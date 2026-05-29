import { DataTypes } from "sequelize";
import sequelize from "../database/db.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "User",
      validate: { isIn: [["User", "Admin"]] },
    },
    avatar: {
      type: DataTypes.JSONB,
      defaultValue: null,
    },
    shipping_info: {
      type: DataTypes.JSONB,
      defaultValue: null,
    },
    reset_password_token: {
      type: DataTypes.STRING(255),
      defaultValue: null,
    },
    reset_password_expire: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    //  Email verification
    email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    email_verify_token: {
      type: DataTypes.STRING(255),
      defaultValue: null,
    },
    email_verify_expire: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
  },
  {
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

export default User;
