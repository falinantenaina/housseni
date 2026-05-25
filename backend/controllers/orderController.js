import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import {
  Notification,
  Order,
  OrderItem,
  Product,
  User,
} from "../models/index.js";
import { getIO } from "../socket.js";

export const SHIPPING_RATES = {
  ville: 50,
  sud: 100,
  nord: 100,
  petite_terre: 250,
};

export const VALID_ZONES = ["ville", "sud", "nord", "petite_terre"];

const ORDER_INCLUDE = [
  { model: User, as: "buyer", attributes: ["id", "name", "email"] },
  {
    model: OrderItem,
    as: "order_items",
    include: [
      { model: Product, as: "product", attributes: ["id", "name", "images"] },
    ],
  },
];

export const placeNewOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    full_name,
    state,
    city,
    country,
    address,
    pincode,
    phone,
    orderedItems,
    delivery_zone,
  } = req.body;

  if (!full_name || !city || !country || !address || !pincode || !phone) {
    return next(
      new ErrorHandler(
        "Veuillez fournir les informations d'expédition complètes.",
        400,
      ),
    );
  }

  if (delivery_zone != null && !VALID_ZONES.includes(delivery_zone)) {
    return next(
      new ErrorHandler(
        `Zone invalide. Valeurs acceptées : ${VALID_ZONES.join(", ")}.`,
        400,
      ),
    );
  }

  const items = Array.isArray(orderedItems)
    ? orderedItems
    : JSON.parse(orderedItems);
  if (!items?.length)
    return next(new ErrorHandler("Aucun article dans le panier.", 400));

  const productIds = items.map((i) => i.product.id);
  const dbProducts = await Product.findAll({
    where: { id: productIds },
    attributes: ["id", "price", "stock", "name"],
  });

  let total_price = 0;
  const orderItemsData = [];

  for (const item of items) {
    const product = dbProducts.find((p) => p.id === item.product.id);
    if (!product)
      return next(
        new ErrorHandler(`Produit introuvable : ${item.product.id}`, 404),
      );
    if (product.stock !== null && item.quantity > product.stock) {
      return next(
        new ErrorHandler(
          `Seulement ${product.stock} unités disponibles pour ${product.name}`,
          400,
        ),
      );
    }
    total_price += parseFloat(product.price) * item.quantity;
    orderItemsData.push({
      product_id: product.id,
      quantity: item.quantity,
      price: parseFloat(product.price),
      image: item.product.images?.[0]?.url || "",
      title: product.name,
    });
  }

  const zone = delivery_zone || null;
  const shipping_price = zone ? (SHIPPING_RATES[zone] ?? 0) : 0;

  //  Créer la commande
  const order = await Order.create({
    buyer_id: req.user.id,
    shipping_info: {
      full_name,
      state: state || null,
      city,
      country,
      address,
      pincode,
      phone,
    },
    total_price,
    tax_price: 0,
    shipping_price,
    delivery_zone: zone,
  });

  await OrderItem.bulkCreate(
    orderItemsData.map((item) => ({ ...item, order_id: order.id })),
  );

  //  Auto-sauvegarder shipping_info sur le profil
  try {
    const buyer = await User.findByPk(req.user.id);
    const current = buyer.shipping_info || {};
    await buyer.update({
      shipping_info: {
        ...current,
        phone: phone || current.phone || null,
        address: address || current.address || null,
        city: city || current.city || null,
        state: state || current.state || null,
        country: country || current.country || null,
        pincode: pincode || current.pincode || null,
      },
    });
  } catch (err) {
    console.warn("shipping_info non sauvegardé :", err.message);
  }

  //  Payload de notification
  const notifPayload = {
    buyer: { name: req.user.name, email: req.user.email },
    total_price,
    shipping_price,
    delivery_zone: zone,
    items_count: orderItemsData.length,
  };

  //  Persister la notification en base
  // Même si l'admin est hors ligne, la notification sera disponible
  // au prochain chargement du panel.
  let savedNotif = null;
  try {
    savedNotif = await Notification.create({
      order_id: order.id,
      type: "new_order",
      payload: notifPayload,
      read: false,
    });
  } catch (err) {
    console.warn("[Notification] Impossible de persister :", err.message);
  }

  //  Émettre en temps réel si des admins sont connectés
  try {
    getIO()
      .to("admins")
      .emit("new_order", {
        id: savedNotif?.id || Date.now(),
        order_id: order.id,
        type: "new_order",
        read: false,
        received_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        ...notifPayload,
      });
  } catch (err) {
    console.warn("[Socket] Impossible d'émettre new_order :", err.message);
  }

  res.status(200).json({
    success: true,
    message: "Commande enregistrée avec succès.",
    total_price,
    shipping_price,
    delivery_zone: zone,
    orderId: order.id,
  });
});

export const fetchSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findByPk(req.params.orderId, {
    include: ORDER_INCLUDE,
  });
  if (!order) return next(new ErrorHandler("Commande introuvable.", 404));
  res
    .status(200)
    .json({ success: true, message: "Commande récupérée.", orders: order });
});

export const fetchMyOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.findAll({
    where: { buyer_id: req.user.id },
    include: [
      {
        model: OrderItem,
        as: "order_items",
        include: [
          {
            model: Product,
            as: "product",
            attributes: ["id", "name", "images"],
          },
        ],
      },
    ],
    order: [["created_at", "DESC"]],
  });
  res.status(200).json({ success: true, myOrders: orders });
});

export const fetchAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.findAll({
    include: ORDER_INCLUDE,
    order: [["created_at", "DESC"]],
  });
  res.status(200).json({ success: true, orders });
});

export const updateOrderStatus = catchAsyncErrors(async (req, res, next) => {
  const { status } = req.body;
  if (!status) return next(new ErrorHandler("Statut requis.", 400));
  const order = await Order.findByPk(req.params.orderId);
  if (!order) return next(new ErrorHandler("Commande introuvable.", 404));
  await order.update({ order_status: status });
  res.status(200).json({
    success: true,
    message: "Statut mis à jour.",
    updatedOrder: order,
  });
});

export const deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findByPk(req.params.orderId);

  if (!order) return next(new ErrorHandler("Commande introuvable.", 404));
  await Notification.destroy({
    where: { order_id: order.id },
  });
  await order.destroy();
  res
    .status(200)
    .json({ success: true, message: "Commande supprimée.", order });
});

export const markOrderAsPaid = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findByPk(req.params.orderId);
  if (!order) return next(new ErrorHandler("Commande introuvable.", 404));
  if (order.paid_at)
    return next(new ErrorHandler("Déjà marquée comme payée.", 400));
  await order.update({ paid_at: new Date() });
  res
    .status(200)
    .json({ success: true, message: "Commande marquée comme payée.", order });
});
