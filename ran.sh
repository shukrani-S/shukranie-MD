#!/bin/bash

# Optional: set OWNER_JID manually if needed
export OWNER_JID="255773350309@s.whatsapp.net"

echo "🔧 Building Docker image..."
docker build -t shukrani-md .

echo "🚀 Running shukrani-md container..."
docker run -e DATABASE_URL="$DATABASE_URL" -e OWNER_JID="$OWNER_JID" shukrani-md
