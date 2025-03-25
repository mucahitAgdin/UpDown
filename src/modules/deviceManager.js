const { wakeDevice } = require('./wake-on-lan');

// Örnek cihaz listesi (Sonradan dosyadan okunabilir)
const devices = [
  { name: 'DEVICE-1', mac: 'AA:BB:CC:DD:EE:FF' },
  { name: 'DEVICE-2', mac: '11:22:33:44:55:66' },
];

// Tüm cihazları döndür
function getDevices() {
  return devices;
}

// Cihaz adına göre uyandır
async function wakeDeviceByName(name) {
  const device = devices.find(d => d.name === name);
  if (!device) throw new Error('Cihaz bulunamadı!');
  await wakeDevice(device.mac); // wakeOnLAN modülünü kullan
}

module.exports = { getDevices, wakeDeviceByName };