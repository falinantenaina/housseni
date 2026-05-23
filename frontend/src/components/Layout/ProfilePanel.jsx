import { LogOut, Package, User, X } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout, updateProfile } from "../../store/slices/authSlice";
import { closeProfile } from "../../store/slices/popupSlice";

const ProfilePanel = () => {
  const dispatch = useDispatch();
  const { isProfileOpen } = useSelector((state) => state.popup);
  const { authUser, isUpdatingProfile } = useSelector((state) => state.auth);
  const [tab, setTab] = useState("profile");
  const [form, setForm] = useState({
    name: "",
    email: "",
    newPassword: "",
    avatar: "",
  });
  const [showPw, setShowPw] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(closeProfile());
  };

  const handleSave = (e) => {
    e.preventDefault();
    const data = {};
    if (form.name) data.name = form.name;
    if (form.newPassword) data.password = form.newPassword;
    if (form.avatar) data.avatar = form.avatar;
    dispatch(updateProfile(data));
  };

  if (!isProfileOpen || !authUser) return null;

  return (
    <>
      <div className="overlay" onClick={() => dispatch(closeProfile())} />
      <div className="fixed top-0 right-0 h-full w-full sm:w-96 bg-card border-l border-border z-50 animate-slide-right flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-ui font-bold text-lg tracking-wide text-foreground">
            MON PROFIL
          </h2>
          <button
            onClick={() => dispatch(closeProfile())}
            className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User info */}
        <div className="p-5 border-b border-border bg-secondary/30">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center overflow-hidden">
              {authUser.avatar ? (
                <img
                  src={authUser.avatar}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-xl font-bold font-display">
                  {authUser.name?.[0]?.toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <p className="font-ui font-bold text-foreground tracking-wide">
                {authUser.name}
              </p>
              <p className="text-muted-foreground text-sm">{authUser.email}</p>
              {authUser.role === "admin" || authUser.role === "Admin" ? (
                <span className="badge-primary text-xs mt-1 inline-block">
                  Admin
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {/* Admin link */}
        {(authUser.role === "admin" || authUser.role === "Admin") && (
          <div className="px-5 py-2 border-b border-border bg-primary/5">
            <a
              href="/admin"
              onClick={() => dispatch(closeProfile())}
              className="flex items-center gap-2 text-primary font-ui font-bold text-sm tracking-widest uppercase hover:underline"
            >
              ⚙ Panneau d'Administration
            </a>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-border">
          {["profile", "orders"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 font-ui font-semibold text-sm tracking-wide transition-colors ${
                tab === t
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "profile" ? "MODIFIER" : "COMMANDES"}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {tab === "profile" ? (
            <div className="text-center py-8">
              <User className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm mb-4">
                Consultez mon profil
              </p>
              <Link
                to="/profil"
                onClick={() => dispatch(closeProfile())}
                className="btn-primary inline-block"
              >
                MODIFIER MON PROFIL
              </Link>
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm mb-4">
                Consultez toutes vos commandes
              </p>
              <Link
                to="/orders"
                onClick={() => dispatch(closeProfile())}
                className="btn-primary inline-block"
              >
                VOIR MES COMMANDES
              </Link>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="btn-secondary w-full flex items-center justify-center gap-2 text-destructive border-destructive/30 hover:bg-destructive/10"
          >
            <LogOut className="w-4 h-4" />
            SE DÉCONNECTER
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfilePanel;
