import { DataTypes } from "sequelize";
import sequelize from "../database/db.js";

const Review = sequelize.define(
  "Review",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    // FK product_id et user_id définies dans models/index.js
    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: false,
      validate: { min: 0, max: 5 },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "reviews",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        // Un avis unique par utilisateur et par produit
        unique: true,
        fields: ["product_id", "user_id"],
      },
    ],
  },
);

export default Review;
