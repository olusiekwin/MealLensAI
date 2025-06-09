# MealLensAI Environment Variables

This document outlines the environment variables required for both the frontend and backend of the MealLensAI application.

---

## 1. Frontend Configuration

Create a file named `.env` in the root directory of the project (`/`) and add the following variables. Replace the placeholder values with your actual credentials.

```env
# API Configuration
# This should point to your deployed backend API endpoint.
EXPO_PUBLIC_API_URL=https://meallensai-backend.onrender.com/api/v1

# --- OAuth Configuration ---
# Replace with your actual client IDs from Google, Apple, and Facebook developer consoles.

# Google
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-google-web-client-id
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your-google-ios-client-id
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your-google-android-client-id

# Apple
EXPO_PUBLIC_APPLE_SERVICE_ID=your-apple-service-id

# Facebook
EXPO_PUBLIC_FACEBOOK_APP_ID=your-facebook-app-id

# Other
EXPO_PUBLIC_RORK_API_BASE_URL=https://dev-yc61r0z7olgzjyhd4rll7.rorktest.dev
```

---

## 2. Backend Configuration

Create a file named `.env` in the `MealLensAI-Backend/` directory and add the following variables.

**IMPORTANT:** The values for Supabase and the JWT Secret are sensitive and should not be committed to version control. Replace the placeholders with your actual secrets.

```env
# Supabase Configuration
# You can find these in your Supabase project's API settings.
SUPABASE_URL=https://jtktdbxkinvlibrlymeh.supabase.co
SUPABASE_KEY=your_supabase_anon_key_here
SUPABASE_DB_URL=postgresql://postgres.jtktdbxkinvlibrlymeh:your_password_here@aws-0-us-east-2.pooler.supabase.com:6543/postgres

# This is populated automatically when a user logs in.
SUPABASE_ACCESS_TOKEN=

# Application/API Configuration
# Use a long, random string for the JWT secret for security.
# You can generate one using: python -c "import secrets; print(secrets.token_hex(32))"
JWT_SECRET_KEY=your_strong_jwt_secret_key_here
FLASK_ENV=development

# Redis Configuration
# These are the default values. Change if your Redis server runs elsewhere.
REDIS_HOST=localhost
REDIS_PORT=6379

# Application Business Logic
DAILY_FREE_LIMIT=2
SESSION_LIFETIME_HOURS=24 