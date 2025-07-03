README.md

# UpDown – Ağ Üzerinden Cihaz Yönetimi Uygulaması

![Uygulama Logosu](updown.ico)
Windows için hazır kurulum paketi

## 📥 Kurulum

Uygulamayı kullanmak için [buradan](https://github.com/mucahitAgdin/Wake-on-Lan/tree/main/releases) en son sürümünü indirin ve UpDown-Setup-0.0.1.exe dosyasını çalıştırın.

## ⚙️ Ön Gereksinimler

### 0 Kurulum Adımları
UpDown uygulamasını kurduğun ana cihazda, aşağıdaki dosya yolunu takip edin:
%localappdata%\wake-on-lan\resources\listener.exe

listener.exe dosyasını, uzaktan kapatılacak olan cihaza kopyalayın.

Hedef cihazda listener.exe dosyasını yönetici olarak çalıştırın.
Bu uygulama arka planda çalışarak UDP üzerinden gelen kapatma komutlarını dinleyecektir.

Uygulama çalışırken herhangi bir pencere göstermez. Görev Yöneticisi üzerinden “listener.exe” olarak takip edebilirsiniz.

Not: Güvenlik duvarı ayarlarında UDP 9999 portunun açık olduğundan emin olun. Ayrıca bazı antivirüs yazılımları listener.exe dosyasını engelleyebilir; bu durumda güvenlik istisnası tanımlamanız gerekebilir.

### 1️ BIOS Ayarları (Wake-on-LAN için)

1. Bilgisayarınızı başlatırken F2, DEL veya üreticiye özel tuşla BIOS'a girin
2. Advanced Settings > Power Management bölümünü bulun
3. Aşağıdaki seçenekleri etkinleştirin:

   * Wake-on-LAN (Bazen "PCI-E Power On" veya "PME Event Wake Up" olarak geçer)
   * ErP Support (Disabled olarak ayarlayın)
4. Değişiklikleri kaydedip çıkın (F10)

### 2️ Windows Ağ Ayarları

1. Ağ Bağlantıları > Ethernet adaptörüne sağ tık > Özellikler
2. Configure > Advanced sekmesi:

   * Wake on Magic Packet: Enabled
   * Shutdown Wake-On-LAN: Enabled
3. Power Management sekmesi:

   * "Bu cihazın bilgisayarı uyandırmasına izin ver" kutusunu işaretleyin

### 3️ Güvenlik Duvarı İzinleri

1. Windows Defender Güvenlik Duvarı > Gelişmiş ayarlar
2. Gelen kuralları:

   * UDP 9999 (Listener için)
   * UDP 7 ve 9 (Wake-on-LAN için)
3. UpDown.exe ve listener.exe için tam erişim izni verin

## 🖥️ Uygulama Kurulumu

1. İndirdiğiniz kurulum dosyasını çalıştırın
2. Yönetici haklarıyla kurulum yapın (önemli!)
3. Kurulum tamamlandığında uygulama otomatik başlayacaktır

## 🔄 Otomatik Başlatma

Uygulama her Windows açılışında otomatik başlayacak şekilde ayarlanmıştır. Bunu değiştirmek için:

1. Uygulama ayarlarından Settings > Start with Windows seçeneğini kapatın

## 🛠️ Sorun Giderme

### ❌ Wake-on-LAN Çalışmıyorsa

1. Cihazın fişe takılı olduğundan emin olun (WoL genellikle tam kapanmış durumda çalışmaz)
2. Ethernet kablosunun bağlı olduğunu kontrol edin (Wi-Fi'de WoL desteği yoktur)
3. Ağ kartı ayarlarında "Energy Efficient Ethernet"i devre dışı bırakın

### ❌ Shutdown Komutu Çalışmıyorsa

1. listener.exe'nin arka planda çalıştığını kontrol edin (Görev Yöneticisi)
2. Antivirüs yazılımınızın uygulamayı engellemediğinden emin olun
3. Hedef cihazda UDP 9999 portunun açık olduğunu doğrulayın

## 📜 Lisans

MIT Lisansı - Detaylar için [LICENSE](https://github.com/mucahitAgglin/Wake-on-Lan/blob/main/LICENSE) dosyasına bakın.


Not: Bu uygulama şu anda yalnızca Windows sistemlerini desteklemektedir. Lütfen tüm cihazlarda BIOS ve ağ ayarlarını yapılandırmadan önce yedek alın.

