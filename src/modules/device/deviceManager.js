//src/modules/device/deviceManager.js

const db = require("../database/database");

async function addDevice(device) {
  return new Promise((resolve, reject) => {
    const { name, ip, mac } = device;
    db.run(
      `INSERT OR IGNORE INTO devices (name, ip, mac) VALUES(?, ?, ?)`,
      [name, ip, mac],
      function (err) {
        if (err) return reject(err);
        const success = this.changes > 0;

        // Cihaz logunu burada yazdırıyoruz
        console.log(success
          ? ` Eklendi → Name: ${name}, IP: ${ip}, MAC: ${mac}`
          : ` Zaten ekli → Name: ${name}, IP: ${ip}, MAC: ${mac}`);
        
          resolve({
          success,
          message: success
            ? "Cihaz eklendi"
            : "Cihaz zaten mevcut"
        });
      }
    );
  });
}

async function listDevices() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM devices ORDER BY name ASC", [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

async function removeDevice(mac) {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM devices WHERE mac = ?", [mac], function (err) {
      if (err) return reject(err);
      resolve({ success: true, changes: this.changes });
    });
  });
}

module.exports = { addDevice, listDevices, removeDevice };