// src/modules/database/database.js:

const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// veritabani dosyasini olusturur veya acar
const dbPath = path.join(__dirname, "devices.db");
const db = new sqlite3.Database(dbPath);

// tabloyu olustur
db.serialize(() => {
    db.run(`
       CREATE TABLE IF NOT EXISTS devices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            ip TEXT,
            mac TEXT UNIQUE
       )`);
});

module.exports = db;
