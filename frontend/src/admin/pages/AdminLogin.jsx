import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { login } from "../../store/slices/authSlice";

const AdminLogin = () => {
  const dispatch = useDispatch();
  const { authUser, isLoggingIn } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);

  if (authUser?.role === "admin" || authUser?.role === "Admin") {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(form));
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-md flex items-center justify-center mx-auto mb-4">
            <span className="font-display text-white text-4xl leading-none">H</span>
          </div>
          <h1 className="font-display text-foreground text-4xl tracking-widest">ETS HOUSSENI</h1>
          <p className="font-ui text-muted-foreground tracking-widest uppercase text-xs mt-1">
            Panneau d'Administration
          </p>
        </div>

        <div className="card-base p-7">
          <h2 className="font-ui font-bold text-foreground tracking-widest uppercase text-lg mb-6">
            CONNEXION ADMIN
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-ui text-xs text-muted-foreground tracking-widest uppercase block mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="admin@ets-housseni.mg"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-base w-full pl-10"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="font-ui text-xs text-muted-foreground tracking-widest uppercase block mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input-base w-full pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPw ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoggingIn ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Connexion...
                </>
              ) : "SE CONNECTER"}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-border text-center">
            <a href="/" className="font-ui text-sm text-muted-foreground hover:text-primary transition-colors tracking-wide">
              ← Retour au site client
            </a>
          </div>
        </div>

        <p className="text-center text-muted-foreground text-xs font-ui mt-4 tracking-wide">
          Accès réservé aux administrateurs ETS HOUSSENI
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
