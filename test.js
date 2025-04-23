
/**
const wol = require("wake-on-lan");

wol.wake("00:11:22:33:44:55", (err) => {
  if (err) {
    console.error("Wake-on-LAN gönderilemedi:", err);
  } else {
    console.log("Wake-on-LAN paketi başarıyla gönderildi!");
  }
});
 */

const { exec } = require("child_process");

// Bilgileri buraya gir
const ip = "192.168.1.31"; // Örnek IP
const username = "agdin";
const password = "158741";
const os = "Windows"; // veya "windows"

let command;

if (os === "windows") {
    command = `sshpass -p '${password}' ssh ${username}@${ip} "shutdown /s /t 0"`;
} else {
    command = `sshpass -p '${password}' ssh -o StrictHostKeyChecking=no ${username}@${ip} "shutdown now"`;
}

console.log("Çalıştırılan komut:", command);

exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error("❌ Shutdown hatası:", error.message);
        return;
    }
    if (stderr) {
        console.error("⚠️ STDERR:", stderr);
    }
    console.log("✅ Komut çıktısı:", stdout);
});
