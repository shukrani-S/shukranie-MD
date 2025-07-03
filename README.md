🤖 SHUKRANI-MD WhatsApp Bot

Welcome to SHUKRANI-MD, a multi-functional WhatsApp bot powered by Baileys, PostgreSQL, and modern deployment platforms.


---

⚙️ Features

Prefixless command support

PostgreSQL database integration

Anti-link protection with warning system

Audio/Video download (YouTube, TikTok)

Sticker generation, conversion & media tools

Pairing via QR or pairing code

Admin and owner-only command controls



---

📁 Folder Structure

shukranie-MD/
├── commands/           # All bot commands
├── raymond/            # Helpers (e.g., isOwner, cleaner)
├── database/           # PostgreSQL config and helpers
├── session/            # WhatsApp session files (auto-generated)
├── control.js          # Main bot entry file
├── .env                # Environment variables
├── Dockerfile          # For container deployment
├── README.md           # This file


---

🧪 Requirements

Node.js 18+

PostgreSQL database (e.g. from Render, Supabase, Railway)

ffmpeg, ytdl-core, wa-sticker-formatter (auto-installed)



---

⚡ Installation

git clone https://github.com/shukrani-S/shukranie-MD.git
cd shukranie-MD
npm install

Create a .env file and add the necessary environment variables:

BOT_NAME="SHUKRANI-MD"
OWNER_NAME="Raymond Kimath"
NUMERO_OWNER="255773350309@s.whatsapp.net"
DATABASE_URL="your_render_pg_url"


---

🚀 Platforms

🟣 Render (Recommended)

1. Go to https://dashboard.render.com


2. Click New Web Service and connect your GitHub repo


3. Choose Node as environment


4. Add the following ENV variables:

BOT_NAME

DATABASE_URL

OWNER_NAME

NUMERO_OWNER



5. Use start command:



node control.js

6. Deploy — wait for logs to show pairing code or scan QR!




---

💜 Heroku (CLI Recommended)

> Heroku deprecated free dynos. Use with verified billing.



git clone https://github.com/shukrani-S/shukranie-MD.git
cd shukranie-MD

# Login to Heroku
heroku login

# Create Heroku app
heroku create shukrani-md

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# Push code
git push heroku main

# Set ENV variables
heroku config:set BOT_NAME="SHUKRANI-MD"
heroku config:set DATABASE_URL="your_render_pg_url"
heroku config:set OWNER_NAME="Raymond Kimath"
heroku config:set NUMERO_OWNER="255773350309@s.whatsapp.net"

# Open logs and scan QR or copy pairing code
heroku logs --tail


---

🟢 Replit

1. Fork or import the repo to Replit


2. Add .env secrets under Replit Secrets tab


3. Run control.js manually or use npm start




---

🔵 Railway

1. Import the GitHub repo to Railway


2. Create new PostgreSQL plugin


3. Set environment variables


4. Set start command: node control.js




---

🟡 Koyeb

1. Go to https://app.koyeb.com


2. Deploy GitHub repo as a new service


3. Set ENV vars and command: node control.js


4. Deploy and scan QR from logs




---

👨‍💻 Developer

Author: Raymond Kimath
WhatsApp: wa.me/255773350309


---

🧹 Clean-Up

Temporary files (audio, video, images) are stored in temp/. These are auto-deleted hourly.


---

📜 License

ISC License — Feel free to use, modify, but credit the original developer.


---

