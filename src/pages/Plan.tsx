import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { storage, DiagnosticAnswers, DiagnosticScores, PersonaType, personaData } from "@/lib/storage";
import { Copy, ArrowRight, CheckCircle, Lightbulb, Settings, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DayPlan {
  day: number;
  theme: string;
  actions: {
    type: "easy" | "impact" | "system";
    label: string;
    task: string;
  }[];
}

const generatePlan = (
  persona: PersonaType | null,
  answers: DiagnosticAnswers | null,
  scores: DiagnosticScores | null
): DayPlan[] => {
  // Default plan if no data
  if (!answers) {
    return [
      {
        day: 1,
        theme: "Clarification",
        actions: [
          { type: "easy", label: "Facile", task: "Fais le diagnostic Parlios" },
          { type: "impact", label: "Impact", task: "Identifie ton plus gros blocage" },
          { type: "system", label: "Système", task: "Crée un document 'Ma stratégie'" },
        ],
      },
    ];
  }

  const plans: DayPlan[] = [];

  // Day 1: Clarté
  const clarteActions = [];
  if (scores && scores.clarte < 60) {
    clarteActions.push({ type: "easy" as const, label: "Facile", task: "Écris en 1 phrase ce que tu fais" });
    clarteActions.push({ type: "impact" as const, label: "Impact", task: "Identifie tes 3 types de clients idéaux" });
  } else {
    clarteActions.push({ type: "easy" as const, label: "Facile", task: "Relis ta mission et ajuste si besoin" });
    clarteActions.push({ type: "impact" as const, label: "Impact", task: "Définis 1 objectif chiffré pour ce mois" });
  }
  clarteActions.push({ type: "system" as const, label: "Système", task: "Crée un fichier 'Mes objectifs Q1'" });
  plans.push({ day: 1, theme: "Clarté", actions: clarteActions });

  // Day 2: Organisation
  plans.push({
    day: 2,
    theme: "Organisation",
    actions: [
      { type: "easy", label: "Facile", task: "Bloque 2h de deep work dans ton agenda" },
      { type: "impact", label: "Impact", task: "Identifie les 3 tâches qui prennent trop de temps" },
      { type: "system", label: "Système", task: "Crée un template pour tes tâches récurrentes" },
    ],
  });

  // Day 3: Offre (based on answers)
  const offreActions = [];
  if (answers.offreActuelle && answers.offreActuelle.length > 20) {
    offreActions.push({ type: "easy" as const, label: "Facile", task: "Simplifie ta description d'offre en 10 mots" });
  } else {
    offreActions.push({ type: "easy" as const, label: "Facile", task: "Liste 5 problèmes que tu résous" });
  }
  offreActions.push({ type: "impact" as const, label: "Impact", task: "Crée une page 'Mes services' simple" });
  offreActions.push({ type: "system" as const, label: "Système", task: "Prépare 1 template de proposition commerciale" });
  plans.push({ day: 3, theme: "Offre", actions: offreActions });

  // Day 4: Prospection (based on canal)
  const prospectActions = [];
  if (answers.canalPrincipal === "LinkedIn") {
    prospectActions.push({ type: "easy" as const, label: "Facile", task: "Optimise ta bio LinkedIn en 1 phrase" });
    prospectActions.push({ type: "impact" as const, label: "Impact", task: "Connecte-toi à 10 prospects qualifiés" });
    prospectActions.push({ type: "system" as const, label: "Système", task: "Prépare 3 messages d'accroche type" });
  } else if (answers.canalPrincipal === "Email / newsletter") {
    prospectActions.push({ type: "easy" as const, label: "Facile", task: "Nettoie ta liste email (désinscrits, bounces)" });
    prospectActions.push({ type: "impact" as const, label: "Impact", task: "Envoie 1 email de valeur à ta liste" });
    prospectActions.push({ type: "system" as const, label: "Système", task: "Crée 1 séquence de bienvenue automatique" });
  } else {
    prospectActions.push({ type: "easy" as const, label: "Facile", task: "Liste 10 personnes à recontacter" });
    prospectActions.push({ type: "impact" as const, label: "Impact", task: "Envoie 3 messages personnalisés" });
    prospectActions.push({ type: "system" as const, label: "Système", task: "Crée un CRM simple (Notion ou Excel)" });
  }
  plans.push({ day: 4, theme: "Prospection", actions: prospectActions });

  // Day 5: Relance
  plans.push({
    day: 5,
    theme: "Relance",
    actions: [
      { type: "easy", label: "Facile", task: "Identifie 5 prospects 'tièdes' à relancer" },
      { type: "impact", label: "Impact", task: "Utilise l'outil Relance Parlios pour chaque" },
      { type: "system", label: "Système", task: "Planifie des rappels de suivi automatiques" },
    ],
  });

  // Day 6: Contenu (based on persona)
  const contenuActions = [];
  if (persona === "sales") {
    contenuActions.push({ type: "easy" as const, label: "Facile", task: "Écris 1 post sur un problème client" });
    contenuActions.push({ type: "impact" as const, label: "Impact", task: "Partage 1 témoignage client" });
  } else if (persona === "scale") {
    contenuActions.push({ type: "easy" as const, label: "Facile", task: "Documente 1 process que tu maîtrises" });
    contenuActions.push({ type: "impact" as const, label: "Impact", task: "Crée 1 contenu 'comment je fais X'" });
  } else {
    contenuActions.push({ type: "easy" as const, label: "Facile", task: "Écris 1 post sur ce que tu apprends" });
    contenuActions.push({ type: "impact" as const, label: "Impact", task: "Partage ton parcours et tes défis" });
  }
  contenuActions.push({ type: "system" as const, label: "Système", task: "Planifie 3 posts pour la semaine prochaine" });
  plans.push({ day: 6, theme: "Contenu", actions: contenuActions });

  // Day 7: Bilan
  plans.push({
    day: 7,
    theme: "Bilan & Next Steps",
    actions: [
      { type: "easy", label: "Facile", task: "Note tes 3 wins de la semaine" },
      { type: "impact", label: "Impact", task: "Identifie ce qui a le mieux marché" },
      { type: "system", label: "Système", task: "Planifie ta semaine 2 avec 3 priorités max" },
    ],
  });

  return plans;
};

const Plan = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [persona, setPersona] = useState<PersonaType | null>(null);
  const [answers, setAnswers] = useState<DiagnosticAnswers | null>(null);
  const [scores, setScores] = useState<DiagnosticScores | null>(null);

  useEffect(() => {
    setPersona(storage.getPersona());
    setAnswers(storage.getDiagnosticAnswers());
    setScores(storage.getDiagnosticScores());
  }, []);

  const plan = generatePlan(persona, answers, scores);

  const copyPlan = () => {
    const planText = plan
      .map(
        (day) =>
          `Jour ${day.day}: ${day.theme}\n` +
          day.actions.map((a) => `  [${a.label}] ${a.task}`).join("\n")
      )
      .join("\n\n");

    navigator.clipboard.writeText(planText);
    toast({
      title: "Plan copié !",
      description: "Colle-le où tu veux.",
    });
  };

  const scoreData = [
    { label: "Clarté", value: scores?.clarte || 50, icon: Lightbulb },
    { label: "Système", value: scores?.systeme || 50, icon: Settings },
    { label: "Charge mentale", value: scores?.chargeMentale || 50, icon: Brain },
  ];

  const getScoreColor = (value: number) => {
    if (value >= 70) return "text-parlios-success";
    if (value >= 40) return "text-primary";
    return "text-destructive";
  };

  return (
    <Layout>
      <div className="parlios-section">
        <div className="parlios-container max-w-4xl">
          {/* Header */}
          <div className="text-center mb-10 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Ton plan 7 jours
            </h1>
            {persona && (
              <p className="text-muted-foreground flex items-center justify-center gap-2">
                <span className="text-xl">{personaData[persona].icon}</span>
                Mode {personaData[persona].title}
              </p>
            )}
          </div>

          {/* Scores */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            {scoreData.map((score) => (
              <div key={score.label} className="parlios-card-static p-4 text-center">
                <score.icon className="mx-auto mb-2 text-muted-foreground" size={24} />
                <div className={`text-2xl font-bold ${getScoreColor(score.value)}`}>
                  {score.value}%
                </div>
                <div className="text-sm text-muted-foreground">{score.label}</div>
              </div>
            ))}
          </div>

          {/* Plan */}
          <div className="space-y-6 mb-10">
            {plan.map((day) => (
              <div key={day.day} className="parlios-card-static p-5 md:p-6 animate-fade-in">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center font-bold text-accent-foreground">
                    J{day.day}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{day.theme}</h3>
                    <p className="text-sm text-muted-foreground">3 actions</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {day.actions.map((action, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                    >
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-md ${
                          action.type === "easy"
                            ? "bg-secondary text-secondary-foreground"
                            : action.type === "impact"
                            ? "bg-accent text-accent-foreground"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        {action.label}
                      </span>
                      <span className="text-foreground text-sm flex-1">{action.task}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={copyPlan}
              variant="outline"
              className="gap-2"
            >
              <Copy size={18} />
              Copier le plan
            </Button>
            <Button
              onClick={() => navigate("/tools")}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
            >
              Aller aux outils
              <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Plan;
