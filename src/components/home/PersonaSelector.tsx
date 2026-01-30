import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { storage, personaData, PersonaType } from "@/lib/storage";
import { ArrowRight, Check } from "lucide-react";

const PersonaSelector = () => {
  const navigate = useNavigate();
  const [selectedPersona, setSelectedPersona] = useState<PersonaType | null>(null);

  useEffect(() => {
    const saved = storage.getPersona();
    if (saved) {
      setSelectedPersona(saved);
    }
  }, []);

  const handleSelect = (persona: PersonaType) => {
    setSelectedPersona(persona);
    storage.setPersona(persona);
  };

  const personas = Object.entries(personaData) as [PersonaType, typeof personaData.starter][];
  const currentPersona = selectedPersona ? personaData[selectedPersona] : null;

  return (
    <section className="parlios-section">
      <div className="parlios-container">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Choisis ton mode
          </h2>
          <p className="text-muted-foreground">
            Sélectionne ce qui te correspond le mieux
          </p>
        </div>

        {/* Persona Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {personas.map(([key, data]) => (
            <button
              key={key}
              onClick={() => handleSelect(key)}
              className={`parlios-card p-5 text-left transition-all duration-300 ${
                selectedPersona === key
                  ? "ring-2 ring-primary bg-accent"
                  : "hover:border-primary/30"
              }`}
            >
              <div className="text-3xl mb-3">{data.icon}</div>
              <h3 className="font-semibold text-foreground mb-1">{data.title}</h3>
              <p className="text-sm text-muted-foreground">{data.subtitle}</p>
              {selectedPersona === key && (
                <div className="mt-3 flex items-center gap-1 text-primary text-sm font-medium">
                  <Check size={16} />
                  Sélectionné
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Dynamic Content based on selected persona */}
        {currentPersona && (
          <div className="parlios-card-static p-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{currentPersona.icon}</span>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">
                      Mode {currentPersona.title}
                    </h3>
                    <p className="text-muted-foreground">{currentPersona.subtitle}</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {currentPersona.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-2 text-foreground">
                      <span className="text-primary mt-1">•</span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => navigate("/diagnostic")}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                  size="lg"
                >
                  Faire le diagnostic (3 min)
                  <ArrowRight size={18} />
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  {currentPersona.cta}
                </p>
              </div>
            </div>
          </div>
        )}

        {!currentPersona && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              ☝️ Clique sur une carte pour voir les détails
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PersonaSelector;
