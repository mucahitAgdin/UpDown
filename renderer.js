// renderer.js
document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.querySelector(".sidebar");
    const toggleButton = document.getElementById("toggleSidebar");
  
    // Sidebar toggle
    toggleButton.addEventListener("click", () => {
      sidebar.classList.toggle("show");
      document.querySelector(".content").style.marginLeft = 
        sidebar.classList.contains("show") ? "250px" : "0";
    });
  
    // Sekme geçişleri
    document.getElementById("btn-computers").addEventListener("click", () => {
      document.getElementById("computers-section").style.display = "block";
      document.getElementById("find-device-section").style.display = "none";
      loadDevices();
    });
  
    document.getElementById("btn-find-device").addEventListener("click", () => {
      document.getElementById("find-device-section").style.display = "block";
      document.getElementById("computers-section").style.display = "none";
    });
  
    // Cihaz tarama
    document.getElementById("search-device").addEventListener("click", async () => {
      const devices = await window.api.scanNetwork();
      displayScannedDevices(devices);
    });
  
    // Dinleyici: Liste güncellemeleri
    window.api.onDevicesUpdate(() => loadDevices());
  
    // İlk yükleme
    loadDevices();
  });
  
async function displayScannedDevices(devices) {
    const container = document.getElementById("scanned-device-list");
    container.innerHTML = ""; // Önce temizle
  
    if (devices.length === 0) {
      container.innerHTML = "<p>No devices found.</p>";
      return;
    }
  
    devices.forEach(device => {
      const deviceCard = document.createElement("div");
      deviceCard.className = "device-card";
      deviceCard.innerHTML = `
        <p><strong>${device.name || "Unknown Device"}</strong></p>
        <p>IP: ${device.ip}</p>
        <p>MAC: ${device.mac}</p>
        <button onclick="addDevice('${device.name}', '${device.ip}', '${device.mac}')">
          Add
        </button>
      `;
      container.appendChild(deviceCard);
    });
  }
  
  // Cihaz ekle 
  async function addDevice(name, ip, mac) {
    try {
      await window.api.addDevice({ name, ip, mac });
      showToast("Cihaz başarıyla eklendi!");
    } catch (error) {
      showToast(`Hata: ${error.message}`, true);
    }
  }
  
  // Toast bildirimi
  function showToast(message, isError = false) {
    const toast = document.createElement("div");
    toast.className = `toast ${isError ? "error" : "success"}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  // renderer.js (Ek)
document.getElementById("search-device").addEventListener("click", async () => {
    try {
      const devices = await window.api.scanNetwork();
      console.log("Scanned Devices:", devices); // Konsola yazdır
      displayScannedDevices(devices);
    } catch (error) {
      console.error("Tarama hatası:", error);
      showToast("Tarama başarısız!", true);
    }
  });