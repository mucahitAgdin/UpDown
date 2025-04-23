//src/modules/network/networkScanner.js:

const { exec } = require("child_process");

function scanNetwork() {
    return new Promise((resolve, reject) => {
        exec("arp -a", (error, stdout) => {
            if (error) {
                return reject(error);
            }

            const lines = stdout.split("\n");
            const devices = [];

            for (const line of lines) {
                const match = line.match(/(\d+\.\d+\.\d+\.\d+).*?(([0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2})/i);
                if (match) {
                    devices.push({
                        ip: match[1],
                        mac: match[2],
                        name: "Unknown"
                    });
                }
            }

            resolve(devices);
        });
    });
}

module.exports = { scanNetwork };
