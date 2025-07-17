const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./old_dico.sqlite');

db.serialize(() => {
  db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
    if (err) {
      console.error("Error fetching tables", err);
      return;
    }
    console.log("Tables found:", tables.map(t => t.name));

    tables.forEach((table) => {
      db.all(`PRAGMA table_info(${table.name})`, (err, columns) => {
        if (err) {
          console.error(`Error fetching columns for table ${table.name}`, err);
          return;
        }
        console.log(`\nColumns for table ${table.name}:`);
        console.log(columns.map(c => `${c.name} (${c.type})`).join(', '));
      });
    });
  });
});

db.close();
