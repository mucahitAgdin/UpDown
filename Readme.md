# UpDown – Ağ Üzerinden Cihaz Yönetimi Uygulaması

![Uygulama Logosu](updown.ico)
Windows için hazır kurulum paketi

---

## 📥 Kurulum

Uygulamayı kullanmak için [buradan](https://github.com/mucahitAgdin/Wake-on-Lan/tree/main/releases) en son sürümünü indirin ve `UpDown-Setup-1.0.0.exe` dosyasını çalıştırın.

---

## ⚙️ Ön Gereksinimler

### 0️⃣ listener.exe Kurulumu (Shutdown özelliği için)

UpDown uygulamasını kurduğunuz ana cihazda aşağıdaki dosya yolunu takip edin:

```
%localappdata%\wake-on-lan\resources\listener.exe
```

* listener.exe dosyasını, uzaktan kapatılacak olan cihaza kopyalayın.
* Hedef cihazda `listener.exe` dosyasına sağ tıklayın ve “Yönetici olarak çalıştır” seçeneğini tıklayın.
* Uygulama arka planda çalışır ve herhangi bir pencere göstermez. Görev Yöneticisi’nde `listener.exe` olarak görünür.

🛡 Notlar:

* Hedef cihazın güvenlik duvarında UDP 9999 portu açık olmalıdır.
* Antivirüs yazılımları `listener.exe` dosyasını engelleyebilir. Gerekirse güvenlik istisnası tanımlayın.

---

### 0.1️⃣ Hedef Cihazda IP Adresi Nasıl Bulunur?

1. Hedef bilgisayarda Başlat menüsüne tıklayın ve “cmd” yazarak Komut İstemi’ni açın.
2. Aşağıdaki komutu yazın ve Enter’a basın:

   ```
   ipconfig
   ```
3. Açılan sonuçta şu satırı bulun:

   ```
   IPv4 Address. . . . . . . . . . . : 192.168.x.x
   ```
4. Bu IP adresini, ana cihazdaki UpDown uygulamasına hedef cihaz olarak tanımlarken kullanabilirsiniz.

💡 Tavsiye: IP adresinin sabit kalması için cihazın modemden sabit IP (static IP) alması önerilir.

---

### 1️⃣ BIOS Ayarları (Wake-on-LAN için)

1. Bilgisayarı başlatırken F2, DEL veya üreticiye özel tuşla BIOS’a girin.
2. Advanced Settings > Power Management bölümüne gidin.
3. Aşağıdaki ayarları etkinleştirin:

   * Wake-on-LAN (Bazen "PCI-E Power On" veya "PME Event Wake Up" olarak da geçebilir)
   * ErP Support → Disabled
4. Değişiklikleri kaydedip çıkın (F10)

---

### 2️⃣ Windows Ağ Ayarları

1. Ağ Bağlantıları > Ethernet adaptörüne sağ tıklayın > Özellikler
2. Configure > Advanced sekmesinde:

   * Wake on Magic Packet: Enabled
   * Shutdown Wake-On-LAN: Enabled
3. Power Management sekmesinde:

   * "Bu cihazın bilgisayarı uyandırmasına izin ver" kutusunu işaretleyin

---

### 3️⃣ Güvenlik Duvarı İzinleri

1. Windows Defender Güvenlik Duvarı > Gelişmiş ayarlar
2. Gelen kurallar:

   * UDP 9999 → listener.exe için
   * UDP 7 ve 9 → Wake-on-LAN için
3. `UpDown.exe` ve `listener.exe` için tam erişim izni verin

---

## 🖥️ Uygulama Kurulumu

1. İndirdiğiniz kurulum dosyasını çalıştırın.
2. Yönetici haklarıyla kurulum yapın (önemli!).
3. Kurulum tamamlandığında uygulama otomatik başlayacaktır.

---

## 🛠️ Sorun Giderme

### ❌ Wake-on-LAN Çalışmıyorsa

* Cihazın fişe takılı olduğundan emin olun (tam kapalıysa WoL çalışmayabilir).
* Ethernet kablosunun takılı olduğundan emin olun (Wi-Fi desteklemez).
* Ağ kartı ayarlarında “Energy Efficient Ethernet” seçeneğini devre dışı bırakın.

### ❌ Shutdown Komutu Çalışmıyorsa

* Hedef cihazda `listener.exe`’nin arka planda çalıştığından emin olun.
* Antivirüs yazılımı listener.exe’yi engelliyor olabilir.
* UDP 9999 portunun açık olduğundan emin olun.

---

📌 Not: Bu uygulama şu anda yalnızca Windows işletim sistemi için geliştirilmiştir.
Tüm cihazlarda BIOS ve ağ ayarlarını yapılandırmadan önce sistem yedeklemelerinizi almanız önerilir.
