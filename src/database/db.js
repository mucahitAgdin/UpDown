const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Veritabanı dosyasını oluştur
const dbPath = path.join(__dirname, 'devices.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) return console.error('Database error:', err.message);
  console.log('Veritabanı başarıyla bağlandı.');
});

// Tabloyu oluştur (varsa geç)
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS devices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      ip TEXT NOT NULL,
      mac TEXT NOT NULL UNIQUE
    )
  `);
});

// Cihazları getir
function getDevices(callback) {
  db.all("SELECT * FROM devices", [], (err, rows) => {
    if (err) {
      console.error(err);
      callback([]);
    } else {
      callback(rows);
    }
  });
}

// Cihaz ekle
function addDevice(device, callback) {
  const { name, ip, mac } = device;
  db.run("INSERT INTO devices (name, ip, mac) VALUES (?, ?, ?)",
    [name, ip, mac],
    function (err) {
      if (err) {
        console.error("Ekleme hatası:", err.message);
        callback(false);
      } else {
        callback(true);
      }
    });
}

// Cihaz sil
function removeDevice(mac, callback) {
  db.run("DELETE FROM devices WHERE mac = ?", [mac], function (err) {
    if (err) {
      console.error("Silme hatası:", err.message);
      callback(false);
    } else {
      callback(true);
    }
  });
}

module.exports = {
  getDevices,
  addDevice,
  removeDevice
};
