// src/modules/database/database.js

const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

// Uygulama verisi için AppData, macOS, Linux destekli platform bağımsız yol
const appDataPath = path.join(
  process.env.APPDATA ||
    (process.platform === "darwin"
      ? path.join(process.env.HOME, "Library/Application Support")
      : path.join(process.env.HOME, ".config")),
  "WakeShutdown"
);

// Veritabanı dosyasının tam yolu
const dbPath = path.join(appDataPath, "devices.db");

// Gerekirse AppData klasörünü oluştur
if (!fs.existsSync(appDataPath)) {
  fs.mkdirSync(appDataPath, { recursive: true });
}

// Veritabanını oluştur ya da aç
const db = new sqlite3.Database(dbPath);

// Tablo oluştur: Eğer yoksa oluşturulacak
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS devices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      ip TEXT NOT NULL,
      mac TEXT NOT NULL UNIQUE
    );
  `);
});

module.exports = db;
