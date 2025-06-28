// API URL parameter types
type ApiUrlParams = string | number;

// Function to create parameterized URL
function createUrl(template: string, params?: Record<string, ApiUrlParams>): string {
  if (!params) return template;
  return Object.entries(params).reduce(
    (url, [key, value]) => url.replace(`:${key}`, String(value)),
    template
  );
}

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/auth/register',
    VALIDATE_TOKEN: '/api/v1/auth/validate-token',
    REFRESH_TOKEN: '/api/v1/auth/refresh',
    GOOGLE_CALLBACK: '/api/v1/auth/google/callback',
    APPLE_CALLBACK: '/api/v1/auth/apple/callback',
    RESET_PASSWORD: '/api/v1/auth/reset-password',
    FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
    LOGOUT: '/api/v1/auth/logout',
    DELETE: '/api/v1/auth/delete'
  },

  // User endpoints
  USER: {
    PROFILE: '/api/v1/user/profile',
    PREFERENCES: '/api/v1/user/preferences',
    ACTIVITY: '/api/v1/user/activity'
  },

  // Detection endpoints
  DETECT: {
    ANALYZE: '/api/v1/detect/analyze',
    PROCESS: '/api/v1/detect/process',
    HISTORY: '/api/v1/detect/history',
    RESOURCES: '/api/v1/detect/resources',
    FOOD_DETECT_RESOURCES: '/api/v1/detect/food_detect_resources',
    DAILY_LIMIT: '/api/v1/detect/daily-limit',
    INSTRUCTIONS: '/api/v1/detect/instructions'
  },

  // Recipe endpoints
  RECIPE: {
    SEARCH: '/api/v1/recipe/search',
    DETAIL: (id: string) => createUrl('/api/v1/recipe/:id', { id }),
    FAVORITES: '/api/v1/recipe/favorites',
    GENERATE: '/api/v1/recipe/generate',
    FAVORITE_ACTION: (id: string) => createUrl('/api/v1/recipe/favorites/:id', { id })
  },

  // Payment endpoints
  PAYMENT: {
    SUBSCRIPTION_STATUS: '/api/v1/payment/subscription-status',
    CREATE_SUBSCRIPTION: '/api/v1/payment/create-subscription',
    CANCEL_SUBSCRIPTION: (id: string) => createUrl('/api/v1/payment/cancel-subscription/:id', { id }),
    HISTORY: '/api/v1/payment/history',
    CALLBACK: '/api/v1/payment/callback',
    WEBHOOK: '/api/v1/payment/webhook'
  },

  // Ads endpoints
  ADS: {
    LIST: '/api/v1/ads/list',
    DAILY_LIMIT: '/api/v1/ads/daily-limit',
    TRACK_VIEW: (adId: string) => createUrl('/api/v1/ads/:adId/view', { adId }),
    TRACK_CLICK: (adId: string) => createUrl('/api/v1/ads/:adId/click', { adId }),
    TRACK: '/api/v1/ads/track'
  },

  // Analytics endpoints
  ANALYTICS: {
    LOG: '/api/v1/analytics/log'
  },

  // Health check
  HEALTH: '/health',

  // Test endpoint
  TEST: '/api/v1/test'
} as const;

// Types for API endpoints
export type ApiEndpoint = string;

export type EndpointFunction = (params: Record<string, ApiUrlParams>) => string;

// Helper type for endpoints that can either be strings or functions
export type EndpointValue = ApiEndpoint | EndpointFunction;

// Export types for use in services
export type { ApiUrlParams };
