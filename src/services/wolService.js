const wol = require("wake_on_lan");
const os = require("os");

const portsToTry = [9, 7];

/**
 * Dinamik olarak broadcast adresini alır (örneğin: 192.168.1.255)
 */
function getBroadcastAddress() {
    const interfaces = os.networkInterfaces();
    for (const name in interfaces) {
        for (const iface of interfaces[name]) {
            if (iface.family === "IPv4" && !iface.internal) {
                const ipParts = iface.address.split(".");
                ipParts[3] = "255";
                return ipParts.join(".");
            }
        }
    }
    return "255.255.255.255"; // fallback
}

/**
 * Belirtilen MAC adresine Wake-on-LAN paketi gönderir
 * @param {string} macAddress - Uyanacak cihazın MAC adresi
 * @returns {Promise<{ success: boolean, port?: number, error?: string }>}
 */
async function wakeDevice(macAddress) {
    const broadcast = getBroadcastAddress();

    for (const port of portsToTry) {
        try {
            await new Promise((resolve, reject) => {
                wol.wake(macAddress, { address: broadcast, port }, function (error) {
                    if (error) {
                        console.warn(`[WARN] Port ${port} başarısız: ${error.message}`);
                        reject(error);
                    } else {
                        console.log(`[OK] Wake sinyali gönderildi ${macAddress} için (Port: ${port}, Broadcast: ${broadcast})`);
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
