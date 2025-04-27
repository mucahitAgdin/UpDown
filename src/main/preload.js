//src/main/preload.js

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Cihaz işlemleri
  listDevices: () => ipcRenderer.invoke("get-device-list"),
  addDevice: (device) => ipcRenderer.invoke("add-device", device),
  removeDevice: (mac) => ipcRenderer.invoke("remove-device", mac),
  
  // Ağ operasyonları
  scanNetwork: () => ipcRenderer.invoke("scan-network"),
  getMacAddress: (ip) => ipcRenderer.invoke("get-mac-address", ip),
  
  // Uzak kontrol
  wakeDevice: (mac) => ipcRenderer.invoke("wake-device", mac)
});