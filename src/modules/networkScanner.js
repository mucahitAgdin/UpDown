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
                const match = line.match(/\(?(\d+\.\d+\.\d+\.\d+)\)?\s+(([a-fA-F0-9]{2}[-:]){5}[a-fA-F0-9]{2})/);
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
