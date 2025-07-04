// src/handlers/ipcHandlers.js

const { ipcMain } = require("electron");
const deviceManager = require("../modules/device/deviceManager");
const { scanNetwork } = require("../modules/network/networkScanner");
const { wakeDevice } = require("../services/wolService");
const { getMacAddress } = require("../modules/network/macFinder");
const { shutdownWindowsDevice } = require("../services/shutdownService");

module.exports = function setupIPCHandlers() {

  ipcMain.handle("scan-network", async () => {
    try {
      const devices = await scanNetwork();
      return devices;
    } catch (error) {
      console.error("Ağ tarama hatası:", error);
      return { success: false, message: "Ağ taraması sırasında bir hata oluştu." };
    }
  });

  ipcMain.handle("get-mac-address", async (_, ip) => {
    try {
      const macAddress = await getMacAddress(ip);
      return macAddress ? macAddress : { success: false, message: "MAC adresi bulunamadı." };
    } catch (error) {
      console.error("MAC bulma hatası:", error);
      return { success: false, message: "MAC adresi alınırken hata oluştu." };
    }
  });

  ipcMain.handle("get-device-list", async () => {
    try {
      return await deviceManager.listDevices();
    } catch (error) {
      console.error("Cihaz listeleme hatası:", error);
      return { success: false, message: "Cihazlar listelenemedi." };
    }
  });

  ipcMain.handle("add-device", async (_, device) => {
    try {
      return await deviceManager.addDevice(device);
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

  ipcMain.handle("rename-device", async (_, mac, name) => {
    try {
      await deviceManager.renameDevice(mac, name);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("wake-device", async (_, macAddress) => {
    try {
      return await wakeDevice(macAddress);
    } catch (error) {
      console.error("Wake hatası:", error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("shutdown-device", async (_, ip = "") => {
    try {
      const result = await shutdownWindowsDevice(ip);
      return { success: true, message: result.message };
    } catch (error) {
      console.error("Shutdown error:", error);
      return { success: false, message: error.message || "Kapatma hatası!" };
    }
  });
};
