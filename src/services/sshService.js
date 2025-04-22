// sshService.js

const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

/**
 * SSH ile cihaza bağlanıp kapatma komutu gönderir
 * @param {string} ip - Cihazın IP adresi
 * @param {string} username - SSH kullanıcı adı
 * @param {string} password - SSH şifresi
 * @param {string} osType - windows | linux | mac
 * @returns {Promise<string>}
 */
async function shutdown(ip, username, password, osType) {
    try {
        await ssh.connect({
            host: ip,
            username,
            password
        });

        let command = '';
        switch (osType.toLowerCase()) {
            case 'windows':
                command = 'shutdown /s /t 0';
                break;
            case 'linux':
                command = 'shutdown now';
                break;
            case 'mac':
                command = 'sudo shutdown -h now';
                break;
            default:
                throw new Error('Bilinmeyen işletim sistemi türü.');
        }

        const result = await ssh.execCommand(command);
        ssh.dispose();
        return result.stderr || result.stdout || 'Komut gönderildi.';
    } catch (err) {
        return `Hata: ${err.message}`;
    }
}

module.exports = { shutdown };
