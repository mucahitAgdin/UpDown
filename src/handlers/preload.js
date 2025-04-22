// preload.js

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    shutdownDevice: (data) => ipcRenderer.invoke('shutdown-device', data)
});
