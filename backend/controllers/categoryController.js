import { Op } from "sequelize";
import cloudinary, { uploadToCloudinary } from "../config/cloudinary.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Category, Product } from "../models/index.js";

export const getAllCategories = catchAsyncErrors(async (req, res, next) => {
  const categories = await Category.findAll({ order: [["name", "ASC"]] });
  res.status(200).json({ success: true, categories });
});

export const getSingleCategory = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findByPk(id);

  if (!category) {
    return next(new ErrorHandler("Catégorie introuvable.", 404));
  }

  res.status(200).json({ success: true, category });
});

export const createCategory = catchAsyncErrors(async (req, res, next) => {
  const { name, description } = req.body;

  if (!name || name.trim().length === 0) {
    return next(
      new ErrorHandler("Le nom de la catégorie est obligatoire.", 400),
    );
  }

  const existing = await Category.findOne({
    where: { name: { [Op.iLike]: name.trim() } },
  });
  if (existing) {
    return next(
      new ErrorHandler("Une catégorie avec ce nom existe déjà.", 400),
    );
  }

  let imageData = null;
  if (req.files && req.files.image) {
    const result = await uploadToCloudinary(req.files.image.data, {
      folder: "Ecommerce_Category_Images",
      width: 800,
      crop: "scale",
    });
    imageData = { url: result.secure_url, public_id: result.public_id };
  }

  const category = await Category.create({
    name: name.trim(),
    description: description || null,
    image: imageData,
  });

  res.status(201).json({
    success: true,
    message: "Catégorie créée avec succès.",
    category,
  });
});

export const updateCategory = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const category = await Category.findByPk(id);
  if (!category) {
    return next(new ErrorHandler("Catégorie introuvable.", 404));
  }

  if (req.files && req.files.image) {
    if (category.image?.public_id) {
      await cloudinary.uploader.destroy(category.image.public_id);
    }
    const result = await uploadToCloudinary(req.files.image.data, {
      folder: "Ecommerce_Category_Images",
      width: 800,
      crop: "scale",
    });
    category.image = { url: result.secure_url, public_id: result.public_id };
  }

  if (name?.trim()) category.name = name.trim();
  if (description !== undefined) category.description = description;

  await category.save();

  res.status(200).json({
    success: true,
    message: "Catégorie mise à jour avec succès.",
    category,
  });
});

export const deleteCategory = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findByPk(id);
  if (!category) {
    return next(new ErrorHandler("Catégorie introuvable.", 404));
  }

  // Dissocier les produits de cette catégorie avant suppression
  await Product.update({ category_id: null }, { where: { category_id: id } });

  if (category.image?.public_id) {
    await cloudinary.uploader.destroy(category.image.public_id);
  }

  await category.destroy();

  res.status(200).json({
    success: true,
    message:
      "Catégorie supprimée avec succès. Les produits associés ont été dissociés.",
  });
});
