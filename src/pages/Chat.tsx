import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, ArrowRight } from "lucide-react";

interface Message {
  id: string;
  type: "user" | "bot";
  text: string;
}

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

const defaultResponse =
  "Merci pour ta question ! Je suis encore en version bêta, mais je capte ce que tu dis. Pour l'instant, le meilleur moyen de t'aider, c'est de commencer par le diagnostic.\n\n🔹 Prochaine étape : Fais le diagnostic en 3 min pour avoir un plan personnalisé.";

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "bot",
      text: "Hey ! 👋 Je suis le coach Parlios (version test). Dis-moi ce qui te bloque en ce moment, je vais essayer de t'aider.\n\n🔹 Prochaine étape : Pose ta question ou décris ta situation.",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);

    // Find matching response
    const lowerInput = input.toLowerCase();
    const matchedResponse = predefinedResponses.find((r) =>
      r.keywords.some((keyword) => lowerInput.includes(keyword))
    );

    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      type: "bot",
      text: matchedResponse?.response || defaultResponse,
    };

    setTimeout(() => {
      setMessages((prev) => [...prev, botResponse]);
    }, 800);

    setInput("");
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
              Version test • Réponses limitées
            </p>
          </div>

          {/* Chat Area */}
          <div className="flex-1 parlios-card-static p-4 mb-4 overflow-y-auto max-h-[50vh]">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      message.type === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Écris ton message..."
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Send size={18} />
            </Button>
          </div>

          {/* CTA */}
          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm mb-3">
              Pour un accompagnement complet, commence par le diagnostic
            </p>
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
