const express = require('express');
const fs = require('fs');
const path = require('path');
const { Boom } = require('@hapi/boom');
const { useSingleFileAuthState, makeWASocket, fetchLatestBaileysVersion, DisconnectReason } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode');
const control = require('./control');

const app = express();
const PORT = process.env.PORT || 3000;

const SESSION_PATH = control.bot.sessionPath;
const { state, saveState } = useSingleFileAuthState(SESSION_PATH);

let sock;
let qrCodeData = null;
let pairingCode = null;

// Serve QR code or pairing code
app.get('/', async (req, res) => {
  res.send(`
    <h1>${control.site.name}</h1>
    <p>${control.site.description}</p>
    <p><strong>Version:</strong> ${control.site.version}</p>
    <p>Owner: ${control.bot.ownerName}</p>
    <p>Bot Name: ${control.bot.botName}</p>
    <hr>
    ${qrCodeData ? `<img src="${qrCodeData}" alt="QR Code" />` : ''}
    ${pairingCode ? `<p><strong>Pairing Code:</strong> ${pairingCode}</p>` : '<p>QR or code will appear here...</p>'}
  `);
});

async function startBot() {
  const { version } = await fetchLatestBaileysVersion();

  sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false,
    browser: ['SHUKRANI', 'Safari', '1.0.0'],
  });

  sock.ev.on('connection.update', async (update) => {
    const { connection, qr, lastDisconnect, isNewLogin, pairingCode: pCode } = update;

    if (qr) {
      qrCodeData = await qrcode.toDataURL(qr);
    }

    if (pCode) {
      pairingCode = pCode;
    }

    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) {
        startBot();
      } else {
        console.log('Connection closed. You are logged out.');
      }
    }

    if (connection === 'open') {
      console.log('✅ Bot connected successfully!');
      qrCodeData = null;
      pairingCode = null;
    }
  });

  sock.ev.on('creds.update', saveState);
}

startBot();

app.listen(PORT, () => {
  console.log(`🚀 SHUKRANI Pairing Site running on http://localhost:${PORT}`);
});
