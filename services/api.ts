import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/config/constants';
import ENV from '../config/environment';
import { router } from 'expo-router';

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
  maxRedirects: 0,
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

// Token refresh flag to prevent multiple refresh attempts
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Subscribe to token refresh
const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

// Notify subscribers about new token
const onTokenRefreshed = (token: string) => {
  refreshSubscribers.map(cb => cb(token));
  refreshSubscribers = [];
};

// Refresh access token using refresh token
const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
      refresh_token: refreshToken
    });

    const { access_token, refresh_token } = response.data;
    
    // Store new tokens
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, access_token);
    await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh_token);
    
    return access_token;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return null;
  }
};

// Global state for backend availability
let USE_MOCK_DATA = false;
let isBackendAvailable = false; // Initially assume backend is not available until proven otherwise
let backendCheckPromise: Promise<boolean> | null = null;

// Add interceptors to both API instances
const addInterceptors = (apiInstance: AxiosInstance, isRemote: boolean = false) => {
  apiInstance.interceptors.request.use(
    async (config) => {
      console.log('🔵 [API Request]', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL
      });
      
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      // Ensure headers exist
      config.headers['Content-Type'] = 'application/json';
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
        status: response.status
      });
      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config;
      
      // Handle token expiration
      if (error.response?.status === 401 && originalRequest && !originalRequest.retry) {
        if (isRefreshing) {
          // Wait for token refresh
          try {
            const token = await new Promise<string>((resolve) => {
              subscribeTokenRefresh((token: string) => {
                resolve(token);
              });
            });
            
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiInstance(originalRequest);
          } catch (err) {
            console.error('Failed to retry with new token:', err);
          }
        }

        originalRequest.retry = true;
        isRefreshing = true;

        try {
          const newToken = await refreshAccessToken();
          if (newToken) {
            onTokenRefreshed(newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return apiInstance(originalRequest);
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
        } finally {
          isRefreshing = false;
        }

        // If refresh failed, redirect to login
        await AsyncStorage.multiRemove([
          STORAGE_KEYS.AUTH_TOKEN,
          STORAGE_KEYS.REFRESH_TOKEN,
          STORAGE_KEYS.USER_EMAIL
        ]);
        
        // Use expo-router to navigate to login
        router.replace('/auth');
        
        return Promise.reject(error);
      }
      
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
  async healthCheck(): Promise<boolean> {
    try {
      console.log('🩺 Performing health check...');
      const response = await localApi.get('/health', { timeout: 5000 });
      const isHealthy = response.status === 200 && response.data?.status === 'ok';
      console.log(`🏥 Health check result: ${isHealthy ? '✅ Healthy' : '❌ Unhealthy'}`, response.data);
      return isHealthy;
    } catch (error: any) {
      console.error('❌ Health check failed:', error.message || error);
      // Force fallback to mock data since backend is known to be down
      USE_MOCK_DATA = true;
      return false;
    }
  },
  
  async request(config: AxiosRequestConfig): Promise<any> {
    try {
      // Determine which API instance to use based on the URL
      const apiInstance = config.url?.startsWith('/api/v1/ai/') ? remoteApi : localApi;
      console.log(`🌐 Making ${config.method?.toUpperCase() || 'REQUEST'} to ${config.url} using ${apiInstance === localApi ? 'LOCAL' : 'REMOTE'} API`);

      // If we know backend is down, use mock data immediately
      if (USE_MOCK_DATA) {
        console.log('🔄 Backend is down, using mock data for', config.url);
        const mockData = getMockDataForEndpoint(config.url || '');
        return {
          status: 200,
          data: mockData,
          headers: {},
          statusText: 'OK',
          config: config,
        };
      }
      
      // Check if backend is available before making the request
      if (!isBackendAvailable && !USE_MOCK_DATA) {
        // If backend status is unknown or previously failed, test connection
        if (!backendCheckPromise) {
          backendCheckPromise = testBackendConnection();
        }
        const isAvailable = await backendCheckPromise.catch(() => false);
        isBackendAvailable = isAvailable;
        if (!isAvailable) {
          console.warn('⚠️ Backend is not available, falling back to mock data for', config.url);
          USE_MOCK_DATA = true;
          const mockData = getMockDataForEndpoint(config.url || '');
          return {
            status: 200,
            data: mockData,
            headers: {},
            statusText: 'OK',
            config: config,
          };
        }
      }
      
      // Try to make the request
      const response = await apiInstance.request(config);
      
      // Check if we got a 404 response from the backend
      if (response.status === 404 && response.data?.code === 404) {
        console.warn(`⚠️ Backend endpoint not found: ${config.url}`);
        
        // Check if this service is mockable
        const isMockable = ENV.MOCKABLE_SERVICES.some(service => config.url?.includes(service));
        if (isMockable) {
          console.log(`📑 Using mock data for ${config.url}`);
          return {
            data: {
              success: true,
              message: 'Using mock data (backend unavailable)',
              data: getMockDataForEndpoint(config.url || '')
            },
            status: 200
          };
        }
      }
      
      return response;
    } catch (error) {
      // Check if this is a network error (backend down)
      if (error.message === 'Network Error' || error.code === 'ECONNABORTED') {
        console.warn(`⚠️ Backend connection failed for ${config.url}`);
        
        // Check if this service is mockable
        const isMockable = ENV.MOCKABLE_SERVICES.some(service => config.url?.includes(service));
        if (isMockable) {
          console.log(`📑 Using mock data for ${config.url}`);
          return {
            data: {
              success: true,
              message: 'Using mock data (backend unavailable)',
              data: getMockDataForEndpoint(config.url || '')
            },
            status: 200
          };
        }
      }
      
      console.error(`❌ Error with ${config.url}:`, error.message || error);
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
