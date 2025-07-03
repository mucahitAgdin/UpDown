const wol = require("wake_on_lan");
const os = require("os");

const macAddress = "8C:C6:81:F6:C9:76"; // Hedef cihazın MAC adresini buraya yaz
const portsToTry = [9, 7];

/**
 * Broadcast adresini otomatik hesaplar (örneğin: 192.168.1.255)
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
    return "255.255.255.255";
}

async function sendWol() {
    const broadcast = getBroadcastAddress();

    for (const port of portsToTry) {
        try {
            await new Promise((resolve, reject) => {
                wol.wake(macAddress, { address: broadcast, port }, (err) => {
                    if (err) {
                        console.warn(`[WARN] Port ${port} başarısız: ${err.message}`);
                        reject(err);
                    } else {
                        console.log(`[OK] WOL paketi gönderildi! (MAC: ${macAddress}, Port: ${port}, Broadcast: ${broadcast})`);
                        resolve();
                    }
                });
            });
            return;
        } catch (_) {
            continue;
        }
    }

    console.error("[X] Hiçbir port üzerinden Wake-on-LAN paketi gönderilemedi.");
}

sendWol();
