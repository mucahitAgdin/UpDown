//src/handlers/ipcHandlers.js:

const { ipcMain } = require("electron");
const { exec } = require('child_process');
const deviceManager = require("../modules/device/deviceManager");
const { scanNetwork } = require("../modules/network/networkScanner");
const { wakeDevice } = require("../services/wolService");
const { executeSSHCommand } = require("../services/sshService");

// Ağ tarama IPC handler'ı
ipcMain.handle("scan-network", async () => {
    return await scanNetwork();
});

// Cihaz listesi getirme IPC handler'ı
ipcMain.handle("get-device-list", async () => {
    return await deviceManager.listDevices();
});

// Cihaz ekleme IPC handler'ı
ipcMain.on("add-device", (event, device) => {
    deviceManager.addDevice(device);
    event.sender.send("devices-list");
});

// Cihaz silme IPC handler'ı
ipcMain.on("remove-device", async (event, mac) => {
    await deviceManager.removeDevice(mac);
    const updatedList = await deviceManager.listDevices();
    event.sender.send("devices-list", updatedList);
});

// Wake-on-LAN IPC handler'ı
ipcMain.handle("wake-device", async (event, macAddress) => {
    return await wakeDevice(macAddress);
});


// SSH Komutu Handler'ı
ipcMain.handle("send-ssh-command", async (_, { ip, username, password, command, osType }) => {
  return await executeSSHCommand({ ip, username, password, command, osType });
});