// networkScanner.js (Güncellendi)
const { exec } = require("child_process");

function scanNetwork() {
  return new Promise((resolve, reject) => {
    const platform = process.platform;
    // Platforma göre ARP komutu seç
    const command = platform === 'win32' ? 'arp -a' : 'arp -n';
    
    exec(command, (error, stdout) => {
      if (error) return reject(error);

      const devices = [];
      const ipRegex = /(\d+\.\d+\.\d+\.\d+)/g;
      const macRegex = /((?:[0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2})/g;

      // Satırları işle
      stdout.split('\n').forEach(line => {
        const ipMatch = line.match(ipRegex);
        const macMatch = line.match(macRegex);
        
        if (ipMatch && macMatch) {
          // MAC adresini ":" ile standardize et
          const formattedMac = macMatch[0].replace(/-/g, ':').toUpperCase();
          devices.push({
            ip: ipMatch[0],
            mac: formattedMac,
            name: "Unknown"
          });
        }
      });

      resolve(devices);
    });
  });
}

module.exports = { scanNetwork };