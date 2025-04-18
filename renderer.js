const { ipcRenderer } = require("electron");

// DOM hazır olunca başlat
document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.querySelector(".sidebar");
    const toggleButton = document.getElementById("toggleSidebar");
    const content = document.querySelector(".content");

    // Sidebar aç/kapa
    toggleButton.addEventListener("click", function () {
        sidebar.classList.toggle("show");
        content.style.marginLeft = sidebar.classList.contains("show") ? "250px" : "0";
    });

    // Sidebar dışına tıklanınca kapat
    document.addEventListener("click", function (event) {
        if (!sidebar.contains(event.target) && !toggleButton.contains(event.target)) {
            sidebar.classList.remove("show");
            content.style.marginLeft = "0";
        }
    });

    // Sekmeler arasında geçiş
    document.getElementById("btn-computers").addEventListener("click", () => {
        document.getElementById("computers-section").style.display = "block";
        document.getElementById("find-device-section").style.display = "none";
        loadDevices(); // Devices sekmesine geçince güncelle
    });

    document.getElementById("btn-find-device").addEventListener("click", () => {
        document.getElementById("computers-section").style.display = "none";
        document.getElementById("find-device-section").style.display = "block";
    });

    // Tarama butonuna tıklanınca ağda cihazları ara
    document.getElementById("search-device").addEventListener("click", async () => {
        const scannedDevices = await ipcRenderer.invoke("scan-network");
        displayScannedDevices(scannedDevices);
    });

    loadDevices(); // Sayfa yüklenince device listesi
});

function displayScannedDevices(devices) {
    const scannedListDiv = document.getElementById("scanned-device-list");
    scannedListDiv.innerHTML = ""; // Önce temizle

    devices.forEach((device, index) => {
        let deviceName = device.name;
        if (!deviceName || deviceName.toLowerCase() === "unknown") {
            deviceName = `Device ${index + 1}`;
        }

        const deviceCard = document.createElement("div");
        deviceCard.classList.add("device-card");
        deviceCard.innerHTML = `
            <p><strong>${deviceName}</strong></p>
            <button onclick="addDevice('${deviceName}', '${device.ip}', '${device.mac}')">Add</button>
        `;
        scannedListDiv.appendChild(deviceCard);
    });
}

function addDevice(name, ip, mac) {
    const device = {
        id: Date.now(), // benzersiz ID
        name,
        ip,
        mac
    };
    ipcRenderer.send("add-device", device);
}

//  Kayıtlı cihazları göster
async function loadDevices() {
    const devices = await ipcRenderer.invoke("get-device-list");

    const deviceListDiv = document.getElementById("device-list");
    deviceListDiv.innerHTML = "";

    devices.forEach(device => {
        const deviceBox = document.createElement("div");
        deviceBox.classList.add("device-card");
        deviceBox.innerHTML = `
            <p><strong>${device.name}</strong></p>
            <button onclick="removeDevice('${device.mac}')">Remove</button>
        `;
        deviceListDiv.appendChild(deviceBox);
    });
}

// Cihazı sil
function removeDevice(mac) {
    ipcRenderer.send("remove-device", mac);
}

// Liste değiştiğinde güncelle
ipcRenderer.on("devices-list", () => {
    loadDevices();
});

// Fonksiyonları window'a atayarak HTML'den çağrılabilir hale getir
window.addDevice = addDevice;
window.removeDevice = removeDevice;
