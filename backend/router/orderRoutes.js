import express from "express";
import {
  deleteOrder,
  fetchAllOrders,
  fetchMyOrders,
  fetchSingleOrder,
  markOrderAsPaid,
  placeNewOrder,
  updateOrderStatus,
} from "../controllers/orderController.js";
import {
  authorizedRoles,
  isAuthenticated,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/new", isAuthenticated, placeNewOrder);

router.get("/:orderId", isAuthenticated, fetchSingleOrder);

router.get("/orders/me", isAuthenticated, fetchMyOrders);

router.get(
  "/admin/getall",
  isAuthenticated,
  authorizedRoles("Admin"),
  fetchAllOrders,
);

router.put(
  "/admin/update/:orderId",
  isAuthenticated,
  authorizedRoles("Admin"),
  updateOrderStatus,
);

router.delete(
  "/admin/delete/:orderId",
  isAuthenticated,
  authorizedRoles("Admin"),
  deleteOrder,
);

router.patch(
  "/admin/mark-paid/:orderId",
  isAuthenticated,
  authorizedRoles("Admin"),
  markOrderAsPaid,
);

export default router;
