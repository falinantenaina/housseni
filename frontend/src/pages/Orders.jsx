import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  MapPin,
  Package,
  Truck,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchMyOrders } from "../store/slices/orderSlice";
import { openAuthPopup } from "../store/slices/popupSlice";

const statusConfig = {
  "En cours": {
    icon: Clock,
    label: "En cours",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  Confirmé: {
    icon: Truck,
    label: "Confirmé",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
  Livré: {
    icon: CheckCircle,
    label: "Livré",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  Annulé: {
    icon: XCircle,
    label: "Annulé",
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
};

const ZONE_LABELS = {
  ville: "Ville",
  sud: "Sud",
  nord: "Nord",
  petite_terre: "Petite Terre",
};

const OrderRow = ({ order }) => {
  const [open, setOpen] = useState(false);
  const status = order.order_status || "En cours";
  const cfg = statusConfig[status] || statusConfig["En cours"];
  const items = order.order_items || [];
  const shipping = order.shipping_info || {};
  const shortId = (order.id || "").slice(-8).toUpperCase();
  const zoneLabel = order.delivery_zone
    ? ZONE_LABELS[order.delivery_zone]
    : null;
  const shippingPrice = order.shipping_price || 0;
  const total =
    Number(order.total_price || 0) +
    Number(shippingPrice || 0) +
    Number(order.tax_price || 0);

  return (
    <div className="card-base overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 p-4 hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div className="hidden sm:block text-left">
            <p className="font-ui font-bold text-foreground text-sm tracking-wide">
              #{shortId}
            </p>
            <p className="text-muted-foreground text-xs">
              {order.created_at
                ? new Date(order.created_at).toLocaleDateString("fr-FR")
                : "—"}
            </p>
          </div>
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md ${cfg.bg} shrink-0`}
          >
            <cfg.icon className={`w-3.5 h-3.5 ${cfg.color}`} />
            <span
              className={`font-ui font-semibold text-xs tracking-wide ${cfg.color}`}
            >
              {cfg.label}
            </span>
          </div>
          <span className="font-ui font-bold text-primary text-sm hidden sm:block">
            {(order.total_price || 0).toLocaleString("fr-MG")} €
          </span>
          {/* Zone badge */}
          {zoneLabel && (
            <span className="hidden lg:flex items-center gap-1 text-xs font-ui text-muted-foreground bg-secondary px-2 py-0.5 rounded">
              <MapPin className="w-3 h-3" /> {zoneLabel}
            </span>
          )}
          {order.paid_at ? (
            <span className="text-emerald-500 text-xs font-ui font-semibold hidden lg:block">
              ✓ Payé
            </span>
          ) : (
            <span className="text-yellow-500 text-xs font-ui font-semibold hidden lg:block">
              Paiement en attente
            </span>
          )}
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        )}
      </button>

      {open && (
        <div className="border-t border-border p-4 animate-fade-up">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-sm">
            <div>
              <p className="font-ui text-xs text-muted-foreground tracking-widest uppercase mb-1">
                Commande
              </p>
              <p className="font-ui text-foreground text-xs break-all">
                #{order.id}
              </p>
              <p className="text-muted-foreground text-xs">
                {order.created_at
                  ? new Date(order.created_at).toLocaleString("fr-FR")
                  : "—"}
              </p>
            </div>
            {shipping.full_name && (
              <div>
                <p className="font-ui text-xs text-muted-foreground tracking-widest uppercase mb-1">
                  Livraison
                </p>
                <p className="font-ui font-semibold text-foreground text-sm">
                  {shipping.full_name}
                </p>
                <p className="text-muted-foreground text-xs">
                  {shipping.address}
                </p>
                <p className="text-muted-foreground text-xs">
                  {shipping.city} {shipping.state}
                </p>
                <p className="text-muted-foreground text-xs">
                  {shipping.phone}
                </p>
              </div>
            )}
          </div>

          {/* Zone de livraison */}
          <div className="mb-4 flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
            <Truck className="w-4 h-4 text-primary shrink-0" />
            <div className="flex-1">
              <p className="font-ui text-xs text-muted-foreground tracking-widest uppercase mb-0.5">
                Zone de livraison
              </p>
              {zoneLabel ? (
                <p className="font-ui font-semibold text-foreground text-sm flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  {zoneLabel}
                </p>
              ) : (
                <p className="font-ui text-muted-foreground text-sm italic">
                  Non renseignée
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="font-ui text-xs text-muted-foreground">
                Frais de livraison
              </p>
              <p
                className={`font-ui font-bold text-sm ${shippingPrice > 0 ? "text-foreground" : "text-muted-foreground"}`}
              >
                {shippingPrice > 0
                  ? `${shippingPrice.toLocaleString("fr-MG")} €`
                  : "—"}
              </p>
            </div>
          </div>

          {items.length > 0 && (
            <div className="mb-4">
              <p className="font-ui text-xs text-muted-foreground tracking-widest uppercase mb-2">
                Articles ({items.length})
              </p>
              <div className="space-y-2">
                {items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-sm py-2 border-b border-border last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt=""
                          className="w-10 h-10 object-cover rounded border border-border bg-secondary"
                        />
                      )}
                      <span className="font-ui text-foreground">
                        {item.title || "Produit"}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-muted-foreground font-ui">
                        ×{item.quantity}
                      </span>
                      <span className="font-ui font-bold text-primary">
                        {((item.price || 0) * item.quantity).toLocaleString(
                          "fr-MG",
                        )}{" "}
                        €
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Récap prix */}
          <div className="space-y-1 pt-2 text-sm">
            <div className="flex justify-between text-muted-foreground font-ui">
              <span>Sous-total</span>
              <span>{(order.total_price || 0).toLocaleString("fr-MG")} €</span>
            </div>
            {shippingPrice > 0 && (
              <div className="flex justify-between text-muted-foreground font-ui">
                <span>Livraison{zoneLabel ? ` (${zoneLabel})` : ""}</span>
                <span>{shippingPrice.toLocaleString("fr-MG")} €</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-border font-ui font-bold">
              <span className="text-foreground">Total TTC</span>
              <span className="text-primary">
                {total.toLocaleString("fr-MG")} €
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Orders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { myOrders, fetchingOrders } = useSelector((s) => s.order);
  const { authUser } = useSelector((s) => s.auth);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!authUser) {
      dispatch(openAuthPopup());
      navigate("/");
      return;
    }
    dispatch(fetchMyOrders());
  }, [authUser, dispatch, navigate]);

  const filtered =
    filter === "all"
      ? myOrders
      : myOrders.filter((o) => o.order_status === filter);

  return (
    <div className="min-h-screen bg-background pt-[88px]">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <span className="section-label">Historique</span>
          <h1 className="section-title">MES COMMANDES</h1>
          <span className="accent-line" />
        </div>

        {/* Filtres */}
        <div className="flex gap-2 flex-wrap mb-6">
          {[
            ["all", "Toutes"],
            ["En cours", "En cours"],
            ["Confirmé", "Confirmé"],
            ["Livré", "Livré"],
            ["Annulé", "Annulé"],
          ].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              className={`font-ui font-semibold text-xs tracking-widest uppercase px-4 py-2 rounded-md border transition-colors ${
                filter === val
                  ? "bg-primary border-primary text-white"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {fetchingOrders ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card-base h-16 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
            <h3 className="font-ui font-bold text-xl tracking-wide text-foreground mb-2">
              AUCUNE COMMANDE
            </h3>
            <p className="text-muted-foreground mb-6">
              Vous n'avez pas encore de commande
            </p>
            <Link to="/products" className="btn-primary">
              COMMENCER MES ACHATS
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((order) => (
              <OrderRow key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
