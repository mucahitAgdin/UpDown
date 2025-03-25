const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { listDevices, removeDevice, addDevice } = require("./src/modules/deviceManager");


function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"), // Önyükleme dosyası
            nodeIntegration: true, // Renderer içinde `require` kullanabilmek için
            contextIsolation: false
        }
    });

    mainWindow.loadFile("index.html");
}

// Uygulama hazır olduğunda pencereyi aç
app.whenReady().then(() => {
    createWindow();

    // macOS için: Pencere kapalıysa yeniden aç
    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Tüm pencereler kapandığında uygulamayı kapat (Windows/Linux)
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

// Renderer'dan gelen istekleri dinle ve yanıtla
ipcMain.handle("get-device-list", async () => {
    return listDevices();
});

ipcMain.on("remove-device", (event, mac) => {
    removeDevice(mac);
    event.sender.send("devices-list", listDevices()); // Güncellenmiş listeyi gönder
});
