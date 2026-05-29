/**
 * Template HTML pour l'email de vérification d'adresse e-mail.
 * @param {string} verifyUrl - Lien complet de confirmation
 * @param {string} name      - Prénom / nom du destinataire
 */
export const generateEmailVerificationTemplate = (
  verifyUrl,
  name = "Client",
) => {
  return `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;
            border: 1px solid #ddd; border-radius: 8px; background-color: #000; color: #fff;">
  <h2 style="color: #fff; text-align: center;">Vérifiez votre adresse e-mail</h2>

  <p style="font-size: 16px; color: #ccc;">Bonjour ${name},</p>

  <p style="font-size: 16px; color: #ccc;">
    Merci de vous être inscrit(e) sur <strong style="color:#fff">ETS HOUSSENI</strong>.
    Veuillez cliquer sur le bouton ci-dessous pour confirmer votre adresse e-mail.
    Ce lien est valable pendant <strong style="color:#fff">24 heures</strong>.
  </p>

  <div style="text-align: center; margin: 28px 0;">
    <a href="${verifyUrl}"
       style="display: inline-block; font-size: 16px; font-weight: bold; color: #000;
              text-decoration: none; padding: 14px 28px; border: 1px solid #fff;
              border-radius: 5px; background-color: #fff;">
      Confirmer mon adresse e-mail
    </a>
  </div>

  <p style="font-size: 14px; color: #ccc;">
    Si vous n'avez pas créé de compte, ignorez simplement cet e-mail.
  </p>

  <p style="font-size: 14px; color: #ccc;">
    Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur&nbsp;:
  </p>
  <p style="font-size: 14px; color: #fff; word-wrap: break-word;">${verifyUrl}</p>

  <footer style="margin-top: 24px; text-align: center; font-size: 13px; color: #666;">
    <p>L'équipe ETS HOUSSENI</p>
    <p style="font-size: 11px; color: #444;">
      Ceci est un message automatique. Merci de ne pas y répondre.
    </p>
  </footer>
</div>
  `;
};
