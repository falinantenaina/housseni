import { Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-20">
      {/* Main footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105">
                <img src="/logo.png" alt="ETS HOUSSENI" className="w-13 h-9" />
              </div>
              <div>
                <div className="font-display text-primary tracking-widest text-lg leading-none">
                  ETS HOUSSENI
                </div>
                <div className="font-ui text-muted-foreground text-xs tracking-widest uppercase">
                  Quincaillerie Générale
                </div>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              Votre partenaire de confiance pour tous vos besoins en
              quincaillerie, outillage et matériaux de construction.
            </p>
            {/* SOCIAL */}
            {/* <div className="flex gap-2">
              <a
                href="#"
                className="w-9 h-9 rounded-md bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-md bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div> */}
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="font-ui font-bold text-foreground tracking-widest uppercase text-sm mb-4">
              Liens Rapides
            </h3>
            <ul className="space-y-2">
              {[
                { label: "Accueil", path: "/" },
                { label: "Tous les produits", path: "/products" },
                { label: "À Propos", path: "/about" },
                { label: "FAQ", path: "/faq" },
                { label: "Contact", path: "/contact" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm font-ui tracking-wide"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Catégories */}
          {/*  <div>
            <h3 className="font-ui font-bold text-foreground tracking-widest uppercase text-sm mb-4">
              Catégories
            </h3>
            <ul className="space-y-2">
              {[
                "Outillage",
                "Visserie & Fixation",
                "Peinture",
                "Plomberie",
                "Électricité",
                "Serrurerie",
              ].map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/products?category=${encodeURIComponent(cat)}`}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm font-ui tracking-wide"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div> */}

          {/* Contact */}
          <div>
            <h3 className="font-ui font-bold text-foreground tracking-widest uppercase text-sm mb-4">
              Nous Contacter
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span className="text-muted-foreground text-sm">
                  Route Nationale Kaweni BP674 97600 MAYOTTE
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span className="text-muted-foreground text-sm">
                  +262 639 28 37 68 | +262 269 60 43 71 | +262 639 28 17 66
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span className="text-muted-foreground text-sm">
                  ets.husseni@yahoo.fr
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-muted-foreground text-xs font-ui tracking-wide">
            &copy; {new Date().getFullYear()} ETS HOUSSENI. Tous droits
            réservés.
          </p>
          <p className="text-muted-foreground text-xs font-ui tracking-wide">
            Quincaillerie Générale
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
