import express from "express";
import {
  createProduct,
  deleteProduct,
  deleteReview,
  fetchAIFilteredProducts,
  fetchAllProducts,
  fetchSingleProduct,
  postProductReview,
  toggleFeatured,
  toggleSale,
  updateProduct,
} from "../controllers/productController.js";
import {
  authorizedRoles,
  isAuthenticated,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", fetchAllProducts);
router.get("/:productId", fetchSingleProduct);

// Recherche IA (authentifié)
router.post("/ai/filter", isAuthenticated, fetchAIFilteredProducts);

// Avis
router.put("/post-new/review/:productId", isAuthenticated, postProductReview);
router.delete("/delete/review/:productId", isAuthenticated, deleteReview);

// Admin — création / modification / suppression
router.post(
  "/admin/create",
  isAuthenticated,
  authorizedRoles("Admin"),
  createProduct,
);

router.put(
  "/admin/update/:productId",
  isAuthenticated,
  authorizedRoles("Admin"),
  updateProduct,
);

router.put(
  "/admin/featured/:productId",
  isAuthenticated,
  authorizedRoles("Admin"),
  toggleFeatured,
);

router.patch(
  "/admin/sale/:productId",
  isAuthenticated,
  authorizedRoles("Admin"),
  toggleSale,
);

router.delete(
  "/admin/delete/:productId",
  isAuthenticated,
  authorizedRoles("Admin"),
  deleteProduct,
);

export default router;
