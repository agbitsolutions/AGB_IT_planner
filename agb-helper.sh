#!/bin/bash

################################################################################
# AGB IT Solutions - Helper Script
# Quick commands for common tasks
################################################################################

readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly CYAN='\033[0;36m'
readonly NC='\033[0m'

show_menu() {
    clear
    echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║    🚀 AGB IT Solutions - Admin Planner Helper             ║${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${BLUE}Setup & Development:${NC}"
    echo "  1) Setup project (first time)"
    echo "  2) Start development server"
    echo "  3) Test API health"
    echo "  4) View logs"
    echo ""
    echo -e "${BLUE}Deployment:${NC}"
    echo "  5) Deploy to Hostinger"
    echo "  6) Fix main site (subdomain issue)"
    echo "  7) Deploy to Netlify"
    echo "  8) Rollback deployment"
    echo ""
    echo -e "${BLUE}Information:${NC}"
    echo "  9) View documentation"
    echo "  10) Show project structure"
    echo "  11) Check deployment status"
    echo ""
    echo "  0) Exit"
    echo ""
    echo -n "Select option: "
}

setup_project() {
    echo -e "${YELLOW}Setting up project...${NC}"
    ./scripts/setup.sh
}

start_dev_server() {
    echo -e "${YELLOW}Starting development server...${NC}"
    cd backend && npm start
}

test_api() {
    echo -e "${YELLOW}Testing API health...${NC}"
    if command -v curl &> /dev/null; then
        curl -s http://localhost:5000/api/health | python3 -m json.tool 2>/dev/null || curl http://localhost:5000/api/health
    else
        echo "curl not installed. Install it to test API."
    fi
    echo ""
    read -p "Press enter to continue..."
}

view_logs() {
    echo -e "${YELLOW}Recent logs:${NC}"
    if [ -f "backend/logs/app.log" ]; then
        tail -n 50 backend/logs/app.log
    elif [ -f "start.log" ]; then
        tail -n 50 start.log
    else
        echo "No logs found"
    fi
    echo ""
    read -p "Press enter to continue..."
}

deploy_hostinger() {
    echo -e "${YELLOW}Deploying to Hostinger...${NC}"
    ./scripts/deploy.sh hostinger
    read -p "Press enter to continue..."
}

fix_main_site() {
    echo -e "${YELLOW}Fixing main site subdomain structure...${NC}"
    ./scripts/deploy.sh hostinger --fix-subdomain
    read -p "Press enter to continue..."
}

deploy_netlify() {
    echo -e "${YELLOW}Deploying to Netlify...${NC}"
    ./scripts/deploy.sh netlify
    read -p "Press enter to continue..."
}

rollback() {
    echo -e "${YELLOW}Rolling back deployment...${NC}"
    ./scripts/deploy.sh hostinger --rollback
    read -p "Press enter to continue..."
}

view_docs() {
    clear
    if command -v bat &> /dev/null; then
        bat docs/COMPLETE_GUIDE.md
    elif command -v less &> /dev/null; then
        less docs/COMPLETE_GUIDE.md
    else
        cat docs/COMPLETE_GUIDE.md
    fi
}

show_structure() {
    clear
    echo -e "${CYAN}Project Structure:${NC}"
    echo ""
    echo "agb_planner/"
    echo "├── backend/           Node.js API server"
    echo "├── frontend/          Web interface"
    echo "├── docs/             Documentation"
    echo "│   ├── COMPLETE_GUIDE.md"
    echo "│   └── CONSOLIDATION_SUMMARY.md"
    echo "├── scripts/          Deployment scripts"
    echo "│   ├── deploy.sh     Unified deployment"
    echo "│   ├── setup.sh      Project setup"
    echo "│   └── cleanup.sh    Organization tool"
    echo "├── archive/          Backup files"
    echo "└── README.md         Quick reference"
    echo ""
    echo -e "${BLUE}Key Commands:${NC}"
    echo "  Setup:   ./scripts/setup.sh"
    echo "  Deploy:  ./scripts/deploy.sh hostinger"
    echo "  Start:   cd backend && npm start"
    echo ""
    read -p "Press enter to continue..."
}

check_deployment() {
    clear
    echo -e "${CYAN}Checking Deployment Status...${NC}"
    echo ""
    
    echo -e "${YELLOW}Local Server:${NC}"
    if curl -s http://localhost:5000/api/health &> /dev/null; then
        echo -e "  ${GREEN}✓${NC} Running at http://localhost:5000"
    else
        echo -e "  ${YELLOW}○${NC} Not running"
    fi
    echo ""
    
    echo -e "${YELLOW}Production (Hostinger):${NC}"
    if curl -s https://admin.agbitsolutions.com/api/health &> /dev/null; then
        echo -e "  ${GREEN}✓${NC} Running at https://admin.agbitsolutions.com"
    else
        echo -e "  ${YELLOW}○${NC} Not accessible or down"
    fi
    echo ""
    
    echo -e "${YELLOW}Main Site:${NC}"
    if curl -s https://agbitsolutions.com &> /dev/null; then
        echo -e "  ${GREEN}✓${NC} Running at https://agbitsolutions.com"
    else
        echo -e "  ${YELLOW}○${NC} Not accessible"
    fi
    echo ""
    
    read -p "Press enter to continue..."
}

# Main loop
main() {
    cd "$(dirname "$0")/.." || exit 1
    
    while true; do
        show_menu
        read -r choice
        
        case $choice in
            1) setup_project ;;
            2) start_dev_server ;;
            3) test_api ;;
            4) view_logs ;;
            5) deploy_hostinger ;;
            6) fix_main_site ;;
            7) deploy_netlify ;;
            8) rollback ;;
            9) view_docs ;;
            10) show_structure ;;
            11) check_deployment ;;
            0) 
                echo -e "${GREEN}Goodbye!${NC}"
                exit 0
                ;;
            *)
                echo -e "${YELLOW}Invalid option${NC}"
                sleep 1
                ;;
        esac
    done
}

main
