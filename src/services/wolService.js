//src/services/wolService.js:

const wol = require("wake_on_lan");

const portsToTry = [9, 7]; // istersen daha fazlasını ekleyebilirsin

async function wakeDevice(macAddress, broadcast = "192.168.31.255") {
    for (const port of portsToTry) {
        try {
            await new Promise((resolve, reject) => {
                wol.wake(macAddress, { address: broadcast, port }, function (error) {
                    if (error) {
                        console.warn(`[WARN] Port ${port} başarısız: ${error.message}`);
                        reject(error);
                    } else {
                        console.log(`[OK] Wake sinyali gönderildi ${macAddress} için (Port: ${port})`);
                        resolve();
                    }
                });
            });
            return { success: true, port };
        } catch (_) {
            continue; // sıradaki porta geç
        }
    }
    return { success: false, error: "Hiçbir port üzerinden sinyal gönderilemedi." };
}


module.exports = {
    wakeDevice,
};
