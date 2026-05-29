import express from "express";
import {
  forgotPassword,
  getUser,
  login,
  logout,
  register,
  resendVerificationEmail,
  resetPassword,
  saveShippingInfo,
  updatePassword,
  updateProfile,
  verifyEmail,
} from "../controllers/authController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

//  Auth
router.post("/register", register);
router.post("/login", login);
router.get("/me", isAuthenticated, getUser);
router.get("/logout", isAuthenticated, logout);

//  Vérification e-mail
// Route publique : le token est dans l'URL (lien reçu par e-mail)
router.get("/email/verify/:token", verifyEmail);

// Route authentifiée : renvoyer un nouveau lien de vérification
router.post(
  "/email/resend-verification",
  isAuthenticated,
  resendVerificationEmail,
);

//  Mot de passe
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);
router.put("/password/update", isAuthenticated, updatePassword);

//  Profil & livraison
router.put("/profile/update", isAuthenticated, updateProfile);
router.put("/shipping-info", isAuthenticated, saveShippingInfo);

export default router;
