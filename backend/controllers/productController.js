import { Op, col, fn } from "sequelize";
import cloudinary, { uploadToCloudinary } from "../config/cloudinary.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Category, Product, Review, User } from "../models/index.js";
import { getAIRecommendation } from "../utils/getAIRecommendation.js";

export const createProduct = catchAsyncErrors(async (req, res, next) => {
  const { name, description, price, category, stock, featured, on_sale } =
    req.body;

  if (!name || !price) {
    return next(
      new ErrorHandler(
        "Veuillez fournir les détails complets du produit.",
        400,
      ),
    );
  }

  if (category) {
    const cat = await Category.findByPk(category);
    if (!cat) {
      return next(new ErrorHandler("Catégorie introuvable.", 404));
    }
  }

  let uploadedImages = [];
  if (req.files && req.files.images) {
    const images = Array.isArray(req.files.images)
      ? req.files.images
      : [req.files.images];

    for (const image of images) {
      const result = await uploadToCloudinary(image.data, {
        folder: "Ecommerce_Product_Images",
        width: 1000,
        crop: "scale",
      });
      uploadedImages.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }
  }

  const product = await Product.create({
    name,
    description: description || null,
    price,
    category_id: category || null,
    stock: stock || null,
    images: uploadedImages,
    featured: featured === true || featured === "true",
    on_sale: on_sale === true || on_sale === "true",
    created_by: req.user.id,
  });

  res.status(201).json({
    success: true,
    message: "Produit créé avec succès.",
    product,
  });
});

export const fetchAllProducts = catchAsyncErrors(async (req, res, next) => {
  const {
    page = 1,
    limit = 20,
    category_id,
    search,
    minPrice,
    maxPrice,
    sort = "newest",
    featured,
  } = req.query;

  const skip = (page - 1) * limit;
  const filter = {};

  if (search) {
    filter[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } },
    ];
  }

  if (category_id) filter.category_id = category_id;

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price[Op.gte] = Number(minPrice);
    if (maxPrice) filter.price[Op.lte] = Number(maxPrice);
  }

  if (featured === "true") filter.featured = true;

  let order = [["created_at", "DESC"]];
  if (sort === "price-asc") order = [["price", "ASC"]];
  if (sort === "price-desc") order = [["price", "DESC"]];
  if (sort === "rating")
    order = [
      ["ratings", "DESC"],
      ["created_at", "DESC"],
    ];

  const { count: total, rows: products } = await Product.findAndCountAll({
    where: filter,
    include: [{ model: Category, as: "category", attributes: ["id", "name"] }],
    order,
    offset: skip,
    limit: parseInt(limit),
    distinct: true,
  });

  res.status(200).json({
    success: true,
    products,
    totalProducts: total,
    page: parseInt(page),
    pages: Math.ceil(total / limit),
  });
});

export const fetchSingleProduct = catchAsyncErrors(async (req, res, next) => {
  const { productId } = req.params;

  const product = await Product.findByPk(productId, {
    include: [
      { model: Category, as: "category", attributes: ["id", "name"] },
      {
        model: Review,
        as: "reviews",
        include: [
          { model: User, as: "user", attributes: ["id", "name", "avatar"] },
        ],
      },
    ],
  });

  if (!product) {
    return next(new ErrorHandler("Produit introuvable.", 404));
  }

  res.status(200).json({
    success: true,
    message: "Produit récupéré avec succès.",
    product,
  });
});

export const updateProduct = catchAsyncErrors(async (req, res, next) => {
  const { productId } = req.params;
  const { name, description, price, category_id, stock, featured, on_sale } =
    req.body;

  if (!name || !price) {
    return next(
      new ErrorHandler(
        "Veuillez fournir les détails complets du produit.",
        400,
      ),
    );
  }

  const oldProduct = await Product.findByPk(productId);
  if (!oldProduct) {
    return next(new ErrorHandler("Produit introuvable.", 404));
  }

  let uploadedImages = oldProduct.images;

  console.log(req.files);

  if (req.files && req.files.images) {
    const images = Array.isArray(req.files.images)
      ? req.files.images
      : [req.files.images];

    // Supprimer les anciennes images Cloudinary
    for (const img of oldProduct.images || []) {
      if (img.public_id) await cloudinary.uploader.destroy(img.public_id);
    }

    uploadedImages = [];
    for (const image of images) {
      const result = await uploadToCloudinary(image.data, {
        folder: "Ecommerce_Product_Images",
        width: 1000,
        crop: "scale",
      });
      uploadedImages.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }
  }

  await oldProduct.update({
    name,
    description: description || null,
    price,
    category_id: category_id || null,
    stock: stock || null,
    images: uploadedImages,
    featured:
      featured !== undefined
        ? featured === true || featured === "true"
        : oldProduct.featured,
    on_sale:
      on_sale !== undefined
        ? on_sale === true || on_sale === "true"
        : oldProduct.on_sale,
  });

  const updatedProduct = await Product.findByPk(productId, {
    include: [{ model: Category, as: "category", attributes: ["id", "name"] }],
  });

  res.status(200).json({
    success: true,
    message: "Produit mis à jour avec succès.",
    updatedProduct,
  });
});

export const deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const { productId } = req.params;

  const product = await Product.findByPk(productId);
  if (!product) {
    return next(new ErrorHandler("Produit introuvable.", 404));
  }

  for (const image of product.images || []) {
    if (image.public_id) await cloudinary.uploader.destroy(image.public_id);
  }

  await product.destroy();

  res
    .status(200)
    .json({ success: true, message: "Produit supprimé avec succès." });
});

export const postProductReview = catchAsyncErrors(async (req, res, next) => {
  const { productId } = req.params;
  const { rating, comment } = req.body;

  if (!rating || !comment) {
    return next(
      new ErrorHandler("Veuillez fournir une note et un commentaire.", 400),
    );
  }

  const product = await Product.findByPk(productId);
  if (!product) {
    return next(new ErrorHandler("Produit introuvable.", 404));
  }

  // Upsert : mettre à jour l'avis existant ou en créer un nouveau
  const [review, created] = await Review.findOrCreate({
    where: { product_id: productId, user_id: req.user.id },
    defaults: { rating: parseFloat(rating), comment },
  });

  if (!created) {
    review.rating = parseFloat(rating);
    review.comment = comment;
    await review.save();
  }

  // Recalculer la note moyenne avec une agrégation SQL
  const avgResult = await Review.findOne({
    where: { product_id: productId },
    attributes: [
      [fn("AVG", col("rating")), "avgRating"],
      [fn("COUNT", col("id")), "reviewCount"],
    ],
    raw: true,
  });

  product.ratings = parseFloat(avgResult.avgRating) || 0;
  await product.save();

  res.status(200).json({ success: true, message: "Avis publié.", product });
});

export const deleteReview = catchAsyncErrors(async (req, res, next) => {
  const { productId } = req.params;

  const product = await Product.findByPk(productId);
  if (!product) {
    return next(new ErrorHandler("Produit introuvable.", 404));
  }

  const review = await Review.findOne({
    where: { product_id: productId, user_id: req.user.id },
  });

  if (!review) {
    return next(new ErrorHandler("Avis introuvable.", 404));
  }

  await review.destroy();

  // Recalculer la note moyenne
  const avgResult = await Review.findOne({
    where: { product_id: productId },
    attributes: [[fn("AVG", col("rating")), "avgRating"]],
    raw: true,
  });

  product.ratings = parseFloat(avgResult?.avgRating) || 0;
  await product.save();

  res.status(200).json({
    success: true,
    message: "Votre avis a été supprimé.",
    review,
    product,
  });
});

export const toggleFeatured = catchAsyncErrors(async (req, res, next) => {
  const { productId } = req.params;
  console.log(req.params);

  const product = await Product.findByPk(productId);
  if (!product) {
    return next(new ErrorHandler("Produit introuvable.", 404));
  }

  product.featured = !product.featured;
  await product.save();

  res.status(200).json({
    success: true,
    message: product.featured
      ? "Produit mis en avant."
      : "Produit retiré de la mise en avant.",
    product,
  });
});

export const toggleSale = catchAsyncErrors(async (req, res, next) => {
  const { productId } = req.params;

  const product = await Product.findByPk(productId);
  if (!product) {
    return next(new ErrorHandler("Produit introuvable.", 404));
  }

  product.on_sale = !product.on_sale;
  await product.save();

  res.status(200).json({
    success: true,
    message: product.on_sale
      ? "Produit mis en promotion."
      : "Promotion retirée.",
    product,
  });
});

export const fetchAIFilteredProducts = catchAsyncErrors(
  async (req, res, next) => {
    const { query } = req.body;

    if (!query) {
      return next(new ErrorHandler("Veuillez fournir un prompt valide.", 400));
    }

    const stopWords = new Set([
      "the",
      "they",
      "them",
      "then",
      "I",
      "we",
      "you",
      "he",
      "she",
      "it",
      "is",
      "a",
      "an",
      "of",
      "and",
      "or",
      "to",
      "for",
      "from",
      "on",
      "who",
      "whom",
      "why",
      "when",
      "which",
      "with",
      "this",
      "that",
      "in",
      "at",
      "by",
      "be",
      "not",
      "was",
      "were",
      "has",
      "have",
      "had",
      "do",
      "does",
      "did",
      "so",
      "some",
      "any",
      "how",
      "can",
      "could",
      "should",
      "would",
      "there",
      "here",
      "just",
      "than",
      "because",
      "but",
      "its",
      "it's",
      "if",
    ]);

    const keywords = query
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((word) => !stopWords.has(word));

    const orConditions = keywords.map((kw) => ({
      [Op.or]: [
        { name: { [Op.iLike]: `%${kw}%` } },
        { description: { [Op.iLike]: `%${kw}%` } },
      ],
    }));

    const filteredProducts = await Product.findAll({
      where: { [Op.or]: orConditions.flatMap((c) => c[Op.or]) },
      include: [{ model: Category, as: "category", attributes: ["name"] }],
      limit: 200,
    });

    if (filteredProducts.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Aucun produit trouvé pour ce prompt.",
        products: [],
      });
    }

    const { success, products } = await getAIRecommendation(
      req,
      res,
      query,
      filteredProducts.map((p) => p.toJSON()),
    );

    res.status(200).json({
      success,
      message: "Produits filtrés par IA.",
      products,
    });
  },
);
