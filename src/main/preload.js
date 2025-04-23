// src/main/preload.js
const { contextBridge, ipcRenderer } = require('electron');

// Main process ile renderer process arasında güvenli iletişim köprüsü
contextBridge.exposeInMainWorld('electronAPI', {
  /**
   * SSH komutunu main process'e gönderir
   * @param {object} config - { ip, username, password, command, osType }
   * @returns {Promise<{success: boolean, output?: string, error?: string}>}
   */
  sendSSHCommand: (config) => ipcRenderer.invoke('send-ssh-command', config)
});