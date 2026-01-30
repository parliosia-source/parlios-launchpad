import { Lightbulb, ListChecks, Rocket } from "lucide-react";

const steps = [
  {
    icon: Lightbulb,
    title: "Clarté",
    description: "Identifie précisément où tu bloques et ce qui a le plus d'impact pour toi.",
    number: "01",
  },
  {
    icon: ListChecks,
    title: "Plan",
    description: "Reçois un plan 7 jours avec des actions simples et réalisables.",
    number: "02",
  },
  {
    icon: Rocket,
    title: "Exécution",
    description: "Utilise nos outils pour passer à l'action plus vite que prévu.",
    number: "03",
  },
];

const DemoSteps = () => {
  return (
    <section className="parlios-section bg-muted/30">
      <div className="parlios-container">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Comment ça marche
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            3 étapes pour passer de la confusion à l'action
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="parlios-card-static p-6 relative overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Step number */}
              <div className="absolute top-4 right-4 text-6xl font-bold text-muted/50">
                {step.number}
              </div>

              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4">
                <step.icon className="text-primary" size={24} />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DemoSteps;
