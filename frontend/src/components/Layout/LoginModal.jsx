import { Eye, EyeOff, Lock, Mail, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { login, signup } from "../../store/slices/authSlice";
import { closeAuthPopup } from "../../store/slices/popupSlice";

const LoginModal = () => {
  const dispatch = useDispatch();
  const { isAuthPopupOpen } = useSelector((state) => state.popup);
  const { isLoggingIn, isSigningUp } = useSelector((state) => state.auth);
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    if (!isAuthPopupOpen) {
      setForm({ name: "", email: "", password: "" });
      setMode("login");
    }
  }, [isAuthPopupOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "login") {
      dispatch(login({ email: form.email, password: form.password })).then(
        (res) => {
          if (!res.error) dispatch(closeAuthPopup());
        },
      );
    } else {
      dispatch(
        signup({ name: form.name, email: form.email, password: form.password }),
      ).then((res) => {
        if (!res.error) dispatch(closeAuthPopup());
      });
    }
  };

  const handleForgotPasswordClick = () => {
    dispatch(closeAuthPopup());
  };

  if (!isAuthPopupOpen) return null;

  return (
    <>
      <div className="overlay" onClick={() => dispatch(closeAuthPopup())} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-md w-full max-w-md animate-fade-up">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2 className="font-ui font-bold text-xl tracking-wide text-foreground">
                {mode === "login" ? "CONNEXION" : "CRÉER UN COMPTE"}
              </h2>
              <p className="text-muted-foreground text-sm mt-0.5">
                {mode === "login"
                  ? "Accédez à votre compte ETS HOUSSENI"
                  : "Rejoignez ETS HOUSSENI"}
              </p>
            </div>
            <button
              onClick={() => dispatch(closeAuthPopup())}
              className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {mode === "signup" && (
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Nom complet"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-base w-full pl-10"
                  required
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
              <input
                type="email"
                placeholder="Adresse email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-base w-full pl-10"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mot de passe"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input-base w-full pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4.5 h-4.5" />
                ) : (
                  <Eye className="w-4.5 h-4.5" />
                )}
              </button>
            </div>

            {/* Lien mot de passe oublié (mode login uniquement) */}
            {mode === "login" && (
              <div className="text-right">
                <Link
                  to="/password/forgot"
                  onClick={handleForgotPasswordClick}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors font-ui tracking-wide"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn || isSigningUp}
              className="btn-primary w-full text-base py-3 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoggingIn || isSigningUp ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Chargement...
                </span>
              ) : mode === "login" ? (
                "SE CONNECTER"
              ) : (
                "CRÉER MON COMPTE"
              )}
            </button>
          </form>

          {/* Switch mode */}
          <div className="px-6 pb-6 text-center">
            <p className="text-muted-foreground text-sm">
              {mode === "login" ? "Pas encore de compte ?" : "Déjà un compte ?"}{" "}
              <button
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="text-primary font-semibold hover:underline"
              >
                {mode === "login" ? "S'inscrire" : "Se connecter"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginModal;
