const fs = require("fs");
const path = require("path");
const { getMacAddress } = require("./macFinder"); // Yeni eklenen MAC bulma fonksiyonu

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

// Yeni cihaz ekleme
async function addDevice(ip) {
    let devices = loadDevices();

    // Eğer cihaz zaten kayıtlıysa ekleme
    if (devices.some(device => device.ip === ip)) {
        console.log(`Cihaz zaten kayıtlı: ${ip}`);
        return;
    }

    // MAC adresini al
    const mac = await getMacAddress(ip);
    if (!mac) {
        console.log(`MAC adresi bulunamadı: ${ip}, listeye eklenmedi.`);
        return;
    }

    const newDevice = { id: devices.length + 1, ip, mac };
    devices.push(newDevice);
    saveDevices(devices);
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
