import { DataTypes } from "sequelize";
import sequelize from "../database/db.js";

const Notification = sequelize.define(
  "Notification",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    // FK order_id définie dans models/index.js
    order_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "new_order",
    },
    // Données sérialisées : buyer, total_price, delivery_zone, items_count...
    payload: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    // true = au moins un admin a vu la notification
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "notifications",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false, // on ne met jamais à jour updatedAt ici
  },
);

export default Notification;
