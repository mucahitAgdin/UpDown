// src/modules/deviceManager.js
const db = require("./database");

class DeviceManager {
  // Cihaz ekle (Promise tabanlı)
  async addDevice(device) {
    const { name, ip, mac } = device;
    return new Promise((resolve, reject) => {
      const stmt = `INSERT OR IGNORE INTO devices (name, ip, mac) VALUES (?, ?, ?)`;
      db.run(stmt, [name, ip, mac], function (err) {
        if (err) reject(err);
        else resolve(this.changes > 0); // Değişiklik varsa true
      });
    });
  }

  // Cihazları listele
  async listDevices() {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM devices", [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // Cihaz sil
  async removeDevice(mac) {
    return new Promise((resolve, reject) => {
      db.run("DELETE FROM devices WHERE mac = ?", [mac], function (err) {
        if (err) reject(err);
        else resolve(this.changes > 0);
      });
    });
  }
}

// Singleton örneği dışa aktar
module.exports = new DeviceManager();