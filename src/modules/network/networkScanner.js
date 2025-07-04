const os = require("os");
const { exec } = require("child_process");
const ping = require("ping");

/**
 * Yerel IP prefix'ini döndür (örnek: 192.168.1)
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
 * IP adresine ping at ve aktif cihazları topla
 */
async function pingSweep(prefix) {
    const promises = [];
    for (let i = 1; i <= 254; i++) {
        const ip = `${prefix}.${i}`;
        promises.push(ping.promise.probe(ip, { timeout: 3 }));
    }

    const results = await Promise.all(promises);
    return results.filter(res => res.alive).map(res => res.host);
}

/**
 * ARP tablosunu oku ve IP → MAC eşleştirmelerini al
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
 * IP üzerinden hostname (bilgisayar adı) alma – NetBIOS (Windows)
 * @param {string} ip 
 * @returns {Promise<string|null>}
 */
function getHostName(ip) {
    return new Promise((resolve) => {
        exec(`nbtstat -A ${ip}`, (error, stdout) => {
            if (error) {
                resolve(null);
                return;
            }

            // <00> UNIQUE olan satır genellikle bilgisayar adıdır
            const match = stdout.match(/(\S+)\s+<00>\s+UNIQUE/i);
            resolve(match ? match[1].trim() : null);
        });
    });
}

/**
 * Ağ taraması yap ve aktif cihazları MAC, IP, hostname ile birlikte döndür
 */
async function scanNetwork() {
    const prefix = getLocalIPPrefix();
    if (!prefix) throw new Error("Yerel IP adresi alınamadı");

    console.log(`[+] ${prefix}.0/24 ağı taranıyor...`);

    const [liveIPs, arpTable] = await Promise.all([
        pingSweep(prefix),
        getArpTable()
    ]);

    const results = [];

    for (const ip of liveIPs) {
        let mac = arpTable[ip] || "00:00:00:00:00:00";
        
        // MAC adresi bulunamazsa yeniden ARP denemesi yap
        if (mac === "00:00:00:00:00:00") {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const refreshedArp = await getArpTable();
            mac = refreshedArp[ip] || mac;
        }

        // HOSTNAME çekmeye çalış
        let name = await getHostName(ip);
        name = name || "Bilinmeyen";

        results.push({ name, ip, mac });
        //console.log(`[+] ${ip} - Hostname: ${name}, MAC: ${mac}`);
    }

    console.log(`[✓] ${results.length} cihaz bulundu`);
    return results;
}

module.exports = { scanNetwork };
