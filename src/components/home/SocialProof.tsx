const testimonials = [
  {
    quote: "En 1 semaine, j'ai enfin compris où je perdais mon temps. Game changer.",
    author: "Marie L.",
    role: "Consultante RH",
  },
  {
    quote: "Le plan était tellement simple que j'ai tout fait. Et ça a marché.",
    author: "Thomas D.",
    role: "Coach business",
  },
  {
    quote: "J'ai signé 2 clients en suivant les relances générées. Merci Parlios.",
    author: "Sophie M.",
    role: "Graphiste freelance",
  },
];

const metrics = [
  { value: "+2h", label: "récupérées / semaine" },
  { value: "87%", label: "finissent leur plan" },
  { value: "3 min", label: "pour le diagnostic" },
];

const SocialProof = () => {
  return (
    <section className="parlios-section">
      <div className="parlios-container">
        {/* Metrics */}
        <div className="grid grid-cols-3 gap-4 md:gap-8 mb-16">
          {metrics.map((metric) => (
            <div key={metric.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                {metric.value}
              </div>
              <div className="text-sm text-muted-foreground">{metric.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Ce qu'ils en disent
          </h2>
          <p className="text-muted-foreground">
            Des résultats concrets, pas des promesses
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="parlios-card-static p-6"
            >
              {/* Quote */}
              <p className="text-foreground mb-4 italic">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                  <span className="text-accent-foreground font-semibold text-sm">
                    {testimonial.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-foreground text-sm">
                    {testimonial.author}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
