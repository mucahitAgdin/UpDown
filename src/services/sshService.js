// src/services/sshService.js
const { NodeSSH } = require('node-ssh');

/**
 * SSH ile komut çalıştırma servisi
 * @param {object} params - { ip, username, password, command, osType }
 * @returns {Promise<{success: boolean, output?: string, error?: string}>}
 */
async function executeSSHCommand({ ip, username, password, command, osType }) {
  const ssh = new NodeSSH();
  try {
    console.log(`[SSH] ${username}@${ip} bağlantısı kuruluyor...`);

    // Windows'ta daha uzun timeout gerekebilir
    await ssh.connect({
      host: ip,
      username,
      password,
      readyTimeout: 10000, // 10 saniye
      onKeyboardInteractive: (name, instructions, prompts, finish) => {
        if (prompts.length > 0) finish([password]); // Şifre istendiğinde otomatik yanıt
      }
    });

    // OS'e özel komut formatı
    if (osType === 'windows') {
      command = `powershell -Command "& {${command}}"`; // PowerShell wrapper
      console.log("[SSH] Windows komut formatı:", command);
    }

    const result = await ssh.execCommand(command);
    
    return {
      success: !result.stderr,
      output: result.stdout || result.stderr
    };
  } catch (error) {
    console.error("[SSH] Bağlantı hatası:", {
      message: error.message,
      stack: error.stack
    });
    
    return {
      success: false,
      error: error.message.includes('timed out') 
        ? 'Bağlantı zaman aşımı. SSH servisi çalışıyor mu?'
        : 'Kimlik doğrulama başarısız'
    };
  } finally {
    ssh.dispose(); // Bağlantıyı kapat
  }
}

module.exports = { executeSSHCommand };