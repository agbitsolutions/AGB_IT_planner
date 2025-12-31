#!/bin/bash

################################################################################
# AGB IT Solutions - Unified Deployment Script
# Version: 1.0.0
# Description: Single deployment script with multiple platform support
# Usage: ./scripts/deploy.sh [platform] [options]
#
# Platforms: hostinger, netlify, railway, vercel, local
# Options: --manual, --fix-subdomain, --rollback, --dry-run
################################################################################

set -e  # Exit on error

# Colors for output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly MAGENTA='\033[0;35m'
readonly CYAN='\033[0;36m'
readonly NC='\033[0m' # No Color

# Configuration
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
readonly TIMESTAMP=$(date +%Y%m%d_%H%M%S)
readonly BACKUP_DIR="${PROJECT_ROOT}/archive/backup_${TIMESTAMP}"

# Hostinger Configuration
readonly HOSTINGER_HOST="89.117.157.109"
readonly HOSTINGER_PORT="65002"
readonly HOSTINGER_USER="u544547223"
readonly HOSTINGER_ROOT="~/domains/agbitsolutions.com/public_html"
readonly HOSTINGER_ADMIN_DIR="${HOSTINGER_ROOT}/admin"

# Version
readonly VERSION="1.0.0"

################################################################################
# Utility Functions
################################################################################

print_header() {
    echo ""
    echo -e "${CYAN}================================================================${NC}"
    echo -e "${CYAN}  🚀 AGB IT Solutions - Deployment Script v${VERSION}${NC}"
    echo -e "${CYAN}================================================================${NC}"
    echo ""
}

print_section() {
    echo ""
    echo -e "${BLUE}▶ $1${NC}"
    echo -e "${BLUE}────────────────────────────────────────${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

print_usage() {
    cat << EOF
Usage: $0 [PLATFORM] [OPTIONS]

PLATFORMS:
  hostinger         Deploy to Hostinger VPS
  netlify          Deploy to Netlify (frontend only)
  railway          Deploy to Railway
  vercel           Deploy to Vercel
  local            Local development setup

OPTIONS:
  --manual         Manual deployment (step-by-step)
  --fix-subdomain  Fix broken main site (move admin to subdomain)
  --rollback       Rollback to previous version
  --dry-run        Show what would be done without doing it
  --help           Show this help message

EXAMPLES:
  $0 hostinger                    # Auto deploy to Hostinger
  $0 hostinger --manual           # Manual Hostinger deployment
  $0 hostinger --fix-subdomain    # Fix subdomain structure
  $0 netlify                      # Deploy to Netlify
  $0 local                        # Setup local environment

EOF
}

check_dependencies() {
    local deps=("$@")
    local missing=()
    
    for cmd in "${deps[@]}"; do
        if ! command -v "$cmd" &> /dev/null; then
            missing+=("$cmd")
        fi
    done
    
    if [ ${#missing[@]} -gt 0 ]; then
        print_error "Missing dependencies: ${missing[*]}"
        print_info "Install them and try again"
        exit 1
    fi
}

confirm_action() {
    local prompt="$1"
    local response
    
    echo -e "${YELLOW}$prompt (y/N): ${NC}"
    read -r response
    
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        print_warning "Action cancelled"
        exit 0
    fi
}

create_backup() {
    print_section "Creating Backup"
    
    mkdir -p "$BACKUP_DIR"
    
    if [ -d "${PROJECT_ROOT}/backend" ]; then
        cp -r "${PROJECT_ROOT}/backend" "${BACKUP_DIR}/"
        print_success "Backend backed up"
    fi
    
    if [ -d "${PROJECT_ROOT}/frontend" ]; then
        cp -r "${PROJECT_ROOT}/frontend" "${BACKUP_DIR}/"
        print_success "Frontend backed up"
    fi
    
    if [ -f "${PROJECT_ROOT}/database.sqlite" ]; then
        cp "${PROJECT_ROOT}/database.sqlite" "${BACKUP_DIR}/"
        print_success "Database backed up"
    fi
    
    print_success "Backup created at: ${BACKUP_DIR}"
}

################################################################################
# Platform-Specific Functions
################################################################################

# ──────────────────────────────────────
# Hostinger Deployment
# ──────────────────────────────────────

deploy_hostinger() {
    print_section "Hostinger Deployment"
    
    check_dependencies "ssh" "tar" "scp"
    
    # Check SSH connection
    print_info "Testing SSH connection..."
    if ! ssh -p "$HOSTINGER_PORT" "${HOSTINGER_USER}@${HOSTINGER_HOST}" "echo 'Connection OK'" &> /dev/null; then
        print_error "Cannot connect to Hostinger. Check SSH credentials."
        exit 1
    fi
    print_success "SSH connection verified"
    
    # Create deployment package
    print_section "Creating Deployment Package"
    
    cd "$PROJECT_ROOT" || exit 1
    
    local archive="/tmp/agb_admin_${TIMESTAMP}.tar.gz"
    
    tar -czf "$archive" \
        --exclude='node_modules' \
        --exclude='database.sqlite' \
        --exclude='.git' \
        --exclude='*.log' \
        --exclude='archive' \
        --exclude='admin.agbitsolutions.com' \
        backend/ frontend/ 2>/dev/null
    
    local size=$(du -h "$archive" | cut -f1)
    print_success "Package created: $size"
    
    # Upload package
    print_section "Uploading to Hostinger"
    
    scp -P "$HOSTINGER_PORT" "$archive" "${HOSTINGER_USER}@${HOSTINGER_HOST}:~/" || {
        print_error "Upload failed"
        rm -f "$archive"
        exit 1
    }
    
    print_success "Upload complete"
    rm -f "$archive"
    
    # Deploy on server
    print_section "Deploying on Server"
    
    ssh -p "$HOSTINGER_PORT" "${HOSTINGER_USER}@${HOSTINGER_HOST}" << 'ENDSSH'
set -e

# Configuration
ADMIN_DIR="~/domains/agbitsolutions.com/public_html/admin"
ARCHIVE=$(ls -t ~/agb_admin_*.tar.gz | head -1)

echo "📁 Deploying to: $ADMIN_DIR"

# Create directory structure
mkdir -p "$ADMIN_DIR"
cd "$ADMIN_DIR"

# Backup existing files
if [ "$(ls -A)" ]; then
    BACKUP_DIR="$HOME/admin_backup_$(date +%Y%m%d_%H%M%S)"
    echo "💾 Backing up to: $BACKUP_DIR"
    mkdir -p "$BACKUP_DIR"
    mv ./* "$BACKUP_DIR/" 2>/dev/null || true
fi

# Extract new files
echo "📦 Extracting files..."
tar -xzf "$ARCHIVE" -C "$ADMIN_DIR"

# Install dependencies
echo "📥 Installing dependencies..."
cd "$ADMIN_DIR/backend"
npm install --production --no-audit

# Setup environment
if [ ! -f ".env" ]; then
    echo "⚙️  Creating .env file..."
    cat > .env << 'EOF'
DB_PATH=./database.sqlite
NODE_ENV=production
PORT=5000
JWT_SECRET=CHANGE_THIS_SECRET_NOW
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EOF
    echo "⚠️  IMPORTANT: Update .env with your credentials!"
fi

# Set permissions
chmod 755 "$ADMIN_DIR"
chmod 644 "$ADMIN_DIR/backend/.env"

# Cleanup
rm -f "$ARCHIVE"

echo "✅ Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Update .env file with your credentials"
echo "2. Setup Node.js app in Hostinger panel:"
echo "   - App root: /public_html/admin"
echo "   - Entry file: backend/server.js"
echo "   - Node version: 14.x or higher"
echo "3. Start the application"

ENDSSH
    
    print_success "Hostinger deployment complete!"
    print_info "Access your admin panel at: https://admin.agbitsolutions.com"
}

deploy_hostinger_manual() {
    print_section "Manual Hostinger Deployment"
    
    print_info "Follow these steps:"
    echo ""
    echo "1. SSH to server:"
    echo "   ssh -p ${HOSTINGER_PORT} ${HOSTINGER_USER}@${HOSTINGER_HOST}"
    echo ""
    echo "2. Navigate to admin directory:"
    echo "   cd ${HOSTINGER_ADMIN_DIR}"
    echo ""
    echo "3. Clone/update repository:"
    echo "   git pull origin main"
    echo ""
    echo "4. Install dependencies:"
    echo "   cd backend && npm install --production"
    echo ""
    echo "5. Configure environment:"
    echo "   cp .env.example .env"
    echo "   nano .env"
    echo ""
    echo "6. Setup in Hostinger panel:"
    echo "   - Application root: /public_html/admin"
    echo "   - Entry file: backend/server.js"
    echo "   - Node.js version: 14+"
    echo ""
    echo "7. Start application from panel"
    echo ""
}

fix_subdomain_structure() {
    print_section "Fixing Subdomain Structure"
    
    print_warning "This will move admin files from root to subdomain"
    confirm_action "Continue with fix?"
    
    ssh -p "$HOSTINGER_PORT" "${HOSTINGER_USER}@${HOSTINGER_HOST}" << 'ENDSSH'
set -e

ROOT_DIR="~/domains/agbitsolutions.com/public_html"
ADMIN_DIR="$ROOT_DIR/admin"

echo "🔍 Checking directory structure..."

# Create admin directory if not exists
mkdir -p "$ADMIN_DIR"

# Move admin files from root to subdomain
if [ -d "$ROOT_DIR/backend" ]; then
    echo "📦 Moving backend to admin subdomain..."
    mv "$ROOT_DIR/backend" "$ADMIN_DIR/"
fi

if [ -d "$ROOT_DIR/frontend" ]; then
    echo "📦 Moving frontend to admin subdomain..."
    mv "$ROOT_DIR/frontend" "$ADMIN_DIR/"
fi

if [ -f "$ROOT_DIR/database.sqlite" ]; then
    echo "📦 Moving database to admin subdomain..."
    mv "$ROOT_DIR/database.sqlite" "$ADMIN_DIR/"
fi

# Remove any admin-related files from root
find "$ROOT_DIR" -maxdepth 1 -type f \( -name "*.sh" -o -name "*.exp" \) -delete

echo "✅ Structure fixed!"
echo ""
echo "Main site (root): $ROOT_DIR"
echo "Admin module: $ADMIN_DIR"

ENDSSH
    
    print_success "Subdomain structure fixed!"
    print_info "Main site should now be working"
    print_info "Admin module at: https://admin.agbitsolutions.com"
}

# ──────────────────────────────────────
# Netlify Deployment
# ──────────────────────────────────────

deploy_netlify() {
    print_section "Netlify Deployment"
    
    check_dependencies "netlify"
    
    print_warning "Netlify deployment is for frontend only"
    print_info "Backend must be deployed separately"
    
    cd "${PROJECT_ROOT}/frontend" || exit 1
    
    if [ ! -f "netlify.toml" ]; then
        print_info "Creating netlify.toml..."
        cat > netlify.toml << 'EOF'
[build]
  publish = "."
  
[[redirects]]
  from = "/api/*"
  to = "https://your-backend-url.com/api/:splat"
  status = 200
  force = true
EOF
    fi
    
    netlify deploy --prod
    
    print_success "Netlify deployment complete!"
}

# ──────────────────────────────────────
# Railway Deployment
# ──────────────────────────────────────

deploy_railway() {
    print_section "Railway Deployment"
    
    check_dependencies "railway"
    
    cd "$PROJECT_ROOT" || exit 1
    
    # Ensure railway.json exists
    if [ ! -f "railway.json" ]; then
        print_info "Creating railway.json..."
        cat > railway.json << 'EOF'
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "cd backend && npm install --production"
  },
  "deploy": {
    "startCommand": "cd backend && npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
EOF
    fi
    
    railway up
    
    print_success "Railway deployment complete!"
}

# ──────────────────────────────────────
# Vercel Deployment
# ──────────────────────────────────────

deploy_vercel() {
    print_section "Vercel Deployment"
    
    check_dependencies "vercel"
    
    print_warning "Vercel is recommended for frontend only"
    
    cd "$PROJECT_ROOT" || exit 1
    
    vercel --prod
    
    print_success "Vercel deployment complete!"
}

# ──────────────────────────────────────
# Local Development Setup
# ──────────────────────────────────────

setup_local() {
    print_section "Local Development Setup"
    
    cd "$PROJECT_ROOT" || exit 1
    
    # Backend setup
    print_info "Setting up backend..."
    cd backend || exit 1
    
    if [ ! -f ".env" ]; then
        cat > .env << 'EOF'
DB_PATH=./database.sqlite
NODE_ENV=development
PORT=5000
JWT_SECRET=dev_secret_change_in_production
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EOF
        print_success ".env created"
    fi
    
    npm install
    print_success "Dependencies installed"
    
    # Test database
    print_info "Testing database connection..."
    node << 'ENDNODE'
import { connectDB } from './config/database.js';
connectDB().then(() => {
  console.log('✅ Database connected');
  process.exit(0);
}).catch(err => {
  console.error('❌ Database error:', err.message);
  process.exit(1);
});
ENDNODE
    
    print_success "Local setup complete!"
    echo ""
    print_info "Start development server:"
    echo "  cd backend && npm start"
    echo ""
    print_info "Access application:"
    echo "  http://localhost:5000"
}

################################################################################
# Rollback Function
################################################################################

rollback_deployment() {
    print_section "Rolling Back Deployment"
    
    local backups=($(ls -dt "${PROJECT_ROOT}/archive/backup_"* 2>/dev/null))
    
    if [ ${#backups[@]} -eq 0 ]; then
        print_error "No backups found"
        exit 1
    fi
    
    echo "Available backups:"
    for i in "${!backups[@]}"; do
        echo "  $((i+1)). $(basename "${backups[$i]}")"
    done
    
    echo ""
    echo -n "Select backup to restore (1-${#backups[@]}): "
    read -r selection
    
    if [[ ! "$selection" =~ ^[0-9]+$ ]] || [ "$selection" -lt 1 ] || [ "$selection" -gt ${#backups[@]} ]; then
        print_error "Invalid selection"
        exit 1
    fi
    
    local backup_dir="${backups[$((selection-1))]}"
    
    confirm_action "Restore from $(basename "$backup_dir")?"
    
    if [ -d "${backup_dir}/backend" ]; then
        rm -rf "${PROJECT_ROOT}/backend"
        cp -r "${backup_dir}/backend" "${PROJECT_ROOT}/"
        print_success "Backend restored"
    fi
    
    if [ -d "${backup_dir}/frontend" ]; then
        rm -rf "${PROJECT_ROOT}/frontend"
        cp -r "${backup_dir}/frontend" "${PROJECT_ROOT}/"
        print_success "Frontend restored"
    fi
    
    if [ -f "${backup_dir}/database.sqlite" ]; then
        cp "${backup_dir}/database.sqlite" "${PROJECT_ROOT}/"
        print_success "Database restored"
    fi
    
    print_success "Rollback complete!"
}

################################################################################
# Main Script
################################################################################

main() {
    print_header
    
    # Parse arguments
    local platform="${1:-}"
    local option="${2:-}"
    
    # Show help
    if [ "$platform" = "--help" ] || [ "$platform" = "-h" ] || [ -z "$platform" ]; then
        print_usage
        exit 0
    fi
    
    # Change to project root
    cd "$PROJECT_ROOT" || exit 1
    
    # Handle options
    case "$option" in
        --dry-run)
            print_info "DRY RUN MODE - No changes will be made"
            print_info "Would deploy to: $platform"
            exit 0
            ;;
        --rollback)
            rollback_deployment
            exit 0
            ;;
    esac
    
    # Create backup before deployment
    if [ "$option" != "--manual" ]; then
        create_backup
    fi
    
    # Platform dispatch
    case "$platform" in
        hostinger)
            case "$option" in
                --manual)
                    deploy_hostinger_manual
                    ;;
                --fix-subdomain)
                    fix_subdomain_structure
                    ;;
                *)
                    deploy_hostinger
                    ;;
            esac
            ;;
        netlify)
            deploy_netlify
            ;;
        railway)
            deploy_railway
            ;;
        vercel)
            deploy_vercel
            ;;
        local)
            setup_local
            ;;
        *)
            print_error "Unknown platform: $platform"
            echo ""
            print_usage
            exit 1
            ;;
    esac
    
    # Success message
    echo ""
    print_success "All done! 🎉"
    echo ""
}

# Run main function
main "$@"
