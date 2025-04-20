const { ipcRenderer } = require("electron");

// DOM hazır olunca başlat
document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.querySelector(".sidebar");
    const toggleButton = document.getElementById("toggleSidebar");
    const content = document.querySelector(".content");

    toggleButton.addEventListener("click", function () {
        sidebar.classList.toggle("show");
        content.style.marginLeft = sidebar.classList.contains("show") ? "250px" : "0";
    });

    document.addEventListener("click", function (event) {
        if (!sidebar.contains(event.target) && !toggleButton.contains(event.target)) {
            sidebar.classList.remove("show");
            content.style.marginLeft = "0";
        }
    });

    document.getElementById("btn-computers").addEventListener("click", () => {
        document.getElementById("computers-section").style.display = "block";
        document.getElementById("find-device-section").style.display = "none";
        loadDevices();
    });

    document.getElementById("btn-find-device").addEventListener("click", () => {
        document.getElementById("computers-section").style.display = "none";
        document.getElementById("find-device-section").style.display = "block";
    });

    document.getElementById("search-device").addEventListener("click", async () => {
        const scannedDevices = await ipcRenderer.invoke("scan-network");
        displayScannedDevices(scannedDevices);
    });

    loadDevices();
});


function showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.classList.add("toast");

    if (type === "success") toast.style.backgroundColor = "#4caf50";
    else if (type === "error") toast.style.backgroundColor = "#f44336";
    else if (type === "warning") toast.style.backgroundColor = "#ff9800";

    toast.innerText = message;

    document.getElementById("toast-container").appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 4000);
}

function displayScannedDevices(devices) {
    const scannedListDiv = document.getElementById("scanned-device-list");
    scannedListDiv.innerHTML = "";

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

async function addDevice(name, ip, mac) {
    const existingDevices = await ipcRenderer.invoke("get-device-list");
    const alreadyExists = existingDevices.some(d => d.mac === mac);

    if (alreadyExists) {
        showToast("Bu cihaz zaten listede var!", "warning");
        return;
    }

    const device = {
        id: Date.now(),
        name,
        ip,
        mac
    };

    ipcRenderer.send("add-device", device);
    showToast("Cihaz başarıyla eklendi!", "success");
}

async function loadDevices() {
    const devices = await ipcRenderer.invoke("get-device-list");
    const deviceListDiv = document.getElementById("device-list");
    deviceListDiv.innerHTML = "";

    devices.forEach(device => {
        const deviceBox = document.createElement("div");
        deviceBox.classList.add("device-card");
        deviceBox.innerHTML = `
            <p><strong>${device.name}</strong></p>
            <button onclick="wakeDevice('${device.mac}')">Wake</button>
            <button onclick="removeDevice('${device.mac}')">Remove</button>
        `;
        deviceListDiv.appendChild(deviceBox);
    });
    
}

function removeDevice(mac) {
    ipcRenderer.send("remove-device", mac);
    showToast("Cihaz silindi", "info");
}

ipcRenderer.on("devices-list", () => {
    loadDevices();
});

async function wakeDevice(mac) {
    try {
        const result = await ipcRenderer.invoke("wake-device", mac);
        if (result.success) {
            showToast("Cihaz uyandırıldı!", "success");
        } else {
            showToast("Uyandırma başarısız!", "error");
        }
    } catch (error) {
        console.error("Wake error:", error);
        showToast("Bir hata oluştu!", "error");
    }
}



window.wakeDevice = wakeDevice; // dışarıdan çağırmak için
window.addDevice = addDevice;
window.removeDevice = removeDevice;
