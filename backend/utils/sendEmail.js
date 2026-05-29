import nodeMailer from "nodemailer";

/**
 * Envoie un e-mail HTML.
 *
 * @param {object} params
 * @param {string}          params.email   - Destinataire principal
 * @param {string|string[]} [params.cc]    - Copie conforme (optionnel)
 * @param {string}          params.subject - Objet du message
 * @param {string}          params.message - Corps HTML du message
 */
export const sendEmail = async ({ email, cc, subject, message }) => {
  const transporter = nodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    service: process.env.SMTP_SERVICE,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject,
    html: message,
    ...(cc ? { cc } : {}),
  };

  await transporter.sendMail(mailOptions);
};
