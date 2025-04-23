// src/main/main.js
const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // ÖNEMLİ: Preload dosya yolu
      contextIsolation: true, // Güvenlik için aktif
      nodeIntegration: false // Güvenlik için pasif
    }
  });

  // Debug için (üretimde kapatın)
  mainWindow.webContents.openDevTools();
  
  mainWindow.loadFile("src/ui/index.html");
}

// IPC handler'larını yükle
require("../handlers/ipcHandlers");

app.whenReady().then(() => {
  createWindow();
  
  // MacOS için pencere yönetimi
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Windows/Linux'ta tüm pencereler kapatıldığında çıkış
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});