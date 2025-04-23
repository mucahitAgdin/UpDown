// src/main/preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  sendSSHCommand: (config) => ipcRenderer.invoke('send-ssh-command', config),
});