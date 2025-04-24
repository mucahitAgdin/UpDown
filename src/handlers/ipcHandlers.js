//src/handlers/ipcHandlers.js

const { ipcMain } = require("electron");
const deviceManager = require("../modules/device/deviceManager");
const { scanNetwork } = require("../modules/network/networkScanner");
const { getMacAddress } = require("../modules/network/macFinder");
const { wakeDevice } = require("../services/wolService");
const { executeSSHCommand } = require("../services/sshService");

// Tüm handler'ları tek bir yerde topluyoruz
module.exports = function setupIPCHandlers() {
  // Ağ tarama (ARP tablosu)
  ipcMain.handle("scan-network", async () => {
    try {
      return await scanNetwork();
    } catch (error) {
      console.error("Ağ tarama hatası:", error);
      return [];
    }
  });

  // MAC adresi çözümleme
  ipcMain.handle("get-mac-address", async (_, ip) => {
    try {
      return await getMacAddress(ip);
    } catch (error) {
      console.error("MAC bulma hatası:", error);
      return null;
    }
  });

  // Cihaz işlemleri
  ipcMain.handle("get-device-list", async () => {
    try {
      return await deviceManager.listDevices();
    } catch (error) {
      console.error("Cihaz listeleme hatası:", error);
      return [];
    }
  });

  ipcMain.handle("add-device", async (_, device) => {
    try {
      await deviceManager.addDevice(device);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("remove-device", async (_, mac) => {
    try {
      await deviceManager.removeDevice(mac);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  // Wake-on-LAN
  ipcMain.handle("wake-device", async (_, macAddress) => {
    try {
      return await wakeDevice(macAddress);
    } catch (error) {
      console.error("Wake hatası:", error);
      return { success: false, error: error.message };
    }
  });

  // SSH operasyonları
  ipcMain.handle("send-ssh-command", async (_, config) => {
    try {
      return await executeSSHCommand(config);
    } catch (error) {
      console.error("SSH hatası:", error);
      return { 
        success: false, 
        error: error.message.includes("timed out") 
          ? "Bağlantı zaman aşımı" 
          : error.message 
      };
    }
  });
};