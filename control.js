// 📁 control.js
// ----------------- CONFIGURATION -----------------
module.exports = {
  site: {
    name: '🌐 SHUKRANI Bot Pairing',
    description: 'Scan QR code or use the pairing code below to connect your WhatsApp bot.',
    version: '2.0.0',
  },

  bot: {
    botName: 'SHUKRANI-MD',
    ownerName: 'Raymond Kimath',
    sessionPath: './session/shukranie.json',
  },

  database: {
    enabled: true,
    type: 'postgresql',
    url: process.env.DATABASE_URL || '', // optional
  },

  features: {
    commandSystem: true,
    prefixlessCommands: true,
    alwaysOnline: true,
    ownerOnlyMode: false,
  },
};

// ----------------- BOT LOGIC -----------------
const { default: makeWASocket, useSingleFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const path = require('path');
const fs = require('fs');
const P = require('pino');
const qrcode = require('qrcode-terminal');
const { getSetting } = require('./database/settings');

// Load commands
const commands = {};
const commandsPath = path.join(__dirname, 'commands');
fs.readdirSync(commandsPath).forEach(file => {
  if (file.endsWith('.js')) {
    const command = require(path.join(commandsPath, file));
    commands[command.name] = command;
  }
});

// Auth state
const { state, saveState } = useSingleFileAuthState('./session/shukranie.json');

async function startBot() {
  const { version } = await fetchLatestBaileysVersion();
  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: true,
    browser: ['SHUKRANI-MD', 'Chrome', '1.0.0'],
    logger: P({ level: 'silent' })
  });

  sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect.error = Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) startBot();
    } else if (connection === 'open') {
      console.log('✅ SHUKRANI-MD bot connected.');
    }
  });

  sock.ev.on('creds.update', saveState);

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0];
    if (!m.message || m.key.fromMe) return;

    const msgText = m.message.conversation || m.message.extendedTextMessage?.text || '';
    let commandText = msgText.trim();

    const commandsMode = await getSetting('commands_mode');
    if (commandsMode === 'off') return;

    const prefix = await getSetting('prefix');
    const isPrefixMode = prefix === 'yes';

    if (isPrefixMode) {
      if (!commandText.startsWith('.')) return;
      commandText = commandText.slice(1);
    }

    const args = commandText.split(/\s+/);
    const commandName = args[0]?.toLowerCase();
    const flexibleCommands = ['autotyping', 'autorecord', 'alwaysonline', 'autoreacting', 'autorecordtyping', 'settings'];

    if (flexibleCommands.includes(commandName)) {
      const settingsCommand = commands['settings'];
      if (settingsCommand) return await settingsCommand.execute(sock, m, args);
    }

    const command = commands[commandName];
    if (!command) return;

    try {
      await command.execute(sock, m, args.slice(1));
    } catch (err) {
      console.error('❌ Error executing command:', err);
    }
  });
}

startBot();
