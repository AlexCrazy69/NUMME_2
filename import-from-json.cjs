const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, 'dico.db');
const jsonPath = path.join(__dirname, 'words.json');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Erreur de connexion à la base de données", err.message);
    return;
  }
  console.log('Connecté à la base de données SQLite.');
});

const importFromJson = () => {
  db.serialize(() => {
    console.log("Suppression de l'ancienne table 'words'...");
    db.run(`DROP TABLE IF EXISTS words`, (err) => {
      if (err) {
        console.error("Erreur lors de la suppression de la table.", err.message);
        return;
      }
      console.log("Table 'words' supprimée.");

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

        console.log("Lecture du fichier words.json...");
        fs.readFile(jsonPath, 'utf8', (err, data) => {
          if (err) {
            console.error("Erreur lors de la lecture du fichier JSON.", err.message);
            return;
          }
          
          const words = JSON.parse(data);
          console.log(`${words.length} mots trouvés dans le fichier JSON.`);

          const stmt = db.prepare(
            `INSERT INTO words (numee, french, type, definition, phonetic, variants, examples, literal, homonym, crossReference)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
          );

          let count = 0;
          db.parallelize(() => {
            words.forEach(word => {
              // Note: 'input_2' est utilisé pour 'definition'
              stmt.run(
                word.titre,
                word.input_1,
                word.cgps,
                word.input_2,
                word.ph,
                word.va,
                word.texte,
                word.lt,
                word.hm,
                word.re,
                (err) => {
                  if (err) {
                    console.error("Erreur lors de l'insertion de la ligne : ", word.titre, err.message);
                  } else {
                    count++;
                  }
                }
              );
            });
          });

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
        });
      });
    });
  });
};

importFromJson();
