const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

// Modüller
const { listDevices, removeDevice } = require("./src/modules/deviceManager");
const { scanNetwork } = require("./src/modules/networkScanner"); // 🔍 Tarama

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile("index.html");
}

// Uygulama hazır olduğunda pencere oluştur
app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Tüm pencereler kapanınca çık
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

// 📥 Kayıtlı cihazları getir
ipcMain.handle("get-device-list", async () => {
    return listDevices();
});

// 🗑️ Cihaz silme
ipcMain.on("remove-device", (event, mac) => {
    removeDevice(mac);
    event.sender.send("devices-list", listDevices());
});

// 🔍 Ağ taraması
ipcMain.handle("scan-network", async () => {
    try {
        const results = await scanNetwork();
        return results;
    } catch (err) {
        console.error("Ağ tarama hatası:", err);
        return [];
    }
});
