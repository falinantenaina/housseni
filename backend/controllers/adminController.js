import { v2 as cloudinary } from "cloudinary";
import { Op, QueryTypes, col, fn } from "sequelize";
import sequelize from "../database/db.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Order, Product, User } from "../models/index.js";
import { SHIPPING_RATES, VALID_ZONES } from "./orderController.js";

const currentRates = { ...SHIPPING_RATES };

// Utilisateurs

export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  const { count: total, rows: users } = await User.findAndCountAll({
    order: [["created_at", "DESC"]],
    offset,
    limit,
  });

  res.status(200).json({
    success: true,
    totalUsers: total,
    currentPage: page,
    users,
  });
});

export const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findByPk(id);
  if (!user) {
    return next(new ErrorHandler("Utilisateur introuvable", 404));
  }

  if (user.avatar?.public_id) {
    await cloudinary.uploader.destroy(user.avatar.public_id);
  }

  await user.destroy();

  res.status(200).json({
    success: true,
    message: "Utilisateur supprimé avec succès",
  });
});

export const updateRole = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!["User", "Admin"].includes(role)) {
    return next(new ErrorHandler("Rôle invalide", 400));
  }

  const user = await User.findByPk(id);
  if (!user) {
    return next(new ErrorHandler("Utilisateur introuvable", 404));
  }

  await user.update({ role });

  res.status(200).json({ success: true, user });
});

//  Dashboard

export const dashboardStats = catchAsyncErrors(async (req, res, next) => {
  const now = new Date();

  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStart = new Date(yesterday);
  yesterdayStart.setHours(0, 0, 0, 0);
  const yesterdayEnd = new Date(yesterday);
  yesterdayEnd.setHours(23, 59, 59, 999);

  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const currentMonthEnd = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
    999,
  );
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const previousMonthEnd = new Date(
    now.getFullYear(),
    now.getMonth(),
    0,
    23,
    59,
    59,
    999,
  );

  const PAID = { paid_at: { [Op.ne]: null } };

  //  Revenus totaux
  const totalRevenueAllTime =
    parseFloat(await Order.sum("total_price", { where: PAID })) || 0;

  //  Nombre d'utilisateurs
  const totalUsersCount = await User.count({ where: { role: "User" } });

  //  Statuts des commandes
  const statusRows = await Order.findAll({
    where: PAID,
    attributes: ["order_status", [fn("COUNT", col("id")), "cnt"]],
    group: ["order_status"],
    raw: true,
  });
  const orderStatusCounts = { "En cours": 0, Confirmé: 0, Livré: 0, Annulé: 0 };
  statusRows.forEach((row) => {
    orderStatusCounts[row.order_status] = parseInt(row.cnt);
  });

  //  Revenus du jour / hier
  const todayRevenue =
    parseFloat(
      await Order.sum("total_price", {
        where: {
          ...PAID,
          created_at: { [Op.between]: [todayStart, todayEnd] },
        },
      }),
    ) || 0;

  const yesterdayRevenue =
    parseFloat(
      await Order.sum("total_price", {
        where: {
          ...PAID,
          created_at: { [Op.between]: [yesterdayStart, yesterdayEnd] },
        },
      }),
    ) || 0;

  //  Ventes mensuelles (graphique)
  const monthlySalesRows = await sequelize.query(
    `SELECT
       EXTRACT(YEAR FROM created_at)::int  AS year,
       EXTRACT(MONTH FROM created_at)::int AS month,
       SUM(total_price)::numeric(12,2)     AS totalsales
     FROM orders
     WHERE paid_at IS NOT NULL
     GROUP BY year, month
     ORDER BY year ASC, month ASC`,
    { type: QueryTypes.SELECT },
  );

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthlySales = monthlySalesRows.map((row) => ({
    month: `${monthNames[row.month - 1]} ${row.year}`,
    totalsales: parseFloat(row.totalsales),
  }));

  //  Top 5 produits les plus vendus
  const topSellingProducts = await sequelize.query(
    `SELECT
       p.id,
       p.name,
       p.images,
       p.ratings,
       p.category_id,
       SUM(oi.quantity)::int AS total_sold
     FROM order_items oi
     JOIN orders o ON o.id = oi.order_id
     JOIN products p ON p.id = oi.product_id
     WHERE o.paid_at IS NOT NULL
     GROUP BY p.id, p.name, p.images, p.ratings, p.category_id
     ORDER BY total_sold DESC
     LIMIT 5`,
    { type: QueryTypes.SELECT },
  );

  // Ajouter l'image principale extraite du JSONB
  const topProducts = topSellingProducts.map((p) => ({
    ...p,
    image:
      Array.isArray(p.images) && p.images.length > 0 ? p.images[0].url : null,
  }));

  //  Ventes du mois en cours / précédent
  const currentMonthSales =
    parseFloat(
      await Order.sum("total_price", {
        where: {
          ...PAID,
          created_at: { [Op.between]: [currentMonthStart, currentMonthEnd] },
        },
      }),
    ) || 0;

  const lastMonthRevenue =
    parseFloat(
      await Order.sum("total_price", {
        where: {
          ...PAID,
          created_at: { [Op.between]: [previousMonthStart, previousMonthEnd] },
        },
      }),
    ) || 0;

  let revenueGrowth = "0%";
  if (lastMonthRevenue > 0) {
    const growthRate =
      ((currentMonthSales - lastMonthRevenue) / lastMonthRevenue) * 100;
    revenueGrowth = `${growthRate >= 0 ? "+" : ""}${growthRate.toFixed(2)}%`;
  }

  //  Produits avec stock faible (≤ 5)
  const lowStockProducts = await Product.findAll({
    where: { stock: { [Op.lte]: 5, [Op.ne]: null } },
    attributes: ["id", "name", "stock"],
  });

  //  Nouveaux utilisateurs ce mois
  const newUsersThisMonth = await User.count({
    where: {
      role: "User",
      created_at: { [Op.gte]: currentMonthStart },
    },
  });

  res.status(200).json({
    success: true,
    message: "Statistiques récupérées avec succès",
    totalRevenueAllTime,
    todayRevenue,
    yesterdayRevenue,
    totalUsersCount,
    orderStatusCounts,
    monthlySales,
    currentMonthSales,
    topSellingProducts: topProducts,
    lowStockProducts,
    revenueGrowth,
    newUsersThisMonth,
  });
});

//  Tarifs de livraison

export const getShippingRates = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({ success: true, shipping_rates: currentRates });
});

export const updateShippingRates = catchAsyncErrors(async (req, res, next) => {
  const updates = req.body;

  for (const zone of Object.keys(updates)) {
    if (!VALID_ZONES.includes(zone)) {
      return next(
        new ErrorHandler(
          `Zone invalide : "${zone}". Zones acceptées : ${VALID_ZONES.join(", ")}.`,
          400,
        ),
      );
    }
    const price = Number(updates[zone]);
    if (isNaN(price) || price < 0) {
      return next(
        new ErrorHandler(
          `Le tarif pour "${zone}" doit être un nombre positif.`,
          400,
        ),
      );
    }
    currentRates[zone] = price;
  }

  res.status(200).json({
    success: true,
    message: "Tarifs de livraison mis à jour.",
    shipping_rates: currentRates,
  });
});

export const updateOrderDeliveryZone = catchAsyncErrors(
  async (req, res, next) => {
    const { orderId } = req.params;
    const { delivery_zone } = req.body;

    if (
      delivery_zone !== null &&
      delivery_zone !== undefined &&
      !VALID_ZONES.includes(delivery_zone)
    ) {
      return next(
        new ErrorHandler(
          `Zone invalide. Valeurs acceptées : ${VALID_ZONES.join(", ")} ou null.`,
          400,
        ),
      );
    }

    const order = await Order.findByPk(orderId);
    if (!order) {
      return next(new ErrorHandler("Commande introuvable.", 404));
    }

    const zone = delivery_zone ?? null;
    const shipping_price = zone ? (currentRates[zone] ?? 0) : 0;

    await order.update({ delivery_zone: zone, shipping_price });

    res.status(200).json({
      success: true,
      message: "Zone de livraison mise à jour.",
      delivery_zone: order.delivery_zone,
      shipping_price: order.shipping_price,
      order,
    });
  },
);

export const updateOrderShippingPrice = catchAsyncErrors(
  async (req, res, next) => {
    const { orderId } = req.params;
    const { shipping_price } = req.body;

    const price = Number(shipping_price);
    if (isNaN(price) || price < 0) {
      return next(
        new ErrorHandler(
          "Le prix de livraison doit être un nombre positif.",
          400,
        ),
      );
    }

    const order = await Order.findByPk(orderId);
    if (!order) {
      return next(new ErrorHandler("Commande introuvable.", 404));
    }

    await order.update({ shipping_price: price });

    res.status(200).json({
      success: true,
      message: "Prix de livraison de la commande mis à jour.",
      shipping_price: order.shipping_price,
      order,
    });
  },
);
