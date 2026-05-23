import { DataTypes } from "sequelize";
import sequelize from "../database/db.js";

const PromotionalBannerItem = sequelize.define(
  "PromotionalBannerItem",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    // FK banner_id et product_id définies dans models/index.js
    banner_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.UUID,
      defaultValue: null,
    },
    label: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    sublabel: {
      type: DataTypes.STRING(255),
      defaultValue: null,
    },
    image_url: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    image_public_id: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    original_price: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: null,
    },
    promo_price: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: null,
    },
    sort_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "promotional_banner_items",
    timestamps: false,
  },
);

export default PromotionalBannerItem;
