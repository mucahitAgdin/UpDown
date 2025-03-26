const { getIPRange } = require('./networkUtils');
const ping = require('ping');

async function scanNetwork() {
    const ipRange = getIPRange();
    if (!ipRange) {
        console.log("ip araligi belirlenemedi");
        return;
    }

    const subnet = ipRange.split(' - ')[0].slice(0, -2);
    const activeDevices = [];

    console.log(`Ağ taramasi baslatildi: ${subnet}.1 - ${subnet}.255`);

    for (let i = 1; i <= 255; i++){
        const ip = `${subnet}.${i}`;
        const res = await ping.promise.probe(ip);

        if(res.alive) {
            console.log()
        }
    }
}