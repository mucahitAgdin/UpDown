//src/main/main.js

const { app, BrowserWindow } = require("electron");
const path = require("path");
const setupIPCHandlers = require("../handlers/ipcHandlers");

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      enableRemoteModule: false,
    }
  });

  // IPC Handler'ları kur
  setupIPCHandlers();

  // DevTools'u aç
  /*if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }*/

  mainWindow.loadFile("src/ui/index.html");
}

app.whenReady().then(createWindow);

// Pencere yönetimi
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});