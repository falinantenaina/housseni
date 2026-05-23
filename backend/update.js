import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);

// Définir le modèle (collection products)
const productSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.model("Product", productSchema, "products");

// ObjectId de la catégorie cible
const categoryId = new mongoose.Types.ObjectId("6a0448634b2cd2741fb5f7fb");

// Mise à jour massive (ULTRA RAPIDE)
const result = await Product.updateMany(
  {
    $or: [
      { category: null },
      { category: { $exists: false } }
    ]
  },
  {
    $set: { category: categoryId }
  }
);

console.log("✅ Mise à jour terminée !");
console.log(`📦 Documents modifiés: ${result.modifiedCount || result.nModified}`);

await mongoose.disconnect();