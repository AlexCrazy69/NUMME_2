var sqlite3 = require('sqlite3').verbose();
// Connexion à la base de données
var db = new sqlite3.Database('./dico.db');
// Suppression de la table si elle existe déjà
db.run('DROP TABLE IF EXISTS users', function (err) {
    if (err) {
        console.error('Erreur lors de la suppression de la table:', err.message);
        return;
    }
    console.log('Table users supprimée (s\'il existait).');
    // Création de la nouvelle table
    db.run("\n    CREATE TABLE users (\n      id INTEGER PRIMARY KEY AUTOINCREMENT,\n      username TEXT NOT NULL UNIQUE,\n      email TEXT NOT NULL UNIQUE,\n      role TEXT NOT NULL DEFAULT 'Utilisateur',\n      password TEXT NOT NULL,\n      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP\n    )\n  ", function (err) {
        if (err) {
            console.error('Erreur lors de la création de la table:', err.message);
            db.close();
            return;
        }
        console.log('Table users créée avec succès.');
        // Insertion des données mock
        var mockUsers = [
            {
                username: 'admin',
                email: 'admin@example.com',
                password: 'admin123',
                role: 'Admin'
            },
            {
                username: 'user1',
                email: 'user1@example.com',
                password: 'user123',
                role: 'Utilisateur'
            }
        ];
        var insertQuery = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
        mockUsers.forEach(function (user, index) {
            db.run(insertQuery, [user.username, user.email, user.password, user.role], function (err) {
                if (err) {
                    console.error("Erreur lors de l'insertion de l'utilisateur ".concat(index + 1, ":"), err.message);
                    return;
                }
                console.log("Utilisateur ".concat(user.username, " ins\u00E9r\u00E9 avec succ\u00E8s."));
            });
        });
        db.close(function () {
            console.log('Connexion à la base de données fermée.');
        });
    });
});
console.log('Script d\'initialisation de la base de données en cours...');
