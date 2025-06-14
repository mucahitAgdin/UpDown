// src/modules/network/networkScanner.js

const os = require("os");
const ip = require("ip");
const nmap = require("node-nmap");
const { addDevice } = require("../device/deviceManager");

// Nmap yolunu Windows için belirt (gerekirse burayı düzenle)
nmap.nmapLocation = "C:\\Program Files (x86)\\Nmap\\nmap.exe";

function getLocalCIDR() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === "IPv4" && !iface.internal) {
                const subnet = ip.subnet(iface.address, iface.netmask);
                return `${subnet.networkAddress}/${subnet.subnetMaskLength}`;
            }
        }
    }
    return null;
}

function scanNetwork() {
    return new Promise((resolve, reject) => {
        const cidr = getLocalCIDR();
        if (!cidr) return reject(new Error("Ağ aralığı bulunamadı."));

        const scan = new nmap.NmapScan(cidr, "-sn");

        scan.on("complete", async (hosts) => {
            const results = [];

            for (const host of hosts) {
                const ip = host.ip;
                const mac = host.mac || "00:00:00:00:00:00";
                const name = host.hostname || "Unknown";

                // Veritabanına ekle (aynı MAC tekrar eklenmez)
                await addDevice({ name, ip, mac });

                results.push({ name, ip, mac });
            }

            resolve(results);
        });

        scan.on("error", (err) => {
            reject(err);
        });

        scan.startScan();
    });
}

module.exports = { scanNetwork };
