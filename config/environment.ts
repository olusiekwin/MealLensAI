import { Platform } from 'react-native';

// Get local IP for mobile device testing
const getLocalIP = () => {
    switch (Platform.OS) {
        case 'android':
            return '10.0.2.2'; // Android emulator localhost
        case 'ios':
            return 'localhost'; // iOS simulator
        default:
            return 'localhost';
    }
};

// Get base URL based on platform and environment
const getBaseUrl = () => {
    const localIP = getLocalIP();
    const port = '5000';
    
    // For iOS simulator, we need to use localhost
    if (Platform.OS === 'ios') {
        return `http://localhost:${port}`;
    }
    
    // For Android emulator, we need to use 10.0.2.2
    if (Platform.OS === 'android') {
        return `http://10.0.2.2:${port}`;
    }
    
    // For web or other platforms
    return `http://localhost:${port}`;
};

// Base environment configuration
interface AIAPIConfig {
  BASE_URL: string;
  ENDPOINTS: {
    FOOD_DETECT: string;
    PROCESS: string;
    INSTRUCTIONS: string;
  };
}

interface EnvironmentConfig {
  API_URL: string;
  REMOTE_API_URL: string;
  REMOTE_SERVICES: string[];
  MOCKABLE_SERVICES: string[];
  AI_API: AIAPIConfig;
  API_TIMEOUT: number;
  DEBUG: boolean;
  RETRY_ATTEMPTS: number;
  USE_MOCK_ADS: boolean;
}

// Environment configuration
const ENV = {
    development: {
        // Use local backend for development
        API_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
        // Remote backend URL for services that require it
        REMOTE_API_URL: 'https://meallensai-backend.onrender.com/api/v1',
        // Services that should use the remote backend even in development
        REMOTE_SERVICES: [
            '/auth',  // All auth endpoints
            '/detect'  // All detection endpoints
        ],
        // Services that should use mock data if backend is unavailable
        MOCKABLE_SERVICES: [
            'user/profile',
            'user/preferences',
            'usage/track',
            'subscription'
        ],
        AI_API: {
            BASE_URL: 'https://ai-utu2.onrender.com', // AI is on a separate server
            ENDPOINTS: {
                FOOD_DETECT: '/food_detect',
                PROCESS: '/process',
                INSTRUCTIONS: '/instructions',
                RESOURCES: '/resources',
                FOOD_DETECT_RESOURCES: '/food_detect_resources'
            }
        },
        API_TIMEOUT: 60000, // 60 seconds
        DEBUG: true,
        RETRY_ATTEMPTS: 3,
        USE_MOCK_ADS: false, // Disable mock ads to use real ads API
    },
    production: {
        API_URL: process.env.EXPO_PUBLIC_API_URL || 'https://meallensai-backend.onrender.com/api/v1',
        // Remote backend URL (same as main API_URL in production)
        REMOTE_API_URL: 'https://meallensai-backend.onrender.com/api/v1',
        // Services that should use the remote backend
        REMOTE_SERVICES: [
            '/auth/login',
            '/auth/register',
            '/auth/google',
            '/auth/apple',
            '/detect'
        ],
        // Services that should use mock data if backend is unavailable
        MOCKABLE_SERVICES: [
            'user/profile',
            'user/preferences',
            'usage/track',
            'subscription'
        ],
        AI_API: {
            BASE_URL: 'https://ai-utu2.onrender.com', // AI is on a separate server
            ENDPOINTS: {
                FOOD_DETECT: '/food_detect',
                PROCESS: '/process',
                INSTRUCTIONS: '/instructions',
                RESOURCES: '/resources',
                FOOD_DETECT_RESOURCES: '/food_detect_resources'
            }
        },
        API_TIMEOUT: 60000, // 60 seconds
        DEBUG: false,
        RETRY_ATTEMPTS: 3,
        USE_MOCK_ADS: false, // Don't use mock ads in production
    }
};

// Get current environment config
export const getConfig = (): EnvironmentConfig => {
  const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';
  return ENV[env] || ENV.development;
};

// For backward compatibility
export default getConfig();
