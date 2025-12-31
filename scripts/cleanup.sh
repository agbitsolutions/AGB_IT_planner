#!/bin/bash

################################################################################
# AGB IT Solutions - Project Cleanup Script
# Description: Archives redundant files and organizes project structure
################################################################################

set -e

readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m'

readonly PROJECT_ROOT="/home/user/agb_planner"
readonly ARCHIVE_DIR="${PROJECT_ROOT}/archive/old_files_$(date +%Y%m%d_%H%M%S)"

echo ""
echo -e "${BLUE}🧹 Cleaning up project structure...${NC}"
echo ""

# Create archive directory
mkdir -p "$ARCHIVE_DIR"/{docs,scripts}

cd "$PROJECT_ROOT" || exit 1

# Archive old markdown files
echo -e "${YELLOW}📄 Archiving old documentation...${NC}"

old_docs=(
    "API_TESTING.md"
    "CI_CD_ARCHITECTURE.md"
    "CI_CD_COMPLETE.md"
    "CI_CD_GUIDE.md"
    "DEPLOYMENT.md"
    "DEPLOYMENT_CHECKLIST.md"
    "DEPLOYMENT_READY.md"
    "FILES_INVENTORY.md"
    "FINAL_SUMMARY.md"
    "GITHUB_NETLIFY_SETUP.md"
    "HOSTINGER_DEPLOYMENT_GUIDE.md"
    "HOSTINGER_NODEJS_SETUP.md"
    "IMPLEMENTATION.md"
    "MIGRATION_README.md"
    "MONGODB_SETUP.md"
    "NETLIFY_URL_GUIDE.md"
    "PROJECT_COMPLETION.md"
    "PROJECT_SUMMARY.md"
    "QUICK_MONGODB_SETUP.md"
    "QUICK_REFERENCE.md"
    "QUICK_SETUP.md"
    "SETUP.md"
    "SQLITE_DEPLOYMENT_START.md"
    "SQLITE_MIGRATION_SUMMARY.md"
    "SSH_GUIDE.md"
    "START_HERE.md"
    "UPLOAD_GUIDE.md"
    "VERCEL_RAILWAY_DEPLOY.md"
)

for doc in "${old_docs[@]}"; do
    if [ -f "$doc" ]; then
        mv "$doc" "${ARCHIVE_DIR}/docs/"
        echo "  ✓ Archived: $doc"
    fi
done

# Archive old scripts
echo ""
echo -e "${YELLOW}📜 Archiving old scripts...${NC}"

old_scripts=(
    "auto-deploy.exp"
    "check-deployment.sh"
    "check-node.sh"
    "connect-auto.exp"
    "connect-hostinger.sh"
    "deploy-to-hostinger.sh"
    "hostinger-backup.sh"
    "hostinger-deploy.sh"
    "hostinger-final-deploy.sh"
    "hostinger-nodejs-setup.sh"
    "migrate-to-sqlite.sh"
    "move-to-subdomain.sh"
    "ngrok-tunnel.sh"
    "quick-setup.sh"
    "server-setup.sh"
    "setup-github-netlify.sh"
    "setup-ssh-key.sh"
    "start.sh"
    "test-setup.sh"
)

for script in "${old_scripts[@]}"; do
    if [ -f "$script" ]; then
        mv "$script" "${ARCHIVE_DIR}/scripts/"
        echo "  ✓ Archived: $script"
    fi
done

# Archive misc files
echo ""
echo -e "${YELLOW}📦 Archiving misc files...${NC}"

misc_files=(
    "QUICKSTART.txt"
    "Multi-Project Planner.html"
    "Procfile"
    "netlify.toml"
    "railway.json"
    "vercel.json"
)

for file in "${misc_files[@]}"; do
    if [ -f "$file" ]; then
        mv "$file" "${ARCHIVE_DIR}/"
        echo "  ✓ Archived: $file"
    fi
done

# Archive admin.agbitsolutions.com duplicate directory
if [ -d "admin.agbitsolutions.com" ]; then
    echo ""
    echo -e "${YELLOW}📁 Archiving duplicate admin.agbitsolutions.com directory...${NC}"
    mv "admin.agbitsolutions.com" "${ARCHIVE_DIR}/"
    echo "  ✓ Archived: admin.agbitsolutions.com/"
fi

# Create new simplified README
echo ""
echo -e "${YELLOW}📝 Creating new README...${NC}"

cat > "${PROJECT_ROOT}/README.md" << 'EOF'
# 🚀 AGB IT Solutions - Admin Planner

> Multi-Project Planning Application with Team Collaboration

## Quick Start

```bash
# Setup
./scripts/setup.sh

# Start development server
cd backend && npm start

# Deploy
./scripts/deploy.sh hostinger
```

## Documentation

See [Complete Guide](docs/COMPLETE_GUIDE.md) for full documentation.

## Project Structure

```
agb_planner/
├── backend/          # Node.js API server
├── frontend/         # Static web files
├── docs/            # Documentation
├── scripts/         # Deployment scripts
└── archive/         # Old/backup files
```

## Deployment

```bash
# Hostinger
./scripts/deploy.sh hostinger

# Fix broken main site
./scripts/deploy.sh hostinger --fix-subdomain

# Local development
./scripts/deploy.sh local
```

## Support

- **Main Site:** https://agbitsolutions.com
- **Admin Panel:** https://admin.agbitsolutions.com
- **Documentation:** [docs/COMPLETE_GUIDE.md](docs/COMPLETE_GUIDE.md)

---

**Version:** 1.0.0 | **Last Updated:** December 31, 2025
EOF

echo "  ✓ Created: README.md"

# Create .gitignore if not exists
if [ ! -f ".gitignore" ]; then
    cat > "${PROJECT_ROOT}/.gitignore" << 'EOF'
# Dependencies
node_modules/
package-lock.json

# Environment
.env
.env.local
.env.production

# Database
database.sqlite
*.db

# Logs
*.log
logs/

# Build outputs
dist/
build/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Backups & Archives
archive/backup_*/

# Temp files
*.tmp
.cache/
EOF
    echo "  ✓ Created: .gitignore"
fi

echo ""
echo -e "${GREEN}✅ Cleanup complete!${NC}"
echo ""
echo "Summary:"
echo "  • Archived ${#old_docs[@]} documentation files"
echo "  • Archived ${#old_scripts[@]} script files"
echo "  • Archived ${#misc_files[@]} misc files"
echo "  • Archive location: ${ARCHIVE_DIR}"
echo ""
echo "New structure:"
echo "  • Documentation: docs/COMPLETE_GUIDE.md"
echo "  • Setup: scripts/setup.sh"
echo "  • Deploy: scripts/deploy.sh"
echo ""
