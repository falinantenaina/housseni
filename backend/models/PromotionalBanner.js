import { DataTypes } from "sequelize";
import sequelize from "../database/db.js";

const VALID_LAYOUTS = [
  "promo_items",
  "full_image",
  "text_image",
  "image_text",
  "centered_text",
  "image_overlay",
];

const PromotionalBanner = sequelize.define(
  "PromotionalBanner",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    layout: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "promo_items",
      validate: { isIn: [VALID_LAYOUTS] },
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    subtitle: {
      type: DataTypes.STRING(255),
      defaultValue: null,
    },
    badge_text: {
      type: DataTypes.STRING(100),
      defaultValue: null,
    },
    date_range: {
      type: DataTypes.STRING(100),
      defaultValue: null,
    },
    cta_text: {
      type: DataTypes.STRING(100),
      defaultValue: "J'en profite",
    },
    cta_url: {
      type: DataTypes.STRING(255),
      defaultValue: "/products",
    },
    bg_image_url: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    bg_image_public_id: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    bg_color: {
      type: DataTypes.STRING(50),
      defaultValue: null,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "promotional_banners",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

export default PromotionalBanner;
