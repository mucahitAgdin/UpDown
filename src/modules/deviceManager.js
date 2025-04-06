const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "devices.json");

// JSON dosyasını oku 
function loadDevices() {
    try {
        if (!fs.existsSync(filePath)) {
            return [];
        }

        const data = fs.readFileSync(filePath, "utf8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Hata: devices.json okunamadı!", error);
        return [];
    }
}

// JSON dosyasına yaz
function saveDevices(devices) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(devices, null, 4));
        console.log("Cihazlar başarıyla kaydedildi.");
    } catch (error) {
        console.error("Hata: devices.json yazılamadı!", error);
    }
}

// Yeni cihaz ekleme (renderer.js'den gelen tüm nesneyi alacak şekilde güncellendi)
function addDevice(device) {
    const devices = loadDevices();

    const exists = devices.some(d => d.mac === device.mac);
    if (!exists) {
        devices.push(device);
        saveDevices(devices);
    } else {
        console.log("Cihaz zaten kayıtlı!");
    }
}

// Cihazları listeleme fonksiyonu
function listDevices() {
    return loadDevices();
}

// Cihaz silme fonksiyonu
function removeDevice(mac) {
    let devices = loadDevices();
    devices = devices.filter(device => device.mac !== mac);
    saveDevices(devices);
}

module.exports = { addDevice, listDevices, removeDevice };
