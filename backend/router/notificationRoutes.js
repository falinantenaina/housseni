import express from "express";
import {
  clearAllNotifications,
  clearNotifications,
  getNotifications,
  markAllRead,
  markOneRead,
} from "../controllers/notificationController.js";
import {
  authorizedRoles,
  isAuthenticated,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// Toutes les routes nécessitent d'être Admin
router.use(isAuthenticated, authorizedRoles("Admin"));

router.get("/", getNotifications);
router.patch("/read-all", markAllRead);
router.patch("/:id/read", markOneRead);
router.delete("/", clearNotifications); // supprime les lues
router.delete("/all", clearAllNotifications); // supprime tout

export default router;
