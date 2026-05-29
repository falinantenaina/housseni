import { CheckCircle, Eye, EyeOff, KeyRound, Lock } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { axiosInstance } from "../lib/axios";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Indicateur de robustesse
  const getStrength = (pwd) => {
    if (pwd.length < 8) return 1;
    if (
      pwd.length >= 12 &&
      /[A-Z]/.test(pwd) &&
      /[0-9]/.test(pwd) &&
      /[^A-Za-z0-9]/.test(pwd)
    )
      return 4;
    if (pwd.length >= 10 && (/[A-Z]/.test(pwd) || /[0-9]/.test(pwd))) return 3;
    return 2;
  };
  const strengthLabel = {
    1: "Trop court",
    2: "Acceptable",
    3: "Moyen",
    4: "Fort",
  };
  const strengthColor = {
    1: "bg-destructive",
    2: "bg-yellow-500",
    3: "bg-blue-500",
    4: "bg-emerald-500",
  };

  const strength = getStrength(form.password);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }
    if (form.password.length < 8 || form.password.length > 16) {
      toast.error("Le mot de passe doit comporter entre 8 et 16 caractères.");
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.put(`/auth/password/reset/${token}`, {
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

      // Stocker le token JWT si le backend renvoie un token (auto-login)
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      setSuccess(true);

      // Rediriger vers l'accueil après 2 s
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Lien invalide ou expiré. Veuillez en demander un nouveau.",
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
          {success ? (
            //  Succès
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
              <h2 className="font-ui font-bold text-foreground text-xl tracking-wide mb-3">
                MOT DE PASSE RÉINITIALISÉ
              </h2>
              <p className="text-muted-foreground text-sm mb-2">
                Votre mot de passe a été mis à jour avec succès.
              </p>
              <p className="text-muted-foreground text-xs">
                Redirection en cours...
              </p>
            </div>
          ) : (
            //  Formulaire
            <>
              <div className="mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <KeyRound className="w-5 h-5 text-primary" />
                </div>
                <h2 className="font-ui font-bold text-foreground tracking-wide text-xl mb-1">
                  NOUVEAU MOT DE PASSE
                </h2>
                <p className="text-muted-foreground text-sm">
                  Choisissez un nouveau mot de passe sécurisé (8 à 16
                  caractères).
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Mot de passe */}
                <div>
                  <label className="font-ui text-xs text-muted-foreground tracking-widest uppercase block mb-1.5">
                    Nouveau mot de passe *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
                    <input
                      type={showPw ? "text" : "password"}
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      className="input-base w-full pl-10 pr-10"
                      required
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPw ? (
                        <EyeOff className="w-4.5 h-4.5" />
                      ) : (
                        <Eye className="w-4.5 h-4.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Barre de robustesse */}
                {form.password.length > 0 && (
                  <div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-full transition-colors ${
                            i <= strength
                              ? strengthColor[strength]
                              : "bg-border"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground font-ui mt-1">
                      {strengthLabel[strength]}
                    </p>
                  </div>
                )}

                {/* Confirmation */}
                <div>
                  <label className="font-ui text-xs text-muted-foreground tracking-widest uppercase block mb-1.5">
                    Confirmer le mot de passe *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder="••••••••"
                      value={form.confirmPassword}
                      onChange={(e) =>
                        setForm({ ...form, confirmPassword: e.target.value })
                      }
                      className="input-base w-full pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirm ? (
                        <EyeOff className="w-4.5 h-4.5" />
                      ) : (
                        <Eye className="w-4.5 h-4.5" />
                      )}
                    </button>
                  </div>

                  {/* Alerte mismatch */}
                  {form.confirmPassword &&
                    form.password !== form.confirmPassword && (
                      <p className="text-xs text-destructive font-ui mt-1">
                        Les mots de passe ne correspondent pas.
                      </p>
                    )}
                </div>

                <button
                  type="submit"
                  disabled={
                    loading ||
                    !form.password ||
                    !form.confirmPassword ||
                    form.password !== form.confirmPassword
                  }
                  className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Réinitialisation...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      RÉINITIALISER LE MOT DE PASSE
                    </>
                  )}
                </button>
              </form>

              <div className="mt-5 pt-5 border-t border-border text-center">
                <Link
                  to="/"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors font-ui tracking-wide"
                >
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

export default ResetPassword;
