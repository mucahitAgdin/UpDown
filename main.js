// main.js
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const deviceManager = require("./src/modules/deviceManager");
const { scanNetwork } = require("./src/modules/networkScanner");
const Main = require("electron/main");

class MainApp {
    constructor() {
        this.window = null;
        this.init();
    }


    // uygulamayi baslat 
    init() {
        app.whenReady().then(() => this.createWindow());
        app.on("window-all-closed", () => this.onWindowClosed());
    }

    // pencere olustur
    createWindow() {
        this.window = new BrowserWindow({
            width: 1000,
            height: 700,
            webPreferences: {
                preload: path.join(__dirname, "preload.js"), //güvenlik icin
                nodeIntegration: false, // güvenlik kapatildi
                contextIsolation: true // izolasyon aktif
            }
        });

        this.window.loadFile("index.html");
        this.setupIPC();
    }

    // IPC handler'lari kur
    setupIPC() {
        // ag tarama istegi
        ipcMain.handle("scan-network", async () => {
            try {
                return await scanNetwork();
            } catch (error) {
                console.error("Tarama hatasi:", error);
            }
        });

        // cihaz listesi getir
        ipcMain.handle("get-device-list", async () => {
            try {
                return await deviceManager.listDevices();
            } catch (error) {
                console.error("listeleme hatasi:", error);
                return [];
            }
        });

        // cihaz ekleme
        ipcMain.on("add-device", async (event, device) => {
            try {
                const isAdded = await deviceManager.addDevice(device);
                if (isAdded) this.window.webContents.send("device-list-updated");
            } catch (error) {
                console.error("ekleme hatsi:", error);
            }
        });

    }
    onWindowClosed() {
        if (process.platform !== "darwin") app.quit();
    }
}

new MainApp();

