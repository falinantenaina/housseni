import { Award, Heart, Shield, Target, Users, Wrench } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Client au cœur",
    desc: "Chaque client est notre priorité absolue. Votre satisfaction est notre engagement.",
  },
  {
    icon: Award,
    title: "Qualité Garantie",
    desc: "Nous sélectionnons rigoureusement chaque produit pour garantir performance et durabilité.",
  },
  {
    icon: Users,
    title: "Équipe Experte",
    desc: "Notre équipe de professionnels est là pour vous conseiller et vous orienter.",
  },
  {
    icon: Target,
    title: "Meilleurs Prix",
    desc: "Des tarifs compétitifs sur l'ensemble de notre catalogue de plus de 5 000 références.",
  },
  {
    icon: Wrench,
    title: "Large Catalogue",
    desc: "Outillage, plomberie, électricité, peinture — tout ce dont vous avez besoin.",
  },
  {
    icon: Shield,
    title: "Fiabilité",
    desc: "20 ans d'expérience dans la quincaillerie.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background pt-[88px]">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Hero */}
        <div className="mb-14">
          <span className="section-label">À propos</span>
          <h1 className="section-title">ETS HOUSSENI</h1>
          <span className="accent-line" />
        </div>

        {/* Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-14">
          <div>
            <h2 className="font-ui font-bold text-xl text-foreground tracking-wide mb-4">
              NOTRE HISTOIRE
            </h2>
            <div className="space-y-3 text-muted-foreground leading-relaxed">
              <p>
                ETS HOUSSENI s'est imposé comme l'une des quincailleries de
                référence. Depuis plus de 20 ans, nous mettons à disposition de
                nos clients particuliers et professionnels un large choix de
                produits de qualité.
              </p>
              <p>
                Notre mission est simple : vous proposer les meilleurs outils,
                matériaux et équipements au meilleur prix, avec un service
                professionnel et des conseils d'experts.
              </p>
              <p>
                Que vous soyez un particulier qui bricole le week-end ou un
                professionnel du bâtiment, nous avons ce qu'il vous faut.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "20+", label: "Années d'expérience" },
              { value: "5 000+", label: "Références en stock" },
              { value: "10 000+", label: "Clients satisfaits" },
              { value: "50+", label: "Marques référencées" },
            ].map((stat, i) => (
              <div key={i} className="card-base p-5 text-center">
                <div className="font-display text-primary text-4xl tracking-wide mb-1">
                  {stat.value}
                </div>
                <div className="font-ui text-muted-foreground text-xs tracking-widest uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="mb-14">
          <h2 className="font-ui font-bold text-xl text-foreground tracking-widest uppercase mb-6">
            NOS VALEURS
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {values.map((v, i) => (
              <div
                key={i}
                className="card-base p-5 flex gap-4 hover:border-primary/40 transition-colors group"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
                  <v.icon className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="font-ui font-bold text-foreground tracking-wide mb-1 text-sm">
                    {v.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-primary rounded-md p-8 text-center relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, white 0px, white 1px, transparent 1px, transparent 14px)`,
            }}
          />
          <h2 className="relative font-display text-white text-3xl tracking-widest mb-3">
            VENEZ NOUS RENDRE VISITE
          </h2>
          <p className="relative text-white/80 mb-6">
            Retrouvez-nous du Lundi au samedi
          </p>
          <a
            href="/contact"
            className="relative inline-block bg-white text-primary font-ui font-bold px-6 py-3 rounded-md hover:bg-white/90 transition-colors tracking-wide"
          >
            NOUS CONTACTER
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
