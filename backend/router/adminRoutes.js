import express from "express";
import {
  dashboardStats,
  deleteUser,
  getAllUsers,
  getShippingRates,
  updateOrderDeliveryZone,
  updateOrderShippingPrice,
  updateRole,
  updateShippingRates,
} from "../controllers/adminController.js";
import {
  authorizedRoles,
  isAuthenticated,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

//  Utilisateurs
router.get(
  "/getallusers",
  isAuthenticated,
  authorizedRoles("Admin"),
  getAllUsers,
);

router.delete(
  "/delete/:id",
  isAuthenticated,
  authorizedRoles("Admin"),
  deleteUser,
);

router.put(
  "/update-role/:id",
  isAuthenticated,
  authorizedRoles("Admin"),
  updateRole,
);

//  Dashboard
router.get(
  "/fetch/dashboard-stats",
  isAuthenticated,
  authorizedRoles("Admin"),
  dashboardStats,
);

//  Tarifs de livraison globaux
router.get(
  "/shipping-rates",
  isAuthenticated,
  authorizedRoles("Admin"),
  getShippingRates,
);

router.put(
  "/shipping-rates",
  isAuthenticated,
  authorizedRoles("Admin"),
  updateShippingRates,
);

//  Livraison par commande
router.patch(
  "/orders/:orderId/delivery-zone",
  isAuthenticated,
  authorizedRoles("Admin"),
  updateOrderDeliveryZone,
);

router.patch(
  "/orders/:orderId/shipping-price",
  isAuthenticated,
  authorizedRoles("Admin"),
  updateOrderShippingPrice,
);

export default router;
