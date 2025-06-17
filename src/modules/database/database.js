// src/modules/database/database.js

const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

// AppData klasörünü kullan (Windows, Linux, Mac uyumlu)
const appDataPath = path.join(
  process.env.APPDATA || 
  (process.platform === 'darwin' ? path.join(process.env.HOME, 'Library/Application Support') : path.join(process.env.HOME, '.config')),
  "WakeShutdown"
);

// devices.db tam yolu
const dbPath = path.join(appDataPath, "devices.db");

// Klasör yoksa oluştur
if (!fs.existsSync(appDataPath)) {
  fs.mkdirSync(appDataPath, { recursive: true });
}

// Veritabanını oluştur ya da aç
const db = new sqlite3.Database(dbPath);

// Tabloyu oluştur
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS devices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      ip TEXT,
      mac TEXT
    )
  `);
});

module.exports = db;
