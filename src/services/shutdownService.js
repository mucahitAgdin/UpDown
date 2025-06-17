// src/services/shutdownService.js
const dgram = require('dgram');
require('dotenv').config();

function logShutdown(ip, status, error = null) {
  const timestamp = new Date().toISOString();
  const statusColor = status === "success" ? status : "FAIL";

  console.log(`[${timestamp}] Shutdown Attempt: IP: ${ip}, Status: ${statusColor.toUpperCase()}`);

  if (error) {
    console.error("Error Details:", error);
  }
}

async function shutdownWindowsDevice(ip) {
  return new Promise((resolve, reject) => {
    const client = dgram.createSocket('udp4');
    const secretKey = process.env.SECRET_KEY || 'DEFAULTKEY';
    const message = Buffer.from(secretKey);
    const port = 9999;
    const timeout = 3000; // 3 saniye timeout

    // Timeout kontrolü
    const timer = setTimeout(() => {
      client.close();
      logShutdown(ip, "failed", "Timeout: No response from listener");
      reject(new Error("Timeout: Listener didn't respond"));
    }, timeout);

    client.on('error', (err) => {
      clearTimeout(timer);
      client.close();
      logShutdown(ip, "failed", err.message);
      reject(err);
    });

    client.send(message, 0, message.length, port, ip, (err) => {
      if (err) {
        clearTimeout(timer);
        client.close();
        logShutdown(ip, "failed", err.message);
        reject(err);
      } else {
        logShutdown(ip, "success");
        clearTimeout(timer);
        client.close();
        resolve({ 
          success: true, 
          message: `Shutdown command sent to ${ip}:${port}` 
        });
      }
    });
  });
}

module.exports = { shutdownWindowsDevice };