const { ipcMain } = require("electron");
const deviceManager = require("../modules/device/deviceManager");
const { scanNetwork } = require("../modules/network/networkScanner");
const { wakeDevice } = require("../services/wolService");

// Cihazları taramak için IPC
ipcMain.handle("scan-network", async () => {
    return await scanNetwork();
});

// Listeyi getir
ipcMain.handle("get-device-list", async () => {
    return await deviceManager.listDevices();
});

// Cihaz ekle
ipcMain.on("add-device", (event, device) => {
    deviceManager.addDevice(device);
    event.sender.send("devices-list");
});

// Cihaz sil
ipcMain.on("remove-device", async (event, mac) => {
    await deviceManager.removeDevice(mac);
    const updatedList = await deviceManager.listDevices();
    event.sender.send("devices-list", updatedList);
});

// Wake-on-LAN
ipcMain.handle("wake-device", async (event, macAddress) => {
    return await wakeDevice(macAddress);
});


