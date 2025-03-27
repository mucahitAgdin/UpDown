const { exec } = require("child_process");

/**
 * Belirtilen IP adresinin MAC adresini döndürür.
 * @param {string} ip - IP adresi
 * @returns {Promise<string | null>} - MAC adresi veya null
 */
function getMacAddress(ip) {
    return new Promise((resolve) => {
        // Önce ARP tablosunu tamamen al
        exec("arp -a", (error, stdout) => {
            if (error) {
                console.error(` Hata: ${error.message}`);
                resolve(null);
                return;
            }

            // IP adresiyle eşleşen MAC adresini bul
            const regex = new RegExp(`${ip}\\s+([0-9A-Fa-f:-]+)`, "i");
            const match = stdout.match(regex);
            resolve(match ? match[1] : null);
        });
    });
}

module.exports = { getMacAddress };
