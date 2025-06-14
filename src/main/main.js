// src/main/main.js
const { app, BrowserWindow } = require("electron");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
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
    },
  });

  setupIPCHandlers();
  mainWindow.loadFile("src/ui/index.html");
}

// Scheduled Task Kurulumu
function setupListenerScheduledTask() {
  const exeName = "listener.exe";
  const src = path.join(__dirname, "../../assets", exeName); // listener.exe'nin bulunduğu yer
  const destDir = path.join(process.env.ProgramData, "RemoteAgent");
  const dest = path.join(destDir, exeName);

  try {
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    // Eğer daha önce kopyalanmamışsa kopyala
    if (!fs.existsSync(dest)) {
      fs.copyFileSync(src, dest);
    }

    const schtasksCmd = `schtasks /Create /F /SC ONSTART /TN "RemoteListener" /TR "${dest}" /RL HIGHEST`;

    exec(schtasksCmd, { windowsHide: true }, (err, stdout, stderr) => {
      if (err) {
        console.error("[Scheduled Task] Oluşturulamadı:", err.message);
      } else {
        console.log("[Scheduled Task] Başarıyla oluşturuldu.");
      }
    });
  } catch (e) {
    console.error("Scheduled Task kurulumu sırasında hata:", e);
  }
}

app.whenReady().then(() => {
  createWindow();
  setupListenerScheduledTask(); // 🎯 Bu satır önemli
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
