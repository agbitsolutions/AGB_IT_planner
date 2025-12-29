#!/bin/bash
# Setup SSH Key Authentication (More Secure)
# Run this once to avoid entering password every time

SSH_HOST="89.117.157.109"
SSH_PORT="65002"
SSH_USER="u544547223"

echo "================================================"
echo "  🔐 SSH Key Setup for Hostinger"
echo "================================================"
echo ""
echo "This will set up SSH key authentication so you don't"
echo "need to enter your password every time."
echo ""

# Check if SSH key exists
if [ ! -f ~/.ssh/id_rsa.pub ]; then
    echo "🔑 Generating SSH key..."
    ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa -N ""
    echo "✅ SSH key generated"
else
    echo "✅ SSH key already exists"
fi
echo ""

# Copy key to server
echo "📤 Copying SSH key to Hostinger..."
echo "You'll need to enter your password one last time:"
echo ""

ssh-copy-id -p $SSH_PORT $SSH_USER@$SSH_HOST

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SSH key installed successfully!"
    echo ""
    echo "🎉 You can now connect without a password:"
    echo "   ./connect-hostinger.sh"
    echo ""
else
    echo ""
    echo "❌ Failed to install SSH key"
    echo "You can still connect with password using:"
    echo "   ssh -p $SSH_PORT $SSH_USER@$SSH_HOST"
fi
