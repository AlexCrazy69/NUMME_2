"use strict";
/**
 * Script Node.js pour extraire tous les mots du dossier data/dictionary/*.ts
 * et générer un fichier electron-dico/dictionary.json complet.
 *
 * Utilisation :
 *   npx ts-node import-dictionary.ts
 */
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
// Dossier source des fichiers dictionnaire
var DICT_DIR = path_1.default.join(__dirname, "data", "dictionary");
// Fichier de sortie
var OUT_FILE = path_1.default.join(__dirname, "electron-dico", "dictionary.json");
function getAllDictionaryFiles() {
    return fs_1.default.readdirSync(DICT_DIR)
        .filter(function (f) { return f.endsWith(".ts") && f !== "index.ts"; })
        .map(function (f) { return path_1.default.join(DICT_DIR, f); });
}
function extractWordsFromFile(filePath) {
    var content = fs_1.default.readFileSync(filePath, "utf8");
    // Recherche des objets { numee: "...", french: "...", ... }
    var regex = /{[\s\S]*?numee\s*:\s*["'`](.*?)["'`][\s\S]*?french\s*:\s*["'`](.*?)["'`][\s\S]*?(definition\s*:\s*["'`](.*?)["'`])?[\s\S]*?(phonetic\s*:\s*["'`](.*?)["'`])?[\s\S]*?(variants\s*:\s*["'`](.*?)["'`])?[\s\S]*?}/g;
    var words = [];
    var match;
    while ((match = regex.exec(content))) {
        words.push({
            numee: match[1] || "",
            french: match[2] || "",
            definition: match[4] || "",
            phonetic: match[6] || "",
            variants: match[8] || ""
        });
    }
    return words;
}
function main() {
    var files = getAllDictionaryFiles();
    var allWords = [];
    files.forEach(function (file) {
        var words = extractWordsFromFile(file);
        allWords = allWords.concat(words);
    });
    fs_1.default.writeFileSync(OUT_FILE, JSON.stringify(allWords, null, 2), "utf8");
    console.log("\u2705 Export termin\u00E9 : ".concat(allWords.length, " mots \u00E9crits dans ").concat(OUT_FILE));
}
main();
