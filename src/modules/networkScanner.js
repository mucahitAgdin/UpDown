const ping = require("ping");
const { addDevice } = require("./deviceManager");
const { getMacAddress } = require("./macFinder");

// Alt ağ IP aralığını belirle
const subnet = "192.168.48"; // Kendi ağınıza göre değiştirin
const ipRange = Array.from({ length: 255 }, (_, i) => `${subnet}.${i + 1}`);

async function scanNetwork() {
    console.log(`Ağ taraması başlatıldı: ${subnet}.1 - ${subnet}.255`);

    // Bütün IP'leri aynı anda taramak için Promise.all kullan
    const scanResults = await Promise.all(ipRange.map(async (ip) => {
        const res = await ping.promise.probe(ip, { timeout: 1 }); // Timeout azaltıldı (1 saniye)
        if (res.alive) {
            const mac = await getMacAddress(ip);
            if (mac) {
                console.log(`Cihaz bulundu: IP: ${ip}, MAC: ${mac}`);
                await addDevice(ip); // Cihazı kaydet
            } else {
                console.log(`MAC adresi bulunamadı: IP: ${ip}`);
            }
            return { ip, mac };
        }
        return null;
    }));

    console.log("Tarama tamamlandı!");
}

// Ağ taramasını başlat
scanNetwork();
