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
    const scanStatus = document.getElementById("scan-status");
    
    try {
        scanStatus.classList.remove("hidden");  // göster
        const scannedDevices = await window.electronAPI.scanNetwork();
        displayScannedDevices(scannedDevices);
        showToast(`${scannedDevices.length} cihaz bulundu`, "success");

    } catch (error) {
        console.error("Ağ tarama hatası:", error);
        showToast("Ağ tarama başarısız!", "error");

    } finally {
        scanStatus.classList.add("hidden"); // gizle
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
    console.log("Gelen cihaz:", device);

    let defaultName = device.name || "";
    if (typeof defaultName !== "string") defaultName = "";

    const isUnknown = defaultName.trim() === "" ||
                      ["bilinmeyen", "unknown"].includes(defaultName.toLowerCase());

    defaultName = isUnknown ? `Device ${index + 1}` : defaultName;

    const deviceCard = document.createElement("div");
    deviceCard.classList.add("device-card");

    // Cihaz ismini kullanıcı girecek
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.value = defaultName;
    nameInput.placeholder = "Cihaz ismi girin...";
    nameInput.style.width = "100%";
    nameInput.style.padding = "5px";
    nameInput.style.marginBottom = "6px";

    const ipP = document.createElement("p");
    ipP.textContent = `IP: ${device.ip}`;

    const addButton = document.createElement("button");
    addButton.textContent = "Add";
    addButton.addEventListener("click", () => {
      const userName = nameInput.value.trim();

      if (!userName) {
        const confirmAdd = confirm("Cihazınıza isim vermediniz. Devam etmek istiyor musunuz?");
        if (!confirmAdd) return;
      }

      addDevice(userName || defaultName, device.ip, device.mac);
    });

    deviceCard.append(nameInput, ipP, addButton);
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

      // Cihaz adı
      const nameP = document.createElement("p");
      nameP.innerHTML = `<strong>${device.name}</strong>`;

      // IP bilgisi
      const ipP = document.createElement("p");
      ipP.textContent = `IP: ${device.ip}`;

      // Wake-on-LAN butonu
      const wakeBtn = document.createElement("button");
      wakeBtn.textContent = "Wake";
      wakeBtn.addEventListener("click", () => wakeDevice(device.mac));

      // Cihaz silme
      const removeBtn = document.createElement("button");
      removeBtn.textContent = "Remove";
      removeBtn.addEventListener("click", () => removeDevice(device.mac));

      // Cihazı kapatma
      const shutdownBtn = document.createElement("button");
      shutdownBtn.textContent = "Shutdown";
      shutdownBtn.classList.add("shutdown-btn");
      shutdownBtn.addEventListener("click", () => shutdownDevice(device.ip));

      deviceCard.append(nameP, ipP, wakeBtn, removeBtn, shutdownBtn);
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

// Shutdown fonksiyonu
async function shutdownDevice(ip) {
    const confirmShutdown = confirm("Bu cihazı kapatmak istediğinize emin misiniz?");
    if (!confirmShutdown) return;
  
    try {
      const result = await window.electronAPI.shutdownDevice(ip);
      showToast(result.message, result.success ? "success" : "error");
    } catch (error) {
      console.error("Shutdown error:", error);
      showToast("Kapatma işlemi başarısız!", "error");
    }
  }
 
// rename device fonksiyonu
async function renameDevice(mac, name) {
    try {
        const result = await window.electronAPI.renameDevice(mac, name);
        showToast(result.success ? "Ad güncellendi" : "Ad güncellenemedi", result.success ? "success" : "error");
    } catch (error) {
        console.error("Rename hatası:", error);
        showToast("Ad güncelleme hatası!", "error");
    }
}
