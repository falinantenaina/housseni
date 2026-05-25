import {
  Bell,
  BellOff,
  CheckCheck,
  Loader,
  Package,
  RefreshCw,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const ZONE_LABELS = {
  ville: "Ville",
  sud: "Sud",
  nord: "Nord",
  petite_terre: "Petite Terre",
};

//  Formatage date relative
const timeAgo = (iso) => {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return "À l'instant";
  const min = Math.floor(sec / 60);
  if (min < 60) return `Il y a ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `Il y a ${h} h`;
  const d = Math.floor(h / 24);
  return d === 1 ? "Hier" : `Il y a ${d} j`;
};

//  Carte notification
const NotifCard = ({ notif, onRead, onNavigate }) => {
  const isNew = !notif.read;
  const zone = notif.delivery_zone ? ZONE_LABELS[notif.delivery_zone] : null;
  const price = (notif.total_price || 0).toLocaleString("fr-MG");
  const buyer = notif.buyer?.name || "Client";
  const items = notif.items_count || 0;

  return (
    <div
      onClick={() => {
        onRead(notif.id);
        onNavigate(notif.order_id);
      }}
      className={`
        flex gap-3 px-4 py-3 cursor-pointer transition-colors
        hover:bg-secondary/50 select-none
        ${
          isNew
            ? "bg-primary/5 border-l-2 border-primary"
            : "border-l-2 border-transparent opacity-70"
        }
      `}
    >
      {/* Icône */}
      <div
        className={`
        w-9 h-9 rounded-full shrink-0 flex items-center justify-center mt-0.5
        ${isNew ? "bg-primary/10" : "bg-secondary"}
      `}
      >
        <ShoppingBag
          className={`w-4 h-4 ${isNew ? "text-primary" : "text-muted-foreground"}`}
        />
      </div>

      {/* Contenu */}
      <div className="flex-1 min-w-0">
        <p
          className={`font-ui font-bold text-xs tracking-wide ${isNew ? "text-foreground" : "text-muted-foreground"}`}
        >
          Nouvelle commande
        </p>
        <p className="text-muted-foreground text-xs mt-0.5 truncate">
          {buyer} — {price} €{zone ? ` · ${zone}` : ""}
          {items ? ` · ${items} article${items > 1 ? "s" : ""}` : ""}
        </p>
        <p className="text-muted-foreground/50 text-[10px] mt-1 font-ui">
          {timeAgo(notif.received_at || notif.created_at)}
        </p>
      </div>

      {/* Pastille non-lu */}
      {isNew && (
        <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
      )}
    </div>
  );
};

//  Composant principal
const AdminNotifications = ({
  notifications = [],
  unreadCount = 0,
  isLoading = false,
  markAllRead,
  markOneRead,
  clearAll,
  clearAllForce,
  refresh,
}) => {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const navigate = useNavigate();

  // Fermer en cliquant à l'extérieur
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleOpen = () => {
    setOpen((prev) => {
      const next = !prev;
      // Marquer tout lu à l'ouverture si des non-lus existent
      if (next && unreadCount > 0) markAllRead();
      return next;
    });
  };

  const handleNavigate = () => {
    setOpen(false);
    navigate("/admin/orders");
  };

  const readCount = notifications.filter((n) => n.read).length;

  return (
    <div className="relative" ref={panelRef}>
      {/*  Cloche  */}
      <button
        onClick={handleOpen}
        title="Notifications commandes"
        className="relative p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
      >
        <Bell className="w-4.5 h-4.5" />

        {/* Badge rouge animé */}
        {unreadCount > 0 && (
          <span
            className="
            absolute -top-0.5 -right-0.5
            min-w-[18px] h-[18px] px-1
            bg-red-500 text-white text-[10px] font-bold rounded-full
            flex items-center justify-center font-ui leading-none
            animate-pulse
          "
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/*  Panel déroulant  */}
      {open && (
        <div
          className="
          absolute right-0 top-full mt-2 w-80
          bg-card border border-border rounded-xl shadow-2xl
          z-50 overflow-hidden animate-fade-up
        "
        >
          {/* En-tête */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              <span className="font-ui font-bold text-foreground text-sm tracking-wide">
                NOTIFICATIONS
              </span>
              {unreadCount > 0 && (
                <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full font-ui">
                  {unreadCount}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {/* Rafraîchir manuellement */}
              <button
                onClick={refresh}
                disabled={isLoading}
                title="Rafraîchir"
                className="p-1.5 rounded text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors disabled:opacity-40"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
                />
              </button>

              {/* Tout marquer lu */}
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  title="Tout marquer comme lu"
                  className="p-1.5 rounded text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Supprimer les lues */}
              {readCount > 0 && (
                <button
                  onClick={clearAll}
                  title="Supprimer les notifications lues"
                  className="p-1.5 rounded text-muted-foreground hover:text-yellow-600 hover:bg-yellow-500/10 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Tout supprimer */}
              {notifications.length > 0 && (
                <button
                  onClick={clearAllForce}
                  title="Tout supprimer"
                  className="p-1.5 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Indicateur polling */}
          <div className="flex items-center gap-1.5 px-4 py-1.5 bg-secondary/30 border-b border-border/50">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-ui text-[10px] text-muted-foreground tracking-wide">
              Actualisation automatique toutes les 15 s
            </span>
          </div>

          {/* Liste */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-border/50">
            {isLoading && notifications.length === 0 ? (
              <div className="flex items-center justify-center py-10 gap-2 text-muted-foreground">
                <Loader className="w-4 h-4 animate-spin" />
                <span className="font-ui text-xs">Chargement...</span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3 text-muted-foreground">
                <BellOff className="w-8 h-8 opacity-20" />
                <p className="font-ui text-xs tracking-wide">
                  Aucune notification
                </p>
              </div>
            ) : (
              notifications.map((notif) => (
                <NotifCard
                  key={notif.id}
                  notif={notif}
                  onRead={markOneRead}
                  onNavigate={handleNavigate}
                />
              ))
            )}
          </div>

          {/* Pied */}
          {notifications.length > 0 && (
            <div className="border-t border-border px-4 py-2.5">
              <button
                onClick={handleNavigate}
                className="
                  w-full flex items-center justify-center gap-2
                  font-ui font-bold text-xs tracking-widest uppercase
                  text-primary hover:text-primary/80 transition-colors py-1
                "
              >
                <Package className="w-3.5 h-3.5" />
                Voir toutes les commandes
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminNotifications;
