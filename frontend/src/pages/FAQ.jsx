import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    q: "Quels sont vos horaires d'ouverture ?",
    a: "Nous sommes ouverts du lundi au samedi de 7h30 à 17h30. Fermé les dimanches et jours fériés.",
  },
  {
    q: "Proposez-vous la livraison à domicile ?",
    a: "Oui, nous livronsdans les principales villes. Les délais et frais varient selon la destination.",
  },
  {
    q: "Puis-je retourner un produit ?",
    a: "Oui, nous acceptons les retours dans les 7 jours suivant l'achat, avec la facture et dans l'état d'origine. Certains produits sont non-retournables pour des raisons d'hygiène ou de sécurité.",
  },
  {
    q: "Disposez-vous de produits professionnels ?",
    a: "Absolument ! Nous proposons une gamme complète pour les professionnels du bâtiment : outillage électroportatif, visserie en vrac, peinture en grand conditionnement, etc.",
  },
  {
    q: "Comment passer une commande en ligne ?",
    a: "Créez un compte, parcourez notre catalogue, ajoutez des produits à votre panier et procédez au paiement sécurisé. Vous recevrez une confirmation par email.",
  },
  {
    q: "Quels modes de paiement acceptez-vous ?",
    a: "Nous acceptons les paiements par carte bancaire (Visa, Mastercard) sur notre site, ainsi que les espèces et chèques en magasin.",
  },
  {
    q: "Faites-vous des devis pour les professionnels ?",
    a: "Oui, nous établissons des devis personnalisés pour les commandes importantes. Contactez-nous directement pour toute demande professionnelle.",
  },
  {
    q: "Avez-vous un programme de fidélité ?",
    a: "Nous mettons en place un programme de fidélité pour nos clients réguliers. Renseignez-vous en magasin ou contactez-nous pour en savoir plus.",
  },
];

const FAQ = () => {
  const [open, setOpen] = useState(null);

  return (
    <div className="min-h-screen bg-background pt-[88px]">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="mb-10">
          <span className="section-label">Aide</span>
          <h1 className="section-title">QUESTIONS FRÉQUENTES</h1>
          <span className="accent-line" />
          <p className="text-muted-foreground">
            Trouvez les réponses à vos questions sur nos produits et services.
          </p>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`card-base overflow-hidden transition-colors ${open === i ? "border-primary/40" : ""}`}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-start justify-between gap-4 px-5 py-4 text-left hover:bg-secondary/30 transition-colors"
              >
                <h3 className="font-ui font-semibold text-foreground tracking-wide text-sm">
                  {faq.q}
                </h3>
                {open === i ? (
                  <ChevronUp className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                )}
              </button>
              {open === i && (
                <div className="px-5 pb-4 animate-fade-up">
                  <div className="w-8 h-0.5 bg-primary mb-3" />
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 card-base p-6 text-center">
          <h3 className="font-ui font-bold text-foreground tracking-wide mb-2">
            Vous avez une autre question ?
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            Notre équipe est disponible pour vous aider
          </p>
          <a href="/contact" className="btn-primary inline-block">
            NOUS CONTACTER
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
