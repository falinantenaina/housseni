import crypto from "crypto";

/**
 * Génère un token de vérification d'e-mail sécurisé.
 * @returns {{ verifyToken: string, hashedToken: string, verifyExpireTime: number }}
 *   - verifyToken     : token brut à envoyer dans l'URL
 *   - hashedToken     : version hashée à stocker en base
 *   - verifyExpireTime: timestamp d'expiration (24 h)
 */
export const generateVerifyEmailToken = () => {
  const verifyToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(verifyToken)
    .digest("hex");

  const verifyExpireTime = Date.now() + 24 * 60 * 60 * 1000;

  return { verifyToken, hashedToken, verifyExpireTime };
};
