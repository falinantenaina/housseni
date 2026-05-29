import { CheckCircle, Loader, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios";

/**
 * Page de confirmation d'adresse e-mail.
 * Appelée via le lien : /email/verify/:token
 */
const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        await axiosInstance.get(`/auth/email/verify/${token}`);
        setStatus("success");
      } catch (err) {
        setErrorMessage(
          err.response?.data?.message ||
            "Lien invalide ou expiré. Veuillez en demander un nouveau depuis votre profil.",
        );
        setStatus("error");
      }
    };

    if (token) verify();
    else setStatus("error");
  }, [token]);

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

        <div className="card-base p-8 text-center">
          {status === "loading" && (
            <>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
                <Loader className="w-8 h-8 text-primary animate-spin" />
              </div>
              <h2 className="font-ui font-bold text-foreground text-xl tracking-wide mb-2">
                VÉRIFICATION EN COURS
              </h2>
              <p className="text-muted-foreground text-sm">
                Veuillez patienter quelques instants...
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
              <h2 className="font-ui font-bold text-foreground text-xl tracking-wide mb-3">
                ADRESSE CONFIRMÉE
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                Votre adresse e-mail a été vérifiée avec succès. Votre compte
                est maintenant pleinement activé.
              </p>
              <Link to="/" className="btn-primary inline-block">
                ACCÉDER À LA BOUTIQUE
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-5">
                <XCircle className="w-8 h-8 text-destructive" />
              </div>
              <h2 className="font-ui font-bold text-foreground text-xl tracking-wide mb-3">
                LIEN INVALIDE
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                {errorMessage}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/" className="btn-secondary">
                  RETOUR À L'ACCUEIL
                </Link>
                <Link to="/profil" className="btn-primary">
                  MON PROFIL
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
