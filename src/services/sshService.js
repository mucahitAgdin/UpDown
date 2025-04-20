// src/services/sshService.js

const { NodeSSH } = require("node-ssh");
const ssh = new NodeSSH();



/**
 * SSH bağlantısı kurar ve komut çalıştırır.
 * @param {string} host - Hedef IP adresi
 * @param {string} username - Kullanıcı adı
 * @param {string} password - Parola
 * @param {string} command - Gönderilecek komut
 * @returns {Promise<object>} stdout ve stderr içeren cevap
 */
async function executeSSHCommand(host, username, password, command) {
    try {
        await ssh.connect({ host, username, password });
        const result = await ssh.execCommand(command);
        return result;
    } catch (error) {
        console.error("SSH bağlantı veya komut hatası:", error);
        throw error;
    }
}

/**
 * Cihazı SSH ile kapatır.
 * @param {string} host - IP adresi
 * @param {string} username - Kullanıcı adı
 * @param {string} password - Parola
 * @param {string} os - İşletim sistemi ("linux", "windows", "mac")
 */
async function shutdownDevice(host, username, password, os) {
    let shutdownCommand;

    if (os === "linux" || os === "mac") {
        shutdownCommand = "shutdown now";
    } else if (os === "windows") {
        shutdownCommand = "shutdown /s /t 0";
    } else {
        throw new Error("Desteklenmeyen işletim sistemi");
    }

    return await executeSSHCommand(host, username, password, shutdownCommand);
}

// EXPORTLAR
module.exports = {
    executeSSHCommand,
    shutdownDevice
};
