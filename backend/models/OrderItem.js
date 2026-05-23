import { DataTypes } from "sequelize";
import sequelize from "../database/db.js";

const OrderItem = sequelize.define(
  "OrderItem",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    // FK order_id et product_id définies dans models/index.js
    order_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1 },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0 },
    },
    image: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: "order_items",
    timestamps: false,
  },
);

export default OrderItem;
