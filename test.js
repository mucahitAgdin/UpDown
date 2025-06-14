
const wol = require("wake-on-lan");

wol.wake("CC:28:AA:19:6E:67", (err) => {
  if (err) {
    console.error("Wake-on-LAN gönderilemedi:", err);
  } else {
    console.log("Wake-on-LAN paketi başarıyla gönderildi!");
  }
});
