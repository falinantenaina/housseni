import { DataTypes } from "sequelize";
import sequelize from "../database/db.js";

const VALID_STATUSES = ["En cours", "Confirmé", "Livré", "Annulé"];
const VALID_ZONES = ["ville", "sud", "nord", "petite_terre"];

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    // FK buyer_id définie dans models/index.js
    buyer_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    // Infos d'expédition stockées en JSONB (objet plat, 1-pour-1 avec la commande)
    shipping_info: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    total_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0 },
    },
    tax_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    shipping_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    delivery_zone: {
      type: DataTypes.STRING(20),
      defaultValue: null,
      validate: {
        isValidZone(value) {
          if (value !== null && !VALID_ZONES.includes(value)) {
            throw new Error(
              `Zone invalide. Valeurs acceptées : ${VALID_ZONES.join(", ")}`,
            );
          }
        },
      },
    },
    order_status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "En cours",
      validate: {
        isIn: [VALID_STATUSES],
      },
    },
    paid_at: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
  },
  {
    tableName: "orders",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

export default Order;
