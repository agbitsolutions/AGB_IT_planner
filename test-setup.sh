#!/bin/bash

# Comprehensive Testing Script for AGB IT Planner CI/CD

echo "═══════════════════════════════════════════════════════════════"
echo "🧪 AGB IT Planner - Comprehensive Test Suite"
echo "═══════════════════════════════════════════════════════════════"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Helper function to run tests
run_test() {
    local test_name=$1
    local command=$2
    
    echo -e "\n${YELLOW}🔍 Testing: $test_name${NC}"
    
    if eval "$command" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ PASSED${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗ FAILED${NC}"
        ((TESTS_FAILED++))
    fi
}

# Test 1: Check Node.js
run_test "Node.js installed" "node --version"

# Test 2: Check npm
run_test "npm installed" "npm --version"

# Test 3: Check backend dependencies
echo -e "\n${YELLOW}🔍 Testing: Backend dependencies${NC}"
if [ -d "backend/node_modules" ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ FAILED${NC} (Run: cd backend && npm install)"
    ((TESTS_FAILED++))
fi

# Test 4: Check git
run_test "Git installed" "git --version"

# Test 5: Check git repository
echo -e "\n${YELLOW}🔍 Testing: Git repository initialized${NC}"
if [ -d ".git" ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ FAILED${NC} (Run: git init)"
    ((TESTS_FAILED++))
fi

# Test 6: Check backend server.js exists
run_test "Backend server.js exists" "test -f backend/server.js"

# Test 7: Check frontend index.html exists
run_test "Frontend index.html exists" "test -f frontend/index.html"

# Test 8: Check .github workflows
run_test "GitHub Actions deploy.yml" "test -f .github/workflows/deploy.yml"
run_test "GitHub Actions backend.yml" "test -f .github/workflows/backend.yml"

# Test 9: Check netlify.toml
run_test "Netlify config exists" "test -f netlify.toml"

# Test 10: Check configuration file
run_test "Frontend config.js exists" "test -f frontend/js/config.js"

# Test 11: Check .gitignore
run_test ".gitignore exists" "test -f .gitignore"

# Test 12: Check documentation
run_test "CI_CD_GUIDE.md exists" "test -f CI_CD_GUIDE.md"
run_test "GITHUB_NETLIFY_SETUP.md exists" "test -f GITHUB_NETLIFY_SETUP.md"
run_test "DEPLOYMENT.md exists" "test -f DEPLOYMENT.md"

# Test 13: Check start script exists
run_test "start.sh script exists" "test -f start.sh"

# Test 14: Check start script executable
echo -e "\n${YELLOW}🔍 Testing: start.sh is executable${NC}"
if [ -x "start.sh" ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ FAILED${NC} (Run: chmod +x start.sh)"
    ((TESTS_FAILED++))
fi

# Test 15: Check package.json files
run_test "Root package.json exists" "test -f package.json"
run_test "Backend package.json exists" "test -f backend/package.json"
run_test "Frontend package.json exists" "test -f frontend/package.json"

# Summary
echo -e "\n${YELLOW}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Tests Passed: $TESTS_PASSED${NC}"
if [ $TESTS_FAILED -gt 0 ]; then
    echo -e "${RED}✗ Tests Failed: $TESTS_FAILED${NC}"
else
    echo -e "${GREEN}✓ All tests passed!${NC}"
fi
echo -e "${YELLOW}═══════════════════════════════════════════════════════════════${NC}"

# Exit code
if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "\n${GREEN}✅ Your project is ready for deployment!${NC}"
    echo -e "\n${YELLOW}Next steps:${NC}"
    echo "1. Create GitHub repository: https://github.com/new"
    echo "2. Push code: git push -u origin main"
    echo "3. Set up Netlify: https://app.netlify.com"
    echo "4. Add GitHub secrets: NETLIFY_SITE_ID, NETLIFY_AUTH_TOKEN"
    echo "5. See GITHUB_NETLIFY_SETUP.md for detailed instructions"
    exit 0
else
    echo -e "\n${RED}❌ Please fix the failing tests before deployment${NC}"
    exit 1
fi
