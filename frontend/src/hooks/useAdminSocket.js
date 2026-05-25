import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { axiosInstance } from "../lib/axios";

// Intervalle de polling en ms (15 secondes)
const POLL_INTERVAL = 15_000;
const MAX_NOTIFS = 50;

const ZONE_LABELS = {
  ville: "Ville",
  sud: "Sud",
  nord: "Nord",
  petite_terre: "Petite Terre",
};

// Normalise une notification API vers un format d'affichage uniforme
const normalize = (raw) => ({
  id: raw.id,
  order_id: raw.order_id,
  type: raw.type || "new_order",
  read: raw.read ?? false,
  received_at: raw.created_at || new Date().toISOString(),
  created_at: raw.created_at || new Date().toISOString(),
  buyer: raw.payload?.buyer || {},
  total_price: raw.payload?.total_price ?? 0,
  shipping_price: raw.payload?.shipping_price ?? 0,
  delivery_zone: raw.payload?.delivery_zone ?? null,
  items_count: raw.payload?.items_count ?? 0,
});

export const useAdminSocket = () => {
  const { authUser } = useSelector((s) => s.auth);

  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // On garde en mémoire les IDs déjà vus pour détecter les nouvelles notifs
  const knownIds = useRef(new Set());
  const isFirst = useRef(true);

  const isAdmin = authUser?.role === "Admin" || authUser?.role === "admin";

  //  Fetch depuis l'API
  const fetchFromAPI = useCallback(
    async ({ silent = false } = {}) => {
      if (!isAdmin) return;
      if (!silent) setIsLoading(true);

      try {
        const res = await axiosInstance.get("/notifications");
        const list = (res.data.notifications || []).map(normalize);

        // Détecter les nouvelles notifs non lues inconnues (polling)
        // Pas d'alerte au premier chargement (on connaît déjà l'état initial)
        if (!isFirst.current) {
          list
            .filter((n) => !n.read && !knownIds.current.has(n.id))
            .forEach((n) => {
              const zone = n.delivery_zone
                ? ` · ${ZONE_LABELS[n.delivery_zone]}`
                : "";
              const price = (n.total_price || 0).toLocaleString("fr-MG");
              toast.info(
                `🛍️ Nouvelle commande de ${n.buyer?.name || "Client"} — ${price} €${zone}`,
                {
                  position: "top-right",
                  autoClose: 6000,
                  toastId: `order-${n.id}`,
                },
              );

              // Son discret
              try {
                const ctx = new (
                  window.AudioContext || window.webkitAudioContext
                )();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = "sine";
                osc.frequency.setValueAtTime(880, ctx.currentTime);
                gain.gain.setValueAtTime(0.15, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(
                  0.001,
                  ctx.currentTime + 0.4,
                );
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.4);
              } catch {
                /* silencieux si navigateur refuse */
              }
            });
        }

        // Mémoriser tous les IDs connus après le premier chargement
        list.forEach((n) => knownIds.current.add(n.id));
        isFirst.current = false;

        setNotifications(list.slice(0, MAX_NOTIFS));
      } catch (err) {
        console.warn("[Notifications] Polling échoué :", err.message);
      } finally {
        if (!silent) setIsLoading(false);
      }
    },
    [isAdmin],
  );

  //  Chargement initial
  useEffect(() => {
    fetchFromAPI();
  }, [fetchFromAPI]);

  //  Polling régulier
  useEffect(() => {
    if (!isAdmin) return;

    const timer = setInterval(() => {
      fetchFromAPI({ silent: true });
    }, POLL_INTERVAL);

    return () => clearInterval(timer);
  }, [isAdmin, fetchFromAPI]);

  //  Titre de l'onglet navigateur
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const base = "ETS HOUSSENI — Admin";
    document.title = unreadCount > 0 ? `(${unreadCount}) ${base}` : base;
    return () => {
      document.title = base;
    };
  }, [unreadCount]);

  //  Actions

  const markAllRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await axiosInstance.patch("/notifications/read-all");
    } catch {
      /* no-op */
    }
  }, []);

  const markOneRead = useCallback(async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
    try {
      await axiosInstance.patch(`/notifications/${id}/read`);
    } catch {
      /* no-op */
    }
  }, []);

  // Supprime uniquement les notifications déjà lues
  const clearAll = useCallback(async () => {
    setNotifications((prev) => prev.filter((n) => !n.read));
    try {
      await axiosInstance.delete("/notifications");
    } catch {
      /* no-op */
    }
  }, []);

  // Supprime TOUT (lues + non lues)
  const clearAllForce = useCallback(async () => {
    knownIds.current.clear();
    isFirst.current = true;
    setNotifications([]);
    try {
      await axiosInstance.delete("/notifications/all");
    } catch {
      /* no-op */
    }
  }, []);

  return {
    notifications,
    unreadCount,
    isLoading,
    markAllRead,
    markOneRead,
    clearAll,
    clearAllForce,
    refresh: () => fetchFromAPI({ silent: false }),
  };
};
