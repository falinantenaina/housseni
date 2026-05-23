import { DataTypes } from "sequelize";
import sequelize from "../database/db.js";

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0 },
    },
    // FK category_id définie dans models/index.js
    category_id: {
      type: DataTypes.UUID,
      defaultValue: null,
    },
    ratings: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0,
    },
    // Tableau d'objets [{ url, public_id }] — stocké en JSONB
    images: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    on_sale: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // FK created_by définie dans models/index.js
    created_by: {
      type: DataTypes.UUID,
      defaultValue: null,
    },
  },
  {
    tableName: "products",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

export default Product;
