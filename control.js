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
    sessionPath: './session', // Changed for multi-file auth
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
    antilink: true
  },
};

// ----------------- DEPENDENCIES -----------------
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const path = require('path');
const fs = require('fs');
const P = require('pino');
const qrcode = require('qrcode-terminal');
const { getSetting } = require('./database/settings');
const { addWarning, resetWarning } = require('./database/warnStore');
const { isWhitelisted } = require('./commands/whitelist');
const cleanTempFolder = require('./raymond/cleaner/cleanTemp');
const connectDB = require('./database/connection');

// ----------------- CHECK DATABASE EARLY -----------------
(async () => {
  const db = await connectDB();
  if (!db) {
    console.log('⚠️ Database connection failed. Bot will run in limited mode.');
    global.nodb = true;
  }
})();

// Run once when bot starts
cleanTempFolder();
setInterval(cleanTempFolder, 60 * 60 * 1000);

// ----------------- LOAD COMMANDS -----------------
const commands = {};
const commandsPath = path.join(__dirname, 'commands');
fs.readdirSync(commandsPath).forEach(file => {
  if (file.endsWith('.js')) {
    const command = require(path.join(commandsPath, file));
    commands[command.name] = command;
  }
});

// ----------------- START BOT -----------------
async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('./session');
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

  sock.ev.on('creds.update', saveCreds);

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
    const
