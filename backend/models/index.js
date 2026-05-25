/**
 * models/index.js
 *
 * Point d'entrée unique pour tous les modèles.
 *
 * Champs JSONB notables :
 *   - User.avatar          → { public_id, url }
 *   - User.shipping_info   → { phone, address, city, state, country, pincode }
 *   - Product.images       → [{ url, public_id }, ...]
 *   - Order.shipping_info  → { full_name, state, city, country, address, pincode, phone }
 *   - Category.image       → { public_id, url }
 *   - Notification.payload → { buyer, total_price, delivery_zone, items_count, ... }
 */

import Category from "./Category.js";
import Notification from "./Notification.js";
import Order from "./Order.js";
import OrderItem from "./OrderItem.js";
import Product from "./Product.js";
import PromotionalBanner from "./PromotionalBanner.js";
import PromotionalBannerItem from "./promotionalBannerItems.js";
import Review from "./Review.js";
import User from "./User.js";

//  Product ↔ Category
Product.belongsTo(Category, { foreignKey: "category_id", as: "category" });
Category.hasMany(Product, { foreignKey: "category_id", as: "products" });

//  Product ↔ User (créateur)
Product.belongsTo(User, { foreignKey: "created_by", as: "creator" });
User.hasMany(Product, { foreignKey: "created_by", as: "products" });

//  Review ↔ Product
Review.belongsTo(Product, { foreignKey: "product_id" });
Product.hasMany(Review, { foreignKey: "product_id", as: "reviews" });

//  Review ↔ User
Review.belongsTo(User, { foreignKey: "user_id", as: "user" });
User.hasMany(Review, { foreignKey: "user_id" });

//  Order ↔ User (acheteur)
Order.belongsTo(User, { foreignKey: "buyer_id", as: "buyer" });
User.hasMany(Order, { foreignKey: "buyer_id", as: "orders" });

//  OrderItem ↔ Order
Order.hasMany(OrderItem, {
  foreignKey: "order_id",
  as: "order_items",
  onDelete: "CASCADE",
});
OrderItem.belongsTo(Order, { foreignKey: "order_id" });

//  OrderItem ↔ Product
OrderItem.belongsTo(Product, { foreignKey: "product_id", as: "product" });
Product.hasMany(OrderItem, { foreignKey: "product_id" });

//  PromotionalBannerItem ↔ PromotionalBanner
PromotionalBanner.hasMany(PromotionalBannerItem, {
  foreignKey: "banner_id",
  as: "items",
  onDelete: "CASCADE",
});
PromotionalBannerItem.belongsTo(PromotionalBanner, { foreignKey: "banner_id" });

//  PromotionalBannerItem ↔ Product
PromotionalBannerItem.belongsTo(Product, {
  foreignKey: "product_id",
  as: "product",
  constraints: false,
});

//  Notification ↔ Order
Notification.belongsTo(Order, {
  foreignKey: "order_id",
  as: "order",
  onDelete: "CASCADE",
});
Order.hasMany(Notification, { foreignKey: "order_id", as: "notifications" });

export {
  Category,
  Notification,
  Order,
  OrderItem,
  Product,
  PromotionalBanner,
  PromotionalBannerItem,
  Review,
  User,
};
