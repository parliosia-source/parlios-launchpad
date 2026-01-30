import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatRequest {
  messages: Message[];
  persona?: string | null;
  diagnosticAnswers?: Record<string, unknown> | null;
  diagnosticScores?: Record<string, number> | null;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { messages, persona, diagnosticAnswers, diagnosticScores }: ChatRequest = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build context from user data
    let contextBlock = "";
    
    if (persona) {
      contextBlock += `\n\nProfil utilisateur: ${persona}`;
    }
    
    if (diagnosticScores) {
      contextBlock += `\n\nScores diagnostic:
- Clarté: ${diagnosticScores.clarte || 0}%
- Système: ${diagnosticScores.systeme || 0}%
- Charge mentale: ${diagnosticScores.chargeMentale || 0}%`;
    }
    
    if (diagnosticAnswers) {
      contextBlock += `\n\nRéponses diagnostic:
- Activité: ${diagnosticAnswers.activite || "non renseigné"}
- Objectif: ${diagnosticAnswers.objectif || "non renseigné"}
- Blocage principal: ${diagnosticAnswers.blocage || "non renseigné"}
- Vision 30 jours: ${diagnosticAnswers.vision30Jours || "non renseigné"}`;
    }

    const systemPrompt = `Tu es le Coach Parlios, un assistant bienveillant et pragmatique pour entrepreneurs et freelances.

Ton rôle:
- Aider à clarifier les blocages et définir des actions concrètes
- Donner des conseils pratiques, jamais de blabla ou de promesses vides
- Être direct mais encourageant
- Toujours finir par une "Prochaine étape" concrète et actionnable

Style:
- Tutoiement, ton humain et chaleureux
- Phrases courtes et percutantes
- Utilise des emojis avec parcimonie (🔹 pour les étapes)
- Jamais de jargon "guru" ou de promesses irréalistes

${contextBlock ? `Contexte utilisateur:${contextBlock}` : "L'utilisateur n'a pas encore fait le diagnostic."}

Réponds toujours en français. Limite tes réponses à 150 mots max.`;

    console.log("Calling Lovable AI with context:", { persona, hasScores: !!diagnosticScores, hasAnswers: !!diagnosticAnswers });

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error("Rate limit exceeded");
        return new Response(JSON.stringify({ error: "rate_limit", message: "Trop de requêtes, réessaie dans quelques instants." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        console.error("Payment required");
        return new Response(JSON.stringify({ error: "payment_required", message: "Crédits IA épuisés." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "ai_error", message: "Erreur du service IA" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content || "Je n'ai pas pu générer de réponse.";

    console.log("AI response generated successfully");

    return new Response(JSON.stringify({ message: assistantMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Chat function error:", error);
    return new Response(JSON.stringify({ error: "server_error", message: error instanceof Error ? error.message : "Erreur serveur" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
