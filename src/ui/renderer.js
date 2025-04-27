// src/ui/renderer.js

/**
 * UYGULAMA BAŞLANGICI
 * DOM yüklendikten sonra tüm event listener'ları kuruyoruz
 */
document.addEventListener("DOMContentLoaded", () => {
    // --- UI ELEMENT TANIMLARI ---
    const sidebar = document.querySelector(".sidebar");
    const toggleButton = document.getElementById("toggleSidebar");
    const content = document.querySelector(".content");
    const computersBtn = document.getElementById("btn-computers");
    const findDeviceBtn = document.getElementById("btn-find-device");
    const searchDeviceBtn = document.getElementById("search-device");

    // --- SIDEBAR TOGGLE İŞLEMLERİ ---
    toggleButton.addEventListener("click", () => {
        sidebar.classList.toggle("show");
        content.style.marginLeft = sidebar.classList.contains("show") ? "250px" : "0";
    });

    // Dışarı tıklanınca sidebar'ı kapat
    document.addEventListener("click", (event) => {
        if (!sidebar.contains(event.target) && !toggleButton.contains(event.target)) {
            sidebar.classList.remove("show");
            content.style.marginLeft = "0";
        }
    });

    // --- SEKMELER ARASI GEÇİŞ ---
    computersBtn.addEventListener("click", () => {
        document.getElementById("computers-section").style.display = "block";
        document.getElementById("find-device-section").style.display = "none";
        loadDevices();
    });

    findDeviceBtn.addEventListener("click", () => {
        document.getElementById("computers-section").style.display = "none";
        document.getElementById("find-device-section").style.display = "block";
    });

    // --- AĞ TARAMA BUTONU ---
    searchDeviceBtn.addEventListener("click", async () => {
        try {
            const scannedDevices = await window.electronAPI.scanNetwork();
            displayScannedDevices(scannedDevices);
        } catch (error) {
            console.error("Ağ tarama hatası:", error);
            showToast("Ağ tarama başarısız!", "error");
        }
    });

    // Sayfa açılışında cihazları yükle
    loadDevices();
});

/**
 * TOAST MESAJ GÖSTERİCİ
 * @param {string} message - Gösterilecek mesaj
 * @param {string} type - Mesaj tipi (success, error, warning, info)
 */
function showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.classList.add("toast");

    const colors = {
        success: "#4caf50",
        error: "#f44336",
        warning: "#ff9800",
        info: "#2196f3"
    };

    toast.style.backgroundColor = colors[type] || colors.info;
    toast.innerText = message;

    document.getElementById("toast-container").appendChild(toast);

    setTimeout(() => toast.remove(), 4000);
}

/**
 * TARANAN CİHAZLARI LİSTELE
 * @param {Array} devices - Taranan cihaz listesi
 */
function displayScannedDevices(devices) {
    const scannedListDiv = document.getElementById("scanned-device-list");
    scannedListDiv.innerHTML = "";

    devices.forEach((device, index) => {
        const deviceName = device.name?.toLowerCase() === "unknown" || !device.name
            ? `Device ${index + 1}`
            : device.name;

        const deviceCard = document.createElement("div");
        deviceCard.classList.add("device-card");

        const nameP = document.createElement("p");
        nameP.innerHTML = `<strong>${deviceName}</strong>`;
        const ipP = document.createElement("p");
        ipP.textContent = `IP: ${device.ip}`;

        const addButton = document.createElement("button");
        addButton.textContent = "Add";
        addButton.addEventListener("click", () => addDevice(deviceName, device.ip, device.mac));

        deviceCard.append(nameP, ipP, addButton);
        scannedListDiv.appendChild(deviceCard);
    });
}

/**
 * YENİ CİHAZ EKLEME
 * @param {string} name - Cihaz adı
 * @param {string} ip - IP adresi
 * @param {string} mac - MAC adresi
 */
async function addDevice(name, ip, mac) {
    try {
        const result = await window.electronAPI.addDevice({ name, ip, mac });
        if (result.success) {
            showToast("Cihaz eklendi", "success");
            await loadDevices();
        } else {
            showToast(result.message || "Cihaz eklenemedi", "warning");
        }
    } catch (error) {
        console.error("Ekleme hatası:", error);
        showToast("Cihaz eklenemedi!", "error");
    }
}

/**
 * CİHAZ LİSTESİNİ YÜKLE
 */
async function loadDevices() {
    try {
        const devices = await window.electronAPI.listDevices();
        const deviceListDiv = document.getElementById("device-list");
        deviceListDiv.innerHTML = "";

        devices.forEach(device => {
            const deviceCard = document.createElement("div");
            deviceCard.classList.add("device-card");

            // Cihaz bilgileri
            const nameP = document.createElement("p");
            nameP.innerHTML = `<strong>${device.name}</strong>`;
            const ipP = document.createElement("p");
            ipP.textContent = `IP: ${device.ip}`;

            // Wake butonu
            const wakeBtn = document.createElement("button");
            wakeBtn.textContent = "Wake";
            wakeBtn.addEventListener("click", () => wakeDevice(device.mac));

            // Remove butonu
            const removeBtn = document.createElement("button");
            removeBtn.textContent = "Remove";
            removeBtn.addEventListener("click", () => removeDevice(device.mac));

            deviceCard.append(nameP, ipP, wakeBtn, shutdownBtn, removeBtn);
            deviceListDiv.appendChild(deviceCard);
        });
    } catch (error) {
        console.error("Cihaz listesi yüklenemedi:", error);
    }
}

/**
 * CİHAZ SİLME
 * @param {string} mac - Silinecek cihazın MAC adresi
 */
async function removeDevice(mac) {
    try {
        const { success } = await window.electronAPI.removeDevice(mac);
        if (success) {
            showToast("Cihaz silindi", "info");
            await loadDevices();
        }
    } catch (error) {
        console.error("Silme hatası:", error);
        showToast("Silme işlemi başarısız!", "error");
    }
}

/**
 * WAKE-ON-LAN İŞLEMİ
 * @param {string} mac - Uyandırılacak cihazın MAC adresi
 */
async function wakeDevice(mac) {
    try {
        const result = await window.electronAPI.wakeDevice(mac);
        showToast(result.success ? "Cihaz uyandırıldı!" : "Uyandırma başarısız!",
            result.success ? "success" : "error");
    } catch (error) {
        console.error("Wake error:", error);
        showToast("Uyandırma hatası!", "error");
    }
}



