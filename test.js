const wol = require("wake-on-lan");

wol.wake("00:11:22:33:44:55", (err) => {
  if (err) {
    console.error("Wake-on-LAN gönderilemedi:", err);
  } else {
    console.log("Wake-on-LAN paketi başarıyla gönderildi!");
  }
});
