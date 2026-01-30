import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, ArrowRight, Loader2, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { storage } from "@/lib/storage";
import { chatStorage, ChatMessage } from "@/lib/chat-storage";
import { useToast } from "@/hooks/use-toast";

// Fallback responses when API fails
const predefinedResponses = [
  {
    keywords: ["bloque", "coincé", "perdu", "sais pas"],
    response:
      "C'est normal de se sentir bloqué parfois. L'important, c'est d'identifier UN seul blocage prioritaire. Quel est le truc qui t'empêche d'avancer le plus en ce moment ?\n\n🔹 Prochaine étape : Fais le diagnostic pour identifier précisément ton blocage.",
  },
  {
    keywords: ["temps", "débordé", "trop", "chargé"],
    response:
      "Le manque de temps, c'est souvent un problème de priorisation plutôt que d'heures. La vraie question : est-ce que tu travailles sur ce qui a le plus d'impact ?\n\n🔹 Prochaine étape : Identifie les 3 tâches qui prennent le plus de temps sans résultat.",
  },
  {
    keywords: ["client", "vendre", "vente", "prospection", "trouver"],
    response:
      "Trouver des clients, c'est un système, pas de la magie. Le secret : régularité + bons canaux + messages clairs. Tu as déjà identifié ton canal principal ?\n\n🔹 Prochaine étape : Utilise l'outil Relance pour écrire 3 messages à des prospects tièdes.",
  },
];

const defaultFallbackResponse =
  "Désolé, je n'ai pas pu me connecter. Réessaie dans quelques instants.\n\n🔹 Prochaine étape : Fais le diagnostic en 3 min pour avoir un plan personnalisé.";

const getFallbackResponse = (input: string): string => {
  const lowerInput = input.toLowerCase();
  const matched = predefinedResponses.find((r) =>
    r.keywords.some((keyword) => lowerInput.includes(keyword))
  );
  return matched?.response || defaultFallbackResponse;
};

const Chat = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Load chat history on mount
  useEffect(() => {
    const history = chatStorage.getHistory();
    if (history.length > 0) {
      setMessages(history);
    } else {
      // Add welcome message
      const welcomeMessage: ChatMessage = {
        id: "welcome",
        role: "assistant",
        content: "Hey ! 👋 Je suis le Coach Parlios. Dis-moi ce qui te bloque en ce moment, je vais t'aider à y voir plus clair.\n\n🔹 Prochaine étape : Pose ta question ou décris ta situation.",
        timestamp: new Date().toISOString(),
      };
      setMessages([welcomeMessage]);
      chatStorage.saveHistory([welcomeMessage]);
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      chatStorage.saveHistory(messages);
    }
  }, [messages]);

  const clearHistory = () => {
    const welcomeMessage: ChatMessage = {
      id: "welcome-" + Date.now(),
      role: "assistant",
      content: "Hey ! 👋 Je suis le Coach Parlios. Dis-moi ce qui te bloque en ce moment, je vais t'aider à y voir plus clair.\n\n🔹 Prochaine étape : Pose ta question ou décris ta situation.",
      timestamp: new Date().toISOString(),
    };
    setMessages([welcomeMessage]);
    chatStorage.saveHistory([welcomeMessage]);
    toast({ title: "Historique effacé" });
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      // Get context from localStorage
      const persona = storage.getPersona();
      const diagnosticAnswers = storage.getDiagnosticAnswers();
      const diagnosticScores = storage.getDiagnosticScores();

      // Prepare messages for API (only user/assistant, not system)
      const apiMessages = newMessages
        .filter(m => m.id !== "welcome" && !m.id.startsWith("welcome-"))
        .map(m => ({ role: m.role, content: m.content }));

      const { data, error } = await supabase.functions.invoke("chat", {
        body: {
          messages: apiMessages,
          persona,
          diagnosticAnswers,
          diagnosticScores,
        },
      });

      if (error) {
        console.error("Chat API error:", error);
        throw new Error(error.message);
      }

      if (data?.error) {
        console.error("Chat response error:", data.error);
        if (data.error === "rate_limit") {
          toast({ title: "Patiente un instant", description: "Trop de requêtes, réessaie dans quelques secondes.", variant: "destructive" });
        }
        throw new Error(data.message || data.error);
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Chat error:", err);
      
      // Fallback to predefined responses
      const fallbackMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getFallbackResponse(input),
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout showFooter={false}>
      <div className="parlios-section min-h-[80vh] flex flex-col">
        <div className="parlios-container max-w-2xl flex-1 flex flex-col">
          {/* Header */}
          <div className="text-center mb-6 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="text-primary" size={28} />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Coach Parlios</h1>
            <p className="text-muted-foreground text-sm">
              Propulsé par l'IA • Personnalisé selon ton profil
            </p>
          </div>

          {/* Chat Area */}
          <div className="flex-1 parlios-card-static p-4 mb-4 overflow-y-auto max-h-[50vh]">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted text-foreground rounded-2xl px-4 py-3 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Coach écrit…</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="Écris ton message..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send size={18} />}
            </Button>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={clearHistory}
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground"
            >
              <Trash2 size={14} />
              Effacer l'historique
            </Button>
            <Button
              onClick={() => (window.location.href = "/diagnostic")}
              variant="outline"
              className="gap-2"
            >
              Faire le diagnostic
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;
