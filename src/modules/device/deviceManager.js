// src/modules/deviceManager.js
const db = require("../database/database");

// yeni cihaz ekle
function addDevice(device) {
    const {name, ip, mac} = device;

    const stmt = `INSERT OR IGNORE INTO devices (name, ip, mac) VALUES(?, ?, ?)`;
    db.run(stmt, [name, ip, mac], function (err){
        if (err){
            console.error("cihaz eklenirken hata:", err.message);
        } else if (this.changes == 0){
            console.log("cihaz zaten mevcut:");
        } else {
            console.log("Yeni cihaz eklendi:", device);
        }
    });
}

// tüm cihazlari listele
function listDevices(){
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM devices", [], (err,rows) => {
            if (err){
                console.error("Listeleme hatasi: ", err.message);
                reject([]);
            } else {
                resolve(rows);
            }
        });
    });
}

// mac adresine gore cihazi sil
function removeDevice(mac) {
    db.run("DELETE FROM devices WHERE mac = ?", [mac], function (err){
        if (err) {
            console.error("cihaz silinirken hata: ", err.message);
        } else {
            console.log("cihaz silindi: ", mac);
        }
    });
}

module.exports = {addDevice, listDevices, removeDevice};