import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);

const productSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.model("Product", productSchema, "products");

function fixEncoding(str) {
  if (!str) return str;

  return Buffer.from(str, "latin1").toString("utf8");
}

const products = await Product.find();

for (const p of products) {
  const oldName = p.name;

  p.name = fixEncoding(p.name);

  if (p.description) {
    p.description = fixEncoding(p.description);
  }

  console.log(`✔ ${oldName} → ${p.name}`);

  await p.save();
}

console.log("✅ Encodage corrigé.");

await mongoose.disconnect();
