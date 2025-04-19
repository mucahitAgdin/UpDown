// preload.js
const { contextBridge, ipcRenderer } = require("electron");

// Sadece izin verilen IPC fonksiyonlarını açığa çıkar
contextBridge.exposeInMainWorld("api", {
  // Ağ tarama işlemi
  scanNetwork: () => ipcRenderer.invoke("scan-network"),
  // Cihaz listesini getir
  getDevices: () => ipcRenderer.invoke("get-device-list"),
  // Yeni cihaz ekle
  addDevice: (device) => ipcRenderer.send("add-device", device),
  // Cihazı sil
  removeDevice: (mac) => ipcRenderer.send("remove-device", mac),
  // Liste güncelleme dinleyicisi
  onDevicesUpdate: (callback) => ipcRenderer.on("devices-list-updated", callback)
});