# MealLensAI Backend Requirements

## Overview
MealLensAI is a mobile application that uses AI to detect food and provide recipes. This document outlines the frontend components and their required backend support.

## Social Authentication

### Required Endpoints:
- `POST /api/auth/social-login`
  - Support social login providers:
    - Google
    - Facebook
    - Apple
  - Accept: 
    - provider: string ('google'|'facebook'|'apple')
    - token: string (OAuth token from provider)
    - userData: object (profile data from provider)
  - Return: 
    - access token
    - refresh token
    - user data
  - Features:
    - Auto account creation if user doesn't exist
    - Link multiple social accounts to same user
    - Handle token validation for each provider

## Advertisement System

### Required Endpoints:
- `GET /api/ads/next`
  - Get next ad to display
  - Return:
    - ad_id: string
    - content: {
      image_url: string,
      click_url: string,
      type: string ('banner'|'interstitial'|'rewarded')
    }
    - display_duration: number (in seconds)

- `POST /api/ads/track`
  - Track ad interactions
  - Accept:
    - ad_id: string
    - event_type: string ('view'|'click'|'complete')
    - timestamp: number

### Ad Display Algorithm
- Display frequency: Every 6 minutes
- Implementation details:
  - Use device timestamp for last ad display
  - Track user session duration
  - Queue next ad after current display
  - Reset timer on app background/foreground
  - Skip ads for premium users
  - Ensure minimum 5 minutes between ads
  - Maximum 10 ads per hour
  - Store last display timestamp in local storage and validate with server

### Ad Types Priority:
1. Interstitial (full screen)
2. Banner (top/bottom)
3. Rewarded (optional view for benefits)

## User Profile & Settings

### Required Endpoints:
- `GET/PUT /api/user/profile`
  - Manage user profile data
  - Fields:
    - Name
    - Email
    - Phone
    - Date of birth
    - Gender
    - Address
    - Profile image

- `GET/PUT /api/user/settings`
  - Manage user preferences
  - Fields:
    - Notifications enabled
    - Dark mode
    - Language preference

## Subscription System

### Required Endpoints:
- `POST /api/payment/create-subscription`
  - Create new subscription
  - Plans:
    - Monthly: $9.99/month
    - Annual: $89.99/year
  - Support payment methods:
    - Credit Card
    - Apple Pay
    - Google Pay

- `GET /api/payment/subscription-status`
  - Get current subscription status

- `POST /api/payment/webhook`
  - Handle payment provider webhooks

## Recipe Management

### Required Endpoints:
- `GET /api/recipes`
  - List recipes with filtering
  - Support categories:
    - All
    - Breakfast
    - Lunch
    - Dinner
    - Desserts
    - Snacks
    - Drinks

- `GET /api/recipes/{id}`
  - Get recipe details including:
    - Title
    - Description
    - Preparation time
    - Ingredients
    - Instructions
    - Nutritional info (protein, carbs, fat)
    - Rating
    - Images

- `POST /api/favorites`
  - Add recipe to favorites

- `GET /api/favorites`
  - List user's favorite recipes

- `DELETE /api/favorites/{id}`
  - Remove recipe from favorites

## AI Food Detection

### Required Endpoints:
- `POST /api/detect`
  - Process food image and return detected ingredients
  - Usage limits:
    - Free tier: 2 detections/day
    - Premium: Unlimited

- `GET /api/usage/daily-limit`
  - Get remaining daily detections

## Meal Planning

### Required Endpoints:
- `GET/POST/PUT/DELETE /api/meal-plans`
  - Manage meal plans
  - Support meal types:
    - Breakfast
    - Lunch
    - Snack
    - Dinner
  - Fields:
    - Date
    - Meal type
    - Recipe ID

## Recipe Sharing

### Required Endpoints:
- `POST /api/share/create-link`
  - Generate shareable recipe link
  - Optional expiration time

- `GET /api/share/{token}`
  - Access shared recipe

## Database Schema Requirements

### Core Tables:
- Users
- Auth Sessions
- Subscriptions
- Recipes
- Recipe Ingredients
- Recipe Instructions
- Recipe Nutrition
- Favorites
- Meal Plans
- Usage Tracking
- Shared Recipes
- Ad Inventory
- Ad Displays
- Ad Analytics

### Relationships:
- User has many Favorites
- User has many Meal Plans
- Recipe has many Ingredients
- Recipe has many Instructions
- Recipe has one Nutrition info
- User has many Ad Displays
- Ad has many Analytics

### Ad-Related Tables Schema:
```sql
CREATE TABLE ads (
    id UUID PRIMARY KEY,
    type VARCHAR(20) NOT NULL, -- 'banner', 'interstitial', 'rewarded'
    content_url TEXT NOT NULL,
    click_url TEXT NOT NULL,
    priority INTEGER DEFAULT 0,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ad_displays (
    id UUID PRIMARY KEY,
    ad_id UUID REFERENCES ads(id),
    user_id UUID REFERENCES users(id),
    displayed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    display_duration INTEGER, -- in seconds
    interaction VARCHAR(20), -- 'view', 'click', 'complete', 'skip'
    session_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ad_analytics (
    ad_id UUID REFERENCES ads(id),
    date DATE NOT NULL,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    completes INTEGER DEFAULT 0,
    skips INTEGER DEFAULT 0,
    total_duration INTEGER DEFAULT 0, -- in seconds
    PRIMARY KEY (ad_id, date)
);
```

## Technical Requirements

### Authentication:
- JWT-based authentication
- Refresh token rotation
- Social auth integration

### Security:
- Rate limiting
- Input validation
- XSS protection
- CSRF protection

### Storage:
- Secure file storage for images
- Image optimization for different sizes

### Performance:
- Caching for frequently accessed data
- Pagination for list endpoints
- Query optimization

### Monitoring:
- Usage tracking
- Error logging
- Performance metrics

## API Response Format
All API responses should follow this structure:
```json
{
  "success": boolean,
  "data": any,
  "error": {
    "code": string,
    "message": string
  }
}
```
