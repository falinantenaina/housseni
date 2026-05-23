import cloudinary, { uploadToCloudinary } from "../config/cloudinary.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { PromotionalBanner, PromotionalBannerItem } from "../models/index.js";

const VALID_LAYOUTS = [
  "promo_items",
  "full_image",
  "text_image",
  "image_text",
  "centered_text",
  "image_overlay",
];

// Include standard pour récupérer bannière + items
const BANNER_INCLUDE = [
  { model: PromotionalBannerItem, as: "items", order: [["sort_order", "ASC"]] },
];

export const getActiveBanners = catchAsyncErrors(async (req, res) => {
  const banners = await PromotionalBanner.findAll({
    where: { is_active: true },
    include: BANNER_INCLUDE,
    order: [["created_at", "DESC"]],
  });
  res.status(200).json({ success: true, banners });
});

export const getAllBanners = catchAsyncErrors(async (req, res) => {
  const banners = await PromotionalBanner.findAll({
    include: BANNER_INCLUDE,
    order: [["created_at", "DESC"]],
  });
  res.status(200).json({ success: true, banners });
});

export const createBanner = catchAsyncErrors(async (req, res, next) => {
  const {
    title,
    subtitle,
    badge_text,
    date_range,
    cta_text,
    cta_url,
    items,
    layout,
    bg_color,
  } = req.body;

  if (!title) return next(new ErrorHandler("Titre requis", 400));

  const resolvedLayout = VALID_LAYOUTS.includes(layout)
    ? layout
    : "promo_items";

  let bg_image_url = null;
  let bg_image_public_id = null;

  if (req.files?.bg_image) {
    const result = await uploadToCloudinary(req.files.bg_image.data, {
      folder: "Ecommerce_Banner_BG",
    });
    bg_image_url = result.secure_url;
    bg_image_public_id = result.public_id;
  }

  const parsedItems =
    typeof items === "string" ? JSON.parse(items) : items || [];

  // Créer la bannière
  const banner = await PromotionalBanner.create({
    layout: resolvedLayout,
    title,
    subtitle: subtitle || null,
    badge_text: badge_text || null,
    date_range: date_range || null,
    cta_text: cta_text || "J'en profite",
    cta_url: cta_url || "/products",
    bg_image_url,
    bg_image_public_id,
    bg_color: bg_color || null,
  });

  // Créer les items de la bannière
  for (let i = 0; i < parsedItems.length; i++) {
    const item = parsedItems[i];
    let imageUrl = item.image_url || null;
    let imagePublicId = item.image_public_id || null;

    const fileKey = `item_image_${i}`;
    if (req.files?.[fileKey]) {
      const result = await uploadToCloudinary(req.files[fileKey].data, {
        folder: "Ecommerce_Banner_Items",
      });
      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
    }

    await PromotionalBannerItem.create({
      banner_id: banner.id,
      product_id: item.product_id || null,
      label: item.label,
      sublabel: item.sublabel || null,
      image_url: imageUrl,
      image_public_id: imagePublicId,
      original_price: item.original_price || null,
      promo_price: item.promo_price || null,
      sort_order: i,
    });
  }

  const fullBanner = await PromotionalBanner.findByPk(banner.id, {
    include: BANNER_INCLUDE,
  });

  res.status(201).json({ success: true, banner: fullBanner });
});

export const toggleBannerActive = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const banner = await PromotionalBanner.findByPk(id);
  if (!banner) return next(new ErrorHandler("Bannière introuvable", 404));

  await banner.update({ is_active: !banner.is_active });

  res.status(200).json({
    success: true,
    message: banner.is_active ? "Bannière activée" : "Bannière désactivée",
  });
});

export const deleteBanner = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const banner = await PromotionalBanner.findByPk(id, {
    include: BANNER_INCLUDE,
  });
  if (!banner) return next(new ErrorHandler("Bannière introuvable", 404));

  // Supprimer l'image de fond
  if (banner.bg_image_public_id) {
    await cloudinary.uploader.destroy(banner.bg_image_public_id);
  }

  // Supprimer les images des items
  for (const item of banner.items || []) {
    if (item.image_public_id) {
      await cloudinary.uploader.destroy(item.image_public_id);
    }
  }

  await banner.destroy(); 

  res.status(200).json({ success: true, message: "Bannière supprimée" });
});
