const fs = require('fs');
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

// Lecture du CSV
const csv = fs.readFileSync('spip_articles.csv', 'utf8');
const lines = csv.split(/\r?\n/);
const header = lines[0].split(',');

function getCol(row, colName) {
  const idx = header.indexOf(colName);
  if (idx === -1) return '';
  return row[idx] ? row[idx].replace(/^"|"$/g, '') : '';
}

for (let i = 1; i < lines.length; i++) {
  if (!lines[i].trim()) continue;
  // Gestion des champs CSV avec retour à la ligne (concatène jusqu'à la fin du mot)
  let row = [];
  let acc = '';
  let inQuote = false;
  for (const c of lines[i]) {
    if (c === '"') inQuote = !inQuote;
    if (c === ',' && !inQuote) {
      row.push(acc);
      acc = '';
    } else {
      acc += c;
    }
  }
  row.push(acc);

  const numee = getCol(row, 'titre');
  const phonetic = getCol(row, 'ph');
  const variants = getCol(row, 'va');
  const definition = getCol(row, 'input_2');
  const french = getCol(row, 'input_1');
  const type = getCol(row, 'cgps');
  const literal = getCol(row, 'lt');
  const examples = getCol(row, 'texte');

  db.run(
    `INSERT INTO words (numee, french, type, definition, phonetic, variants, examples, literal)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      numee,
      french,
      type,
      definition,
      phonetic,
      variants,
      examples,
      literal,
      homonym,
      crossReference
    ]
  );
}

db.close(() => {
  console.log('Import CSV terminé.');
});