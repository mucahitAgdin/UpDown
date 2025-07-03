const os = require('os'); //isletim sistemi bilgileri

function getLocalIP(){
    const networkInterfaces = os.networkInterfaces(); //ağ arayüzleri

    for(const name of Object.keys(networkInterfaces)){
        for(const net of networkInterfaces[name]){
            if (net.family === 'IPv4' && !net.internal){
                return net.address; //ipv4 ve dış ağ adresini al
            }
        }
    }
    return null; 
}

// test
console.log("cihazların IP adresi:", getLocalIP());


function getSubnet(ip){
    const parts = ip.split('.'); //IP'yi noktadan böl
    return `${parts[0]}.${parts[1]}.${parts[2]}`;//ilk üç kısmı birleştir
}

//test 
/*console.log("subnet:", getSubnet("192.168.31.76"));*/


// Alt ağı al
function getIPRange() {
    const interfaces = os.networkInterfaces();
    let localIP = null;

    // Tüm ağ arayüzlerini tara
    Object.values(interfaces).forEach((iface) => {
        iface.forEach((entry) => {
            if (entry.family === "IPv4" && !entry.internal) {
                localIP = entry.address;
            }
        });
    });

    if (!localIP) {
        console.log("IP adresi bulunamadı.");
        return null;
    }

    const subnet = localIP.split('.').slice(0, 3).join('.'); // İlk 3 bloğu al
    return subnet; // "192.168.31"
}

module.exports = { getIPRange };

// Modül olarak dışa aktar
module.exports = { getLocalIP, getSubnet, getIPRange };