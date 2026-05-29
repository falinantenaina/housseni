/**
 * Template HTML pour l'e-mail de confirmation de commande.
 *
 * @param {object} params
 * @param {string} params.name          - Nom complet du client
 * @param {string} params.orderId       - Identifiant complet de la commande
 * @param {Array}  params.items         - Lignes de commande [{ title, quantity, price }]
 * @param {number} params.total_price   - Sous-total HT
 * @param {number} params.shipping_price - Frais de livraison
 * @param {string} params.delivery_zone  - Zone de livraison (null si non renseignée)
 * @param {object} params.shippingInfo   - Infos d'expédition { address, city, state, phone }
 */

const ZONE_LABELS = {
  ville: "Ville",
  sud: "Sud",
  nord: "Nord",
  petite_terre: "Petite Terre",
};

export const generateOrderConfirmationTemplate = ({
  name = "Client",
  orderId = "",
  items = [],
  total_price = 0,
  shipping_price = 0,
  delivery_zone = null,
  shippingInfo = {},
}) => {
  const shortId = (orderId || "").slice(-8).toUpperCase();
  const zoneLabel = delivery_zone
    ? ZONE_LABELS[delivery_zone] || delivery_zone
    : "Non renseignée";
  const totalTTC = Number(total_price) + Number(shipping_price);

  const itemsRows = items
    .map(
      (item) => `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #222;color:#ccc;font-size:14px;">
            ${item.title || item.name || "Produit"}
          </td>
          <td style="padding:10px 12px;border-bottom:1px solid #222;color:#ccc;font-size:14px;text-align:center;">
            ×${item.quantity ?? 1}
          </td>
          <td style="padding:10px 12px;border-bottom:1px solid #222;color:#fff;font-size:14px;text-align:right;">
            ${((item.price || 0) * (item.quantity ?? 1)).toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
          </td>
        </tr>`,
    )
    .join("");

  return `
<div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 24px;
            border: 1px solid #333; border-radius: 10px; background-color: #000; color: #fff;">

  <!-- En-tête -->
  <div style="text-align:center; margin-bottom:28px;">
    <h1 style="color:#fff; font-size:24px; margin:0 0 6px;">ETS HOUSSENI</h1>
    <p style="color:#888; font-size:13px; margin:0;">Quincaillerie Générale — Mayotte</p>
  </div>

  <!-- Titre -->
  <h2 style="color:#fff; font-size:20px; margin:0 0 8px;">
    ✅ Commande confirmée
  </h2>
  <p style="color:#ccc; font-size:15px; margin:0 0 24px;">
    Bonjour <strong style="color:#fff">${name}</strong>, votre commande a bien été reçue.
    Nous vous contacterons pour confirmer la livraison.
  </p>

  <!-- Référence commande -->
  <div style="background:#111; border:1px solid #333; border-radius:6px; padding:14px 18px; margin-bottom:24px;">
    <p style="margin:0; font-size:13px; color:#888;">Numéro de commande</p>
    <p style="margin:4px 0 0; font-size:18px; font-weight:bold; color:#fff; letter-spacing:1px;">
      #${shortId}
    </p>
  </div>

  <!-- Articles commandés -->
  <h3 style="color:#fff; font-size:15px; margin:0 0 10px;">Détail de la commande</h3>
  <table style="width:100%; border-collapse:collapse; margin-bottom:20px;">
    <thead>
      <tr style="background:#111;">
        <th style="padding:10px 12px; text-align:left; color:#888; font-size:12px; text-transform:uppercase; letter-spacing:.5px; border-bottom:1px solid #333;">Article</th>
        <th style="padding:10px 12px; text-align:center; color:#888; font-size:12px; text-transform:uppercase; letter-spacing:.5px; border-bottom:1px solid #333;">Qté</th>
        <th style="padding:10px 12px; text-align:right; color:#888; font-size:12px; text-transform:uppercase; letter-spacing:.5px; border-bottom:1px solid #333;">Montant</th>
      </tr>
    </thead>
    <tbody>
      ${itemsRows || `<tr><td colspan="3" style="padding:12px;color:#666;text-align:center;">Aucun article</td></tr>`}
    </tbody>
  </table>

  <!-- Totaux -->
  <div style="background:#111; border:1px solid #333; border-radius:6px; padding:14px 18px; margin-bottom:24px;">
    <div style="display:flex; justify-content:space-between; padding:4px 0; color:#ccc; font-size:14px;">
      <span>Sous-total</span>
      <span>${Number(total_price).toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €</span>
    </div>
    <div style="display:flex; justify-content:space-between; padding:4px 0; color:#ccc; font-size:14px;">
      <span>Livraison (${zoneLabel})</span>
      <span>${Number(shipping_price).toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €</span>
    </div>
    <div style="display:flex; justify-content:space-between; padding:10px 0 4px; color:#fff; font-size:16px; font-weight:bold; border-top:1px solid #333; margin-top:8px;">
      <span>Total TTC</span>
      <span>${totalTTC.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €</span>
    </div>
  </div>

  <!-- Adresse de livraison -->
  ${
    shippingInfo.address || shippingInfo.city
      ? `
  <h3 style="color:#fff; font-size:15px; margin:0 0 10px;">Adresse de livraison</h3>
  <div style="background:#111; border:1px solid #333; border-radius:6px; padding:14px 18px; margin-bottom:24px; color:#ccc; font-size:14px; line-height:1.7;">
    <p style="margin:0;"><strong style="color:#fff">${shippingInfo.full_name || name}</strong></p>
    ${shippingInfo.address ? `<p style="margin:0;">${shippingInfo.address}</p>` : ""}
    ${shippingInfo.city || shippingInfo.state ? `<p style="margin:0;">${[shippingInfo.city, shippingInfo.state].filter(Boolean).join(" ")}</p>` : ""}
    ${shippingInfo.phone ? `<p style="margin:0;">📞 ${shippingInfo.phone}</p>` : ""}
    <p style="margin:4px 0 0; color:#888; font-size:13px;">Zone : ${zoneLabel}</p>
  </div>`
      : ""
  }

  <!-- Note paiement -->
  <div style="background:#0d1b0d; border:1px solid #1a3a1a; border-radius:6px; padding:14px 18px; margin-bottom:24px; color:#7fc97f; font-size:14px;">
    💳 Paiement à la livraison — notre équipe vous contactera pour planifier la remise.
  </div>

  <!-- Contact -->
  <p style="color:#888; font-size:13px; margin:0 0 4px;">Une question ?</p>
  <p style="color:#ccc; font-size:13px; margin:0;">
    📞 +262 639 28 37 68 &nbsp;|&nbsp; admin@ets-housseni.com
  </p>

  <footer style="margin-top:28px; padding-top:16px; border-top:1px solid #222; text-align:center; font-size:12px; color:#555;">
    ETS HOUSSENI — Route Nationale Kaweni BP674, 97600 Mayotte<br/>
    Ceci est un message automatique. Merci de ne pas y répondre.
  </footer>
</div>
  `;
};
