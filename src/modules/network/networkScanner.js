// src/modules/network/networkScanner.js

const os = require("os");
const { exec } = require("child_process");
const ping = require("ping");
const { addDevice } = require("../device/deviceManager");

/**
 * Yerel IP adresini al
 */
function getLocalIPPrefix() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === "IPv4" && !iface.internal) {
                const ipParts = iface.address.split(".");
                return `${ipParts[0]}.${ipParts[1]}.${ipParts[2]}`;
            }
        }
    }
    return null;
}

/**
 * Tüm IP'lere ping at, cevap verenleri topla
 */
async function pingSweep(prefix) {
    const promises = [];
    for (let i = 1; i <= 254; i++) {
        const ip = `${prefix}.${i}`;
        promises.push(ping.promise.probe(ip, { timeout: 3 })); // Timeout süresi artırıldı
    }

    const results = await Promise.all(promises);
    return results.filter(res => res.alive).map(res => res.host);
}

/**
 * ARP tablosundan MAC adreslerini oku
 */
function getArpTable() {
    return new Promise((resolve) => {
        exec("arp -a", (error, stdout) => {
            if (error) {
                console.error("ARP tablosu okunamadı:", error.message);
                resolve({});
                return;
            }

            const arpTable = {};
            const lines = stdout.split("\n");
            for (const line of lines) {
                const match = line.match(/(\d+\.\d+\.\d+\.\d+)\s+([0-9a-fA-F:-]+)/);
                if (match) {
                    const ip = match[1];
                    const mac = match[2].replace(/-/g, ":").toUpperCase();
                    arpTable[ip] = mac;
                }
            }

            resolve(arpTable);
        });
    });
}

/**
 * Ana tarama fonksiyonu
 */
async function scanNetwork() {
    const prefix = getLocalIPPrefix();
    if (!prefix) throw new Error("Yerel IP adresi alınamadı");

    console.log(`[+] ${prefix}.0/24 ağı taranıyor...`);
    const [liveIPs, arpTable] = await Promise.all([pingSweep(prefix), getArpTable()]); // Paralel çalıştırdım

    const results = [];

    for (const ip of liveIPs) {
        let mac = arpTable[ip] || "00:00:00:00:00:00";
        const name = "Bilinmeyen";

        // Eğer MAC adresi boşsa, ARP tablosunu tekrar oku
        if (mac === "00:00:00:00:00:00") {
            console.log(`MAC adresi bulunamadı: ${ip}, yeniden kontrol ediliyor...`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // 1 saniye bekle
            const newArpTable = await getArpTable();
            mac = newArpTable[ip] || mac; // Yeniden dene
        }


        results.push({ name, ip, mac });
    }

    console.log(`[✓] ${results.length} cihaz bulundu`);
    return results;
}

module.exports = { scanNetwork };
