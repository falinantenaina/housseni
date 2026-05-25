import {
  Camera,
  Check,
  CheckCircle,
  Eye,
  EyeOff,
  KeyRound,
  Loader,
  Mail,
  MapPin,
  Package,
  Save,
  Shield,
  Truck,
  User,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { axiosInstance } from "../lib/axios";
import { saveShippingInfo, updateProfile } from "../store/slices/authSlice";

//  Helpers
const Field = ({ label, icon: Icon, children }) => (
  <div>
    <label className="font-ui text-xs text-muted-foreground tracking-widest uppercase block mb-1.5">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      )}
      {children}
    </div>
  </div>
);

//  Onglet Informations personnelles
const ProfileInfoTab = ({ authUser }) => {
  const dispatch = useDispatch();
  const { isUpdatingProfile } = useSelector((s) => s.auth);
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    name: authUser?.name || "",
    email: authUser?.email || "",
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", form.name);
    data.append("email", form.email);
    if (avatarFile) data.append("avatar", avatarFile);
    dispatch(updateProfile(data)).then((res) => {
      if (!res.error) {
        setAvatarFile(null);
        setAvatarPreview(null);
      }
    });
  };

  const avatarSrc =
    avatarPreview || authUser?.avatar?.url || authUser?.avatar || null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avatar */}
      <div className="flex items-center gap-5 p-4 bg-secondary/40 rounded-xl border border-border">
        <div className="relative group shrink-0">
          <div className="w-20 h-20 rounded-full border-2 border-border overflow-hidden bg-secondary flex items-center justify-center">
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt={authUser?.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 text-muted-foreground" />
            )}
          </div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          >
            <Camera className="w-5 h-5 text-white" />
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-ui font-bold text-foreground truncate">
            {authUser?.name}
          </p>
          <p className="text-muted-foreground text-xs font-ui mt-0.5 truncate">
            {authUser?.email}
          </p>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="text-primary text-xs font-ui font-semibold mt-2 hover:underline"
          >
            Changer la photo
          </button>
        </div>
        {avatarPreview && (
          <button
            type="button"
            onClick={() => {
              setAvatarPreview(null);
              setAvatarFile(null);
            }}
            className="p-1.5 rounded-full hover:bg-secondary text-muted-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Champs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Nom complet *" icon={User}>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input-base w-full pl-10"
            required
          />
        </Field>
        <Field label="Adresse email" icon={Mail}>
          <input
            disabled
            type="email"
            value={form.email}
            className="input-base w-full pl-10 opacity-60 cursor-not-allowed"
          />
        </Field>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isUpdatingProfile}
          className="btn-primary px-8 py-2.5 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isUpdatingProfile ? (
            <>
              <Loader className="w-4 h-4 animate-spin" /> Enregistrement...
            </>
          ) : (
            <>
              <Check className="w-4 h-4" /> Sauvegarder
            </>
          )}
        </button>
      </div>
    </form>
  );
};

//  Onglet Adresse de livraison
const ShippingTab = ({ authUser }) => {
  const dispatch = useDispatch();
  const { isSavingShippingInfo } = useSelector((s) => s.auth);
  const saved = authUser?.shipping_info || {};

  const [form, setForm] = useState({
    phone: saved.phone || "",
    address: saved.address || "",
    city: saved.city || "",
    state: saved.state || "",
    country: saved.country || "",
    pincode: saved.pincode || "",
  });

  const hasUnsavedChanges =
    form.phone !== (saved.phone || "") ||
    form.address !== (saved.address || "") ||
    form.city !== (saved.city || "") ||
    form.state !== (saved.state || "") ||
    form.country !== (saved.country || "") ||
    form.pincode !== (saved.pincode || "");

  const hasSavedData = !!(saved.address || saved.phone || saved.city);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(saveShippingInfo(form));
  };

  const inputClass = (key) =>
    `input-base w-full ${form[key] && !hasUnsavedChanges ? "border-emerald-500/30" : ""}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl">
        <Package className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground font-ui">
          Ces informations seront{" "}
          <span className="text-foreground font-semibold">
            pré-remplies automatiquement
          </span>{" "}
          lors de vos prochaines commandes. Vous pourrez toujours les modifier
          avant de valider.
        </p>
      </div>

      {/* Badge données sauvegardées */}
      {hasSavedData && !hasUnsavedChanges && (
        <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2.5 font-ui">
          <CheckCircle className="w-3.5 h-3.5 shrink-0" />
          Adresse de livraison sauvegardée — pré-remplissage actif sur le
          formulaire de commande
        </div>
      )}

      {/* Contact */}
      <div>
        <p className="font-ui text-xs text-muted-foreground tracking-widest uppercase mb-3 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5" /> Contact
        </p>
        <Field label="Téléphone">
          <input
            type="tel"
            placeholder="Ex: +262 XX XX XX XX"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={inputClass("phone")}
          />
        </Field>
      </div>

      {/* Adresse */}
      <div>
        <p className="font-ui text-xs text-muted-foreground tracking-widest uppercase mb-3 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" /> Adresse
        </p>
        <div className="space-y-3">
          <Field label="Rue / Quartier">
            <input
              type="text"
              placeholder="Rue, quartier, numéro..."
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className={inputClass("address")}
            />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Ville">
              <input
                type="text"
                placeholder="Ex: Mamoudzou"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className={inputClass("city")}
              />
            </Field>
            <Field label="Province / Région">
              <input
                type="text"
                placeholder="Votre région"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className={inputClass("state")}
              />
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Pays">
              <input
                type="text"
                placeholder="Ex: Mayotte"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                className={inputClass("country")}
              />
            </Field>
            <Field label="Code postal">
              <input
                type="text"
                placeholder="Ex: 97600"
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                className={inputClass("pincode")}
              />
            </Field>
          </div>
        </div>
      </div>

      {/* Zones */}
      <div className="p-4 bg-secondary/40 border border-border rounded-xl">
        <p className="font-ui text-xs text-muted-foreground tracking-widest uppercase mb-3 flex items-center gap-1.5">
          <Truck className="w-3.5 h-3.5" /> Zones et tarifs de livraison
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { zone: "Ville", price: 50 },
            { zone: "Sud", price: 100 },
            { zone: "Nord", price: 100 },
            { zone: "Petite Terre", price: 250 },
          ].map(({ zone, price }) => (
            <div
              key={zone}
              className="flex items-center justify-between text-xs bg-background border border-border rounded-lg px-3 py-2"
            >
              <span className="font-ui font-semibold text-foreground">
                {zone}
              </span>
              <span className="font-ui text-primary font-bold">{price} €</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground font-ui mt-2">
          La zone sera sélectionnée lors de chaque commande.
        </p>
      </div>

      <div className="flex items-center justify-between pt-1">
        {hasUnsavedChanges ? (
          <p className="text-xs text-yellow-600 font-ui flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 inline-block" />
            Modifications non sauvegardées
          </p>
        ) : (
          <span />
        )}
        <button
          type="submit"
          disabled={isSavingShippingInfo || !hasUnsavedChanges}
          className="btn-primary px-8 py-2.5 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSavingShippingInfo ? (
            <>
              <Loader className="w-4 h-4 animate-spin" /> Sauvegarde...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Sauvegarder
            </>
          )}
        </button>
      </div>
    </form>
  );
};

//  Onglet Mot de passe
const PasswordField = ({
  label,
  field,
  showKey,
  form,
  setForm,
  show,
  setShow,
}) => (
  <div>
    <label className="font-ui text-xs text-muted-foreground tracking-widest uppercase block mb-1.5">
      {label} *
    </label>
    <div className="relative">
      <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <input
        type={show[showKey] ? "text" : "password"}
        value={form[field]}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, [field]: e.target.value }))
        }
        className="input-base w-full pl-10 pr-10"
        required
      />
      <button
        type="button"
        onClick={() =>
          setShow((prev) => ({ ...prev, [showKey]: !prev[showKey] }))
        }
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
      >
        {show[showKey] ? (
          <EyeOff className="w-4 h-4" />
        ) : (
          <Eye className="w-4 h-4" />
        )}
      </button>
    </div>
  </div>
);

const PasswordTab = () => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmNewPassword) {
      toast.error("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }
    if (form.newPassword.length < 8 || form.newPassword.length > 16) {
      toast.error("Le mot de passe doit contenir entre 8 et 16 caractères.");
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.put("/auth/password/update", form);
      toast.success("Mot de passe mis à jour avec succès !");
      setForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Erreur lors de la mise à jour.",
      );
    } finally {
      setLoading(false);
    }
  };

  const strength = getStrength(form.newPassword);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
        <p className="text-sm text-muted-foreground font-ui">
          Le mot de passe doit contenir entre{" "}
          <span className="text-foreground font-semibold">
            8 et 16 caractères
          </span>
          .
        </p>
      </div>

      <PasswordField
        label="Mot de passe actuel"
        field="currentPassword"
        showKey="current"
        form={form}
        setForm={setForm}
        show={show}
        setShow={setShow}
      />
      <PasswordField
        label="Nouveau mot de passe"
        field="newPassword"
        showKey="new"
        form={form}
        setForm={setForm}
        show={show}
        setShow={setShow}
      />

      {form.newPassword.length > 0 && (
        <div>
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${i <= strength ? strengthColor[strength] : "bg-border"}`}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground font-ui mt-1">
            {strengthLabel[strength]}
          </p>
        </div>
      )}

      <PasswordField
        label="Confirmer le nouveau mot de passe"
        field="confirmNewPassword"
        showKey="confirm"
        form={form}
        setForm={setForm}
        show={show}
        setShow={setShow}
      />

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary px-8 py-2.5 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" /> Mise à jour...
            </>
          ) : (
            <>
              <Check className="w-4 h-4" /> Mettre à jour
            </>
          )}
        </button>
      </div>
    </form>
  );
};

//  Page principale
const TABS = [
  { id: "info", label: "Informations", icon: User },
  { id: "shipping", label: "Mon adresse", icon: MapPin },
  { id: "password", label: "Mot de passe", icon: KeyRound },
];

const Profile = () => {
  const { authUser } = useSelector((s) => s.auth);
  const [activeTab, setActiveTab] = useState("info");

  if (!authUser) {
    return (
      <div className="min-h-screen pt-[88px] flex items-center justify-center">
        <p className="text-muted-foreground font-ui">
          Veuillez vous connecter pour accéder à votre profil.
        </p>
      </div>
    );
  }

  const saved = authUser?.shipping_info || {};
  const hasAddress = !!(saved.address || saved.city);

  return (
    <div className="min-h-screen bg-background pt-[88px]">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <span className="section-label">Compte</span>
          <h1 className="section-title">MON PROFIL</h1>
          <span className="accent-line" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/*  Sidebar  */}
          <aside className="lg:col-span-1">
            <div className="card-base p-5 space-y-1">
              {/* Avatar mini */}
              <div className="flex flex-col items-center text-center pb-4 mb-3 border-b border-border">
                <div className="w-16 h-16 rounded-full border-2 border-border overflow-hidden bg-secondary flex items-center justify-center mb-3">
                  {authUser?.avatar?.url ? (
                    <img
                      src={authUser.avatar.url}
                      alt={authUser.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-7 h-7 text-muted-foreground" />
                  )}
                </div>
                <p className="font-ui font-bold text-foreground text-sm leading-tight">
                  {authUser.name}
                </p>
                <div className="flex items-center gap-1 mt-1.5">
                  <Shield className="w-3 h-3 text-primary" />
                  <span className="font-ui text-xs text-muted-foreground">
                    {authUser.role === "User" ? "Client" : authUser.role}
                  </span>
                </div>
              </div>

              {/* Nav tabs */}
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                // Badge "adresse manquante" sur l'onglet Mon adresse
                const showBadge = tab.id === "shipping" && !hasAddress;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-ui font-semibold text-sm tracking-wide transition-all text-left ${
                      isActive
                        ? "bg-primary text-white"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    <tab.icon className="w-4 h-4 shrink-0" />
                    <span className="flex-1">{tab.label}</span>
                    {showBadge && (
                      <span
                        className="w-2 h-2 rounded-full bg-yellow-500 shrink-0"
                        title="Adresse non renseignée"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </aside>

          {/*  Contenu  */}
          <div className="lg:col-span-3">
            <div className="card-base p-6">
              {/* Titre de section */}
              <div className="mb-6 pb-4 border-b border-border">
                {(() => {
                  const tab = TABS.find((t) => t.id === activeTab);
                  return (
                    <h2 className="font-ui font-bold text-foreground tracking-widest uppercase text-sm flex items-center gap-2">
                      <tab.icon className="w-4 h-4 text-primary" />
                      {tab.label}
                    </h2>
                  );
                })()}
              </div>

              {activeTab === "info" && <ProfileInfoTab authUser={authUser} />}
              {activeTab === "shipping" && <ShippingTab authUser={authUser} />}
              {activeTab === "password" && <PasswordTab />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
