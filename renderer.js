const { ipcRenderer } = require("electron");


document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.querySelector(".sidebar");
    const toggleButton = document.getElementById("toggleSidebar");
    const content = document.querySelector(".content");

    toggleButton.addEventListener("click", function () {
        if (sidebar.classList.contains("show")) {
            sidebar.classList.remove("show");
            content.style.marginLeft = "0"; // Sidebar kapanınca içerik sola kayar
        } else {
            sidebar.classList.add("show");
            content.style.marginLeft = "250px"; // Açılınca içerik sağa kayar
        }
    });

    // Sidebar dışına tıklayınca kapat
    document.addEventListener("click", function (event) {
        if (!sidebar.contains(event.target) && !toggleButton.contains(event.target)) {
            sidebar.classList.remove("show");
            content.style.marginLeft = "0";
        }
    });

    // **Sekme Geçişleri**
    document.getElementById("btn-computers").addEventListener("click", function () {
        document.getElementById("computers-section").style.display = "block";
        document.getElementById("find-device-section").style.display = "none";
    });

    document.getElementById("btn-find-device").addEventListener("click", function () {
        document.getElementById("computers-section").style.display = "none";
        document.getElementById("find-device-section").style.display = "block";
    });
});



// **Cihazları Yükle**
async function loadDevices() {
    const devices = await ipcRenderer.invoke("get-device-list");
    console.log("Cihaz Listesi:", devices);

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

