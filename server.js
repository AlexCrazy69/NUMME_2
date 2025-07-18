import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import fs from 'fs';
import bcrypt from 'bcryptjs';

const app = express();
const port = 3001;

// --- Logger robuste ---
const logStream = fs.createWriteStream('server_requests.log', { flags: 'a' });
const log = (message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  logStream.write(logMessage + '\n');
  console.log(logMessage);
};

// Middleware
app.use(cors());
app.use(express.json());

// Content Security Policy (CSP) Configuration
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self';"
    + "script-src 'self' 'unsafe-inline';"
    + "style-src 'self' 'unsafe-inline';"
    + "img-src 'self' data:;"
    + "connect-src 'self' http://localhost:3001;"
    + "font-src 'self';"
    + "object-src 'none';"
    + "media-src 'self';"
    + "frame-src 'none';"
  );
  next();
});

// Database connection
const db = new sqlite3.Database(process.env.DATABASE_PATH || './dico.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    log(`Error opening database 'dico.db': ${err.message}`);
  } else {
    log('Connected to the SQLite database.');
  }
});

// ==================== CREATE TABLES ====================

// Table pour le défi du jour
db.run(`CREATE TABLE IF NOT EXISTS daily_challenge (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  word TEXT,
  definition TEXT,
  date TEXT,
  type TEXT,
  solution TEXT
)`);

// Table pour les propositions collaboratives
db.run(`CREATE TABLE IF NOT EXISTS propositions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  mot TEXT,
  definition TEXT,
  exemple TEXT,
  auteur TEXT,
  statut TEXT DEFAULT 'en attente'
)`);

// Table pour les quiz communautaires
db.run(`CREATE TABLE IF NOT EXISTS community_quiz (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  questions TEXT, -- JSON.stringify
  author TEXT,
  statut TEXT DEFAULT 'en attente'
)`);

// Table for words (dico)
db.run(`CREATE TABLE IF NOT EXISTS words (
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
)`);

// Table pour les utilisateurs
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user'
)`, (err) => {
  if (err) {
    log(`Error creating users table: ${err.message}`);
  } else {
    console.log('Users table created or already exists. Checking for default users...');

    const usersToEnsure = [
      { username: 'admin', password: 'admin123', role: 'admin' },
      { username: 'user', password: 'password', role: 'user' }
    ];

    usersToEnsure.forEach(user => {
      bcrypt.hash(user.password, 10, (err, hash) => {
        if (err) {
          return console.error(`Error hashing password for ${user.username}:`, err);
        }

        db.get('SELECT id FROM users WHERE username = ?', [user.username], (err, row) => {
          if (err) {
            return console.error(`Error checking for user ${user.username}:`, err.message);
          }

          if (row) {
            // User exists, update password hash to ensure it's correct
            db.run('UPDATE users SET password = ? WHERE username = ?', [hash, user.username], function(err) {
              if (err) {
                return console.error(`Error updating user ${user.username}:`, err.message);
              }
              // console.log(`${user.username} user password checked and updated.`);
            });
          } else {
            // User does not exist, insert it
            db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [user.username, hash, user.role], function(err) {
              if (err) {
                return console.error(`Error creating user ${user.username}:`, err.message);
              }
              console.log(`${user.username} user created.`);
            });
          }
        });
      });
    });
  }
});

// ==================== API ROUTES ====================

// Route de connexion
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  log(`Login attempt for username: ${username}`);

  if (!username || !password) {
    log('Missing username or password in login attempt.');
    return res.status(400).json({ error: 'Nom d\'utilisateur et mot de passe requis.' });
  }

  const query = 'SELECT * FROM users WHERE username = ?';
  db.get(query, [username], (err, user) => {
    if (err) {
      log(`Database error on POST /api/login: ${err.message}`);
      return res.status(500).json({ error: 'Erreur interne du serveur.' });
    }

    if (!user) {
      log(`User not found: ${username}`);
      return res.status(401).json({ error: 'Nom d\'utilisateur ou mot de passe incorrect.' });
    }

    log(`User found: ${user.username}, comparing password...`);
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        log(`Bcrypt error on POST /api/login: ${err.message}`);
        return res.status(500).json({ error: 'Erreur lors de la vérification du mot de passe.' });
      }

      if (isMatch) {
        log(`Password match for user: ${username}`);
        const { password, ...userData } = user;
        res.json({ message: 'Connexion réussie.', user: userData });
      } else {
        log(`Password mismatch for user: ${username}`);
        res.status(401).json({ error: 'Nom d\'utilisateur ou mot de passe incorrect.' });
      }
    });
  });
});

// Route pour récupérer les mots avec filtres, recherche et pagination
app.get('/api/words', (req, res) => {

  log(`Request received: ${req.method} ${req.url}`);
  log(`Query params: ${JSON.stringify(req.query)}`);
  try {
    const { letter, search, page: pageStr, limit: limitStr } = req.query;
    const page = parseInt(pageStr) || 1;
    const limit = parseInt(limitStr) || 20;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM words';
    let params = [];
    let conditions = [];

    if (search) {
      conditions.push(`(numee LIKE ? OR french LIKE ? OR definition LIKE ? OR variants LIKE ? OR examples LIKE ?)`);
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
    } else if (letter) {
      conditions.push(`numee LIKE ?`);
      params.push(`${letter}%`);
    } else {
      // Si aucun filtre, ne rien renvoyer pour éviter de charger toute la base
      return res.json([]);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ` ORDER BY numee COLLATE NOCASE ASC LIMIT ? OFFSET ?`;
    params.push(limit, offset);
    
    log(`Executing query: ${query}`);
    log(`With params: ${JSON.stringify(params)}`);

    db.all(query, params, (err, rows) => {
      if (err) {
        log(`Database error: ${err.message}`);
        return res.status(500).json({ error: 'Erreur interne du serveur' });
      }
      res.json(rows);
    });
  } catch (err) {
    log(`Request processing error: ${err}`);
    res.status(500).json({ error: 'Paramètres invalides' });
  }
});

// ==================== CRUD Dictionnaire ====================

// CREATE a new word
app.post('/api/words', (req, res) => {
  const { numee, french, type, definition, phonetic, variants, examples, literal, homonym, crossReference } = req.body;
  
  if (!numee || !french || !type) {
    return res.status(400).json({ error: 'Les champs "numee", "french" et "type" sont requis.' });
  }

  const query = `INSERT INTO words (numee, french, type, definition, phonetic, variants, examples, literal, homonym, crossReference)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
  const params = [numee, french, type, definition, phonetic, variants, examples, literal, homonym, crossReference];

  db.run(query, params, function(err) {
    if (err) {
      log(`Database error on POST /api/words: ${err.message}`);
      return res.status(500).json({ error: 'Erreur lors de la création du mot.' });
    }
    res.status(201).json({ id: this.lastID, ...req.body });
  });
});

// UPDATE a word
app.put('/api/words/:id', (req, res) => {
  const { id } = req.params;
  const { numee, french, type, definition, phonetic, variants, examples, literal, homonym, crossReference } = req.body;

  if (!numee || !french || !type) {
    return res.status(400).json({ error: 'Les champs "numee", "french" et "type" sont requis.' });
  }

  const query = `UPDATE words SET 
                   numee = ?, french = ?, type = ?, definition = ?, phonetic = ?, 
                   variants = ?, examples = ?, literal = ?, homonym = ?, crossReference = ?
                 WHERE id = ?`;
  
  const params = [numee, french, type, definition, phonetic, variants, examples, literal, homonym, crossReference, id];

  db.run(query, params, function(err) {
    if (err) {
      log(`Database error on PUT /api/words/${id}: ${err.message}`);
      return res.status(500).json({ error: 'Erreur lors de la mise à jour du mot.' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Mot non trouvé.' });
    }
    res.json({ id: Number(id), ...req.body });
  });
});

// DELETE a word
app.delete('/api/words/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM words WHERE id = ?', id, function(err) {
    if (err) {
      log(`Database error on DELETE /api/words/${id}: ${err.message}`);
      return res.status(500).json({ error: 'Erreur lors de la suppression du mot.' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Mot non trouvé.' });
    }
    res.status(204).send(); // No Content
  });
});


// Défi du jour (GET)
app.get('/api/daily-challenge', (req, res) => {
  db.get(
    `SELECT * FROM daily_challenge WHERE date = date('now', 'localtime') LIMIT 1`,
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: "Aucun défi du jour." });
      res.json(row);
    }
  );
});

// Soumission au défi du jour (POST)
app.post('/api/daily-challenge/submit', (req, res) => {
  const { challengeId, answer } = req.body;
  db.get(`SELECT * FROM daily_challenge WHERE id=?`, [challengeId], (err, row) => {
    if (err || !row) return res.status(400).json({ feedback: "Défi non trouvé." });
    if (row.type === 'deviner') {
      if (answer.trim().toLowerCase() === row.word.trim().toLowerCase()) {
        res.json({ feedback: "Bravo, bonne réponse !" });
      } else {
        res.json({ feedback: "Ce n'est pas le bon mot, réessaie !" });
      }
    } else {
      if (answer.toLowerCase().includes(row.word.toLowerCase())) {
        res.json({ feedback: "Bien joué, tu as utilisé le mot !" });
      } else {
        res.json({ feedback: "Essaie d'utiliser le mot dans ta phrase." });
      }
    }
  });
});

// Propositions collaboratives (POST)
app.post('/api/propositions', (req, res) => {
  const { mot, definition, exemple, auteur } = req.body;
  db.run(
    `INSERT INTO propositions (mot, definition, exemple, auteur) VALUES (?, ?, ?, ?) `,
    [mot, definition, exemple, auteur || 'Anonyme'],
    function (err) {
      if (err) return res.status(500).json({ message: "Erreur lors de la proposition." });
      res.json({ message: "Proposition envoyée, merci !" });
    }
  );
});

// Propositions collaboratives (GET pour modération)
app.get('/api/propositions', (req, res) => {
  db.all(`SELECT * FROM propositions WHERE statut='en attente'`, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Validation/refus d'une proposition (PUT)
app.put('/api/propositions/:id', (req, res) => {
  const { statut } = req.body;
  db.run(
    `UPDATE propositions SET statut=? WHERE id=?`,
    [statut, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});

// Quiz communautaire (POST)
app.post('/api/community-quiz', (req, res) => {
  const { title, questions, author } = req.body;
  db.run(
    `INSERT INTO community_quiz (title, questions, author) VALUES (?, ?, ?) `,
    [title, JSON.stringify(questions), author || 'Anonyme'],
    function (err) {
      if (err) return res.status(500).json({ message: "Erreur lors de la création du quiz." });
      res.json({ message: "Quiz partagé !" });
    }
  );
});

// Quiz communautaire (GET)
app.get('/api/community-quiz', (req, res) => {
  db.all(`SELECT * FROM community_quiz WHERE statut='en attente' OR statut='validé'`, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows.map(q => ({ ...q, questions: JSON.parse(q.questions) })));
  });
});

// Validation/refus d'un quiz (PUT)
app.put('/api/community-quiz/:id', (req, res) => {
  const { statut } = req.body;
  db.run(
    `UPDATE community_quiz SET statut=? WHERE id=?`,
    [statut, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});


// Start server
app.listen(port, () => {
  log(`Server is running on https://numme2-d1sd8.sevalla.app:${port}`);
});
