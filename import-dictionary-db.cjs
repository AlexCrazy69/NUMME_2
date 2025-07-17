/**
 * Script Node.js pour extraire tous les mots de la base SQLite (dico.db)
 * et générer un fichier electron-dico/dictionary.json complet.
 *
 * Utilisation :
 *   npx ts-node import-dictionary-db.ts
 */
var fs = require("fs");
var path = require("path");
var sqlite3 = require("sqlite3").verbose();
// Fichier SQLite source
var DB_FILE = path.join(__dirname, "dico.db");
// Fichier de sortie
var OUT_FILE = path.join(__dirname, "electron-dico", "dictionary.json");
var db = new sqlite3.Database(DB_FILE);
db.all("SELECT numee, french, type, definition, phonetic, variants, examples, literal, homonym, crossReference FROM words", function (err, rows) {
    if (err) {
        console.error("Erreur lors de la lecture de la base :", err);
        process.exit(1);
    }
    fs.writeFileSync(OUT_FILE, JSON.stringify(rows, null, 2), "utf8");
    console.log("\u2705 Export DB termin\u00E9 : ".concat(rows.length, " mots \u00E9crits dans ").concat(OUT_FILE));
    db.close();
});
