const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js') //ön yükleme dosyası

        }
    });

    mainWindow.loadFile('index.html'); //ana HTML dosyasını yükle
}

//uygulama hazır olduğunda pencereyi aç
app.whenReady().then(() => {
    createWindow();

   //macOS için: pencere kapalıysa yeniden aç
   app.on('activate', () => {
    if(BrowserWindow.getAllWindows().length === 0) createWindow();
   })
});

 //tüm pencereler kapandığında uygulamayı kapat (windows/linux)
 app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});