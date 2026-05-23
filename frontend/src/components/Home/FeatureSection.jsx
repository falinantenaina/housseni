import { Award, Clock, Headphones, Package, Shield, Truck } from "lucide-react";

const features = [
  {
    icon: Package,
    title: "Grand Stock",
    desc: "Des milliers de références disponibles immédiatement",
    color: "text-blue-600",
  },
  {
    icon: Truck,
    title: "Livraison Rapide",
    desc: "Livraison express",
    color: "text-emerald-600",
  },
  {
    icon: Shield,
    title: "Qualité Garantie",
    desc: "Produits de marques reconnues avec garantie",
    color: "text-amber-600",
  },
  {
    icon: Clock,
    title: "Service Fiable",
    desc: "Ouvert 6 jours/7 • 7h30 - 17h30",
    color: "text-purple-600",
  },
  {
    icon: Headphones,
    title: "Support Expert",
    desc: "Conseils techniques par des professionnels",
    color: "text-rose-600",
  },
  {
    icon: Award,
    title: "Meilleurs Prix",
    desc: "Prix compétitifs",
    color: "text-teal-600",
  },
];

const FeatureSection = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="section-label">Pourquoi nous choisir</span>
          <h2 className="section-title text-4xl mt-2">NOS ENGAGEMENTS</h2>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto">
            Nous nous engageons à vous offrir le meilleur service et la
            meilleure qualité.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white dark:bg-card border border-border rounded-3xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </div>

              <h3 className="text-xl font-semibold tracking-tight mb-3 text-foreground">
                {feature.title}
              </h3>

              <p className="text-muted-foreground leading-relaxed">
                {feature.desc}
              </p>

              {/* Ligne décorative */}
              <div className="h-0.5 w-12 bg-primary/30 mt-8 group-hover:w-20 transition-all duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
