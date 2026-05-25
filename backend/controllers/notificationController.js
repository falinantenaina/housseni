import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { Notification } from "../models/index.js";

/**
 * GET /api/v1/notifications
 * Récupère les 50 dernières notifications pour les admins.
 * Les notifications non lues sont retournées en priorité.
 */
export const getNotifications = catchAsyncErrors(async (req, res) => {
  const notifications = await Notification.findAll({
    order: [
      ["read", "ASC"], // non lues en premier
      ["created_at", "DESC"],
    ],
    limit: 50,
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  res.status(200).json({
    success: true,
    notifications,
    unreadCount,
  });
});

/**
 * PATCH /api/v1/notifications/read-all
 * Marque toutes les notifications comme lues.
 */
export const markAllRead = catchAsyncErrors(async (req, res) => {
  await Notification.update({ read: true }, { where: { read: false } });

  res.status(200).json({
    success: true,
    message: "Toutes les notifications marquées comme lues.",
  });
});

/**
 * PATCH /api/v1/notifications/:id/read
 * Marque une notification spécifique comme lue.
 */
export const markOneRead = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;

  await Notification.update({ read: true }, { where: { id } });

  res.status(200).json({ success: true });
});

/**
 * DELETE /api/v1/notifications
 * Supprime toutes les notifications (déjà lues uniquement par sécurité).
 */
export const clearNotifications = catchAsyncErrors(async (req, res) => {
  await Notification.destroy({ where: { read: true } });

  res.status(200).json({
    success: true,
    message: "Notifications lues supprimées.",
  });
});

/**
 * DELETE /api/v1/notifications/all
 * Supprime TOUTES les notifications (admin seulement).
 */
export const clearAllNotifications = catchAsyncErrors(async (req, res) => {
  await Notification.destroy({ where: {} });

  res.status(200).json({
    success: true,
    message: "Toutes les notifications supprimées.",
  });
});
