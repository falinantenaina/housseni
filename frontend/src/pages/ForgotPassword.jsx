import { ArrowLeft, Mail, Send } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { axiosInstance } from "../lib/axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      await axiosInstance.post(
        `/auth/password/forgot?frontendUrl=${encodeURIComponent(window.location.origin)}`,
        { email },
      );
      setSent(true);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Aucun compte trouvé avec cette adresse e-mail.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105">
              <img src="/logo.png" alt="ETS HOUSSENI" className="w-13 h-9" />
            </div>
            <div className="text-left">
              <div className="font-display text-primary tracking-widest text-xl leading-none">
                ETS HOUSSENI
              </div>
              <div className="font-ui text-muted-foreground text-xs tracking-widest uppercase">
                Quincaillerie Générale
              </div>
            </div>
          </Link>
        </div>

        <div className="card-base p-7">
          {sent ? (
            //  État : email envoyé
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-5">
                <Send className="w-8 h-8 text-emerald-500" />
              </div>
              <h2 className="font-ui font-bold text-foreground tracking-wide text-xl mb-3">
                E-MAIL ENVOYÉ
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Un lien de réinitialisation a été envoyé à{" "}
                <strong className="text-foreground">{email}</strong>.
                <br />
                Vérifiez vos spams si vous ne le trouvez pas. Le lien est
                valable <strong className="text-foreground">15 minutes</strong>.
              </p>
              <Link to="/" className="btn-secondary inline-block text-sm">
                RETOUR À L'ACCUEIL
              </Link>
            </div>
          ) : (
            //  Formulaire
            <>
              <div className="mb-6">
                <h2 className="font-ui font-bold text-foreground tracking-wide text-xl mb-1">
                  MOT DE PASSE OUBLIÉ
                </h2>
                <p className="text-muted-foreground text-sm">
                  Saisissez votre adresse e-mail. Nous vous enverrons un lien
                  pour réinitialiser votre mot de passe.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="font-ui text-xs text-muted-foreground tracking-widest uppercase block mb-1.5">
                    Adresse e-mail
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
                    <input
                      type="email"
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-base w-full pl-10"
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      ENVOYER LE LIEN
                    </>
                  )}
                </button>
              </form>

              <div className="mt-5 pt-5 border-t border-border text-center">
                <Link
                  to="/"
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors font-ui tracking-wide"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Retour à l'accueil
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
