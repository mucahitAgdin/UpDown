const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const deviceManager = require("./src/modules/deviceManager");
const { scanNetwork } = require("./src/modules/networkScanner");

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    mainWindow.loadFile("index.html");
}

app.whenReady().then(() => {
    createWindow();
    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

// Cihazları taramak için IPC
ipcMain.handle("scan-network", async () => {
    return await scanNetwork();
});

// Listeyi getir
ipcMain.handle("get-device-list", () => {
    return deviceManager.listDevices();
});

// Cihaz ekle
ipcMain.on("add-device", (event, device) => {
    deviceManager.addDevice(device);
    event.sender.send("devices-list");
});

// Cihaz sil
ipcMain.on("remove-device", (event, mac) => {
    deviceManager.removeDevice(mac);
    event.sender.send("devices-list", deviceManager.listDevices());
});
