const wol = require('wol');

// MAC adresini alıp Wake-on-LAN paketi gönderen fonksiyon
function wakeDevice(macAddress) {
  return new Promise((resolve, reject) => {
    wol.wake(macAddress, (error, response) => {
      if (error) reject(error);
      else resolve(response);
    });
  });
}

module.exports = { wakeDevice }; // Dışa aktar