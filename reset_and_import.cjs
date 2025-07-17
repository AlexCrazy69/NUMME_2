const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

// Connexion à la base SQLite
const db = new sqlite3.Database('./dico.db', (err) => {
  if (err) {
    console.error("Erreur de connexion à la base de données", err.message);
    return;
  }
  console.log('Connecté à la base de données SQLite.');
});

const resetAndImport = () => {
  db.serialize(() => {
    // 1. Supprimer l'ancienne table
    console.log("Suppression de l'ancienne table 'words'...");
    db.run(`DROP TABLE IF EXISTS words`, (err) => {
      if (err) {
        console.error("Erreur lors de la suppression de la table.", err.message);
        return;
      }
      console.log("Table 'words' supprimée.");

      // 2. Créer la nouvelle table
      console.log("Création de la nouvelle table 'words'...");
      db.run(`CREATE TABLE words (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        numee TEXT,
        french TEXT,
        type TEXT,
        definition TEXT,
        phonetic TEXT,
        variants TEXT,
        examples TEXT,
        literal TEXT,
        homonym TEXT,
        crossReference TEXT
      )`, (err) => {
        if (err) {
          console.error("Erreur lors de la création de la table.", err.message);
          return;
        }
        console.log("Table 'words' créée.");

        // 3. Importer les données depuis le CSV
        console.log("Début de l'importation des données depuis spip_articles.csv...");
        importData();
      });
    });
  });
};

const importData = () => {
  const csvPath = 'spip_articles.csv';
  if (!fs.existsSync(csvPath)) {
    console.error(`Le fichier ${csvPath} n'a pas été trouvé.`);
    db.close();
    return;
  }

  const csv = fs.readFileSync(csvPath, 'utf8');
  const lines = csv.split(/\r?\n/);
  const header = lines[0].split(',');

  // --- DEBUG: Afficher les en-têtes et la première ligne ---
  console.log('--- EN-TÊTES DU CSV ---');
  console.log(header);
  if (lines.length > 1) {
    console.log('--- PREMIÈRE LIGNE DE DONNÉES ---');
    console.log(lines[1].split(','));
  }
  console.log('--------------------------');
  // --- FIN DEBUG ---

  const getCol = (row, colName) => {
    const idx = header.indexOf(colName);
    if (idx === -1) return '';
    return row[idx] ? row[idx].replace(/^"|"$/g, '') : '';
  };

  const stmt = db.prepare(
    `INSERT INTO words (numee, french, type, definition, phonetic, variants, examples, literal, homonym, crossReference)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  let count = 0;
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;

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

    const numee = getCol(row, 'titre').trim().toUpperCase();
    const french = getCol(row, 'input_1');
    const type = getCol(row, 'cgps');
    const definition = getCol(row, 'input_2');
    const phonetic = getCol(row, 'ph');
    const variants = getCol(row, 'va');
    const examples = getCol(row, 'texte');
    const literal = getCol(row, 'lt');
    const homonym = getCol(row, 'hm');
    const crossReference = getCol(row, 're');

    stmt.run(numee, french, type, definition, phonetic, variants, examples, literal, homonym, crossReference, (err) => {
        if(err) {
            console.error("Erreur lors de l'insertion de la ligne : ", numee, err.message);
        }
    });
    count++;
  }

  stmt.finalize((err) => {
    if (err) {
      console.error("Erreur lors de la finalisation de l'insertion.", err.message);
    }
    console.log(`${count} lignes importées avec succès.`);
    db.close((err) => {
      if (err) {
        console.error("Erreur lors de la fermeture de la base de données.", err.message);
      }
      console.log('Importation terminée. La base de données est prête.');
    });
  });
};

resetAndImport();