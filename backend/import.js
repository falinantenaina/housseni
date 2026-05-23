// import.js — ETS Housseni
// ─────────────────────────────────────────────────────────────
// Usage : node import.js
// ─────────────────────────────────────────────────────────────

import dotenv from "dotenv";
import fs from "fs";
import mongoose from "mongoose";
import { config } from "./import.config.js";

dotenv.config();

// ─── Couleurs console ─────────────────────────────────────────
const log = {
  info: (t) => console.log(`\x1b[36m${t}\x1b[0m`),
  success: (t) => console.log(`\x1b[32m${t}\x1b[0m`),
  warn: (t) => console.log(`\x1b[33m${t}\x1b[0m`),
  error: (t) => console.error(`\x1b[31m${t}\x1b[0m`),
  bold: (t) => console.log(`\x1b[1m${t}\x1b[0m`),
  dim: (t) => console.log(`\x1b[2m${t}\x1b[0m`),
};

// ─── Parse le JSON phpMyAdmin ─────────────────────────────────
function parseJSON(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Fichier introuvable : ${filePath}`);
  }
  const raw = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(raw);

  if (!Array.isArray(data)) {
    throw new Error("Format inattendu — tableau phpMyAdmin attendu.");
  }

  const tables = {};
  for (const entry of data) {
    if (entry?.type === "table" && Array.isArray(entry.data)) {
      tables[entry.name] = entry.data;
    }
  }
  return tables;
}

// ─── Étape 1 : Insertion ──────────────────────────────────────
async function insertData(db, tables) {
  log.bold("\n📦 ÉTAPE 1 — Insertion des données\n");

  for (const tableConfig of config.tables) {
    const { mysqlTable, mongoCollection, transform } = tableConfig;
    const rows = tables[mysqlTable] || [];

    const col = db.collection(mongoCollection);
    await col.deleteMany({}); // repart de zéro à chaque import

    if (rows.length === 0) {
      log.dim(
        `  ⊘  "${mysqlTable}" vide → collection "${mongoCollection}" créée vide.`,
      );
      continue;
    }

    try {
      const docs = rows.map((row) => (transform ? transform(row) : row));
      const result = await col.insertMany(docs, { ordered: false });
      log.success(
        `  ✅ "${mysqlTable}" → "${mongoCollection}" : ${result.insertedCount} documents`,
      );
    } catch (err) {
      log.error(`  ❌ Erreur "${mysqlTable}" : ${err.message}`);
    }
  }
}

// ─── Étape 2 : Relations UUID → ObjectId ─────────────────────
async function resolveRelations(db) {
  log.bold("\n🔗 ÉTAPE 2 — Résolution des relations\n");

  for (const rel of config.relations) {
    const { collection, field, refCollection, refField, targetField } = rel;

    try {
      const col = db.collection(collection);
      const refCol = db.collection(refCollection);

      // Map : UUID → ObjectId MongoDB
      const refs = await refCol
        .find({}, { projection: { _id: 1, [refField]: 1 } })
        .toArray();
      const map = new Map(refs.map((d) => [d[refField], d._id]));

      const docs = await col
        .find({ [field]: { $exists: true, $ne: null } })
        .toArray();
      let resolved = 0,
        missing = 0;

      for (const doc of docs) {
        const newId = map.get(doc[field]);
        if (newId) {
          await col.updateOne(
            { _id: doc._id },
            { $set: { [targetField]: newId }, $unset: { [field]: "" } },
          );
          resolved++;
        } else {
          await col.updateOne({ _id: doc._id }, { $unset: { [field]: "" } });
          missing++;
        }
      }

      log.success(
        `  ✅ "${collection}.${targetField}" → ${resolved} résolues` +
          (missing > 0 ? `  ⚠️  ${missing} UUID introuvables` : ""),
      );
    } catch (err) {
      log.error(
        `  ❌ Erreur relation "${collection}.${field}" : ${err.message}`,
      );
    }
  }
}

// ─── Étape 3 : Nettoyage mysqlUUID ───────────────────────────
async function cleanup(db) {
  log.bold("\n🧹 ÉTAPE 3 — Suppression des champs mysqlUUID\n");

  for (const { mongoCollection } of config.tables) {
    const col = db.collection(mongoCollection);
    const r = await col.updateMany({}, { $unset: { mysqlUUID: "" } });
    if (r.modifiedCount > 0) {
      log.success(
        `  ✅ "${mongoCollection}" nettoyé (${r.modifiedCount} docs)`,
      );
    }
  }
}

// ─── Résumé ───────────────────────────────────────────────────
async function summary(db) {
  log.bold("\n📊 RÉSUMÉ FINAL\n");
  for (const { mongoCollection } of config.tables) {
    const count = await db.collection(mongoCollection).countDocuments();
    const emoji = count > 0 ? "✅" : "⊘ ";
    log.success(
      `  ${emoji}  ${mongoCollection.padEnd(28)} ${count} document${count > 1 ? "s" : ""}`,
    );
  }
}

// ─── Main ─────────────────────────────────────────────────────
async function main() {
  log.bold("\n🚀 IMPORT ETS Housseni → MongoDB Atlas\n");

  if (!config.mongodb.uri) {
    log.error("❌ MONGO_URI manquant dans .env");
    process.exit(1);
  }

  // 1. Lecture du JSON
  log.info(`📂 Lecture de : ${config.jsonFile}`);
  const tables = parseJSON(config.jsonFile);
  const tableNames = Object.keys(tables);
  log.success(
    `✅ ${tableNames.length} tables trouvées : ${tableNames.join(", ")}\n`,
  );

  // 2. Connexion MongoDB
  log.info("🔌 Connexion MongoDB Atlas...");
  await mongoose.connect(config.mongodb.uri);
  const db = mongoose.connection.db;
  log.success("✅ MongoDB connecté.\n");

  try {
    await insertData(db, tables);
    await resolveRelations(db);
    await cleanup(db);
    await summary(db);
    log.bold("\n\x1b[32m🎉 Import terminé avec succès !\x1b[0m\n");
  } finally {
    await mongoose.disconnect();
    log.warn("Connexion fermée.");
  }
}

main().catch((err) => {
  log.error(`\n💥 Erreur fatale : ${err.message}`);
  process.exit(1);
});
