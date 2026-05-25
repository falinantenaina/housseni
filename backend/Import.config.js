// import.config.js — ETS Housseni
//
import dotenv from "dotenv";
dotenv.config();
export const config = {
  jsonFile: "./c2794247c_ets-housseni.json",

  mongodb: {
    uri: process.env.MONGODB_URI,
  },

  tables: [
    {
      mysqlTable: "users",
      mongoCollection: "users",
      transform: (row) => ({
        mysqlUUID: row.id, // garde l'UUID pour résoudre les relations
        name: row.name,
        email: row.email,
        password: row.password,
        role: row.role || "user",
        avatar: row.avatar ? { url: row.avatar, public_id: null } : null,
        reset_password_token: null,
        reset_password_expire: null,
        created_at: row.created_at ? new Date(row.created_at) : new Date(),
      }),
    },
    {
      mysqlTable: "categories",
      mongoCollection: "categories",
      transform: (row) => ({
        mysqlUUID: row.id,
        name: row.name,
        description: row.description || null,
        image: row.image ? { url: row.image, public_id: null } : null,
        created_at: row.created_at ? new Date(row.created_at) : new Date(),
      }),
    },
    {
      mysqlTable: "products",
      mongoCollection: "products",
      transform: (row) => {
        // images est un JSON stringifié dans MySQL — on le parse
        let images = [];
        if (row.images) {
          try {
            images =
              typeof row.images === "string"
                ? JSON.parse(row.images)
                : row.images;
          } catch {
            images = [];
          }
        }

        return {
          mysqlUUID: row.id,
          mysqlCategoryUUID: row.category_id || null, // résolu en ObjectId après
          mysqlCreatedByUUID: row.created_by || null, // résolu en ObjectId après
          name: row.name,
          description: row.description || null,
          price: parseFloat(row.price) || 0,
          stock: row.stock ? parseInt(row.stock) : null,
          images, // tableau déjà OK (url + public_id)
          ratings: parseFloat(row.ratings) || 0,
          reviews: [],
          featured: row.featured === "1" || row.featured === 1,
          on_sale: row.on_sale === "1" || row.on_sale === 1,
          created_at: row.created_at ? new Date(row.created_at) : new Date(),
        };
      },
    },
    {
      mysqlTable: "promotional_banners",
      mongoCollection: "promotionalbanners",
      transform: (row) => ({
        mysqlUUID: row.id,
        layout: row.layout || "promo_items",
        title: row.title,
        subtitle: row.subtitle || null,
        badge_text: row.badge_text || null,
        date_range: row.date_range || null,
        cta_text: row.cta_text || "J'en profite",
        cta_url: row.cta_url || "/products",
        bg_image_url: row.bg_image_url || null,
        bg_image_public_id: row.bg_image_public_id || null,
        bg_color: row.bg_color || null,
        is_active: row.is_active === "1" || row.is_active === 1,
        items: [],
        created_at: row.created_at ? new Date(row.created_at) : new Date(),
      }),
    },
    // Tables vides — importées à vide pour créer les collections
    { mysqlTable: "orders", mongoCollection: "orders", transform: null },
    {
      mysqlTable: "order_items",
      mongoCollection: "order_items",
      transform: null,
    },
    { mysqlTable: "payments", mongoCollection: "payments", transform: null },
    {
      mysqlTable: "promotional_banner_items",
      mongoCollection: "promotionalbanner_items",
      transform: null,
    },
    { mysqlTable: "reviews", mongoCollection: "reviews", transform: null },
    {
      mysqlTable: "shipping_info",
      mongoCollection: "shippinginfos",
      transform: null,
    },
  ],

  //  Relations : UUID MySQL → ObjectId MongoDB
  relations: [
    {
      collection: "products",
      field: "mysqlCategoryUUID",
      refCollection: "categories",
      refField: "mysqlUUID",
      targetField: "category",
    },
    {
      collection: "products",
      field: "mysqlCreatedByUUID",
      refCollection: "users",
      refField: "mysqlUUID",
      targetField: "created_by",
    },
  ],
};
