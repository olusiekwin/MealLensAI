import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/config/constants';
import ENV from '../config/environment';

interface ApiError extends Error {
  code?: string;
  status?: number;
  data?: any;
}

// Ensure the API URLs don't have trailing slashes to prevent path duplication
const API_BASE_URL = ENV.API_URL.endsWith('/') ? ENV.API_URL.slice(0, -1) : ENV.API_URL;
const REMOTE_API_BASE_URL = ENV.REMOTE_API_URL.endsWith('/') ? ENV.REMOTE_API_URL.slice(0, -1) : ENV.REMOTE_API_URL;

console.log('🔄 Initializing API with base URLs:', {
  local: API_BASE_URL,
  remote: REMOTE_API_BASE_URL
});

// Common Axios config
const commonConfig: AxiosRequestConfig = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: ENV.API_TIMEOUT,
  withCredentials: false,
  validateStatus: (status) => status >= 200 && status < 500,
  // Handle redirects manually
  maxRedirects: 0,
  // iOS simulator specific configuration
  ...(Platform.OS === 'ios' && {
    proxy: false,
    insecureHTTPParser: true
  })
};

// Create local API instance
const localApi = axios.create({
  ...commonConfig,
  baseURL: API_BASE_URL,
});

// Create remote API instance
const remoteApi = axios.create({
  ...commonConfig,
  baseURL: REMOTE_API_BASE_URL,
});

// Add interceptors to both API instances
const addInterceptors = (apiInstance: AxiosInstance) => {
  apiInstance.interceptors.request.use(
    async (config) => {
      console.log('🔵 [API Request]', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        headers: config.headers,
        data: config.data
      });
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (token !== null) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('🔑 Added auth token to request');
        
        // Log token details for debugging (first 10 chars only for security)
        console.log(`Token prefix: ${token.substring(0, 10)}...`);
        
        // Check if this is a session token or JWT token
        try {
          const isJWT = token.split('.').length === 3;
          console.log(`Token type: ${isJWT ? 'JWT' : 'Session token'}`);
        } catch (e) {
          console.log('Could not determine token type');
        }
      }
      return config;
    },
    (error) => {
      console.error('❌ [API Request Error]', error);
      return Promise.reject(error);
    }
  );

  apiInstance.interceptors.response.use(
    (response) => {
      console.log('✅ [API Response]', {
        url: response.config.url,
        baseURL: response.config.baseURL,
        status: response.status,
        data: response.data
      });
      return response;
    },
    (error) => {
      console.error('❌ [API Error]', {
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        headers: error.response?.headers
      });
      
      // Create a custom error with additional properties
      const apiError = new Error(error.message) as ApiError;
      apiError.name = 'ApiError';
      apiError.code = error.response?.data?.error?.code || error.code;
      apiError.status = error.response?.status;
      apiError.data = error.response?.data;
      
      return Promise.reject(apiError);
    }
  );
};

// Add interceptors to both API instances
addInterceptors(localApi);
addInterceptors(remoteApi);

// Smart API function that routes requests to the appropriate backend
const api = {
  async request(config: AxiosRequestConfig) {
    const url = config.url || '';
    
    // Check if this service should use the remote backend
    const useRemote = ENV.REMOTE_SERVICES.some(service => url.startsWith(service));
    
    try {
      // Use the appropriate API instance
      const apiInstance = useRemote ? remoteApi : localApi;
      console.log(`🌐 Using ${useRemote ? 'remote' : 'local'} backend for ${url}`);
      
      // Try to make the request
      const response = await apiInstance.request(config);
      
      // Check if we got a 404 response from the backend
      if (response.status === 404 && response.data?.code === 404) {
        console.warn(`⚠️ Backend endpoint not found: ${url}`);
        
        // Check if this service is mockable
        const isMockable = ENV.MOCKABLE_SERVICES.some(service => url.includes(service));
        if (isMockable) {
          console.log(`📑 Using mock data for ${url}`);
          return {
            data: {
              success: true,
              message: 'Using mock data (backend unavailable)',
              data: getMockDataForEndpoint(url)
            },
            status: 200
          };
        }
      }
      
      return response;
    } catch (error) {
      // Check if this is a network error (backend down)
      if (error.message === 'Network Error' || error.code === 'ECONNABORTED') {
        console.warn(`⚠️ Backend connection failed for ${url}`);
        
        // Check if this service is mockable
        const isMockable = ENV.MOCKABLE_SERVICES.some(service => url.includes(service));
        if (isMockable) {
          console.log(`📑 Using mock data for ${url}`);
          return {
            data: {
              success: true,
              message: 'Using mock data (backend unavailable)',
              data: getMockDataForEndpoint(url)
            },
            status: 200
          };
        }
      }
      
      console.error(`❌ Error with ${url}:`, error);
      throw error;
    }
  },
  
  // Standard HTTP methods
  async get(url: string, config?: AxiosRequestConfig) {
    return this.request({ ...config, method: 'get', url });
  },
  
  async post(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.request({ ...config, method: 'post', url, data });
  },
  
  async put(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.request({ ...config, method: 'put', url, data });
  },
  
  async delete(url: string, config?: AxiosRequestConfig) {
    return this.request({ ...config, method: 'delete', url });
  },
  
  async patch(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.request({ ...config, method: 'patch', url, data });
  },
  
  // Health check to determine if the backend is available
  async healthCheck() {
    try {
      const response = await this.get('/health');
      return response?.data?.status === 'healthy';
    } catch (error) {
      console.error('❌ Health check failed:', error);
      return false;
    }
  }
};

export const testBackendConnection = async () => {
  try {
    const response = await api.get('/health');
    if (!response) {
      throw new Error('No response received');
    }
    console.log('✅ Backend connection successful:', response.data);
    return {
      success: true,
      message: response.data?.message || 'Connected to backend',
      data: response.data
    };
  } catch (error: any) {
    console.error('❌ Backend connection failed:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    return {
      success: false,
      message: error.message || 'Failed to connect to backend',
      error: (error as any).response?.data || error.message
    };
  }
};

export const searchFood = async (query: string) => {
  try {
    // Make a real API call to the backend
    const response = await api.get('/search', {
      params: { query }
    });
    
    if (!response || !response.data) {
      throw new Error('Invalid response from search API');
    }
    
    return response.data.data || {
      googleResults: [],
      youtubeResults: []
    };
  } catch (error) {
    console.error('Error searching food:', error);
    throw new Error('Failed to search for food information');
  }
};

// Analyze food from image
export const analyzeFoodImage = async (imageBase64: string) => {
  try {
    // Make a real API call to the AI service
    const response = await api.post('/detect/detect', {
      image: imageBase64
    });
    
    if (!response || !response.data) {
      throw new Error('Invalid response from detection API');
    }
    
    return response.data.data || {
      detectedFood: "",
      ingredients: [],
      cookingInstructions: [],
      recipeSuggestions: []
    };
  } catch (error) {
    console.error('Error analyzing food image:', error);
    throw new Error('Failed to analyze food image');
  }
};

// Function to get mock data for different endpoints
const getMockDataForEndpoint = (url: string) => {
  // Authentication endpoints
  if (url.includes('/auth/login')) {
    return {
      success: true,
      token: 'mock-jwt-token-for-testing',
      user: {
        id: 'mock-user-id',
        email: 'test@example.com',
        username: 'testuser',
        created_at: new Date().toISOString()
      }
    };
  }
  
  // User profile endpoints
  if (url.includes('/user/profile')) {
    return {
      user: {
        id: 'mock-user-id',
        email: 'test@example.com',
        username: 'testuser',
        first_name: 'Test',
        last_name: 'User',
        date_of_birth: '1990-01-01',
        gender: 'prefer not to say',
        address: '123 Test St',
        location: 'Test City',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    };
  }
  
  // User preferences
  if (url.includes('/user/preferences')) {
    return {
      preferences: {
        dietaryRestrictions: ['vegetarian'],
        cookingSkillLevel: 'intermediate',
        favorites: []
      }
    };
  }
  
  // Payment/subscription
  if (url.includes('/payment/subscription-status')) {
    return {
      status: 'free',
      expiry_date: null,
      remaining_detections: 3,
      max_detections: 3
    };
  }
  
  // Detection endpoints
  if (url.includes('/detect/process') || url.includes('/process')) {
    return {
      analysis_id: 'mock-analysis-id',
      response: ['chicken', 'rice', 'onions', 'garlic', 'olive oil'],
      food_suggestions: ['Chicken Fried Rice', 'Chicken Pilaf', 'Chicken Risotto']
    };
  }
  
  if (url.includes('/detect/instructions') || url.includes('/instructions')) {
    return {
      title: 'Chicken Fried Rice',
      ingredients: [
        '2 cups cooked rice',
        '1 chicken breast, diced',
        '1 onion, chopped',
        '2 cloves garlic, minced',
        '2 tbsp olive oil',
        'Salt and pepper to taste'
      ],
      steps: [
        { text: 'Heat oil in a large pan over medium heat.' },
        { text: 'Add chicken and cook until no longer pink, about 5-7 minutes.' },
        { text: 'Add onions and garlic, cook until softened.' },
        { text: 'Add rice and stir to combine. Cook for 3-5 minutes.' },
        { text: 'Season with salt and pepper to taste.' },
        { text: 'Serve hot.' }
      ],
      tips: [
        { text: 'For extra flavor, add soy sauce or oyster sauce.' },
        { text: 'You can add vegetables like peas, carrots, or bell peppers.' }
      ],
      estimatedTime: 20,
      difficulty: 'Easy'
    };
  }
  
  if (url.includes('/detect/resources') || url.includes('/resources')) {
    return {
      YoutubeSearch: [
        { title: 'Easy Chicken Fried Rice Recipe', link: 'https://www.youtube.com/watch?v=mock1' },
        { title: 'How to Make Perfect Fried Rice', link: 'https://www.youtube.com/watch?v=mock2' },
        { title: 'Quick Chicken Fried Rice', link: 'https://www.youtube.com/watch?v=mock3' }
      ],
      GoogleSearch: [
        { title: 'Best Chicken Fried Rice Recipe', description: 'A delicious and easy recipe...', link: 'https://www.example.com/recipe1' },
        { title: 'Authentic Chicken Fried Rice', description: 'Learn how to make authentic...', link: 'https://www.example.com/recipe2' },
        { title: '30-Minute Chicken Fried Rice', description: 'Quick and tasty recipe...', link: 'https://www.example.com/recipe3' }
      ]
    };
  }
  
  if (url.includes('/detect/history')) {
    return [
      {
        detection_id: 'mock-detection-1',
        user_id: 'mock-user-id',
        detection_type: 'image',
        items: ['chicken', 'rice', 'vegetables'],
        created_at: new Date(Date.now() - 86400000).toISOString(),
        is_favorite: false
      },
      {
        detection_id: 'mock-detection-2',
        user_id: 'mock-user-id',
        detection_type: 'text',
        items: ['pasta', 'tomatoes', 'basil'],
        created_at: new Date(Date.now() - 172800000).toISOString(),
        is_favorite: true
      }
    ];
  }
  
  // Default mock data
  return {
    message: 'Mock data for endpoint not specifically defined',
    endpoint: url
  };
};

export default api;
