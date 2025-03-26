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
console.log("subnet:", getSubnet("192.168.31.76"));

function getIPRange() {
    const localIP = getLocalIP();
    if(!localIP) return null;

    const subnet = getSubnet(localIP); //alt ağı belirle
    return `${subnet}.1-${subnet}.255`; // başlangıç ve bitiş IP'leri
}

//test
console.log("IP Araligi:", getIPRange());

// Modül olarak dışa aktar
module.exports = { getLocalIP, getSubnet, getIPRange };