import {
  ArrowLeft,
  CheckCircle,
  Loader,
  MapPin,
  Package,
  Phone,
  Save,
  ShoppingBag,
  Truck,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { saveShippingInfo } from "../store/slices/authSlice";
import { placeOrder, resetOrderSuccess } from "../store/slices/orderSlice";
import { openAuthPopup } from "../store/slices/popupSlice";

const SHIPPING_RATES = {
  ville: 50,
  sud: 100,
  nord: 100,
  petite_terre: 250,
};

const ZONE_OPTIONS = [
  { value: "ville", label: "Ville", price: SHIPPING_RATES.ville },
  { value: "sud", label: "Sud", price: SHIPPING_RATES.sud },
  { value: "nord", label: "Nord", price: SHIPPING_RATES.nord },
  {
    value: "petite_terre",
    label: "Petite Terre",
    price: SHIPPING_RATES.petite_terre,
  },
];

// Compare deux objets de shipping_info pour détecter les changements
const shippingEqual = (form, saved) =>
  form.phone === (saved?.phone || "") &&
  form.address === (saved?.address || "") &&
  form.city === (saved?.city || "") &&
  form.state === (saved?.state || "") &&
  form.country === (saved?.country || "") &&
  form.pincode === (saved?.pincode || "");

const Payment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart } = useSelector((s) => s.cart);
  const { authUser, isSavingShippingInfo } = useSelector((s) => s.auth);
  const { placingOrder, orderSuccess } = useSelector((s) => s.order);
  const [redirecting, setRedirecting] = useState(false);
  const [deliveryZone, setDeliveryZone] = useState("");

  // Référence aux infos sauvegardées (mis à jour quand authUser change)
  const saved = authUser?.shipping_info || {};

  const [form, setForm] = useState({
    full_name: authUser?.name || "",
    phone: saved.phone || "",
    address: saved.address || "",
    city: saved.city || "",
    state: saved.state || "",
    country: saved.country || "",
    pincode: saved.pincode || "",
  });

  // Quand authUser se met à jour (après saveShippingInfo), synchronise le form
  // mais seulement si l'utilisateur n'est pas en train d'éditer (firstMount)
  const firstMount = useRef(true);
  useEffect(() => {
    if (firstMount.current) {
      firstMount.current = false;
      return;
    }
    // Mise à jour des champs adresse/contact uniquement (pas full_name)
    setForm((prev) => ({
      ...prev,
      phone: authUser?.shipping_info?.phone || "",
      address: authUser?.shipping_info?.address || "",
      city: authUser?.shipping_info?.city || "",
      state: authUser?.shipping_info?.state || "",
      country: authUser?.shipping_info?.country || "",
      pincode: authUser?.shipping_info?.pincode || "",
    }));
  }, [authUser?.shipping_info]);

  // Détecte si le form diffère des données sauvegardées
  const hasUnsavedChanges = !shippingEqual(form, saved);

  const subtotal = cart.reduce(
    (a, i) => a + (i.price || 0) * (i.quantity || 1),
    0,
  );
  const shippingPrice = deliveryZone ? (SHIPPING_RATES[deliveryZone] ?? 0) : 0;
  const total = subtotal + shippingPrice;

  useEffect(() => {
    dispatch(resetOrderSuccess());
  }, [dispatch]);

  useEffect(() => {
    if (!authUser) {
      dispatch(openAuthPopup());
      navigate("/cart");
      return;
    }
    if (cart.length === 0 && !placingOrder && !orderSuccess && !redirecting) {
      navigate("/cart");
    }
  }, [
    authUser,
    cart.length,
    placingOrder,
    orderSuccess,
    redirecting,
    dispatch,
    navigate,
  ]);

  useEffect(() => {
    if (orderSuccess) {
      setRedirecting(true);
      const timer = setTimeout(() => {
        dispatch(resetOrderSuccess());
        navigate("/orders");
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [orderSuccess, dispatch, navigate]);

  // Sauvegarde manuelle (bouton "Sauvegarder mon adresse")
  const handleSaveShipping = () => {
    dispatch(
      saveShippingInfo({
        phone: form.phone,
        address: form.address,
        city: form.city,
        state: form.state,
        country: form.country,
        pincode: form.pincode,
      }),
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const orderedItems = cart.map((item) => ({
      product: { id: item.id, images: item.images || [], name: item.name },
      quantity: item.quantity || 1,
    }));

    // placeOrder → le backend sauvegarde automatiquement les infos de livraison
    dispatch(
      placeOrder({
        ...form,
        orderedItems,
        delivery_zone: deliveryZone || null,
      }),
    );
  };

  const field = (
    label,
    key,
    type = "text",
    placeholder = "",
    required = true,
  ) => (
    <div>
      <label className="font-ui text-xs text-muted-foreground tracking-widest uppercase block mb-1.5">
        {label} {required ? "*" : ""}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className="input-base w-full"
        required={required}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-background pt-[88px]">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-ui text-sm tracking-wide mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Retour au panier
          </Link>
          <span className="section-label block">Finalisation</span>
          <h1 className="section-title">PASSER LA COMMANDE</h1>
          <span className="accent-line" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* ── Formulaire ───────────────────────────────────────────── */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Infos personnelles */}
              <div className="card-base p-5">
                <h2 className="font-ui font-bold text-foreground tracking-widest uppercase text-sm mb-4 flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Informations personnelles
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {field("Nom complet", "full_name", "text", "Ex: Jean Dupont")}
                  {field("Téléphone", "phone", "tel", "Ex: +262 XX XX XX XX")}
                </div>
              </div>

              {/* Adresse de livraison */}
              <div className="card-base p-5">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <h2 className="font-ui font-bold text-foreground tracking-widest uppercase text-sm flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    Adresse de livraison
                  </h2>

                  {/* Bouton sauvegarde manuelle — visible seulement si l'adresse a été modifiée */}
                  {hasUnsavedChanges && (
                    <button
                      type="button"
                      onClick={handleSaveShipping}
                      disabled={isSavingShippingInfo}
                      className="flex items-center gap-1.5 font-ui font-semibold text-xs tracking-widest uppercase px-3 py-1.5 rounded-md border border-primary/40 text-primary hover:bg-primary/10 transition-colors disabled:opacity-50 shrink-0"
                    >
                      {isSavingShippingInfo ? (
                        <Loader className="w-3 h-3 animate-spin" />
                      ) : (
                        <Save className="w-3 h-3" />
                      )}
                      Sauvegarder mon adresse
                    </button>
                  )}
                </div>

                {/* Badge pré-remplissage */}
                {(saved.address || saved.phone) && !hasUnsavedChanges && (
                  <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2 mb-4 font-ui">
                    <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                    Pré-rempli depuis votre compte — vous pouvez modifier si
                    besoin
                  </div>
                )}

                <div className="space-y-4">
                  {field(
                    "Adresse",
                    "address",
                    "text",
                    "Rue, quartier, numéro...",
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {field("Ville", "city", "text", "Ex: Mamoudzou")}
                    {field(
                      "Province / Région",
                      "state",
                      "text",
                      "Votre région",
                      false,
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {field("Pays", "country", "text", "Ex: Mayotte")}
                    {field("Code postal", "pincode", "number", "Ex: 97600")}
                  </div>
                </div>
              </div>

              {/* Zone de livraison */}
              <div className="card-base p-5">
                <h2 className="font-ui font-bold text-foreground tracking-widest uppercase text-sm mb-1 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-primary" />
                  Zone de livraison
                  <span className="text-muted-foreground font-normal text-xs normal-case tracking-normal ml-1">
                    (optionnel)
                  </span>
                </h2>
                <p className="text-muted-foreground text-xs mb-4">
                  Sélectionnez votre zone pour connaître les frais appliqués.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {ZONE_OPTIONS.map(({ value, label, price }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setDeliveryZone(deliveryZone === value ? "" : value)
                      }
                      className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all ${
                        deliveryZone === value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      }`}
                    >
                      <MapPin
                        className={`w-4 h-4 ${deliveryZone === value ? "text-primary" : ""}`}
                      />
                      <span className="font-ui font-bold text-xs tracking-wide">
                        {label}
                      </span>
                      <span
                        className={`font-ui text-xs font-semibold ${deliveryZone === value ? "text-primary" : "text-muted-foreground"}`}
                      >
                        {price} €
                      </span>
                    </button>
                  ))}
                </div>
                {deliveryZone && (
                  <div className="mt-3 flex items-center justify-between text-sm bg-primary/5 border border-primary/20 rounded-lg px-3 py-2">
                    <span className="font-ui text-foreground">
                      Zone :{" "}
                      <strong>
                        {
                          ZONE_OPTIONS.find((z) => z.value === deliveryZone)
                            ?.label
                        }
                      </strong>
                    </span>
                    <span className="font-ui font-bold text-primary">
                      {shippingPrice} €
                    </span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={placingOrder}
                className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {placingOrder ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" /> Confirmation en
                    cours...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" /> CONFIRMER LA COMMANDE
                  </>
                )}
              </button>
            </form>
          </div>

          {/* ── Résumé commande ───────────────────────────────────────── */}
          <div className="lg:col-span-2">
            <div className="card-base p-5 sticky top-24">
              <h2 className="font-ui font-bold text-foreground tracking-widest uppercase text-sm mb-4 pb-3 border-b border-border flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-primary" />
                VOTRE COMMANDE
              </h2>

              <div className="space-y-3 mb-4 pb-4 border-b border-border max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 text-sm"
                  >
                    <div className="relative shrink-0">
                      <img
                        src={
                          item.images?.[0]?.url ||
                          item.image ||
                          "https://via.placeholder.com/48"
                        }
                        alt=""
                        className="w-12 h-12 object-cover rounded border border-border bg-secondary"
                      />
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary text-white rounded-full text-[10px] font-bold flex items-center justify-center font-ui">
                        {item.quantity || 1}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-ui text-foreground text-xs truncate">
                        {item.name}
                      </p>
                      <p className="text-muted-foreground text-xs font-ui">
                        {(item.price || 0).toLocaleString("fr-MG")} € ×{" "}
                        {item.quantity || 1}
                      </p>
                    </div>
                    <span className="font-ui font-bold text-primary text-xs shrink-0">
                      {(
                        (item.price || 0) * (item.quantity || 1)
                      ).toLocaleString("fr-MG")}{" "}
                      €
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-ui">
                    Sous-total (
                    {cart.reduce((a, i) => a + (i.quantity || 1), 0)} article
                    {cart.reduce((a, i) => a + (i.quantity || 1), 0) > 1
                      ? "s"
                      : ""}
                    )
                  </span>
                  <span className="font-ui">
                    {subtotal.toLocaleString("fr-MG")} €
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-ui flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" />
                    Livraison
                    {deliveryZone
                      ? ` (${ZONE_OPTIONS.find((z) => z.value === deliveryZone)?.label})`
                      : ""}
                  </span>
                  {deliveryZone ? (
                    <span className="font-ui font-semibold text-foreground">
                      {shippingPrice} €
                    </span>
                  ) : (
                    <span className="font-ui text-muted-foreground italic text-xs">
                      Non renseignée
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-between mt-4 pt-4 border-t border-border font-ui font-bold">
                <span className="text-foreground tracking-wide">TOTAL</span>
                <span className="text-primary text-lg">
                  {total.toLocaleString("fr-MG")} €
                </span>
              </div>

              <div className="mt-4 pt-4 border-t border-border space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-ui">
                  <Package className="w-3.5 h-3.5 text-primary shrink-0" />
                  Paiement à la livraison
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-ui">
                  <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
                  Vous serez contacté pour confirmer la livraison
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
