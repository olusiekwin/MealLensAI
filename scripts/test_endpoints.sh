#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Base URL - Using remote backend
API_URL="https://meallensai-backend.onrender.com/api/v1"
TOKEN=""
REFRESH_TOKEN=""

echo "🔍 Testing User Flow"
echo "===================="

# 1. Health Check
echo -e "\n${GREEN}Testing Health Check${NC}"
curl -s -X GET "${API_URL}/health"

# 2. User Registration
echo -e "\n\n${GREEN}Testing User Registration${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "${API_URL}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "olusiekwingraham@gmail.com",
    "password": "MealLens2024!",
    "confirm_password": "MealLens2024!",
    "username": "olusiekwin",
    "first_name": "Olusiekwin",
    "last_name": "Graham"
  }')
echo $REGISTER_RESPONSE

# 3. User Login
echo -e "\n\n${GREEN}Testing User Login${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "${API_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "olusiekwingraham@gmail.com",
    "password": "MealLens2024!"
  }')
echo $LOGIN_RESPONSE

# Extract token from login response
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.session.token')

if [ "$TOKEN" = "null" ]; then
    echo -e "\n${RED}Failed to get token, skipping authenticated requests${NC}"
    exit 1
fi

# 4. Get User Profile
echo -e "\n\n${GREEN}Testing Get Profile${NC}"
curl -s -X GET "${API_URL}/user/profile" \
  -H "Authorization: Bearer ${TOKEN}"

# 5. Update User Profile
echo -e "\n\n${GREEN}Testing Update Profile${NC}"
curl -s -X PUT "${API_URL}/user/profile" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "preferences": {
      "dietary_flags": ["vegetarian", "gluten-free"],
      "content_filters": ["spicy", "nuts"]
    }
  }'

# 6. Add to Favorites
echo -e "\n\n${GREEN}Testing Add to Favorites${NC}"
curl -s -X POST "${API_URL}/favorites" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "item_id": "123",
    "item_type": "meal",
    "item_data": {
      "name": "Vegetarian Pasta",
      "ingredients": ["pasta", "tomatoes", "basil"]
    }
  }'

# 7. Get Favorites
echo -e "\n\n${GREEN}Testing Get Favorites${NC}"
curl -s -X GET "${API_URL}/favorites" \
  -H "Authorization: Bearer ${TOKEN}"

# 8. Remove from Favorites
echo -e "\n\n${GREEN}Testing Remove from Favorites${NC}"
curl -s -X DELETE "${API_URL}/favorites/123" \
  -H "Authorization: Bearer ${TOKEN}"

# 9. Check Subscription Status
echo -e "\n\n${GREEN}Testing Get Subscription Status${NC}"
curl -s -X GET "${API_URL}/payment/subscription-status" \
  -H "Authorization: Bearer ${TOKEN}"

# 10. Update Subscription
echo -e "\n\n${GREEN}Testing Update Subscription${NC}"
curl -s -X POST "${API_URL}/payment/subscribe" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "plan": "premium",
    "payment_reference": "pst_123"
  }'

# 11. Get Payment History
echo -e "\n\n${GREEN}Testing Get Payment History${NC}"
curl -s -X GET "${API_URL}/payment/history" \
  -H "Authorization: Bearer ${TOKEN}"

# 12. Get Ads
echo -e "\n\n${GREEN}Testing Get Ads${NC}"
curl -s -X GET "${API_URL}/ads" \
  -H "Authorization: Bearer ${TOKEN}"

# 13. Track Ad View
echo -e "\n\n${GREEN}Testing Track Ad View${NC}"
curl -s -X POST "${API_URL}/ads/viewed" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "ad_id": "123",
    "duration": 30
  }'

# 14. Logout
echo -e "\n\n${GREEN}Testing Logout${NC}"
curl -s -X POST "${API_URL}/auth/logout" \
  -H "Authorization: Bearer ${TOKEN}"

echo -e "\n\n${GREEN}Test Flow Complete!${NC}"