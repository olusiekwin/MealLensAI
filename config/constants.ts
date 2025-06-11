import { Platform } from 'react-native';

// Environment detection
export const IS_WEB = typeof window !== 'undefined' && window.navigator?.product !== 'ReactNative';
export const IS_IOS = !IS_WEB && Platform.OS === 'ios';
export const IS_ANDROID = !IS_WEB && Platform.OS === 'android';

// API Configuration
export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

// OAuth Configuration
export const GOOGLE_CONFIG = {
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '',
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || '',
  androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || '',
  scopes: ['profile', 'email'],
};

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@auth_token',
  USER_EMAIL: '@user_email',
  REFRESH_TOKEN: '@refresh_token',
  USER_ID: '@user_id',
  USAGE_COUNT: '@usage_count',
  DAILY_USAGE_COUNT: '@daily_usage_count',
  LAST_USAGE_DATE: '@last_usage_date',
  ONBOARDING_COMPLETED: '@onboarding_completed',
  PROFILE_SETUP_COMPLETED: '@profile_setup_completed',
  LAST_FEEDBACK_DATE: 'lastFeedbackDate',
  APP_OPEN_COUNT: 'appOpenCount',
  LAST_SUBSCRIPTION_PROMPT: 'last_subscription_prompt',
};

export const AI_ENDPOINTS: {
  BASE_URL: string;
  FOOD_DETECT: string;
  PROCESS: string;
  INSTRUCTIONS: string;
  RESOURCES: string;
  FOOD_DETECT_RESOURCES: string;
  AUTH_DETECT: string;
  AUTH_PROCESS: string;
  AUTH_INSTRUCTIONS: string;
  AUTH_RESOURCES: string;
  AUTH_FOOD_DETECT_RESOURCES: string;
  AUTH_HISTORY: string;
  AUTH_DAILY_LIMIT: string;
} = {
  // Direct AI endpoints (no auth required)
  BASE_URL: 'https://ai-utu2.onrender.com',
  FOOD_DETECT: 'https://ai-utu2.onrender.com/food_detect',
  PROCESS: 'https://ai-utu2.onrender.com/process',
  INSTRUCTIONS: 'https://ai-utu2.onrender.com/instructions',
  RESOURCES: 'https://ai-utu2.onrender.com/resources',
  FOOD_DETECT_RESOURCES: 'https://ai-utu2.onrender.com/food_detect_resources',
  // Authenticated endpoints through main backend
  AUTH_DETECT: `${API_URL}/detect`,
  AUTH_PROCESS: `${API_URL}/detect/process`,
  AUTH_INSTRUCTIONS: `${API_URL}/detect/instructions`,
  AUTH_RESOURCES: `${API_URL}/detect/resources`,
  AUTH_FOOD_DETECT_RESOURCES: `${API_URL}/detect/food_detect_resources`,
  AUTH_HISTORY: `${API_URL}/detect/history`,
  AUTH_DAILY_LIMIT: `${API_URL}/daily-limit`
};

// User preference options
export const DIETARY_RESTRICTIONS: string[] = [
  'vegetarian',
  'vegan',
  'gluten-free',
  'dairy-free',
  'nut-free',
  'halal',
  'kosher'
];

export const COOKING_SKILL_LEVELS: string[] = [
  'beginner',
  'intermediate',
  'advanced'
];
