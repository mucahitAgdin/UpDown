const fs = require("fs");
const path = require("path");
const wol = require("wake-on-lan");

// JSON dosyasının yolu 
const filePath = path.join(__dirname, "devices.json");

// JSON dosyasını oku 
function loadDevices() {
  try {
    if (!fs.existsSync(filePath)) {
      return [];
    }

    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data); // `devices` anahtarı gereksizdi
  } catch (error) {
    console.error("Error reading devices.json:", error);
    return [];
  }
}

// JSON dosyasına yaz
function saveDevices(devices) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(devices, null, 4)); // `devices` anahtarı gereksizdi
    console.log("Devices saved successfully.");
  } catch (error) {
    console.error("Error writing devices.json", error);
  }
}

// Yeni cihaz ekleme
function addDevice(ip, mac, name) {
  let devices = loadDevices();

  // Aynı MAC adresine sahip cihaz varsa ekleme
  if (devices.some(device => device.mac === mac)) {
    console.log("Device already exists:", mac);
    return;
  }

  const newDevice = { ip, mac, name };
  devices.push(newDevice);
  saveDevices(devices);
}

// Tüm cihazları listeleme fonksiyonu
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
