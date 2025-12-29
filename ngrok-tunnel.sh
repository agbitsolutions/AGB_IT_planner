#!/bin/bash

##############################################################################
# ngrok Tunnel Manager for AGB Planner
# 
# This script starts ngrok tunnel and displays the public URL
# Usage: ./ngrok-tunnel.sh
##############################################################################

echo "╔════════════════════════════════════════════════════════════════════════════╗"
echo "║                  STARTING NGROK TUNNEL FOR LOCALHOST:5000                 ║"
echo "╚════════════════════════════════════════════════════════════════════════════╝"
echo ""
echo "Starting ngrok tunnel..."
echo ""

# Start ngrok and capture output
ngrok http 5000 --log=stdout 2>&1 | tee /tmp/ngrok.log &
NGROK_PID=$!

# Wait a bit for ngrok to start
sleep 3

# Extract the public URL from ngrok API
PUBLIC_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o '"public_url":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$PUBLIC_URL" ]; then
    echo "❌ Failed to get public URL from ngrok"
    kill $NGROK_PID
    exit 1
fi

echo ""
echo "╔════════════════════════════════════════════════════════════════════════════╗"
echo "║                        NGROK TUNNEL STARTED                               ║"
echo "╚════════════════════════════════════════════════════════════════════════════╝"
echo ""
echo "Public URL: $PUBLIC_URL"
echo ""
echo "Next steps:"
echo "  1. Copy this URL: $PUBLIC_URL"
echo "  2. Update frontend/js/config.js with this URL"
echo "  3. Commit and push to GitHub"
echo "  4. Netlify will auto-redeploy"
echo ""
echo "⚠️  IMPORTANT:"
echo "  • Keep this terminal running (don't close it)"
echo "  • Keep backend server running (./start.sh)"
echo "  • Each time you restart ngrok, the URL changes"
echo "  • You'll need to update config.js and redeploy to Netlify"
echo ""
echo "Press Ctrl+C to stop ngrok tunnel"
echo "════════════════════════════════════════════════════════════════════════════"
echo ""

# Keep the script running
wait $NGROK_PID
