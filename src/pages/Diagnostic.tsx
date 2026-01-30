import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { storage, DiagnosticAnswers, DiagnosticScores } from "@/lib/storage";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";

interface Question {
  id: keyof DiagnosticAnswers;
  question: string;
  type: "text" | "textarea" | "choice" | "slider";
  options?: string[];
  placeholder?: string;
}

const questions: Question[] = [
  {
    id: "activite",
    question: "Quelle est ton activité ?",
    type: "text",
    placeholder: "Ex: Coach business, consultant marketing, développeur freelance...",
  },
  {
    id: "objectif",
    question: "Quel est ton objectif principal en ce moment ?",
    type: "choice",
    options: ["Lancer mon activité", "Structurer ce que j'ai déjà", "Vendre plus", "Récupérer du temps"],
  },
  {
    id: "blocage",
    question: "Où tu bloques le plus ?",
    type: "choice",
    options: ["Manque de clarté", "Manque d'organisation", "Vente / prospection", "Passage à l'action"],
  },
  {
    id: "tempsDisponible",
    question: "Combien de temps peux-tu consacrer par semaine ?",
    type: "choice",
    options: ["Moins de 2h", "2-5h", "5-10h", "Plus de 10h"],
  },
  {
    id: "energie",
    question: "Ton niveau d'énergie actuel ?",
    type: "slider",
  },
  {
    id: "urgence",
    question: "À quel point c'est urgent de résoudre ça ?",
    type: "slider",
  },
  {
    id: "typeClients",
    question: "C'est quoi ton type de clients ?",
    type: "text",
    placeholder: "Ex: PME tech, particuliers, startups...",
  },
  {
    id: "offreActuelle",
    question: "C'est quoi ton offre actuelle ?",
    type: "textarea",
    placeholder: "Décris en quelques mots ce que tu proposes...",
  },
  {
    id: "canalPrincipal",
    question: "Par quel canal tu trouves tes clients ?",
    type: "choice",
    options: ["Réseau / bouche-à-oreille", "LinkedIn", "Email / newsletter", "Ads / pub", "Autre"],
  },
  {
    id: "vision30Jours",
    question: "Si tout allait mieux dans 30 jours, ce serait quoi ?",
    type: "textarea",
    placeholder: "Décris ta situation idéale...",
  },
];

const Diagnostic = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<DiagnosticAnswers>>({});
  const [showResults, setShowResults] = useState(false);

  const totalSteps = questions.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const currentQuestion = questions[currentStep];

  const updateAnswer = (value: string | number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const getCurrentValue = (): string | number => {
    const value = answers[currentQuestion.id];
    if (currentQuestion.type === "slider") {
      return (value as number) || 3;
    }
    return (value as string) || "";
  };

  const canProceed = (): boolean => {
    const value = answers[currentQuestion.id];
    if (currentQuestion.type === "slider") return true;
    return !!value && String(value).trim().length > 0;
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      calculateAndSave();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const calculateScores = (): DiagnosticScores => {
    // Clarté score (0-100) based on objectif, blocage, vision
    let clarte = 50;
    if (answers.objectif === "Lancer mon activité") clarte -= 10;
    if (answers.objectif === "Structurer ce que j'ai déjà") clarte += 10;
    if (answers.blocage === "Manque de clarté") clarte -= 20;
    if (answers.blocage === "Passage à l'action") clarte += 10;
    if (answers.vision30Jours && answers.vision30Jours.length > 50) clarte += 15;
    clarte = Math.max(0, Math.min(100, clarte));

    // Système score (0-100) based on temps, offre, canal
    let systeme = 50;
    if (answers.tempsDisponible === "Moins de 2h") systeme -= 15;
    if (answers.tempsDisponible === "Plus de 10h") systeme += 15;
    if (answers.offreActuelle && answers.offreActuelle.length > 30) systeme += 15;
    if (answers.canalPrincipal === "Réseau / bouche-à-oreille") systeme -= 10;
    if (answers.canalPrincipal === "LinkedIn" || answers.canalPrincipal === "Email / newsletter") systeme += 10;
    systeme = Math.max(0, Math.min(100, systeme));

    // Charge mentale score (0-100) based on energie, urgence (higher = less stressed)
    const energie = (answers.energie as number) || 3;
    const urgence = (answers.urgence as number) || 3;
    let chargeMentale = 50 + (energie * 10) - (urgence * 8);
    chargeMentale = Math.max(0, Math.min(100, chargeMentale));

    return { clarte, systeme, chargeMentale };
  };

  const calculateAndSave = () => {
    const scores = calculateScores();
    storage.setDiagnosticAnswers(answers as DiagnosticAnswers);
    storage.setDiagnosticScores(scores);
    setShowResults(true);
  };

  const goToPlan = () => {
    navigate("/plan");
  };

  if (showResults) {
    const scores = calculateScores();
    return (
      <Layout showFooter={false}>
        <div className="parlios-section min-h-[80vh] flex items-center">
          <div className="parlios-container max-w-2xl mx-auto">
            <div className="text-center mb-8 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-primary" size={32} />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Diagnostic terminé !
              </h1>
              <p className="text-muted-foreground">
                Voici tes scores. Prêt pour ton plan 7 jours ?
              </p>
            </div>

            {/* Scores */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="parlios-card-static p-4 text-center">
                <div className="text-2xl font-bold text-primary">{scores.clarte}%</div>
                <div className="text-sm text-muted-foreground">Clarté</div>
              </div>
              <div className="parlios-card-static p-4 text-center">
                <div className="text-2xl font-bold text-primary">{scores.systeme}%</div>
                <div className="text-sm text-muted-foreground">Système</div>
              </div>
              <div className="parlios-card-static p-4 text-center">
                <div className="text-2xl font-bold text-primary">{scores.chargeMentale}%</div>
                <div className="text-sm text-muted-foreground">Charge mentale</div>
              </div>
            </div>

            <Button
              onClick={goToPlan}
              size="lg"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
            >
              Générer mon plan 7 jours
              <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showFooter={false}>
      <div className="parlios-section min-h-[80vh]">
        <div className="parlios-container max-w-2xl mx-auto">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Question {currentStep + 1} sur {totalSteps}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question */}
          <div className="parlios-card-static p-6 md:p-8 mb-6 animate-fade-in" key={currentStep}>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-6">
              {currentQuestion.question}
            </h2>

            {currentQuestion.type === "text" && (
              <Input
                value={getCurrentValue() as string}
                onChange={(e) => updateAnswer(e.target.value)}
                placeholder={currentQuestion.placeholder}
                className="text-base"
              />
            )}

            {currentQuestion.type === "textarea" && (
              <Textarea
                value={getCurrentValue() as string}
                onChange={(e) => updateAnswer(e.target.value)}
                placeholder={currentQuestion.placeholder}
                rows={4}
                className="text-base"
              />
            )}

            {currentQuestion.type === "choice" && currentQuestion.options && (
              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => updateAnswer(option)}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                      getCurrentValue() === option
                        ? "border-primary bg-accent text-foreground"
                        : "border-border hover:border-primary/50 text-foreground"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {currentQuestion.type === "slider" && (
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Très bas</span>
                  <span>Très élevé</span>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      onClick={() => updateAnswer(num)}
                      className={`flex-1 py-4 rounded-xl border text-lg font-medium transition-all ${
                        getCurrentValue() === num
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border hover:border-primary/50 text-foreground"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex gap-4">
            <Button
              onClick={handlePrevious}
              variant="outline"
              disabled={currentStep === 0}
              className="gap-2"
            >
              <ArrowLeft size={18} />
              Précédent
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
            >
              {currentStep === totalSteps - 1 ? "Terminer" : "Suivant"}
              <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Diagnostic;
