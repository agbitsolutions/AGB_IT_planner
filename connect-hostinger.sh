#!/bin/bash
# SSH Connection Script for Hostinger
# Quick connect to your Hostinger server

SSH_HOST="89.117.157.109"
SSH_PORT="65002"
SSH_USER="u544547223"

echo "🔐 Connecting to Hostinger server..."
echo "Host: $SSH_HOST"
echo "Port: $SSH_PORT"
echo "User: $SSH_USER"
echo ""

# Connect via SSH
ssh -p $SSH_PORT $SSH_USER@$SSH_HOST

# After you disconnect, show this message
echo ""
echo "✅ Disconnected from Hostinger"
