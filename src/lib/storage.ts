// LocalStorage keys
export const STORAGE_KEYS = {
  PERSONA: "parlios_persona",
  DIAGNOSTIC_ANSWERS: "parlios_diagnostic_answers",
  DIAGNOSTIC_SCORES: "parlios_diagnostic_scores",
  TOOL_RUNS: "parlios_tool_runs",
} as const;

// Persona types
export type PersonaType = "starter" | "temps" | "scale" | "sales";

export interface DiagnosticAnswers {
  activite: string;
  objectif: string;
  blocage: string;
  tempsDisponible: string;
  energie: number;
  urgence: number;
  typeClients: string;
  offreActuelle: string;
  canalPrincipal: string;
  vision30Jours: string;
}

export interface DiagnosticScores {
  clarte: number;
  systeme: number;
  chargeMentale: number;
}

export interface ToolRun {
  id: string;
  tool: string;
  date: string;
  inputs: Record<string, string>;
  output: string;
}

// Storage helpers
export const storage = {
  getPersona: (): PersonaType | null => {
    return localStorage.getItem(STORAGE_KEYS.PERSONA) as PersonaType | null;
  },

  setPersona: (persona: PersonaType): void => {
    localStorage.setItem(STORAGE_KEYS.PERSONA, persona);
  },

  getDiagnosticAnswers: (): DiagnosticAnswers | null => {
    const data = localStorage.getItem(STORAGE_KEYS.DIAGNOSTIC_ANSWERS);
    return data ? JSON.parse(data) : null;
  },

  setDiagnosticAnswers: (answers: DiagnosticAnswers): void => {
    localStorage.setItem(STORAGE_KEYS.DIAGNOSTIC_ANSWERS, JSON.stringify(answers));
  },

  getDiagnosticScores: (): DiagnosticScores | null => {
    const data = localStorage.getItem(STORAGE_KEYS.DIAGNOSTIC_SCORES);
    return data ? JSON.parse(data) : null;
  },

  setDiagnosticScores: (scores: DiagnosticScores): void => {
    localStorage.setItem(STORAGE_KEYS.DIAGNOSTIC_SCORES, JSON.stringify(scores));
  },

  getToolRuns: (): ToolRun[] => {
    const data = localStorage.getItem(STORAGE_KEYS.TOOL_RUNS);
    return data ? JSON.parse(data) : [];
  },

  addToolRun: (run: Omit<ToolRun, "id" | "date">): void => {
    const runs = storage.getToolRuns();
    const newRun: ToolRun = {
      ...run,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };
    runs.unshift(newRun);
    localStorage.setItem(STORAGE_KEYS.TOOL_RUNS, JSON.stringify(runs.slice(0, 50)));
  },
};

// Persona data
export const personaData = {
  starter: {
    title: "Starter",
    subtitle: "Tu démarres ton activité",
    icon: "🚀",
    bullets: [
      "Clarifier ton offre et tes premiers clients",
      "Mettre en place tes fondations",
      "Lancer ta première action commerciale",
    ],
    cta: "Je veux démarrer clair",
  },
  temps: {
    title: "Temps",
    subtitle: "Tu manques de temps",
    icon: "⏰",
    bullets: [
      "Automatiser les tâches répétitives",
      "Prioriser ce qui a vraiment un impact",
      "Retrouver 2h par semaine minimum",
    ],
    cta: "Je veux récupérer du temps",
  },
  scale: {
    title: "Scale",
    subtitle: "Tu veux structurer pour grandir",
    icon: "📈",
    bullets: [
      "Systématiser tes process gagnants",
      "Déléguer sans perdre en qualité",
      "Passer de freelance à business",
    ],
    cta: "Je veux scaler",
  },
  sales: {
    title: "Sales",
    subtitle: "Tu veux vendre plus",
    icon: "💰",
    bullets: [
      "Multiplier tes opportunités",
      "Améliorer ton closing",
      "Créer un flux régulier de clients",
    ],
    cta: "Je veux plus de clients",
  },
};
