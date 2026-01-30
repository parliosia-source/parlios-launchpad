import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import CompactPersonaSelector from "./CompactPersonaSelector";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="parlios-section pt-12 md:pt-20">
      <div className="parlios-container">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6 animate-fade-in">
            <Sparkles size={16} />
            Parlios Launchpad (Test)
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight animate-fade-in">
            Ta clarté.{" "}
            <span className="text-primary">Ton plan.</span>{" "}
            Ton exécution.
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in">
            Arrête de courir dans tous les sens. En 3 minutes, obtiens un diagnostic clair 
            et un plan d'action concret pour les 7 prochains jours.
          </p>

          {/* Compact Persona Selector - Above the fold */}
          <div className="mb-8">
            <CompactPersonaSelector />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Button
              onClick={() => navigate("/diagnostic")}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 text-base px-8"
            >
              Faire le diagnostic (3 min)
              <ArrowRight size={18} />
            </Button>
            <Button
              onClick={() => navigate("/tools")}
              variant="outline"
              size="lg"
              className="gap-2 text-base px-8"
            >
              Voir les outils
            </Button>
          </div>

          {/* Concrete promise instead of generic social proof */}
          <p className="mt-8 text-sm text-muted-foreground animate-fade-in max-w-lg mx-auto">
            En 3 minutes, tu repars avec : un diagnostic clair + un plan 7 jours + 1 message prêt à envoyer.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
