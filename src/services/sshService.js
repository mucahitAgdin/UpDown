// src/services/sshService.js
const { NodeSSH } = require('node-ssh');

/**
 * SSH ile komut çalıştırır (Windows/Linux/macOS uyumlu).
 * @param {string} ip - Hedef IP
 * @param {string} username - Kullanıcı adı
 * @param {string} password - Şifre (veya privateKey yolu)
 * @param {string} command - Çalıştırılacak komut
 * @param {string} osType - 'windows' | 'linux' | 'mac'
 */
async function executeSSHCommand({ ip, username, password, command, osType }) {
  const ssh = new NodeSSH();
  try {
    await ssh.connect({
      host: ip,
      username,
      password, // Veya privateKey: 'path/to/key'
    });

    // OS'e göre komut formatı
    let formattedCommand = command;
    if (osType === 'windows') {
      formattedCommand = `powershell.exe -Command "${command.replace(/"/g, '\\"')}"`;
    }

    const result = await ssh.execCommand(formattedCommand);
    return { success: true, output: result.stdout || result.stderr };
  } catch (error) {
    return { success: false, error: error.message };
  } finally {
    ssh.dispose();
  }
}

module.exports = { executeSSHCommand };