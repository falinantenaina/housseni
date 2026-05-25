import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  LoaderCircle,
  MapPin,
  Printer,
  Search,
  Trash2,
  Truck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteAdminOrder,
  fetchAdminOrders,
  fetchShippingRates,
  markOrderAsPaid,
  updateOrderDeliveryZone,
  updateOrderShippingPrice,
  updateOrderStatus,
  updateShippingRates,
} from "../../store/slices/adminSlice";
import AdminHeader from "../components/AdminHeader";
import AdminLayout from "../components/AdminLayout";

const STATUS_OPTIONS = ["En cours", "Confirmé", "Livré", "Annulé"];
const STATUS_STYLES = {
  "En cours": "bg-blue-500/10 text-blue-500",
  Confirmé: "bg-yellow-500/10 text-yellow-500",
  Livré: "bg-emerald-500/10 text-emerald-500",
  Annulé: "bg-destructive/10 text-destructive",
};

const ZONE_LABELS = {
  ville: "Ville",
  sud: "Sud",
  nord: "Nord",
  petite_terre: "Petite Terre",
};

const printProforma = (order, orderItems = []) => {
  const shippingInfo = order.shipping_info || {};
  const items =
    orderItems.length > 0
      ? orderItems
      : order.order_items || order.items || order.orderItems || [];
  const orderId = order.id || "";
  const shortId = orderId.slice(-8).toUpperCase();
  const orderDate = order.created_at
    ? new Date(order.created_at).toLocaleDateString("fr-FR")
    : "—";

  const totalHT = order.total_price || 0;
  const taxPrice = order.tax_price || 0;
  const shippingPrice = order.shipping_price || 0;
  const totalTTC = totalHT;
  const zoneLabel = order.delivery_zone
    ? ZONE_LABELS[order.delivery_zone] || order.delivery_zone
    : "—";

  const itemsRows = items
    .map(
      (item, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${item.title || item.name || item.product_name || "Produit"}</td>
        <td class="center">${item.quantity ?? 1}</td>
        <td class="right">${(item.price || 0).toLocaleString("fr-FR", { minimumFractionDigits: 2 })}</td>
        <td class="right">${((item.price || 0) * (item.quantity ?? 1)).toLocaleString("fr-FR", { minimumFractionDigits: 2 })}</td>
        <td class="center">${item.tva_rate ?? "—"}</td>
      </tr>`,
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>Proforma #${shortId}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, Helvetica, sans-serif; font-size: 11px; color: #111; padding: 24px 28px; max-width: 800px; margin: 0 auto; }
    .header-grid { display: grid; grid-template-columns: 1fr auto; align-items: start; margin-bottom: 14px; }
    .company-name { font-size: 17px; font-weight: 900; letter-spacing: 0.5px; text-transform: uppercase; }
    .doc-title { font-size: 22px; font-weight: 900; text-transform: uppercase; text-align: right; letter-spacing: 1px; border-bottom: 3px solid #111; padding-bottom: 4px; }
    .company-info { font-size: 10px; color: #444; margin-top: 4px; line-height: 1.5; }
    hr.separator { border: none; border-top: 1px solid #aaa; margin: 10px 0; }
    .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 10px; }
    .meta-table th { background: #111; color: #fff; padding: 4px 8px; text-align: center; font-weight: 700; letter-spacing: 0.5px; }
    .meta-table td { padding: 4px 8px; text-align: center; border: 1px solid #ccc; }
    .address-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px; }
    .address-box { border: 1px solid #ccc; padding: 8px 10px; font-size: 10px; }
    .address-box .label { font-size: 9px; font-weight: 700; text-transform: uppercase; color: #666; margin-bottom: 4px; letter-spacing: 0.5px; }
    .address-box .name { font-weight: 700; font-size: 11px; }
    .items-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
    .items-table th { background: #111; color: #fff; padding: 5px 8px; font-weight: 700; font-size: 10px; letter-spacing: 0.4px; }
    .items-table td { padding: 5px 8px; border-bottom: 1px solid #e5e5e5; font-size: 10px; }
    .items-table tr:nth-child(even) td { background: #f9f9f9; }
    .items-table .total-row td { background: #f0f0f0; font-weight: 700; font-size: 11px; border-top: 2px solid #111; }
    .center { text-align: center; } .right { text-align: right; }
    .totals-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 10px; }
    .tva-table { width: 100%; border-collapse: collapse; font-size: 10px; }
    .tva-table th { background: #555; color: #fff; padding: 3px 6px; font-size: 9.5px; font-weight: 700; }
    .tva-table td { padding: 3px 6px; border-bottom: 1px solid #ddd; }
    .summary-box { border: 1px solid #ccc; padding: 10px; font-size: 11px; }
    .summary-row { display: flex; justify-content: space-between; padding: 3px 0; border-bottom: 1px solid #eee; }
    .summary-row:last-child { border-bottom: none; }
    .summary-row.total { font-weight: 900; font-size: 13px; padding-top: 6px; border-top: 2px solid #111; margin-top: 4px; }
    .footer { margin-top: 16px; font-size: 9px; color: #777; text-align: center; border-top: 1px solid #ccc; padding-top: 8px; }
    @media print { body { padding: 10px 14px; } @page { margin: 10mm; size: A4; } }
  </style>
</head>
<body>
  <div class="header-grid">
    <div>
      <div class="company-name">ETS HOUSSENI</div>
      <div class="company-info">Route Nationale Kaweni BP674, 97600 MAYOTTE<br/>Tél : +262 639 28 37 68</div>
    </div>
    <div class="doc-title">${order.paid_at ? "FACTURE" : "PROFORMA"}</div>
  </div>
  <hr class="separator"/>
  <table class="meta-table">
    <thead><tr><th>Numéro</th><th>Date</th><th>Client</th><th>Zone livraison</th><th>Feuillet</th></tr></thead>
    <tbody>
      <tr>
        <td><strong>${shortId}</strong></td>
        <td>${orderDate}</td>
        <td>${shippingInfo.full_name || "—"}</td>
        <td>${zoneLabel}</td>
        <td>1 / 1</td>
      </tr>
    </tbody>
  </table>
  <div class="address-grid">
    <div class="address-box">
      <div class="label">ADRESSE DE LIVRAISON</div>
      <div class="name">${shippingInfo.full_name || "—"}</div>
      <div>${shippingInfo.address || ""}</div>
      <div>${[shippingInfo.city, shippingInfo.state].filter(Boolean).join(" ")}</div>
      <div>${shippingInfo.phone || ""}</div>
    </div>
  </div>
  <table class="items-table">
    <thead>
      <tr><th>N°</th><th>Désignation</th><th class="center">Quantité</th><th class="right">P.U. net H.T</th><th class="right">Montant H.T</th><th class="center">TVA</th></tr>
    </thead>
    <tbody>
      ${items.length > 0 ? itemsRows : `<tr><td colspan="6" style="text-align:center;color:#999;padding:12px;">Aucun article</td></tr>`}
      <tr class="total-row">
        <td colspan="4" class="right">Total H.T.</td>
        <td class="right">${totalHT.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €</td>
        <td></td>
      </tr>
    </tbody>
  </table>
  <div class="totals-grid">
    <div>
      <table class="tva-table">
        <thead><tr><th>Réf.</th><th>Base</th><th>Taux TVA</th><th>Montant TVA</th></tr></thead>
        <tbody>
          <tr><td>1</td><td>—</td><td>20,00 %</td><td>0,00 €</td></tr>
          <tr><td>4</td><td class="right">${totalHT.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €</td><td>0,00 %</td><td class="right">0,00 €</td></tr>
        </tbody>
      </table>
      <div style="margin-top:8px; font-size:9px; color:#777;">
        N° commande : ${orderId}<br/>Date : ${orderDate}<br/>
        Mode de règlement : ${order.paid_at ? "Payé" : "En attente"}<br/>
        Zone de livraison : ${zoneLabel}
      </div>
    </div>
    <div class="summary-box">
      <div class="summary-row"><span>Total H.T.</span><span>${totalHT.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €</span></div>
      <div class="summary-row"><span>T.V.A.</span><span>${taxPrice.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €</span></div>
      <div class="summary-row"><span>Livraison (${zoneLabel})</span><span>${shippingPrice.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €</span></div>
      <div class="summary-row total"><span>Total T.T.C.</span><span>${(totalHT + shippingPrice + taxPrice).toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €</span></div>
    </div>
  </div>
  <div class="footer">Proforma n° ${shortId} du ${orderDate} — Document non contractuel, valable 30 jours.</div>
  <script>window.onload = () => { window.print(); };</script>
</body>
</html>`;

  const win = window.open("", "_blank", "width=900,height=700");
  if (win) {
    win.document.write(html);
    win.document.close();
  }
};

//  Panneau livraison dans le détail d'une commande
const ShippingPanel = ({ order }) => {
  const dispatch = useDispatch();
  const { shippingRates } = useSelector((s) => s.admin);

  const [zone, setZone] = useState(order.delivery_zone || "");
  const [customPrice, setCustomPrice] = useState(order.shipping_price ?? 0);
  const [updatingZone, setUpdatingZone] = useState(false);
  const [updatingPrice, setUpdatingPrice] = useState(false);

  // Synchronise si la commande est mise à jour dans le store
  useEffect(() => {
    setZone(order.delivery_zone || "");
    setCustomPrice(order.shipping_price ?? 0);
  }, [order.delivery_zone, order.shipping_price]);

  const handleZoneChange = async (newZone) => {
    setZone(newZone);
    setUpdatingZone(true);
    const result = await dispatch(
      updateOrderDeliveryZone({
        id: order.id,
        delivery_zone: newZone || null,
      }),
    );
    // Met à jour le prix affiché selon ce que retourne le backend
    if (result.payload?.shipping_price !== undefined) {
      setCustomPrice(result.payload.shipping_price);
    }
    setUpdatingZone(false);
  };

  const handlePriceUpdate = async () => {
    setUpdatingPrice(true);
    await dispatch(
      updateOrderShippingPrice({
        id: order.id,
        shipping_price: Number(customPrice),
      }),
    );
    setUpdatingPrice(false);
  };

  return (
    <div className="border border-border rounded-lg p-4 bg-secondary/20">
      <p className="font-ui text-xs text-muted-foreground tracking-widest uppercase mb-3 flex items-center gap-1.5">
        <Truck className="w-3.5 h-3.5" /> Zone & frais de livraison
      </p>

      {/* Sélection de zone */}
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <label className="font-ui text-xs text-muted-foreground">Zone :</label>
        <div className="flex items-center gap-2">
          <select
            value={zone}
            onChange={(e) => handleZoneChange(e.target.value)}
            disabled={updatingZone}
            className="input-base text-sm py-1.5"
          >
            <option value="">— Non renseignée —</option>
            <option value="ville">Ville — {shippingRates.ville} €</option>
            <option value="sud">Sud — {shippingRates.sud} €</option>
            <option value="nord">Nord — {shippingRates.nord} €</option>
            <option value="petite_terre">
              Petite Terre — {shippingRates.petite_terre} €
            </option>
          </select>
          {updatingZone && (
            <LoaderCircle className="w-4 h-4 animate-spin text-primary" />
          )}
        </div>

        {zone && (
          <span className="flex items-center gap-1 text-xs font-ui font-semibold text-primary bg-primary/10 px-2 py-1 rounded-md">
            <MapPin className="w-3 h-3" />
            {ZONE_LABELS[zone]} · {shippingRates[zone]} €
          </span>
        )}
      </div>

      {/* Prix manuel */}
      <div className="flex flex-wrap items-center gap-3">
        <label className="font-ui text-xs text-muted-foreground">
          Prix livraison (€) :
        </label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={customPrice}
          onChange={(e) => setCustomPrice(e.target.value)}
          className="input-base text-sm py-1.5 w-28"
        />
        <button
          onClick={handlePriceUpdate}
          disabled={updatingPrice}
          className="flex items-center gap-1.5 font-ui font-semibold text-xs tracking-widest uppercase px-3 py-2 rounded-md border border-primary/40 text-primary hover:bg-primary/10 transition-colors disabled:opacity-50"
        >
          {updatingPrice ? (
            <LoaderCircle className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <CheckCircle className="w-3.5 h-3.5" />
          )}
          Mettre à jour
        </button>
      </div>
    </div>
  );
};

//  Panneau tarifs globaux
const ShippingRatesPanel = () => {
  const dispatch = useDispatch();
  const { shippingRates } = useSelector((s) => s.admin);
  const [rates, setRates] = useState({ ...shippingRates });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setRates({ ...shippingRates });
  }, [shippingRates]);

  const handleSave = async () => {
    setSaving(true);
    await dispatch(updateShippingRates(rates));
    setSaving(false);
  };

  return (
    <div className="card-base p-5 mb-6">
      <h3 className="font-ui font-bold text-foreground tracking-widest uppercase text-sm mb-4 flex items-center gap-2">
        <Truck className="w-4 h-4 text-primary" />
        Tarifs de livraison globaux
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
        {[
          { key: "ville", label: "Ville" },
          { key: "sud", label: "Sud" },
          { key: "nord", label: "Nord" },
          { key: "petite_terre", label: "Petite Terre" },
        ].map(({ key, label }) => (
          <div key={key}>
            <label className="font-ui text-xs text-muted-foreground tracking-widest uppercase block mb-1.5">
              {label}
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                value={rates[key] ?? ""}
                onChange={(e) =>
                  setRates({ ...rates, [key]: Number(e.target.value) })
                }
                className="input-base w-full text-sm py-1.5 pr-8"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-ui">
                €
              </span>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 font-ui font-semibold text-xs tracking-widest uppercase px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        {saving ? (
          <LoaderCircle className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <CheckCircle className="w-3.5 h-3.5" />
        )}
        Enregistrer les tarifs
      </button>
    </div>
  );
};

//  Ligne commande
const OrderRow = ({ order, onDelete }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(order.order_status || "En cours");
  const [updating, setUpdating] = useState(false);
  const [markingPaid, setMarkingPaid] = useState(false);

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    setStatus(newStatus);
    await dispatch(updateOrderStatus({ id: order.id, status: newStatus }));
    setUpdating(false);
  };

  const handleMarkAsPaid = async () => {
    if (!window.confirm("Marquer cette commande comme payée ?")) return;
    setMarkingPaid(true);
    await dispatch(markOrderAsPaid(order.id));
    setMarkingPaid(false);
  };

  const shippingInfo = order.shipping_info || {};
  const orderItems = order.order_items || [];
  const orderId = order.id || "";
  const shortId = orderId.slice(-8).toUpperCase();
  const currentStatus = status || order.order_status || "En cours";
  const zoneLabel = order.delivery_zone
    ? ZONE_LABELS[order.delivery_zone]
    : null;

  return (
    <div className="card-base overflow-hidden mb-3">
      <div className="flex items-center justify-between gap-3 px-5 py-4 hover:bg-secondary/30 transition-colors">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-4 min-w-0 flex-1 text-left"
        >
          <div className="hidden sm:block min-w-0">
            <p className="font-ui font-bold text-foreground text-xs tracking-widest uppercase">
              #{shortId}
            </p>
            <p className="text-muted-foreground text-xs">
              {order.created_at
                ? new Date(order.created_at).toLocaleDateString("fr-FR")
                : "—"}
            </p>
          </div>
          <span
            className={`font-ui font-bold text-xs px-2.5 py-1 rounded-md tracking-wide shrink-0 ${STATUS_STYLES[currentStatus] || STATUS_STYLES["En cours"]}`}
          >
            {currentStatus}
          </span>
          <span className="font-ui font-bold text-primary text-sm hidden sm:block">
            {(order.total_price || 0).toLocaleString("fr-MG")} €
          </span>
          {/* Zone badge */}
          {zoneLabel && (
            <span className="hidden md:flex items-center gap-1 text-xs font-ui font-semibold text-muted-foreground bg-secondary px-2 py-0.5 rounded">
              <MapPin className="w-3 h-3" /> {zoneLabel}
            </span>
          )}
          {shippingInfo.full_name && (
            <span className="text-muted-foreground text-xs hidden md:block truncate max-w-[140px]">
              {shippingInfo.full_name}
            </span>
          )}
          {order.paid_at ? (
            <span className="text-emerald-500 text-xs font-ui font-semibold hidden lg:block">
              ✓ Payé
            </span>
          ) : (
            <span className="text-yellow-500 text-xs font-ui font-semibold hidden lg:block">
              En attente
            </span>
          )}
        </button>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => printProforma(order, orderItems)}
            className="p-1.5 rounded hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
            title="Imprimer proforma"
          >
            <Printer className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(order.id)}
            className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
            title="Supprimer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button onClick={() => setOpen(!open)} className="p-1">
            {open ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border p-5 animate-fade-up space-y-5">
          {/* Infos générales */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="font-ui text-xs text-muted-foreground tracking-widest uppercase mb-2">
                Commande
              </p>
              <p className="text-foreground text-xs font-ui break-all">
                #{orderId}
              </p>
              <p className="text-muted-foreground text-xs">
                {order.created_at
                  ? new Date(order.created_at).toLocaleString("fr-FR")
                  : "—"}
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                Taxe :{" "}
                {order.tax_price !== undefined ? `${order.tax_price} €` : "—"}
              </p>
            </div>
            {(shippingInfo.full_name || shippingInfo.address) && (
              <div>
                <p className="font-ui text-xs text-muted-foreground tracking-widest uppercase mb-2">
                  Livraison
                </p>
                <p className="text-foreground text-sm font-ui font-semibold">
                  {shippingInfo.full_name}
                </p>
                <p className="text-muted-foreground text-xs">
                  {shippingInfo.address}
                </p>
                <p className="text-muted-foreground text-xs">
                  {shippingInfo.city} {shippingInfo.state}
                </p>
                <p className="text-muted-foreground text-xs">
                  {shippingInfo.phone}
                </p>
              </div>
            )}
            <div>
              <p className="font-ui text-xs text-muted-foreground tracking-widest uppercase mb-2">
                Total
              </p>
              <p className="font-ui font-bold text-primary text-lg">
                {(order.total_price || 0).toLocaleString("fr-MG")} €
              </p>
              <p className="text-xs text-muted-foreground">
                Livraison :{" "}
                {(order.shipping_price || 0).toLocaleString("fr-MG")} €
                {zoneLabel && ` (${zoneLabel})`}
              </p>
              <p className="text-xs font-ui font-bold text-foreground mt-1">
                Total TTC :{" "}
                {(
                  Number(order.total_price || 0) +
                  Number(order.shipping_price || 0) +
                  Number(order.tax_price || 0)
                ).toLocaleString("fr-MG")}{" "}
                €
              </p>
            </div>
          </div>

          {/* Articles */}
          {orderItems.length > 0 && (
            <div>
              <p className="font-ui text-xs text-muted-foreground tracking-widest uppercase mb-2">
                Articles ({orderItems.length})
              </p>
              <div className="space-y-2">
                {orderItems.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0 text-sm"
                  >
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt=""
                          className="w-9 h-9 rounded border border-border object-cover bg-secondary"
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

          {/* Panneau livraison admin */}
          <ShippingPanel order={order} />

          {/* Actions statut et paiement */}
          <div className="flex items-center gap-3 flex-wrap">
            <label className="font-ui text-xs text-muted-foreground tracking-widest uppercase">
              Statut :
            </label>
            <select
              value={currentStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={updating}
              className="input-base text-sm py-1.5 pr-8"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {updating && (
              <LoaderCircle className="w-4 h-4 animate-spin text-primary" />
            )}

            {!order.paid_at && (
              <button
                onClick={handleMarkAsPaid}
                disabled={markingPaid}
                className="flex items-center gap-2 font-ui font-semibold text-xs tracking-widest uppercase px-3 py-2 rounded-md border border-emerald-500/40 text-emerald-600 hover:bg-emerald-500/10 transition-colors disabled:opacity-50"
              >
                {markingPaid ? (
                  <LoaderCircle className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <CheckCircle className="w-3.5 h-3.5" />
                )}
                Marquer comme payé
              </button>
            )}

            <button
              onClick={() => printProforma(order, orderItems)}
              className="ml-auto flex items-center gap-2 font-ui font-semibold text-xs tracking-widest uppercase px-3 py-2 rounded-md border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimer proforma
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

//  Page principale
const AdminOrders = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((s) => s.admin);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paidFilter, setPaidFilter] = useState("all");
  const [showRates, setShowRates] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminOrders());
    dispatch(fetchShippingRates());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Supprimer cette commande ?"))
      dispatch(deleteAdminOrder(id));
  };

  const filtered = orders.filter((o) => {
    const orderId = o.id || "";
    const fullName = o.shipping_info?.full_name || "";
    const matchSearch =
      !search ||
      orderId.toLowerCase().includes(search.toLowerCase()) ||
      fullName.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "all" || o.order_status === statusFilter;
    const matchPaid =
      paidFilter === "all" ||
      (paidFilter === "paid" ? !!o.paid_at : !o.paid_at);
    return matchSearch && matchStatus && matchPaid;
  });

  return (
    <AdminLayout>
      <AdminHeader title="Commandes" />
      <main className="flex-1 p-6">
        {/* Bouton toggle tarifs */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowRates((v) => !v)}
            className="flex items-center gap-2 font-ui font-semibold text-xs tracking-widest uppercase px-3 py-2 rounded-md border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
          >
            <Truck className="w-3.5 h-3.5" />
            {showRates ? "Masquer les tarifs" : "Gérer les tarifs de livraison"}
          </button>
        </div>

        {/* Panneau tarifs globaux (toggle) */}
        {showRates && <ShippingRatesPanel />}

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {STATUS_OPTIONS.map((s) => (
            <div
              key={s}
              onClick={() => setStatusFilter(statusFilter === s ? "all" : s)}
              className={`card-base p-4 text-center cursor-pointer transition-colors ${statusFilter === s ? "border-primary" : ""}`}
            >
              <div
                className={`font-display text-2xl ${STATUS_STYLES[s]?.split(" ")[1] || "text-foreground"}`}
              >
                {orders.filter((o) => o.order_status === s).length}
              </div>
              <div className="font-ui text-xs text-muted-foreground tracking-widest uppercase mt-0.5">
                {s}
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="ID commande, nom client..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-base w-full pl-9 text-sm py-2"
            />
          </div>
          <select
            value={paidFilter}
            onChange={(e) => setPaidFilter(e.target.value)}
            className="input-base text-sm py-2"
          >
            <option value="all">Tous paiements</option>
            <option value="paid">Payées</option>
            <option value="unpaid">Non payées</option>
          </select>
          <div className="flex gap-2 flex-wrap">
            {["all", ...STATUS_OPTIONS].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`font-ui font-semibold text-xs tracking-widest uppercase px-3 py-2 rounded-md border transition-colors ${
                  statusFilter === s
                    ? "bg-primary border-primary text-white"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                }`}
              >
                {s === "all" ? "Toutes" : s}
              </button>
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex items-center justify-between mb-4 text-sm">
          <span className="font-ui text-muted-foreground">
            {filtered.length} commande{filtered.length !== 1 ? "s" : ""}
          </span>
          <span className="font-ui text-muted-foreground">
            Payées :{" "}
            <span className="text-primary font-bold">
              {filtered
                .filter((o) => o.paid_at)
                .reduce((a, o) => a + (Number(o.total_price) || 0), 0)
                .toLocaleString("fr-MG")}{" "}
              €
            </span>
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <LoaderCircle className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground font-ui">
            Aucune commande trouvée
          </div>
        ) : (
          <div>
            {filtered.map((order) => (
              <OrderRow key={order.id} order={order} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>
    </AdminLayout>
  );
};

export default AdminOrders;
