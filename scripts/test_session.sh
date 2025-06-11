#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Base URL
BASE_URL="http://localhost:5000"

# Test function
test_endpoint() {
    echo -e "\n${GREEN}Testing: $1${NC}"
    echo "Command: $2"
    eval $2
    echo
}

# 1. Health Check
test_endpoint "Health Check" "curl $BASE_URL/health"

# 2. Register (comment out if user exists)
test_endpoint "Register User" "curl -X POST $BASE_URL/auth/register \
  -H 'Content-Type: application/json' \
  -d '{\"email\": \"test@example.com\", \"password\": \"testpass123\", \"username\": \"testuser\"}'"

# 3. Login
echo -e "\n${GREEN}Logging in to get token...${NC}"
TOKEN=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }' | jq -r '.token')

if [ -z "$TOKEN" ]; then
    echo -e "${RED}Failed to get token${NC}"
    exit 1
fi

echo "Token: ${TOKEN:0:20}..."

# 4. Validate token
test_endpoint "Validate Token" "curl -X GET $BASE_URL/auth/validate-token \
  -H 'Authorization: Bearer $TOKEN'"

# 5. Get token info
test_endpoint "Token Info" "curl -X GET $BASE_URL/auth/token-info \
  -H 'Authorization: Bearer $TOKEN'"

# 6. Get user profile
test_endpoint "Get Profile" "curl -X GET $BASE_URL/user/profile \
  -H 'Authorization: Bearer $TOKEN'"

# 7. Update profile
test_endpoint "Update Profile" "curl -X PUT $BASE_URL/user/profile \
  -H 'Authorization: Bearer $TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{\"username\": \"updated_user\"}'"

# 8. Get updated profile
test_endpoint "Get Updated Profile" "curl -X GET $BASE_URL/user/profile \
  -H 'Authorization: Bearer $TOKEN'"

# 9. Logout
test_endpoint "Logout" "curl -X POST $BASE_URL/auth/logout \
  -H 'Authorization: Bearer $TOKEN'"

# 10. Try to use token after logout (should fail)
test_endpoint "Use Token After Logout" "curl -X GET $BASE_URL/user/profile \
  -H 'Authorization: Bearer $TOKEN'" 