const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to the SQLite database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

const initializeDb = () => {
  db.serialize(() => {
    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Trips table
    db.run(`
      CREATE TABLE IF NOT EXISTS trips (
        id TEXT PRIMARY KEY,
        ownerId TEXT,
        data TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(ownerId) REFERENCES users(id)
      )
    `);

    // Seed Default Zohair User
    db.get('SELECT * FROM users WHERE email = ?', ['zohair@example.com'], (err, row) => {
      if (!row) {
        db.run(
          `INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)`,
          ['u_default', 'Zohair', 'zohair@example.com', 'password456']
        );
      }
    });

    // Ensure strictly no seed trips default exists
    // (This guarantees a fresh state empty dashboard)
  });
};

initializeDb();

module.exports = db;
