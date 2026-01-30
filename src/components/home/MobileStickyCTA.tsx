import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { storage, personaData } from "@/lib/storage";
import { ClipboardList, Wrench } from "lucide-react";

const MobileStickyCTA = () => {
  const navigate = useNavigate();
  const [personaLabel, setPersonaLabel] = useState<string>("non choisi");

  useEffect(() => {
    const checkPersona = () => {
      const saved = storage.getPersona();
      if (saved && personaData[saved]) {
        setPersonaLabel(personaData[saved].title);
      } else {
        setPersonaLabel("non choisi");
      }
    };

    checkPersona();
    
    // Listen for storage changes
    const handleStorage = () => checkPersona();
    window.addEventListener("storage", handleStorage);
    
    // Also poll for changes (since localStorage events don't fire in same tab)
    const interval = setInterval(checkPersona, 500);
    
    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-background/95 backdrop-blur-sm border-t border-border px-4 py-3 safe-area-inset-bottom">
        {/* Mode indicator */}
        <div className="text-center mb-2">
          <span className="text-xs text-muted-foreground">
            Mode: <span className="font-medium text-foreground">{personaLabel}</span>
          </span>
        </div>
        
        {/* CTA buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => navigate("/diagnostic")}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
            size="lg"
          >
            <ClipboardList size={18} />
            Diagnostic
          </Button>
          <Button
            onClick={() => navigate("/tools")}
            variant="outline"
            className="flex-1 gap-2"
            size="lg"
          >
            <Wrench size={18} />
            Outils
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileStickyCTA;
