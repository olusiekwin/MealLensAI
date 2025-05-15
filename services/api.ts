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
  timeout: 10000, // 10 second timeout
});

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
  async (config) => {
    console.log(`🔵 [API Request] ${config.method?.toUpperCase()} ${config.url}`);
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ [API Request Error]:', error.message);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging
api.interceptors.response.use(
  response => {
    console.log(`🟢 [API Response] ${response.config.method?.toUpperCase()} ${response.config.url} - Status: ${response.status}`);
    return response;
  },
  error => {
    console.error('❌ [API Error]', error.config?.url + ':', {
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
    };
  }
};

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
    };
  } catch (error) {
    console.error('Error searching food:', error);
    throw new Error('Failed to search for food information');
  }
};

// Analyze food from image
export const analyzeFoodImage = async (imageBase64: string) => {
  try {
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
    };
  } catch (error) {
    console.error('Error analyzing food image:', error);
    throw new Error('Failed to analyze food image');
  }
};

export default api;