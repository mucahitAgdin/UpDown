//src/services/wolService.js:

const wol = require("wake_on_lan");

/**
 * Belirtilen MAC adresine Wake-on-LAN sinyali gönderir.
 * @param {string} macAddress - Uyandırılacak cihazın MAC adresi.
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
function wakeDevice(macAddress) {
    return new Promise((resolve) => {
        wol.wake(macAddress, function (error) {
            if (error) {
                console.error("Wake error:", error);
                resolve({ success: false, error: error.message });
            } else {
                console.log("Wake signal sent to:", macAddress);
                resolve({ success: true });
            }
        });
    });
}

module.exports = {
    wakeDevice,
};
