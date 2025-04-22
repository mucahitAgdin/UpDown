const { ipcRenderer } = require("electron");

document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.querySelector(".sidebar");
    const toggleButton = document.getElementById("toggleSidebar");
    const content = document.querySelector(".content");

    const computersBtn = document.getElementById("btn-computers");
    const findDeviceBtn = document.getElementById("btn-find-device");

    const searchDeviceBtn = document.getElementById("search-device");

    // Sidebar toggle
    toggleButton.addEventListener("click", () => {
        sidebar.classList.toggle("show");
        content.style.marginLeft = sidebar.classList.contains("show") ? "250px" : "0";
    });

    // Dışarı tıklanınca sidebar kapansın
    document.addEventListener("click", (event) => {
        if (!sidebar.contains(event.target) && !toggleButton.contains(event.target)) {
            sidebar.classList.remove("show");
            content.style.marginLeft = "0";
        }
    });

    // Cihazlar sekmesi
    computersBtn.addEventListener("click", () => {
        document.getElementById("computers-section").style.display = "block";
        document.getElementById("find-device-section").style.display = "none";
        loadDevices();
    });

    // Cihaz bul sekmesi
    findDeviceBtn.addEventListener("click", () => {
        document.getElementById("computers-section").style.display = "none";
        document.getElementById("find-device-section").style.display = "block";
    });

    // Ağ tarama
    searchDeviceBtn.addEventListener("click", async () => {
        const scannedDevices = await ipcRenderer.invoke("scan-network");
        displayScannedDevices(scannedDevices);
    });

    // Sayfa yüklenince cihazları getir
    loadDevices();
});

/**
 * Toast mesajı
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
 * Taranan cihazları göster
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
 * Yeni cihaz ekle
 */
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
    loadDevices();
}

/**
 * Cihazları yükle
 */
async function loadDevices() {
    const devices = await ipcRenderer.invoke("get-device-list");
    const deviceListDiv = document.getElementById("device-list");
    deviceListDiv.innerHTML = "";

    devices.forEach(device => {
        const deviceCard = document.createElement("div");
        deviceCard.classList.add("device-card");

        const nameP = document.createElement("p");
        nameP.innerHTML = `<strong>${device.name}</strong>`;
        const ipP = document.createElement("p");
        ipP.textContent = `IP: ${device.ip}`;

        const wakeBtn = document.createElement("button");
        wakeBtn.textContent = "Wake";
        wakeBtn.addEventListener("click", () => wakeDevice(device.mac));

        const shutdownBtn = document.createElement("button");
        shutdownBtn.textContent = "Shutdown";
        shutdownBtn.addEventListener("click", () => openSshModal(device.ip));

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.addEventListener("click", () => removeDevice(device.mac));

        deviceCard.append(nameP, ipP, wakeBtn, shutdownBtn, removeBtn);
        deviceListDiv.appendChild(deviceCard);
    });
}

/**
 * Cihaz sil
 */
function removeDevice(mac) {
    ipcRenderer.send("remove-device", mac);
    showToast("Cihaz silindi", "info");
    loadDevices();
}

/**
 * Wake-on-LAN gönder
 */
async function wakeDevice(mac) {
    try {
        const result = await ipcRenderer.invoke("wake-device", mac);
        showToast(result.success ? "Cihaz uyandırıldı!" : "Uyandırma başarısız!", result.success ? "success" : "error");
    } catch (error) {
        console.error("Wake error:", error);
        showToast("Bir hata oluştu!", "error");
    }
}

// SSH modal işlemleri
let selectedDeviceIp = "";

function openSshModal(ip) {
    selectedDeviceIp = ip;
    document.getElementById("ssh-modal").style.display = "block";
}

function closeSshModal() {
    document.getElementById("ssh-modal").style.display = "none";
}

function confirmShutdown() {
    const username = document.getElementById('ssh-username').value;
    const password = document.getElementById('ssh-password').value;
    const osType = document.getElementById('ssh-os').value;

    if (!selectedDeviceIp || !username || !password || !osType) {
        alert("Lütfen tüm alanları doldurun!");
        return;
    }

    window.electronAPI.shutdownDevice({
        ip: selectedDeviceIp,
        username,
        password,
        osType
    }).then(result => {
        alert(result);
    });

    closeSshModal();
}

// Dışarıdan erişim gerekirse
window.confirmShutdown = confirmShutdown;
window.closeSshModal = closeSshModal;
