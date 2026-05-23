import { ArrowRight, CheckCircle, Mail } from "lucide-react";
import { useState } from "react";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);

    // Simulation d'envoi (à remplacer par un vrai appel API plus tard)
    setTimeout(() => {
      setSent(true);
      setLoading(false);
      setEmail("");
    }, 800);
  };

  return (
    <section className="py-20">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-primary via-blue-700 to-indigo-700 rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />

          <div className="relative">
            <div className="mx-auto w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
              <Mail className="w-8 h-8 text-white" />
            </div>

            <h2 className="text-white text-4xl sm:text-5xl font-bold tracking-tighter mb-4">
              RESTEZ INFORMÉ
            </h2>

            <p className="text-white/80 text-lg max-w-md mx-auto mb-10">
              Recevez nos nouveautés, promotions exclusives et conseils
              techniques directement dans votre boîte mail.
            </p>

            {sent ? (
              <div className="bg-white/10 border border-white/20 rounded-2xl p-8 text-white">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-400" />
                <h3 className="font-semibold text-xl mb-2">
                  Merci pour votre inscription !
                </h3>
                <p className="text-white/70">
                  Vous allez recevoir un email de confirmation.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  placeholder="Votre adresse email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-6 py-4 bg-white/10 border border-white/30 rounded-2xl text-white placeholder:text-white/50 focus:outline-none focus:border-white/50 transition-colors"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-white px-8 py-4 font-semibold flex items-center justify-center gap-2 rounded-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-70"
                >
                  {loading ? "Inscription..." : "S'INSCRIRE"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            <p className="text-white/50 text-xs mt-6">
              Vous pouvez vous désinscrire à tout moment • Nous respectons votre
              vie privée
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
