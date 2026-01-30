import { useState, useEffect } from "react";
import { storage, personaData, PersonaType } from "@/lib/storage";
import { Check, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const CompactPersonaSelector = () => {
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

  const handleDefault = () => {
    handleSelect("starter");
  };

  const personas = Object.entries(personaData) as [PersonaType, typeof personaData.starter][];
  const currentPersona = selectedPersona ? personaData[selectedPersona] : null;

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-4">
        <p className="text-sm text-muted-foreground">
          {selectedPersona ? "Ton mode :" : "Choisis ton mode (30s)"}
        </p>
      </div>

      {/* Compact Persona Buttons */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {personas.map(([key, data]) => (
          <button
            key={key}
            onClick={() => handleSelect(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 text-sm font-medium ${
              selectedPersona === key
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background border-border hover:border-primary/50 text-foreground"
            }`}
          >
            <span>{data.icon}</span>
            <span>{data.title}</span>
            {selectedPersona === key && <Check size={14} />}
          </button>
        ))}
      </div>

      {/* Default button if no selection */}
      {!selectedPersona && (
        <div className="text-center mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDefault}
            className="text-muted-foreground hover:text-foreground gap-2"
          >
            <HelpCircle size={14} />
            Je ne sais pas
          </Button>
        </div>
      )}

      {/* Mini bullets when persona selected */}
      {currentPersona && (
        <div className="bg-accent/50 rounded-xl px-4 py-3 animate-fade-in">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-foreground">
            {currentPersona.bullets.slice(0, 3).map((bullet, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <span className="text-primary">•</span>
                {bullet}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompactPersonaSelector;
