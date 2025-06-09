# Complete .env Configurations

This file contains the exact content to be placed in your respective `.env` files.

---

## 1. Frontend `.env` File

Create a file named `.env` in the **root directory** of your project and paste the following content into it.

**Action Required:** You still need to replace the placeholder `your-google-*`, `your-apple-*`, and `your-facebook-*` IDs with your actual credentials from the developer consoles.

```env
# API Configuration
EXPO_PUBLIC_API_URL=https://meallensai-backend.onrender.com/api/v1

# Google OAuth Configuration
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-google-web-client-id
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your-google-ios-client-id
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your-google-android-client-id

# Apple Sign In Configuration
EXPO_PUBLIC_APPLE_SERVICE_ID=your-apple-service-id

# Facebook App ID
EXPO_PUBLIC_FACEBOOK_APP_ID=your-facebook-app-id

# Other environment variables
EXPO_PUBLIC_RORK_API_BASE_URL=https://dev-yc61r0z7olgzjyhd4rll7.rorktest.dev
```

---

## 2. Backend `.env` File

Create a file named `.env` in the **`MealLensAI-Backend/`** directory and paste the following content into it.

**Action Required:**
- Replace `your_supabase_anon_key_here` with your actual Supabase anonymous key.
- Replace `By5SzJfPu1GP8eaU` with your actual database password from Supabase.
- It is highly recommended to replace the `JWT_SECRET_KEY` with a new, secure, randomly generated key.

```env
# Supabase Configuration
SUPABASE_URL=https://jtktdbxkinvlibrlymeh.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0a3RkYnhraW52bGlicmx5bWVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyMDk0ODksImV4cCI6MjA2Mjc4NTQ4OX0.KmOsCZdzReYayxbSK1wUNsDyD22M3GfvlUNMGTIP-oY
SUPABASE_DB_URL=postgresql://postgres.jtktdbxkinvlibrlymeh:By5SzJfPu1GP8eaU@aws-0-us-east-2.pooler.supabase.com:6543/postgres

# This will be populated when a user logs in and should be left blank.
SUPABASE_ACCESS_TOKEN=

# Application/API Configuration
JWT_SECRET_KEY=meallensai_jwt_secret_2024
FLASK_ENV=development

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# Application Settings
DAILY_FREE_LIMIT=2
SESSION_LIFETIME_HOURS=24
``` 