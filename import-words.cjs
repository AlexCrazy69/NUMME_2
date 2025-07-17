const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Connexion à la base SQLite
const db = new sqlite3.Database('./dico.db');

// Création de la table words si besoin
db.run(`CREATE TABLE IF NOT EXISTS words (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  numee TEXT,
  french TEXT,
  type TEXT,
  definition TEXT,
  phonetic TEXT,
  variants TEXT,
  examples TEXT
)`);

// Récupérer tous les fichiers .ts du dossier data/dictionary, sauf index.ts
const dictDir = path.join(__dirname, 'data', 'dictionary');
const files = fs.readdirSync(dictDir).filter(f => f.endsWith('.ts') && f !== 'index.ts');

function extractObjects(text) {
  // Supprimer les lignes d'import/export et les commentaires
  text = text
    .replace(/^import.*$/gm, '')
    .replace(/^export.*$/gm, '')
    .replace(/\/\/.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//gm, '');
  // Extraire tous les objets du tableau principal
  const objects = [];
  let depth = 0, obj = '', inObj = false;
  for (const line of text.split('\n')) {
    if (line.includes('{')) {
      depth++;
      inObj = true;
    }
    if (inObj) obj += line + '\n';
    if (line.includes('}')) {
      depth--;
      if (depth === 0 && inObj) {
        objects.push(obj);
        obj = '';
        inObj = false;
      }
    }
  }
  return objects;
}

for (const file of files) {
  const filePath = path.join(dictDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const objects = extractObjects(content);
  for (const objText of objects) {
    // Nettoyage pour JSON
    let jsonText = objText
      .replace(/([a-zA-Z0-9_\-\(\)]+):/g, '"$1":')
      .replace(/'/g, '"')
      .replace(/,(\s*[}\]])/g, '$1');
    let entry;
    try {
      entry = JSON.parse(jsonText);
    } catch (e) {
      console.error('Erreur de parsing objet dans', file, e.message);
      continue;
    }
    db.run(
      `INSERT INTO words (numee, french, type, definition, phonetic, variants, examples)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        entry.numee || '',
        entry.french || '',
        entry.type || '',
        entry.definition || '',
        entry.phonetic || '',
        entry.variants || '',
        JSON.stringify(entry.examples || [])
      ]
    );
  }
}

db.close(() => {
  console.log('Import terminé.');
});