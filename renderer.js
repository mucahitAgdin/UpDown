const { ipcRenderer } = require("electron");

// **Sekme Geçişleri**
document.getElementById("btn-computers").addEventListener("click", function () {
    document.getElementById("computers-section").style.display = "block";
    document.getElementById("find-device-section").style.display = "none";
});

document.getElementById("btn-find-device").addEventListener("click", function () {
    document.getElementById("computers-section").style.display = "none";
    document.getElementById("find-device-section").style.display = "block";
});

// **Cihazları Yükle**
async function loadDevices() {
    const devices = await ipcRenderer.invoke("get-device-list");
    console.log("📡 Cihaz Listesi:", devices);
    
    const deviceListDiv = document.getElementById("device-list");
    deviceListDiv.innerHTML = ""; // Önce listeyi temizle

    devices.forEach(device => {
        const deviceItem = document.createElement("div");
        deviceItem.classList.add("device-item");
        deviceItem.innerHTML = `
            <p><strong>${device.name}</strong></p>
            <p>IP: ${device.ip}</p>
            <p>MAC: ${device.mac}</p>
            <button onclick="removeDevice('${device.mac}')">Remove</button>
        `;
        deviceListDiv.appendChild(deviceItem);
    });
}

// **Cihaz Silme İşlemi**
function removeDevice(mac) {
    ipcRenderer.send("remove-device", mac);
}

// **Liste Güncellendiğinde Yeniden Yükle**
ipcRenderer.on("devices-list", (event, devices) => {
    loadDevices(); // Yeni listeyi yükle
});

// Sayfa yüklendiğinde cihazları çek
document.addEventListener("DOMContentLoaded", loadDevices);
