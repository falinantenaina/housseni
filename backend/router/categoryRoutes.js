import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
} from "../controllers/categoryController.js";
import {
  authorizedRoles,
  isAuthenticated,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getAllCategories);
router.get("/:id", getSingleCategory);

// Admin
router.post(
  "/admin/create",
  isAuthenticated,
  authorizedRoles("Admin"),
  createCategory,
);

router.put(
  "/admin/update/:id",
  isAuthenticated,
  authorizedRoles("Admin"),
  updateCategory,
);

router.delete(
  "/admin/delete/:id",
  isAuthenticated,
  authorizedRoles("Admin"),
  deleteCategory,
);

export default router;
