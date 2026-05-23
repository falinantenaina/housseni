/**
 * migrate-mongo-to-pg.js
 *
 * Migration complète MongoDB Atlas → PostgreSQL
 *
 * Ce script :
 *   1. Se connecte à MongoDB Atlas et lit toutes les collections
 *   2. Synchronise les tables Sequelize (ALTER, pas DROP)
 *   3. Migre dans l'ordre correct pour respecter les FK :
 *      users → categories → products → reviews →
 *      orders → order_items → promotional_banners → promotional_banner_items
 *
 * Usage :
 *   node migrate-mongo-to-pg.js
 *
 * Prérequis dans .env :
 *   MONGODB_URI=mongodb+srv://...
 *   DB_HOST / DB_PORT / DB_NAME / DB_USER / DB_PASSWORD
 *
 */

import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import { DataTypes, QueryTypes, Sequelize } from "sequelize";

dotenv.config();

//  Couleurs console
const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  magenta: "\x1b[35m",
};
const log = {
  info: (t) => console.log(`${c.cyan}ℹ  ${t}${c.reset}`),
  success: (t) => console.log(`${c.green}✅ ${t}${c.reset}`),
  warn: (t) => console.log(`${c.yellow}⚠  ${t}${c.reset}`),
  error: (t) => console.error(`${c.red}❌ ${t}${c.reset}`),
  bold: (t) => console.log(`${c.bold}${t}${c.reset}`),
  dim: (t) => console.log(`${c.dim}   ${t}${c.reset}`),
  section: (t) =>
    console.log(
      `\n${c.bold}${c.magenta} ${t} ${"".repeat(Math.max(0, 60 - t.length))}${c.reset}`,
    ),
};

//  Validation des variables d'environnement
function validateEnv() {
  const required = [
    "MONGODB_URI",
    "DB_HOST",
    "DB_NAME",
    "DB_USER",
    "DB_PASSWORD",
  ];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    log.error(`Variables manquantes dans .env : ${missing.join(", ")}`);
    process.exit(1);
  }
}

//  Connexion MongoDB Atlas
async function connectMongo() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  log.success("MongoDB Atlas connecté.");
  return client;
}

//  Connexion PostgreSQL (Sequelize brut — sans les modèles métier)
function createSequelize() {
  return new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT) || 5432,
      dialect: "postgres",
      logging: false,
    },
  );
}

//  Utilitaires

/** Convertit un ObjectId MongoDB en string UUID-like lisible */
const toStr = (v) => (v instanceof ObjectId ? v.toString() : (v ?? null));

/**
 * Map ObjectId MongoDB → UUID PostgreSQL.
 * On utilise les UUIDs générés lors de l'insertion en PG
 * pour résoudre les relations (FK).
 */
class IdMap {
  #map = new Map(); // mongoId (string) → pgUUID (string)

  set(mongoId, pgId) {
    if (mongoId) this.#map.set(mongoId.toString(), pgId);
  }

  get(mongoId) {
    if (!mongoId) return null;
    return this.#map.get(mongoId.toString()) ?? null;
  }
}

/** Insère un tableau de lignes dans une table PG, en ignorant les doublons */
async function bulkInsertIgnore(sequelize, table, rows) {
  if (!rows || rows.length === 0) return 0;

  let inserted = 0;
  for (const row of rows) {
    try {
      const cols = Object.keys(row);
      const vals = Object.values(row);
      const placeholders = cols.map((_, i) => `:p${i}`).join(", ");
      const bind = Object.fromEntries(vals.map((v, i) => [`p${i}`, v]));

      await sequelize.query(
        `INSERT INTO "${table}" (${cols.map((c) => `"${c}"`).join(", ")})
         VALUES (${placeholders})
         ON CONFLICT DO NOTHING`,
        { replacements: bind, type: QueryTypes.INSERT },
      );
      inserted++;
    } catch (err) {
      log.warn(`Ligne ignorée dans "${table}" : ${err.message}`);
    }
  }
  return inserted;
}

//  Vérification / création des tables via Sequelize
async function syncTables(sequelize) {
  log.section("Synchronisation des tables PostgreSQL");

  // On recrée les modèles minimaux ici pour ne pas dépendre de l'application.
  // Ces définitions doivent correspondre exactement à models/*.js.

  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: { type: DataTypes.STRING(100), allowNull: false },
      email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      password: { type: DataTypes.STRING(255), allowNull: false },
      role: { type: DataTypes.STRING(20), defaultValue: "User" },
      avatar: { type: DataTypes.JSONB, defaultValue: null },
      reset_password_token: { type: DataTypes.STRING(255), defaultValue: null },
      reset_password_expire: { type: DataTypes.DATE, defaultValue: null },
      shipping_info: { type: DataTypes.JSONB, defaultValue: null },
    },
    {
      tableName: "users",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );

  const Category = sequelize.define(
    "Category",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      description: { type: DataTypes.TEXT, defaultValue: null },
      image: { type: DataTypes.JSONB, defaultValue: null },
    },
    {
      tableName: "categories",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );

  const Product = sequelize.define(
    "Product",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: { type: DataTypes.STRING(255), allowNull: false },
      description: { type: DataTypes.TEXT, defaultValue: null },
      price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      category_id: { type: DataTypes.UUID, defaultValue: null },
      ratings: { type: DataTypes.DECIMAL(3, 2), defaultValue: 0 },
      images: { type: DataTypes.JSONB, defaultValue: [] },
      stock: { type: DataTypes.INTEGER, defaultValue: null },
      featured: { type: DataTypes.BOOLEAN, defaultValue: false },
      on_sale: { type: DataTypes.BOOLEAN, defaultValue: false },
      created_by: { type: DataTypes.UUID, defaultValue: null },
    },
    {
      tableName: "products",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );

  const Review = sequelize.define(
    "Review",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      product_id: { type: DataTypes.UUID, allowNull: false },
      user_id: { type: DataTypes.UUID, allowNull: false },
      rating: { type: DataTypes.DECIMAL(3, 2), allowNull: false },
      comment: { type: DataTypes.TEXT, allowNull: false },
    },
    {
      tableName: "reviews",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [{ unique: true, fields: ["product_id", "user_id"] }],
    },
  );

  const Order = sequelize.define(
    "Order",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      buyer_id: { type: DataTypes.UUID, allowNull: false },
      shipping_info: { type: DataTypes.JSONB, allowNull: false },
      total_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      tax_price: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
      shipping_price: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
      delivery_zone: { type: DataTypes.STRING(20), defaultValue: null },
      order_status: { type: DataTypes.STRING(20), defaultValue: "En cours" },
      paid_at: { type: DataTypes.DATE, defaultValue: null },
    },
    {
      tableName: "orders",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );

  const OrderItem = sequelize.define(
    "OrderItem",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      order_id: { type: DataTypes.UUID, allowNull: false },
      product_id: { type: DataTypes.UUID, allowNull: false },
      quantity: { type: DataTypes.INTEGER, allowNull: false },
      price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      image: { type: DataTypes.TEXT, defaultValue: "" },
      title: { type: DataTypes.STRING(255), allowNull: false },
    },
    { tableName: "order_items", timestamps: false },
  );

  const PromotionalBanner = sequelize.define(
    "PromotionalBanner",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      layout: { type: DataTypes.STRING(50), defaultValue: "promo_items" },
      title: { type: DataTypes.STRING(255), allowNull: false },
      subtitle: { type: DataTypes.STRING(255), defaultValue: null },
      badge_text: { type: DataTypes.STRING(100), defaultValue: null },
      date_range: { type: DataTypes.STRING(100), defaultValue: null },
      cta_text: { type: DataTypes.STRING(100), defaultValue: "J'en profite" },
      cta_url: { type: DataTypes.STRING(255), defaultValue: "/products" },
      bg_image_url: { type: DataTypes.TEXT, defaultValue: null },
      bg_image_public_id: { type: DataTypes.TEXT, defaultValue: null },
      bg_color: { type: DataTypes.STRING(50), defaultValue: null },
      is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    {
      tableName: "promotional_banners",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );

  const PromotionalBannerItem = sequelize.define(
    "PromotionalBannerItem",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      banner_id: { type: DataTypes.UUID, allowNull: false },
      product_id: { type: DataTypes.UUID, defaultValue: null },
      label: { type: DataTypes.STRING(255), allowNull: false },
      sublabel: { type: DataTypes.STRING(255), defaultValue: null },
      image_url: { type: DataTypes.TEXT, defaultValue: null },
      image_public_id: { type: DataTypes.TEXT, defaultValue: null },
      original_price: { type: DataTypes.DECIMAL(10, 2), defaultValue: null },
      promo_price: { type: DataTypes.DECIMAL(10, 2), defaultValue: null },
      sort_order: { type: DataTypes.INTEGER, defaultValue: 0 },
    },
    { tableName: "promotional_banner_items", timestamps: false },
  );

  // Associations nécessaires pour sync avec FK
  Product.belongsTo(Category, { foreignKey: "category_id" });
  Product.belongsTo(User, { foreignKey: "created_by" });
  Review.belongsTo(Product, { foreignKey: "product_id" });
  Review.belongsTo(User, { foreignKey: "user_id" });
  Order.belongsTo(User, { foreignKey: "buyer_id" });
  OrderItem.belongsTo(Order, { foreignKey: "order_id" });
  OrderItem.belongsTo(Product, { foreignKey: "product_id" });
  PromotionalBannerItem.belongsTo(PromotionalBanner, {
    foreignKey: "banner_id",
  });

  // ALTER : met à jour les colonnes manquantes sans supprimer les données
  await sequelize.sync({
    /* alter: true */
  });
  log.success("Tables synchronisées (ALTER).");

  return {
    User,
    Category,
    Product,
    Review,
    Order,
    OrderItem,
    PromotionalBanner,
    PromotionalBannerItem,
  };
}

//  ÉTAPES DE MIGRATION

async function migrateUsers(mongoDb, sequelize, idMap) {
  log.section("1 / 8 — Users");

  const docs = await mongoDb.collection("users").find().toArray();
  log.info(`${docs.length} utilisateurs trouvés dans MongoDB.`);

  if (docs.length === 0) {
    log.warn("Collection vide, ignorée.");
    return;
  }

  let ok = 0,
    skip = 0;

  for (const doc of docs) {
    try {
      const [result] = await sequelize.query(
        `INSERT INTO users
           (id, name, email, password, role, avatar,
            shipping_info,
            reset_password_token, reset_password_expire,
            created_at, updated_at)
         VALUES
           (gen_random_uuid(), :name, :email, :password, :role, :avatar,
            :shipping_info,
            :rpt, :rpe, :created_at, :updated_at)
         ON CONFLICT (email) DO UPDATE SET
           name          = EXCLUDED.name,
           shipping_info = EXCLUDED.shipping_info,
           updated_at    = EXCLUDED.updated_at
         RETURNING id`,
        {
          replacements: {
            name: doc.name || "Unknown",
            email: doc.email,
            password: doc.password,
            role: doc.role || "User",
            avatar: doc.avatar ? JSON.stringify(doc.avatar) : null,
            shipping_info: doc.shipping_info
              ? JSON.stringify(doc.shipping_info)
              : null,
            rpt: doc.reset_password_token || null,
            rpe: doc.reset_password_expire || null,
            created_at: doc.created_at || new Date(),
            updated_at: doc.updated_at || new Date(),
          },
          type: QueryTypes.SELECT,
        },
      );
      idMap.users.set(doc._id, result.id);
      ok++;
    } catch (err) {
      log.warn(`User ignoré (${doc.email}) : ${err.message}`);
      skip++;
    }
  }

  log.success(`Users : ${ok} insérés / mis à jour, ${skip} ignorés.`);
}

async function migrateCategories(mongoDb, sequelize, idMap) {
  log.section("2 / 8 — Categories");

  const docs = await mongoDb.collection("categories").find().toArray();
  log.info(`${docs.length} catégories trouvées dans MongoDB.`);

  if (docs.length === 0) {
    log.warn("Collection vide, ignorée.");
    return;
  }

  let ok = 0,
    skip = 0;

  for (const doc of docs) {
    try {
      const [result] = await sequelize.query(
        `INSERT INTO categories
           (id, name, description, image, created_at, updated_at)
         VALUES
           (gen_random_uuid(), :name, :description, :image, :created_at, :updated_at)
         ON CONFLICT (name) DO UPDATE SET
           description = EXCLUDED.description,
           image       = EXCLUDED.image,
           updated_at  = EXCLUDED.updated_at
         RETURNING id`,
        {
          replacements: {
            name: doc.name,
            description: doc.description || null,
            image: doc.image ? JSON.stringify(doc.image) : null,
            created_at: doc.created_at || new Date(),
            updated_at: doc.updated_at || new Date(),
          },
          type: QueryTypes.SELECT,
        },
      );
      idMap.categories.set(doc._id, result.id);
      ok++;
    } catch (err) {
      log.warn(`Category ignorée (${doc.name}) : ${err.message}`);
      skip++;
    }
  }

  log.success(`Categories : ${ok} insérées / mises à jour, ${skip} ignorées.`);
}

async function migrateProducts(mongoDb, sequelize, idMap) {
  log.section("3 / 8 — Products");

  const docs = await mongoDb.collection("products").find().toArray();
  log.info(`${docs.length} produits trouvés dans MongoDB.`);

  if (docs.length === 0) {
    log.warn("Collection vide, ignorée.");
    return;
  }

  let ok = 0,
    skip = 0;

  for (const doc of docs) {
    try {
      const categoryPgId = idMap.categories.get(doc.category);
      const creatorPgId = idMap.users.get(doc.created_by);

      const [result] = await sequelize.query(
        `INSERT INTO products
           (id, name, description, price, category_id, ratings,
            images, stock, featured, on_sale, created_by,
            created_at, updated_at)
         VALUES
           (gen_random_uuid(), :name, :description, :price, :category_id,
            :ratings, :images, :stock, :featured, :on_sale, :created_by,
            :created_at, :updated_at)
         ON CONFLICT DO NOTHING
         RETURNING id`,
        {
          replacements: {
            name: doc.name,
            description: doc.description || null,
            price: parseFloat(doc.price) || 0,
            category_id: categoryPgId || null,
            ratings: parseFloat(doc.ratings) || 0,
            images: JSON.stringify(Array.isArray(doc.images) ? doc.images : []),
            stock:
              doc.stock !== undefined && doc.stock !== null
                ? parseInt(doc.stock)
                : null,
            featured: doc.featured === true || doc.featured === 1,
            on_sale: doc.on_sale === true || doc.on_sale === 1,
            created_by: creatorPgId || null,
            created_at: doc.created_at || new Date(),
            updated_at: doc.updated_at || new Date(),
          },
          type: QueryTypes.SELECT,
        },
      );

      if (result) {
        idMap.products.set(doc._id, result.id);
        ok++;
      } else {
        // ON CONFLICT DO NOTHING → récupérer l'id existant par le nom
        const [existing] = await sequelize.query(
          `SELECT id FROM products WHERE name = :name LIMIT 1`,
          { replacements: { name: doc.name }, type: QueryTypes.SELECT },
        );
        if (existing) {
          idMap.products.set(doc._id, existing.id);
          log.dim(`Produit déjà existant : "${doc.name}" → id ${existing.id}`);
        }
        skip++;
      }
    } catch (err) {
      log.warn(`Product ignoré (${doc.name}) : ${err.message}`);
      skip++;
    }
  }

  log.success(`Products : ${ok} insérés, ${skip} ignorés / doublons.`);
}

async function migrateReviews(mongoDb, sequelize, idMap) {
  log.section("4 / 8 — Reviews");

  // Dans MongoDB les reviews étaient imbriquées dans les produits
  const productDocs = await mongoDb
    .collection("products")
    .find({ "reviews.0": { $exists: true } })
    .toArray();

  let total = 0,
    ok = 0,
    skip = 0;

  for (const productDoc of productDocs) {
    const productPgId = idMap.products.get(productDoc._id);
    if (!productPgId) continue;

    for (const review of productDoc.reviews || []) {
      total++;
      const userPgId = idMap.users.get(review.user);
      if (!userPgId) {
        log.dim(`Review ignorée — user introuvable : ${toStr(review.user)}`);
        skip++;
        continue;
      }

      try {
        await sequelize.query(
          `INSERT INTO reviews
             (id, product_id, user_id, rating, comment, created_at, updated_at)
           VALUES
             (gen_random_uuid(), :product_id, :user_id, :rating, :comment,
              :created_at, :updated_at)
           ON CONFLICT (product_id, user_id) DO UPDATE SET
             rating     = EXCLUDED.rating,
             comment    = EXCLUDED.comment,
             updated_at = EXCLUDED.updated_at`,
          {
            replacements: {
              product_id: productPgId,
              user_id: userPgId,
              rating: parseFloat(review.rating) || 0,
              comment: review.comment || "",
              created_at: review.created_at || new Date(),
              updated_at: review.updated_at || new Date(),
            },
            type: QueryTypes.INSERT,
          },
        );
        ok++;
      } catch (err) {
        log.warn(`Review ignorée : ${err.message}`);
        skip++;
      }
    }
  }

  log.info(`${total} avis trouvés dans les produits MongoDB.`);
  log.success(`Reviews : ${ok} insérés / mis à jour, ${skip} ignorés.`);
}

async function migrateOrders(mongoDb, sequelize, idMap) {
  log.section("5 / 8 — Orders");

  const docs = await mongoDb.collection("orders").find().toArray();
  log.info(`${docs.length} commandes trouvées dans MongoDB.`);

  if (docs.length === 0) {
    log.warn("Collection vide, ignorée.");
    return;
  }

  let ok = 0,
    skip = 0;

  for (const doc of docs) {
    try {
      const buyerPgId = idMap.users.get(doc.buyer);
      if (!buyerPgId) {
        log.dim(`Commande ignorée — buyer introuvable : ${toStr(doc.buyer)}`);
        skip++;
        continue;
      }

      // Reconstitue shipping_info (peut être sous-document ou JSONB)
      const shippingInfo = doc.shipping_info || {
        full_name: "Inconnu",
        city: "Inconnue",
        country: "Inconnu",
        address: "Inconnue",
        pincode: "00000",
        phone: "0000000000",
      };

      const [result] = await sequelize.query(
        `INSERT INTO orders
           (id, buyer_id, shipping_info, total_price, tax_price,
            shipping_price, delivery_zone, order_status, paid_at,
            created_at, updated_at)
         VALUES
           (gen_random_uuid(), :buyer_id, :shipping_info, :total_price,
            :tax_price, :shipping_price, :delivery_zone, :order_status,
            :paid_at, :created_at, :updated_at)
         ON CONFLICT DO NOTHING
         RETURNING id`,
        {
          replacements: {
            buyer_id: buyerPgId,
            shipping_info: JSON.stringify(shippingInfo),
            total_price: parseFloat(doc.total_price) || 0,
            tax_price: parseFloat(doc.tax_price) || 0,
            shipping_price: parseFloat(doc.shipping_price) || 0,
            delivery_zone: doc.delivery_zone || null,
            order_status: doc.order_status || "En cours",
            paid_at: doc.paid_at || null,
            created_at: doc.created_at || new Date(),
            updated_at: doc.updated_at || new Date(),
          },
          type: QueryTypes.SELECT,
        },
      );

      if (result) {
        idMap.orders.set(doc._id, result.id);
        ok++;
      } else {
        skip++;
      }
    } catch (err) {
      log.warn(`Order ignorée : ${err.message}`);
      skip++;
    }
  }

  log.success(`Orders : ${ok} insérées, ${skip} ignorées.`);
}

async function migrateOrderItems(mongoDb, sequelize, idMap) {
  log.section("6 / 8 — Order Items");

  const docs = await mongoDb
    .collection("orders")
    .find({ "order_items.0": { $exists: true } })
    .toArray();

  let total = 0,
    ok = 0,
    skip = 0;

  for (const orderDoc of docs) {
    const orderPgId = idMap.orders.get(orderDoc._id);
    if (!orderPgId) {
      skip++;
      continue;
    }

    for (const item of orderDoc.order_items || []) {
      total++;
      const productPgId = idMap.products.get(item.product);

      try {
        await sequelize.query(
          `INSERT INTO order_items
             (id, order_id, product_id, quantity, price, image, title)
           VALUES
             (gen_random_uuid(), :order_id, :product_id, :quantity,
              :price, :image, :title)
           ON CONFLICT DO NOTHING`,
          {
            replacements: {
              order_id: orderPgId,
              product_id: productPgId || null,
              quantity: parseInt(item.quantity) || 1,
              price: parseFloat(item.price) || 0,
              image: item.image || "",
              title: item.title || item.name || "Produit",
            },
            type: QueryTypes.INSERT,
          },
        );
        ok++;
      } catch (err) {
        log.warn(`OrderItem ignoré : ${err.message}`);
        skip++;
      }
    }
  }

  log.info(`${total} lignes de commande trouvées dans MongoDB.`);
  log.success(`OrderItems : ${ok} insérés, ${skip} ignorés.`);
}

async function migratePromotionalBanners(mongoDb, sequelize, idMap) {
  log.section("7 / 8 — Promotional Banners");

  const docs = await mongoDb.collection("promotionalbanners").find().toArray();
  log.info(`${docs.length} bannières trouvées dans MongoDB.`);

  if (docs.length === 0) {
    log.warn("Collection vide, ignorée.");
    return;
  }

  let ok = 0,
    skip = 0;

  for (const doc of docs) {
    try {
      const [result] = await sequelize.query(
        `INSERT INTO promotional_banners
           (id, layout, title, subtitle, badge_text, date_range,
            cta_text, cta_url, bg_image_url, bg_image_public_id,
            bg_color, is_active, created_at, updated_at)
         VALUES
           (gen_random_uuid(), :layout, :title, :subtitle, :badge_text,
            :date_range, :cta_text, :cta_url, :bg_image_url,
            :bg_image_public_id, :bg_color, :is_active,
            :created_at, :updated_at)
         ON CONFLICT DO NOTHING
         RETURNING id`,
        {
          replacements: {
            layout: doc.layout || "promo_items",
            title: doc.title,
            subtitle: doc.subtitle || null,
            badge_text: doc.badge_text || null,
            date_range: doc.date_range || null,
            cta_text: doc.cta_text || "J'en profite",
            cta_url: doc.cta_url || "/products",
            bg_image_url: doc.bg_image_url || null,
            bg_image_public_id: doc.bg_image_public_id || null,
            bg_color: doc.bg_color || null,
            is_active: doc.is_active !== false,
            created_at: doc.created_at || new Date(),
            updated_at: doc.updated_at || new Date(),
          },
          type: QueryTypes.SELECT,
        },
      );

      if (result) {
        idMap.banners.set(doc._id, result.id);
        ok++;
      } else {
        skip++;
      }
    } catch (err) {
      log.warn(`Banner ignorée (${doc.title}) : ${err.message}`);
      skip++;
    }
  }

  log.success(`Banners : ${ok} insérées, ${skip} ignorées.`);
}

async function migratePromotionalBannerItems(mongoDb, sequelize, idMap) {
  log.section("8 / 8 — Promotional Banner Items");

  // Les items peuvent être dans une collection séparée OU imbriqués dans les bannières
  let docs = await mongoDb
    .collection("promotionalbanner_items")
    .find()
    .toArray();

  // Si la collection séparée est vide, chercher les items imbriqués dans les bannières
  if (docs.length === 0) {
    const bannerDocs = await mongoDb
      .collection("promotionalbanners")
      .find({ "items.0": { $exists: true } })
      .toArray();

    docs = bannerDocs.flatMap((b) =>
      (b.items || []).map((item) => ({ ...item, _banner_id: b._id })),
    );
    if (docs.length > 0) {
      log.info(`${docs.length} items trouvés imbriqués dans les bannières.`);
    }
  }

  if (docs.length === 0) {
    log.warn("Aucun banner item trouvé, ignoré.");
    return;
  }

  let ok = 0,
    skip = 0;

  for (const doc of docs) {
    try {
      const bannerId = idMap.banners.get(doc.banner_id || doc._banner_id);
      const productId = idMap.products.get(doc.product);

      if (!bannerId) {
        log.dim(`BannerItem ignoré — bannière introuvable.`);
        skip++;
        continue;
      }

      await sequelize.query(
        `INSERT INTO promotional_banner_items
           (id, banner_id, product_id, label, sublabel, image_url,
            image_public_id, original_price, promo_price, sort_order)
         VALUES
           (gen_random_uuid(), :banner_id, :product_id, :label, :sublabel,
            :image_url, :image_public_id, :original_price, :promo_price,
            :sort_order)
         ON CONFLICT DO NOTHING`,
        {
          replacements: {
            banner_id: bannerId,
            product_id: productId || null,
            label: doc.label || "Item",
            sublabel: doc.sublabel || null,
            image_url: doc.image_url || null,
            image_public_id: doc.image_public_id || null,
            original_price:
              doc.original_price != null
                ? parseFloat(doc.original_price)
                : null,
            promo_price:
              doc.promo_price != null ? parseFloat(doc.promo_price) : null,
            sort_order: parseInt(doc.sort_order) || 0,
          },
          type: QueryTypes.INSERT,
        },
      );
      ok++;
    } catch (err) {
      log.warn(`BannerItem ignoré : ${err.message}`);
      skip++;
    }
  }

  log.success(`BannerItems : ${ok} insérés, ${skip} ignorés.`);
}

//  Recalcul des notes moyennes
async function recalcProductRatings(sequelize) {
  log.section("Post-traitement — Recalcul des notes moyennes");

  await sequelize.query(
    `UPDATE products p
     SET ratings = COALESCE((
       SELECT AVG(r.rating)
       FROM reviews r
       WHERE r.product_id = p.id
     ), 0)`,
    { type: QueryTypes.UPDATE },
  );

  log.success("Notes moyennes recalculées.");
}

//  Résumé final
async function printSummary(sequelize) {
  log.section("Résumé final");

  const tables = [
    "users",
    "categories",
    "products",
    "reviews",
    "orders",
    "order_items",
    "promotional_banners",
    "promotional_banner_items",
  ];

  for (const table of tables) {
    const [{ count }] = await sequelize.query(
      `SELECT COUNT(*)::int AS count FROM "${table}"`,
      { type: QueryTypes.SELECT },
    );
    const emoji = count > 0 ? "✅" : "⊘ ";
    log.success(
      `${emoji}  ${table.padEnd(32)} ${count} ligne${count !== 1 ? "s" : ""}`,
    );
  }
}

//  MAIN
async function main() {
  console.log(`\n${c.bold}${c.magenta}${"═".repeat(65)}${c.reset}`);
  console.log(
    `${c.bold}${c.magenta}   Migration MongoDB Atlas → PostgreSQL${c.reset}`,
  );
  console.log(`${c.bold}${c.magenta}${"═".repeat(65)}${c.reset}\n`);

  validateEnv();

  //  Connexions
  const mongoClient = await connectMongo();
  const mongoDb = mongoClient.db(); // utilise la DB de l'URI

  const sequelize = createSequelize();
  await sequelize.authenticate();
  log.success("PostgreSQL connecté.");

  //  Tables
  await syncTables(sequelize);

  //  Maps d'IDs : mongoObjectId → pgUUID
  const idMap = {
    users: new IdMap(),
    categories: new IdMap(),
    products: new IdMap(),
    orders: new IdMap(),
    banners: new IdMap(),
  };

  //  Migration dans l'ordre des dépendances FK
  await migrateUsers(mongoDb, sequelize, idMap);
  await migrateCategories(mongoDb, sequelize, idMap);
  await migrateProducts(mongoDb, sequelize, idMap);
  await migrateReviews(mongoDb, sequelize, idMap);
  await migrateOrders(mongoDb, sequelize, idMap);
  await migrateOrderItems(mongoDb, sequelize, idMap);
  await migratePromotionalBanners(mongoDb, sequelize, idMap);
  await migratePromotionalBannerItems(mongoDb, sequelize, idMap);

  //  Post-traitement
  await recalcProductRatings(sequelize);
  await printSummary(sequelize);

  //  Fermeture
  await mongoClient.close();
  await sequelize.close();

  console.log(
    `\n${c.bold}${c.green}🎉  Migration terminée avec succès !${c.reset}\n`,
  );
}

main().catch((err) => {
  log.error(`Erreur fatale : ${err.message}`);
  console.error(err);
  process.exit(1);
});
