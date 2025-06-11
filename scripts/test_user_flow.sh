#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Base URL
API_URL="http://localhost:5000/api/v1"
TOKEN=""
REFRESH_TOKEN=""

# Helper function to check response success
check_response() {
  local response=$1
  local step=$2
  
  if echo "$response" | jq -e '.success == true' > /dev/null; then
    echo -e "${GREEN}✓ $step successful${NC}"
    return 0
  else
    local error_msg=$(echo "$response" | jq -r '.error.message // "Unknown error"')
    local error_code=$(echo "$response" | jq -r '.error.code // "unknown"')
    echo -e "${RED}✗ $step failed: $error_msg (code: $error_code)${NC}"
    return 1
  fi
}

echo "🔍 Testing User Flow"
echo "===================="

# 1. Health Check
echo -e "\n${GREEN}Testing Health Check${NC}"
HEALTH_RESPONSE=$(curl -s -X GET "${API_URL}/health")
echo $HEALTH_RESPONSE

# 2. User Registration
echo -e "\n${GREEN}Testing User Registration${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "${API_URL}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "grayoluu@gmail.com",
    "password": "Test123!",
    "confirm_password": "Test123!",
    "first_name": "Gray",
    "last_name": "Oluu",
    "username": "grayoluu",
    "preferences": {
      "dietary_flags": ["vegetarian"],
      "content_filters": ["spicy"]
    }
  }')
echo $REGISTER_RESPONSE

if ! check_response "$REGISTER_RESPONSE" "Registration"; then
  echo -e "${YELLOW}Continuing with login since user might already exist${NC}"
fi

# 3. User Login
echo -e "\n${GREEN}Testing User Login${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "${API_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "grayoluu@gmail.com",
    "password": "Test123!"
  }')
echo $LOGIN_RESPONSE

if ! check_response "$LOGIN_RESPONSE" "Login"; then
  echo -e "${RED}Login failed. Cannot continue without valid token.${NC}"
  exit 1
fi

# Extract tokens from new response format
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.session.access_token')
REFRESH_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.session.refresh_token')

if [[ "$TOKEN" == "null" || -z "$TOKEN" ]]; then
  echo -e "${RED}Failed to extract access token from response${NC}"
  exit 1
fi

if [[ "$REFRESH_TOKEN" == "null" || -z "$REFRESH_TOKEN" ]]; then
  echo -e "${YELLOW}Warning: No refresh token in response${NC}"
fi

echo -e "${GREEN}Successfully obtained access token: ${TOKEN:0:10}...${NC}"

# 4. Validate Token
echo -e "\n${GREEN}Testing Token Validation${NC}"
VALIDATE_RESPONSE=$(curl -s -X GET "${API_URL}/auth/validate-token" \
  -H "Authorization: Bearer ${TOKEN}")
check_response "$VALIDATE_RESPONSE" "Token Validation"

# 5. Get User Profile
echo -e "\n${GREEN}Testing Get Profile${NC}"
PROFILE_RESPONSE=$(curl -s -X GET "${API_URL}/user/profile" \
  -H "Authorization: Bearer ${TOKEN}")
check_response "$PROFILE_RESPONSE" "Get Profile"

# 6. Update User Profile
echo -e "\n${GREEN}Testing Update Profile${NC}"
UPDATE_RESPONSE=$(curl -s -X PUT "${API_URL}/user/profile" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "preferences": {
      "dietary_flags": ["vegetarian", "gluten-free"],
      "content_filters": ["spicy", "nuts"]
    }
  }')
check_response "$UPDATE_RESPONSE" "Update Profile"

# 7. Add to Favorites
echo -e "\n${GREEN}Testing Add to Favorites${NC}"
ADD_FAV_RESPONSE=$(curl -s -X POST "${API_URL}/user/favorites" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "item_id": "123",
    "item_type": "meal",
    "item_data": {
      "name": "Vegetarian Pasta",
      "ingredients": ["pasta", "tomatoes", "basil"]
    }
  }')
check_response "$ADD_FAV_RESPONSE" "Add to Favorites"

# 8. Get Favorites
echo -e "\n${GREEN}Testing Get Favorites${NC}"
GET_FAV_RESPONSE=$(curl -s -X GET "${API_URL}/user/favorites" \
  -H "Authorization: Bearer ${TOKEN}")
check_response "$GET_FAV_RESPONSE" "Get Favorites"

# 9. Remove from Favorites
echo -e "\n${GREEN}Testing Remove from Favorites${NC}"
DEL_FAV_RESPONSE=$(curl -s -X DELETE "${API_URL}/user/favorites/123" \
  -H "Authorization: Bearer ${TOKEN}")
check_response "$DEL_FAV_RESPONSE" "Remove from Favorites"

# 10. Update Subscription Status
echo -e "\n${GREEN}Testing Update Subscription${NC}"
SUB_RESPONSE=$(curl -s -X POST "${API_URL}/user/subscription" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "status": true,
    "payment_reference": "pst_123",
    "plan": "premium"
  }')
check_response "$SUB_RESPONSE" "Update Subscription"

# 11. Share Item
echo -e "\n${GREEN}Testing Share Item${NC}"
SHARE_RESPONSE=$(curl -s -X POST "${API_URL}/user/share" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "item_id": "123",
    "item_type": "meal",
    "share_platform": "whatsapp"
  }')
check_response "$SHARE_RESPONSE" "Share Item"

# 12. Update Ads Preference
echo -e "\n${GREEN}Testing Update Ads Preference${NC}"
ADS_RESPONSE=$(curl -s -X PUT "${API_URL}/user/preferences/ads" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "ads_opt_out": true
  }')
check_response "$ADS_RESPONSE" "Update Ads Preference"

# 13. Refresh Token
echo -e "\n${GREEN}Testing Token Refresh${NC}"
REFRESH_RESPONSE=$(curl -s -X POST "${API_URL}/auth/refresh-token" \
  -H "Content-Type: application/json" \
  -d "{
    \"refresh_token\": \"${REFRESH_TOKEN}\"
  }")

if check_response "$REFRESH_RESPONSE" "Token Refresh"; then
  NEW_TOKEN=$(echo $REFRESH_RESPONSE | jq -r '.data.session.access_token')
  if [[ "$NEW_TOKEN" != "null" && -n "$NEW_TOKEN" ]]; then
    TOKEN=$NEW_TOKEN
    echo -e "${GREEN}Successfully refreshed token: ${TOKEN:0:10}...${NC}"
  else
    echo -e "${RED}Failed to extract new token from refresh response${NC}"
  fi
fi

# 14. Logout
echo -e "\n${GREEN}Testing Logout${NC}"
LOGOUT_RESPONSE=$(curl -s -X POST "${API_URL}/auth/logout" \
  -H "Authorization: Bearer ${TOKEN}")
check_response "$LOGOUT_RESPONSE" "Logout"

echo -e "\n${GREEN}Test Flow Complete!${NC}" 