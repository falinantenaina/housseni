// import-ingco.js
//
// Importe le fichier INGCO_TARIFS.xlsx vers MongoDB Atlas
// - Upload les images vers Cloudinary
// - CODE BAR → description du produit
// - Nom FR (colonne D) → name
// - PRIX DE VENTE → price
// - QTY → stock
// Usage : node import-ingco.js
//

import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";
import mongoose from "mongoose";

dotenv.config();

//  Config
const XLSX_FILE = "./INGCO_TARIFS_MAI_2026__1_.xlsx";
const SHEET_NAME = "PROSPECTUS";
const IMAGES_DIR = "./ingco_images_temp"; // dossier temporaire pour les images extraites
const BATCH_SIZE = 5; // nb d'uploads Cloudinary en parallèle

//  Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});

//  Couleurs console
const log = {
  info: (t) => console.log(`\x1b[36m${t}\x1b[0m`),
  success: (t) => console.log(`\x1b[32m${t}\x1b[0m`),
  warn: (t) => console.log(`\x1b[33m${t}\x1b[0m`),
  error: (t) => console.error(`\x1b[31m${t}\x1b[0m`),
  bold: (t) => console.log(`\x1b[1m${t}\x1b[0m`),
  dim: (t) => console.log(`\x1b[2m${t}\x1b[0m`),
};

//  Upload Cloudinary depuis Buffer
function uploadBuffer(buffer, folder, publicId) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, public_id: publicId, overwrite: true },
      (err, result) => (err ? reject(err) : resolve(result)),
    );
    stream.end(buffer);
  });
}

//  Lecture du fichier Excel
async function parseExcel() {
  // Import dynamique pour éviter les erreurs si pas installé
  let openpyxl;
  try {
    // On utilise un script Python pour lire l'Excel et extraire les images
    // car openpyxl n'est pas disponible en Node.js
    const { execSync } = await import("child_process");

    // Exporte les données et images via Python
    const script = `
import openpyxl, json, base64, sys, io
from pathlib import Path

wb = openpyxl.load_workbook('${XLSX_FILE}')
ws = wb.active

# Map images: row 0-indexed → base64
image_map = {}
for img in ws._images:
    anchor = img.anchor
    if hasattr(anchor, '_from') and anchor._from.col == 1:
        row = anchor._from.row
        buf = img.ref if isinstance(img.ref, bytes) else img.ref.getvalue()
        image_map[row] = base64.b64encode(buf).decode()

# Lignes de données
products = []
for i, row in enumerate(ws.iter_rows(min_row=2, values_only=True)):
    code_bar   = str(row[0]).strip() if row[0] else None
    name_en    = str(row[2]).strip() if row[2] else None
    name_fr    = str(row[3]).strip() if row[3] else None
    unit       = str(row[4]).strip() if row[4] else None
    qty        = int(row[5]) if row[5] and str(row[5]).isdigit() else (int(float(str(row[5]))) if row[5] else None)
    price_raw  = row[6]
    price      = float(str(price_raw).replace(',', '.').replace(' ', '').replace('€','')) if price_raw else 0

    # image row = i + 1 (data index 0 = image row 1)
    image_b64 = image_map.get(i + 1, None)

    if not name_fr and not name_en:
        continue

    products.append({
        "code_bar": code_bar,
        "name": name_fr or name_en,
        "unit": unit,
        "stock": qty,
        "price": price,
        "image_b64": image_b64,
    })

print(json.dumps(products))
`;

    const output = execSync(
      `python3 -c "${script.replace(/"/g, '\\"').replace(/\n/g, " ")}"`,
      {
        maxBuffer: 50 * 1024 * 1024, // 50MB
      },
    );

    return JSON.parse(output.toString());
  } catch (err) {
    throw new Error(`Erreur lecture Excel : ${err.message}`);
  }
}

//  Alternative : lecture directe via fichier temp Python
async function parseExcelViaTempScript() {
  const { execSync } = await import("child_process");

  const pythonScript = `
import openpyxl, json, base64, io

wb = openpyxl.load_workbook('${XLSX_FILE}')
ws = wb.active

image_map = {}
for img in ws._images:
    anchor = img.anchor
    if hasattr(anchor, '_from') and anchor._from.col == 1:
        row = anchor._from.row
        try:
            buf = img.ref.getvalue() if hasattr(img.ref, 'getvalue') else bytes(img.ref)
            image_map[row] = base64.b64encode(buf).decode()
        except:
            pass

products = []
for i, row in enumerate(ws.iter_rows(min_row=2, values_only=True)):
    code_bar = str(int(float(str(row[0])))) if row[0] else None
    name_fr  = str(row[3]).strip() if row[3] else (str(row[2]).strip() if row[2] else None)
    unit     = str(row[4]).strip() if row[4] else 'PCS'

    try:
        qty = int(float(str(row[5]))) if row[5] else None
    except:
        qty = None

    try:
        price = float(str(row[6]).replace(',', '.').replace(' ', '').replace('\\u20ac',''))
    except:
        price = 0

    image_b64 = image_map.get(i + 1)

    if not name_fr:
        continue

    products.append({
        "code_bar": code_bar,
        "name": name_fr,
        "unit": unit,
        "stock": qty,
        "price": price,
        "image_b64": image_b64
    })

print(json.dumps(products, ensure_ascii=False))
`;

  const tempPyFile = "./parse_ingco.py";

  fs.writeFileSync(tempPyFile, pythonScript, "utf-8");

  const output = execSync(`py "${tempPyFile}"`, {
    maxBuffer: 100 * 1024 * 1024,
  });

  return JSON.parse(output.toString());
}

//  Mongoose Product model (minimal)
function getProductModel() {
  const schema = new mongoose.Schema(
    {
      name: String,
      description: String, // CODE BAR ici
      price: Number,
      stock: Number,
      unit: String,
      images: [{ url: String, public_id: String }],
      ratings: { type: Number, default: 0 },
      reviews: { type: Array, default: [] },
      featured: { type: Boolean, default: false },
      on_sale: { type: Boolean, default: false },
      category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        default: null,
      },
      created_at: { type: Date, default: Date.now },
    },
    { collection: "products" },
  );

  return mongoose.models.Product || mongoose.model("Product", schema);
}

//  Main
async function main() {
  log.bold("\n🚀 IMPORT INGCO XLSX → MongoDB Atlas\n");

  if (!process.env.MONGODB_URI) {
    log.error("❌ MONGODB_URI manquant dans .env");
    process.exit(1);
  }
  if (!process.env.CLOUDINARY_CLIENT_NAME) {
    log.error("❌ Variables Cloudinary manquantes dans .env");
    process.exit(1);
  }
  if (!fs.existsSync(XLSX_FILE)) {
    log.error(`❌ Fichier introuvable : ${XLSX_FILE}`);
    process.exit(1);
  }

  //  1. Parse Excel
  log.info("📊 Lecture du fichier Excel...");
  const products = await parseExcelViaTempScript();
  log.success(`✅ ${products.length} produits extraits du fichier Excel`);

  const withImage = products.filter((p) => p.image_b64).length;
  const withoutImage = products.length - withImage;
  log.dim(`   → ${withImage} avec image, ${withoutImage} sans image\n`);

  //  2. Connexion MongoDB
  log.info("🔌 Connexion MongoDB Atlas...");
  await mongoose.connect(process.env.MONGO_URI);
  log.success("✅ MongoDB connecté.\n");

  const Product = getProductModel();

  //  3. Upload images + insertion produits
  log.bold("📦 Upload Cloudinary + insertion MongoDB\n");

  let inserted = 0,
    skipped = 0,
    errors = 0;

  // Traitement par batch pour ne pas surcharger Cloudinary
  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    const batch = products.slice(i, i + BATCH_SIZE);

    await Promise.all(
      batch.map(async (p) => {
        try {
          let images = [];

          // Upload image si disponible
          if (p.image_b64) {
            const buffer = Buffer.from(p.image_b64, "base64");
            const safeName = p.name
              .replace(/[^a-zA-Z0-9]/g, "_")
              .substring(0, 40);
            const result = await uploadBuffer(
              buffer,
              "Ecommerce_Product_Images",
              `ingco_${safeName}_${Date.now()}`,
            );
            images = [{ url: result.secure_url, public_id: result.public_id }];
          }

          // Insertion MongoDB
          await Product.create({
            name: p.name,
            description: p.code_bar || null, // CODE BAR en description
            price: p.price,
            stock: p.stock,
            unit: p.unit,
            images,
            featured: false,
            on_sale: false,
          });

          inserted++;
          process.stdout.write(
            `\r  ✅ ${inserted}/${products.length} insérés...`,
          );
        } catch (err) {
          errors++;
          log.error(`\n  ❌ Erreur "${p.name}" : ${err.message}`);
        }
      }),
    );
  }

  //  4. Résumé
  console.log(); // newline après le counter
  log.bold("\n📊 RÉSUMÉ\n");
  log.success(`  ✅ Produits insérés    : ${inserted}`);
  if (skipped) log.warn(`  ⚠️  Ignorés            : ${skipped}`);
  if (errors) log.error(`  ❌ Erreurs             : ${errors}`);

  const total = await Product.countDocuments();
  log.info(`  📦 Total produits MongoDB : ${total}`);

  await mongoose.disconnect();
  log.bold("\n\x1b[32m🎉 Import INGCO terminé !\x1b[0m\n");
}

main().catch((err) => {
  log.error(`\n💥 Erreur fatale : ${err.message}`);
  process.exit(1);
});
