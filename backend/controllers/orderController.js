import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Order, OrderItem, Product, User } from "../models/index.js";

export const SHIPPING_RATES = {
  ville: 50,
  sud: 100,
  nord: 100,
  petite_terre: 250,
};

export const VALID_ZONES = ["ville", "sud", "nord", "petite_terre"];

// Include standard pour récupérer une commande complète avec ses relations
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

  if (
    delivery_zone !== undefined &&
    delivery_zone !== null &&
    !VALID_ZONES.includes(delivery_zone)
  ) {
    return next(
      new ErrorHandler(
        `Zone de livraison invalide. Valeurs acceptées : ${VALID_ZONES.join(", ")}.`,
        400,
      ),
    );
  }

  const items = Array.isArray(orderedItems)
    ? orderedItems
    : JSON.parse(orderedItems);

  if (!items || items.length === 0) {
    return next(new ErrorHandler("Aucun article dans le panier.", 400));
  }

  const productIds = items.map((item) => item.product.id);
  const products = await Product.findAll({
    where: { id: productIds },
    attributes: ["id", "price", "stock", "name"],
  });

  let total_price = 0;
  const orderItemsData = [];

  for (const item of items) {
    const product = products.find((p) => p.id === item.product.id);

    if (!product) {
      return next(
        new ErrorHandler(
          `Produit introuvable pour l'ID : ${item.product.id}`,
          404,
        ),
      );
    }

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

  // ── Créer la commande ────────────────────────────────────────
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

  // ── Insérer les lignes de commande ───────────────────────────
  await OrderItem.bulkCreate(
    orderItemsData.map((item) => ({ ...item, order_id: order.id })),
  );

  // ── Auto-sauvegarder les infos de livraison sur le profil ────
  // Permet de pré-remplir le formulaire lors de la prochaine commande.
  // On ne met à jour que les champs réellement fournis.
  try {
    const buyer = await User.findByPk(req.user.id);
    const currentInfo = buyer.shipping_info || {};
    await buyer.update({
      shipping_info: {
        ...currentInfo,
        phone: phone || currentInfo.phone || null,
        address: address || currentInfo.address || null,
        city: city || currentInfo.city || null,
        state: state || currentInfo.state || null,
        country: country || currentInfo.country || null,
        pincode: pincode || currentInfo.pincode || null,
      },
    });
  } catch (err) {
    // Non bloquant : la commande est déjà créée
    console.warn("Impossible de sauvegarder les shipping_info :", err.message);
  }

  res.status(200).json({
    success: true,
    message: "Commande enregistrée avec succès. Veuillez procéder au paiement.",
    total_price,
    shipping_price,
    delivery_zone: zone,
    orderId: order.id,
  });
});

export const fetchSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const { orderId } = req.params;

  const order = await Order.findByPk(orderId, { include: ORDER_INCLUDE });

  if (!order) {
    return next(new ErrorHandler("Commande introuvable.", 404));
  }

  res.status(200).json({
    success: true,
    message: "Commande récupérée.",
    orders: order,
  });
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

  res.status(200).json({
    success: true,
    message: "Toutes vos commandes ont été récupérées.",
    myOrders: orders,
  });
});

export const fetchAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.findAll({
    include: ORDER_INCLUDE,
    order: [["created_at", "DESC"]],
  });

  res.status(200).json({
    success: true,
    message: "Toutes les commandes ont été récupérées.",
    orders,
  });
});

export const updateOrderStatus = catchAsyncErrors(async (req, res, next) => {
  const { status } = req.body;

  if (!status) {
    return next(
      new ErrorHandler(
        "Veuillez indiquer un statut valide pour la commande.",
        400,
      ),
    );
  }

  const { orderId } = req.params;

  const order = await Order.findByPk(orderId);
  if (!order) {
    return next(new ErrorHandler("Commande introuvable.", 404));
  }

  await order.update({ order_status: status });

  res.status(200).json({
    success: true,
    message: "Statut de la commande mis à jour.",
    updatedOrder: order,
  });
});

export const deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const { orderId } = req.params;

  const order = await Order.findByPk(orderId);
  if (!order) {
    return next(new ErrorHandler("Commande introuvable.", 404));
  }

  await order.destroy(); // cascade supprime aussi les order_items

  res.status(200).json({
    success: true,
    message: "Commande supprimée.",
    order,
  });
});

export const markOrderAsPaid = catchAsyncErrors(async (req, res, next) => {
  const { orderId } = req.params;

  const order = await Order.findByPk(orderId);
  if (!order) {
    return next(new ErrorHandler("Commande introuvable.", 404));
  }

  if (order.paid_at) {
    return next(
      new ErrorHandler("Cette commande est déjà marquée comme payée.", 400),
    );
  }

  await order.update({ paid_at: new Date() });

  res.status(200).json({
    success: true,
    message: "Commande marquée comme payée.",
    order,
  });
});
