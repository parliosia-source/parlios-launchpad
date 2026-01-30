import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { storage, ToolRun } from "@/lib/storage";
import { Copy, Mail, MessageSquare, Clock, Sparkles, CheckCircle, History } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const tools = [
  {
    id: "relance",
    title: "Relance Email / LinkedIn",
    description: "Génère un message de relance personnalisé",
    icon: Mail,
    active: true,
  },
  {
    id: "resume",
    title: "Résumé & prochaines étapes",
    description: "Résume une conversation et liste les actions",
    icon: MessageSquare,
    active: false,
  },
  {
    id: "checklist",
    title: "Checklist lancement",
    description: "Ta liste complète pour lancer une offre",
    icon: CheckCircle,
    active: false,
  },
];

const generateRelanceMessage = (
  contexte: string,
  objectif: string,
  canal: string,
  ton: string,
  longueur: string
): string => {
  const isEmail = canal === "email";
  const isPro = ton === "pro";
  const isChaleureux = ton === "chaleureux";
  const isShort = longueur === "court";
  const isMedium = longueur === "moyen";

  // Greeting
  let greeting = isEmail ? "Bonjour," : "Hey !";
  if (isPro && isEmail) greeting = "Bonjour [Prénom],";
  if (isChaleureux) greeting = isEmail ? "Salut [Prénom]," : "Salut 👋";

  // Opening
  let opening = "";
  if (isPro) {
    opening = "Je me permets de revenir vers vous suite à notre dernier échange.";
  } else if (isChaleureux) {
    opening = "J'espère que tout roule de ton côté !";
  } else {
    opening = "Je reviens vers toi rapidement.";
  }

  // Context
  let contextPart = "";
  if (contexte.toLowerCase().includes("appel") || contexte.toLowerCase().includes("call")) {
    contextPart = "Suite à notre appel, je voulais faire un point.";
  } else if (contexte.toLowerCase().includes("mail") || contexte.toLowerCase().includes("email")) {
    contextPart = "Je fais suite à mon précédent message.";
  } else if (contexte.toLowerCase().includes("proposition") || contexte.toLowerCase().includes("devis")) {
    contextPart = "Je reviens vers toi concernant la proposition que je t'avais envoyée.";
  } else {
    contextPart = contexte.length > 10 ? `Pour rappel : ${contexte}` : "Je voulais prendre de tes nouvelles.";
  }

  // Objective integration
  let objectivePart = "";
  if (objectif.toLowerCase().includes("réponse") || objectif.toLowerCase().includes("retour")) {
    objectivePart = "As-tu eu le temps d'y réfléchir ?";
  } else if (objectif.toLowerCase().includes("rdv") || objectif.toLowerCase().includes("appel")) {
    objectivePart = "Serais-tu dispo cette semaine pour qu'on en discute ?";
  } else if (objectif.toLowerCase().includes("sign") || objectif.toLowerCase().includes("valider")) {
    objectivePart = "Où en es-tu de ton côté pour avancer ?";
  } else {
    objectivePart = objectif.length > 5 ? `Mon objectif : ${objectif}. Qu'en penses-tu ?` : "Des news ?";
  }

  // Closing
  let closing = "";
  if (isPro) {
    closing = isEmail 
      ? "Je reste à votre disposition pour en discuter.\n\nBien cordialement,"
      : "Dis-moi si ça te parle !";
  } else if (isChaleureux) {
    closing = isEmail
      ? "Hâte d'avoir de tes nouvelles ! 😊\n\nÀ très vite,"
      : "À très vite ! 🙌";
  } else {
    closing = isEmail
      ? "Tiens-moi au courant.\n\nÀ bientôt,"
      : "Tiens-moi au jus !";
  }

  // Build message based on length
  if (isShort) {
    return `${greeting}\n\n${contextPart} ${objectivePart}\n\n${closing}`;
  } else if (isMedium) {
    return `${greeting}\n\n${opening}\n\n${contextPart}\n\n${objectivePart}\n\n${closing}`;
  } else {
    return `${greeting}\n\n${opening}\n\n${contextPart}\n\nJe sais que tu as beaucoup de choses en cours, mais je pense vraiment que ça pourrait t'aider.\n\n${objectivePart}\n\nSi tu préfères, on peut aussi faire un rapide call de 10 min pour clarifier.\n\n${closing}`;
  }
};

const Tools = () => {
  const { toast } = useToast();
  const [selectedTool, setSelectedTool] = useState<string | null>("relance");
  const [history, setHistory] = useState<ToolRun[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Relance form state
  const [contexte, setContexte] = useState("");
  const [objectif, setObjectif] = useState("");
  const [canal, setCanal] = useState("email");
  const [ton, setTon] = useState("chaleureux");
  const [longueur, setLongueur] = useState("moyen");
  const [output, setOutput] = useState("");

  useEffect(() => {
    setHistory(storage.getToolRuns());
  }, []);

  const handleGenerate = () => {
    const message = generateRelanceMessage(contexte, objectif, canal, ton, longueur);
    setOutput(message);

    // Save to history
    storage.addToolRun({
      tool: "relance",
      inputs: { contexte, objectif, canal, ton, longueur },
      output: message,
    });
    setHistory(storage.getToolRuns());
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    toast({
      title: "Copié !",
      description: "Message prêt à envoyer.",
    });
  };

  const loadFromHistory = (run: ToolRun) => {
    if (run.tool === "relance") {
      setContexte(run.inputs.contexte || "");
      setObjectif(run.inputs.objectif || "");
      setCanal(run.inputs.canal || "email");
      setTon(run.inputs.ton || "chaleureux");
      setLongueur(run.inputs.longueur || "moyen");
      setOutput(run.output);
      setShowHistory(false);
    }
  };

  const OptionButton = ({
    value,
    current,
    onClick,
    children,
  }: {
    value: string;
    current: string;
    onClick: (v: string) => void;
    children: React.ReactNode;
  }) => (
    <button
      onClick={() => onClick(value)}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        current === value
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground hover:bg-muted/80"
      }`}
    >
      {children}
    </button>
  );

  return (
    <Layout>
      <div className="parlios-section">
        <div className="parlios-container">
          {/* Header */}
          <div className="text-center mb-10 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Boîte à outils
            </h1>
            <p className="text-muted-foreground">
              Des micro-outils pour gagner du temps
            </p>
          </div>

          {/* Tool Grid */}
          <div className="grid md:grid-cols-3 gap-4 mb-10">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => tool.active && setSelectedTool(tool.id)}
                disabled={!tool.active}
                className={`parlios-card p-5 text-left transition-all ${
                  selectedTool === tool.id
                    ? "ring-2 ring-primary"
                    : tool.active
                    ? "hover:border-primary/30"
                    : "opacity-60 cursor-not-allowed"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                    <tool.icon className="text-primary" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{tool.title}</h3>
                    <p className="text-sm text-muted-foreground">{tool.description}</p>
                    {!tool.active && (
                      <span className="inline-block mt-2 text-xs bg-muted px-2 py-1 rounded">
                        Coming soon
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Relance Tool */}
          {selectedTool === "relance" && (
            <div className="parlios-card-static p-6 md:p-8 animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Sparkles className="text-primary" size={24} />
                  <h2 className="text-xl font-semibold text-foreground">Générateur de relance</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHistory(!showHistory)}
                  className="gap-2"
                >
                  <History size={16} />
                  Historique
                </Button>
              </div>

              {showHistory ? (
                <div className="space-y-3">
                  <h3 className="font-medium text-foreground mb-4">Dernières exécutions</h3>
                  {history.length === 0 ? (
                    <p className="text-muted-foreground text-sm">Aucun historique</p>
                  ) : (
                    history.slice(0, 5).map((run) => (
                      <button
                        key={run.id}
                        onClick={() => loadFromHistory(run)}
                        className="w-full text-left p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <Clock size={14} />
                          {new Date(run.date).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        <p className="text-foreground text-sm line-clamp-2">
                          {run.inputs.contexte || "Relance"} → {run.inputs.canal}
                        </p>
                      </button>
                    ))
                  )}
                  <Button
                    variant="outline"
                    onClick={() => setShowHistory(false)}
                    className="w-full mt-4"
                  >
                    Retour au formulaire
                  </Button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Form */}
                  <div className="space-y-5">
                    <div>
                      <Label className="text-foreground mb-2 block">Contexte</Label>
                      <Textarea
                        value={contexte}
                        onChange={(e) => setContexte(e.target.value)}
                        placeholder="Ex: Appel de découverte la semaine dernière, intéressé par l'offre coaching..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label className="text-foreground mb-2 block">Objectif</Label>
                      <Input
                        value={objectif}
                        onChange={(e) => setObjectif(e.target.value)}
                        placeholder="Ex: Obtenir une réponse, fixer un RDV..."
                      />
                    </div>

                    <div>
                      <Label className="text-foreground mb-2 block">Canal</Label>
                      <div className="flex gap-2">
                        <OptionButton value="email" current={canal} onClick={setCanal}>
                          Email
                        </OptionButton>
                        <OptionButton value="linkedin" current={canal} onClick={setCanal}>
                          LinkedIn
                        </OptionButton>
                      </div>
                    </div>

                    <div>
                      <Label className="text-foreground mb-2 block">Ton</Label>
                      <div className="flex gap-2 flex-wrap">
                        <OptionButton value="pro" current={ton} onClick={setTon}>
                          Pro
                        </OptionButton>
                        <OptionButton value="chaleureux" current={ton} onClick={setTon}>
                          Chaleureux
                        </OptionButton>
                        <OptionButton value="direct" current={ton} onClick={setTon}>
                          Direct
                        </OptionButton>
                      </div>
                    </div>

                    <div>
                      <Label className="text-foreground mb-2 block">Longueur</Label>
                      <div className="flex gap-2">
                        <OptionButton value="court" current={longueur} onClick={setLongueur}>
                          Court
                        </OptionButton>
                        <OptionButton value="moyen" current={longueur} onClick={setLongueur}>
                          Moyen
                        </OptionButton>
                        <OptionButton value="long" current={longueur} onClick={setLongueur}>
                          Long
                        </OptionButton>
                      </div>
                    </div>

                    <Button
                      onClick={handleGenerate}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                    >
                      <Sparkles size={18} />
                      Générer le message
                    </Button>
                  </div>

                  {/* Output */}
                  <div>
                    <Label className="text-foreground mb-2 block">Message généré</Label>
                    <div className="relative">
                      <Textarea
                        value={output}
                        onChange={(e) => setOutput(e.target.value)}
                        placeholder="Ton message apparaîtra ici..."
                        rows={12}
                        className="resize-none"
                      />
                      {output && (
                        <Button
                          onClick={copyOutput}
                          size="sm"
                          className="absolute bottom-3 right-3 gap-1"
                        >
                          <Copy size={14} />
                          Copier
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Tools;
