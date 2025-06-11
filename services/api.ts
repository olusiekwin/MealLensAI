<<<<<<< HEAD
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ENV from '../config/environment';

const API_BASE_URL = ENV.API_URL;

console.log('🔄 Initializing API with base URL:', API_BASE_URL);

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
  async (config) => {
    console.log(`🔵 [API Request] ${config.method?.toUpperCase()} ${config.url}`);
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Auth token attached to request');
    }
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging
api.interceptors.response.use(
  response => {
    console.log(`✅ [API Response] ${response.config.method?.toUpperCase()} ${response.config.url} - Status: ${response.status}`);
    return response;
  },
  error => {
    console.error(`❌ [API Error] ${error.config?.url}:`, {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

// Test backend connection
export const testBackendConnection = async () => {
  try {
    console.log('🔄 Testing backend connection to:', API_BASE_URL);
    const response = await api.get('/debug/ping');
    console.log('✅ Backend connection successful:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Backend connection failed:', {
      url: API_BASE_URL,
      error: error.message,
      details: error.response?.data || 'No response data'
    });
    throw error;
  }
};

// Auth endpoints
export const registerUser = async (userData: { 
  email: string; 
  password: string; 
  confirm_password: string;
  username: string; 
}) => {
  try {
    console.log('🔄 Attempting user registration');
    const response = await api.post('/auth/register', userData);
    console.log('✅ Registration successful:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Registration failed:', error.response?.data || error.message);
    throw error;
  }
};

export const loginUser = async (credentials: { email: string; password: string }) => {
  try {
    console.log('🔄 Attempting login');
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      await AsyncStorage.setItem('auth_token', response.data.token);
      console.log('✅ Login successful and token stored');
    }
    return response.data;
  } catch (error: any) {
    console.error('❌ Login failed:', error.response?.data || error.message);
    throw error;
  }
};

// Track app usage
export const trackAppUsage = async () => {
  try {
    // Get current date as string (YYYY-MM-DD)
    const today = new Date().toISOString().split('T')[0];
    
    // Get last usage date
    const lastUsageDate = await AsyncStorage.getItem('last_usage_date');
    
    // Get total usage count
    const totalCount = await AsyncStorage.getItem('usage_count');
    const newTotalCount = totalCount ? parseInt(totalCount) + 1 : 1;
    await AsyncStorage.setItem('usage_count', newTotalCount.toString());
    
    // Check if it's a new day
    if (lastUsageDate !== today) {
      // Reset daily count for new day
      await AsyncStorage.setItem('daily_usage_count', '1');
      await AsyncStorage.setItem('last_usage_date', today);
      return { 
        totalUsageCount: newTotalCount, 
        dailyUsageCount: 1,
        dailyLimitReached: false
      };
    } else {
      // Increment daily usage count
      const dailyCount = await AsyncStorage.getItem('daily_usage_count');
      const newDailyCount = dailyCount ? parseInt(dailyCount) + 1 : 1;
      await AsyncStorage.setItem('daily_usage_count', newDailyCount.toString());
      
      return { 
        totalUsageCount: newTotalCount, 
        dailyUsageCount: newDailyCount,
        dailyLimitReached: newDailyCount > 3 // Daily limit is 3 uses
      };
    }
  } catch (error) {
    console.error('Error tracking app usage:', error);
    return { 
      totalUsageCount: 0, 
      dailyUsageCount: 0,
      dailyLimitReached: false,
      error
=======
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
>>>>>>> the-moredern-features
    };
  }
};

<<<<<<< HEAD
// Check if user has reached daily limit
export const hasReachedDailyLimit = async () => {
  try {
    // Get current date as string (YYYY-MM-DD)
    const today = new Date().toISOString().split('T')[0];
    
    // Get last usage date
    const lastUsageDate = await AsyncStorage.getItem('last_usage_date');
    
    // If it's a new day, user hasn't reached limit
    if (lastUsageDate !== today) return false;
    
    // Get daily usage count
    const dailyCount = await AsyncStorage.getItem('daily_usage_count');
    const dailyUsageCount = dailyCount ? parseInt(dailyCount) : 0;
    
    // Daily limit is 3 uses
    return dailyUsageCount >= 3;
  } catch (error) {
    console.error('Error checking daily limit:', error);
    return false;
  }
};

// Add usage after watching an ad
export const addUsageAfterAd = async () => {
  try {
    // Get current daily usage count
    const dailyCount = await AsyncStorage.getItem('daily_usage_count');
    const currentDailyCount = dailyCount ? parseInt(dailyCount) : 0;
    
    // If already at or above limit, reduce by 1 to allow one more use
    if (currentDailyCount >= 3) {
      await AsyncStorage.setItem('daily_usage_count', '2');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error adding usage after ad:', error);
    return false;
  }
};

// Get search results for a food item
export const searchFood = async (query: string) => {
  try {
    // This would be a real API call in production
    // For now, we'll return mock data
    return {
      googleResults: [
        {
          title: `${query} recipes`,
          link: `https://www.google.com/search?q=${encodeURIComponent(query)}+recipes`,
          description: `Find the best ${query} recipes online`
        },
        {
          title: `How to cook ${query}`,
          link: `https://www.google.com/search?q=how+to+cook+${encodeURIComponent(query)}`,
          description: `Learn different ways to prepare ${query}`
        },
        {
          title: `${query} nutrition facts`,
          link: `https://www.google.com/search?q=${encodeURIComponent(query)}+nutrition+facts`,
          description: `Discover the nutritional value of ${query}`
        }
      ],
      youtubeResults: [
        {
          title: `How to Cook Perfect ${query}`,
          link: `https://www.youtube.com/results?search_query=how+to+cook+perfect+${encodeURIComponent(query)}`,
          thumbnail: `https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg`
        },
        {
          title: `Easy ${query} Recipe`,
          link: `https://www.youtube.com/results?search_query=easy+${encodeURIComponent(query)}+recipe`,
          thumbnail: `https://img.youtube.com/vi/xvFZjo5PgG0/hqdefault.jpg`
        },
        {
          title: `${query} Cooking Tips`,
          link: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}+cooking+tips`,
          thumbnail: `https://img.youtube.com/vi/oHg5SJYRHA0/hqdefault.jpg`
        }
      ]
=======
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
>>>>>>> the-moredern-features
    };
  } catch (error) {
    console.error('Error searching food:', error);
    throw new Error('Failed to search for food information');
  }
};

// Analyze food from image
export const analyzeFoodImage = async (imageBase64: string) => {
  try {
<<<<<<< HEAD
    // This would be a real API call to an AI service in production
    // For now, we'll return mock data
    return {
      detectedFood: "Avocado & Egg Sandwich",
      ingredients: [
        "2 slices of bread (whole-grain or sourdough)",
        "1 ripe avocado (mashed or sliced)",
        "2 boiled eggs (hard or soft boiled)",
        "Salt and pepper",
        "Lemon juice (optional)",
        "Fresh herbs (optional)"
      ],
      cookingInstructions: [
        "1. Toast the bread slices until golden brown.",
        "2. Mash the avocado in a bowl and season with salt, pepper, and a splash of lemon juice if using.",
        "3. Spread the avocado mixture evenly on both slices of toast.",
        "4. Slice the boiled eggs and arrange them on top of the avocado.",
        "5. Sprinkle with additional salt and pepper to taste.",
        "6. Add fresh herbs if desired.",
        "7. Serve immediately and enjoy!"
      ],
      recipeSuggestions: [
        {
          id: "1",
          title: "Egg & Avocado Sandwich",
          image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
          cookTime: "15 mins",
          difficulty: "Easy",
          rating: "4.2"
        },
        {
          id: "2",
          title: "Avocado Toast with Poached Eggs",
          image: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
          cookTime: "20 mins",
          difficulty: "Medium",
          rating: "4.5"
        },
        {
          id: "3",
          title: "Breakfast Burrito with Avocado",
          image: "https://images.unsplash.com/photo-1584278860047-22db9ff82bed?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
          cookTime: "25 mins",
          difficulty: "Medium",
          rating: "4.7"
        }
      ]
=======
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
>>>>>>> the-moredern-features
    };
  } catch (error) {
    console.error('Error analyzing food image:', error);
    throw new Error('Failed to analyze food image');
  }
};

<<<<<<< HEAD
export default api;
=======
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
>>>>>>> the-moredern-features
