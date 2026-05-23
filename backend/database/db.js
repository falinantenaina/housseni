import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
    port: parseInt(process.env.DB_PORT) || 5432,
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      underscored: false,
      freezeTableName: true,
    },
  },
);

// Connexion + synchronisation des modèles
// { alter: true } met à jour les tables existantes sans les recréer.
// Passez à { force: false } en production stable pour éviter toute altération.
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(/* { alter: true } */);
    console.log("PostgreSQL connecté et modèles synchronisés.");
  } catch (error) {
    console.error("Erreur connexion PostgreSQL :", error);
    process.exit(1);
  }
};

export default sequelize;
