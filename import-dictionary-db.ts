/**
 * Script Node.js pour extraire tous les mots de la base SQLite (dico.db)
 * et générer un fichier electron-dico/dictionary.json complet.
 *
 * Utilisation :
 *   npx ts-node import-dictionary-db.ts
 */

const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

// Fichier SQLite source
const DB_FILE = path.join(__dirname, "dico.db");
// Fichier de sortie
const OUT_FILE = path.join(__dirname, "electron-dico", "dictionary.json");

const db = new sqlite3.Database(DB_FILE);

db.all(
  "SELECT numee, french, type, definition, phonetic, variants, examples, literal, homonym, crossReference FROM words",
  (err, rows) => {
    if (err) {
      console.error("Erreur lors de la lecture de la base :", err);
      process.exit(1);
    }
    fs.writeFileSync(OUT_FILE, JSON.stringify(rows, null, 2), "utf8");
    console.log(`✅ Export DB terminé : ${rows.length} mots écrits dans ${OUT_FILE}`);
    db.close();
  }
);