#!/bin/bash

################################################################################
# AGB IT Solutions - Unified Setup Script
# Version: 1.0.0
# Description: Single setup script for all environments
# Usage: ./scripts/setup.sh [options]
################################################################################

set -e

# Colors
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly CYAN='\033[0;36m'
readonly NC='\033[0m'

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

print_header() {
    echo ""
    echo -e "${CYAN}================================================================${NC}"
    echo -e "${CYAN}  🚀 AGB IT Solutions - Setup Script${NC}"
    echo -e "${CYAN}================================================================${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

main() {
    print_header
    
    cd "$PROJECT_ROOT" || exit 1
    
    # Check directories
    if [ ! -d "backend" ]; then
        echo "❌ Error: backend directory not found!"
        exit 1
    fi
    
    cd backend || exit 1
    
    # Create .env if not exists
    if [ ! -f ".env" ]; then
        print_info "Creating .env file..."
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
        print_warning "Remember to update credentials in .env"
    else
        print_info ".env already exists"
    fi
    
    # Install dependencies
    print_info "Installing dependencies..."
    npm install
    print_success "Dependencies installed"
    
    # Test database
    print_info "Testing database connection..."
    cat > test-db.js << 'EOF'
import { connectDB } from './config/database.js';
import './models/index.js';

connectDB().then(() => {
  console.log('✅ Database connection successful!');
  process.exit(0);
}).catch(err => {
  console.error('❌ Database connection failed:', err.message);
  process.exit(1);
});
EOF
    
    node test-db.js
    rm test-db.js
    
    echo ""
    print_success "Setup complete! 🎉"
    echo ""
    echo "Next steps:"
    echo "  1. Update backend/.env with your credentials"
    echo "  2. Start server: cd backend && npm start"
    echo "  3. Access: http://localhost:5000"
    echo "  4. Deploy: ./scripts/deploy.sh [platform]"
    echo ""
    print_info "See docs/COMPLETE_GUIDE.md for full documentation"
}

main "$@"
