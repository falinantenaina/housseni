import express from "express";
import {
  createBanner,
  deleteBanner,
  getActiveBanners,
  getAllBanners,
  toggleBannerActive,
} from "../controllers/bannerController.js";
import {
  authorizedRoles,
  isAuthenticated,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/active", getActiveBanners);

router.get(
  "/admin/all",
  isAuthenticated,
  authorizedRoles("Admin"),
  getAllBanners,
);

router.post(
  "/admin/create",
  isAuthenticated,
  authorizedRoles("Admin"),
  createBanner,
);

router.patch(
  "/admin/toggle/:id",
  isAuthenticated,
  authorizedRoles("Admin"),
  toggleBannerActive,
);

router.delete(
  "/admin/delete/:id",
  isAuthenticated,
  authorizedRoles("Admin"),
  deleteBanner,
);

export default router;
