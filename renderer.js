const { ipcRenderer } = require("electron");

document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.querySelector(".sidebar");
    const toggleButton = document.getElementById("toggleSidebar");
    const content = document.querySelector(".content");

    // Sidebar aç/kapa
    toggleButton.addEventListener("click", function () {
        if (sidebar.classList.contains("show")) {
            sidebar.classList.remove("show");
            content.style.marginLeft = "0";
        } else {
            sidebar.classList.add("show");
            content.style.marginLeft = "250px";
        }
    });

    // Sidebar dışına tıklanınca kapat
    document.addEventListener("click", function (event) {
        if (!sidebar.contains(event.target) && !toggleButton.contains(event.target)) {
            sidebar.classList.remove("show");
            content.style.marginLeft = "0";
        }
    });

    // Sekmeler arası geçişler
    document.getElementById("btn-computers").addEventListener("click", function () {
        document.getElementById("computers-section").style.display = "block";
        document.getElementById("find-device-section").style.display = "none";
    });

    document.getElementById("btn-find-device").addEventListener("click", function () {
        document.getElementById("computers-section").style.display = "none";
        document.getElementById("find-device-section").style.display = "block";
    });

    // Sayfa yüklendiğinde cihazları getir
    loadDevices();
});

// 📥 IPC ile cihaz listesini çek ve ekrana bas
async function loadDevices() {
    const devices = await ipcRenderer.invoke("get-device-list");
    const deviceListDiv = document.getElementById("device-list");
    deviceListDiv.innerHTML = "";

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

// Cihaz sil butonu işlevi
function removeDevice(mac) {
    ipcRenderer.send("remove-device", mac);
}

// Liste güncellenince tekrar yükle
ipcRenderer.on("devices-list", () => {
    loadDevices();
});

// 🔍 Search Device butonu işlevi — tarama başlat
document.getElementById("search-device").addEventListener("click", async function () {
    const button = this;
    button.textContent = "Searching...";
    button.disabled = true;

    try {
        const results = await ipcRenderer.invoke("scan-network");

        const deviceListDiv = document.getElementById("device-list");
        deviceListDiv.innerHTML = "";

        if (results.length === 0) {
            deviceListDiv.innerHTML = "<p>No devices found.</p>";
        } else {
            results.forEach(device => {
                const item = document.createElement("div");
                item.classList.add("device-item");
                item.innerHTML = `
                    <p><strong>${device.name}</strong></p>
                    <p>IP: ${device.ip}</p>
                    <p>MAC: ${device.mac}</p>
                `;
                deviceListDiv.appendChild(item);
            });
        }
    } catch (error) {
        console.error("Tarama hatası:", error);
    } finally {
        button.textContent = "Search Device";
        button.disabled = false;
    }
});
