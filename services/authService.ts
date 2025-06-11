import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { ResponseType } from 'expo-auth-session';

// Import the centralized API instance
import api from './api';
// Removed axios import to avoid direct remote calls. All requests go through backend API.

import {
  IS_WEB,
  IS_IOS,
  IS_ANDROID,
  GOOGLE_CONFIG,
  STORAGE_KEYS,
  API_URL
} from '../config/constants';

// Initialize WebBrowser for OAuth
WebBrowser.maybeCompleteAuthSession();

// Types
interface LoginData {
  email: string;
  password: string;
}

interface AuthError {
  message: string;
  code?: string;
}

interface AuthResponse {
  success: boolean;
  message?: string;
  error?: AuthError;
  data?: any;
  session?: {
    access_token: string;
    refresh_token: string;
  };
}

interface UserData {
  email: string;
  password: string;
  username?: string;
  confirm_password?: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  created_at: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  dietaryRestrictions?: string[];
  cookingSkillLevel?: string;
  favorites?: string[];
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second
const REQUEST_TIMEOUT = 10000; // 10 seconds

async function retryRequest<T>(requestFn: () => Promise<T>): Promise<T> {
  let lastError: Error;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await requestFn();
    } catch (error: any) {
      lastError = error;
      console.log(`Request failed (attempt ${attempt}):`, error.message);
      
      // Retry on network errors or timeouts
      if ((error.message === 'Network Error' || 
           error.code === 'ECONNABORTED' || 
           error.message.includes('timeout')) && 
          attempt < MAX_RETRIES) {
        console.log(`Retry attempt ${attempt} of ${MAX_RETRIES}...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * attempt));
        continue;
      }
      throw error;
    }
  }
  throw lastError!;
}

class AuthService {
  // Register a new user
  async register(userData: UserData) {
    try {
      console.log('🔄 Attempting registration with:', { email: userData.email });
      const response = await retryRequest(() => 
        api.post('/api/v1/auth/register', userData)
      );
      console.log('✅ Registration response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Registration failed:', error.response?.data || error.message);
      throw error.response?.data?.error || 'Registration failed';
    }
  }

  // Login user
  async login(userData: LoginData): Promise<AuthResponse> {
    try {
      console.log('🔄 Attempting login with:', { email: userData.email });
      
      const response = await retryRequest(() => 
        api.post('/api/v1/auth/login', userData, {
          timeout: REQUEST_TIMEOUT
        })
      );
      
      console.log('✅ Login response:', response.data);
      
      if (response.data.success && response.data.data) {
        const { user, session } = response.data.data;
        
        // Store auth tokens
        if (session?.access_token) {
          console.log('🔑 Storing auth tokens...');
          await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, session.access_token);
          await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, session.refresh_token);
          await AsyncStorage.setItem(STORAGE_KEYS.USER_EMAIL, userData.email);
          
          // Store user ID if available
          if (user?.id) {
            await AsyncStorage.setItem(STORAGE_KEYS.USER_ID, user.id);
            console.log('✅ User ID stored:', user.id);
          }
          
          console.log('✅ Auth tokens stored successfully');
          
          return {
            success: true,
            token: session.access_token,
            refresh_token: session.refresh_token,
            user: user
          };
        } else {
          console.warn('⚠️ No access token in response:', response.data);
          return {
            success: false,
            error: {
              message: 'No access token in response',
              code: 'missing_token'
            }
          };
        }
      }
      
      // Handle error response
      return {
        success: false,
        error: response.data.error || {
          message: 'Login failed',
          code: 'unknown_error'
        }
      };
      
    } catch (error: any) {
      console.log('❌ Login failed:', error);
      console.error('Login error details:', {
        message: error.message,
        code: error.code,
        timeout: error.code === 'ECONNABORTED',
        response: error.response?.data
      });
      
      // Check if it's a timeout issue
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        return {
          success: false,
          error: {
            message: 'Login request timed out. Please try again.',
            code: 'timeout_error'
          }
        };
      }
      
      // Return error from backend if available
      if (error.response?.data?.error) {
        return {
          success: false,
          error: error.response.data.error
        };
      }
      
      return {
        success: false,
        error: {
          message: error.message || 'Login failed',
          code: error.code || 'unknown_error'
        }
      };
    }
  }

  // Forgot password
  async forgotPassword(email: string) {
    try {
      const response = await retryRequest(() => 
        api.post('/api/v1/auth/forgot-password', { email })
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Password reset failed:', error.response?.data || error.message);
      throw error;
    }
  }

  // Logout user
  async signOut() {
    try {
      // Call server logout
      await retryRequest(() => api.post('/api/v1/auth/logout', {}));
      
      // Clear local storage
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.AUTH_TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.USER_EMAIL
      ]);
      
      return { success: true };
    } catch (error: any) {
      console.error('❌ Logout failed:', error.response?.data || error.message);
      throw error;
    }
  }

  // Delete account
  async deleteAccount() {
    try {
      await api.request({
        method: 'delete',
        url: '/api/v1/auth/user/delete'
      });
      await AsyncStorage.removeItem('auth_token');
      return { success: true };
    } catch (error: any) {
      console.error('Delete account error:', error);
      console.error('❌ Account deletion failed:', error.response?.data || error.message);
      throw error;
    }
  }

  // Google Sign-In using OAuth
  async signInWithGoogle() {
    try {
      // Configure Google OAuth request
      const discovery = await AuthSession.fetchDiscoveryAsync('https://accounts.google.com');
      
      const redirectUri = AuthSession.makeRedirectUri({
        scheme: 'meallensai',
        path: 'auth/google/callback'
      });

      const clientId = IS_WEB 
        ? GOOGLE_CONFIG.webClientId 
        : IS_IOS 
          ? GOOGLE_CONFIG.iosClientId 
          : GOOGLE_CONFIG.androidClientId;

      const authRequest = new AuthSession.AuthRequest({
        clientId,
        redirectUri,
        responseType: ResponseType.Code,
        scopes: GOOGLE_CONFIG.scopes,
        usePKCE: true,
      });

      const result = await authRequest.promptAsync(discovery);

      if (result.type === 'success' && result.params.code) {
        // Exchange code for token with your backend
        const response = await api.post('/api/v1/auth/google/callback', {
          code: result.params.code,
          redirect_uri: redirectUri
        });

        if (response.data.success && response.data.session?.access_token) {
          await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.session.access_token);
          return { success: true, token: response.data.session.access_token };
        }
      }

      throw new Error('Google authentication failed');
    } catch (error: any) {
      console.error('❌ Google sign-in error:', error);
      throw error;
    }
  }

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (!token) return null;

      const response = await api.get('/user/profile/', {
        headers: { Authorization: `Bearer ${token}` }
      });

      return response.data.user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Update user preferences
  async updateUserPreferences(preferences: Partial<UserPreferences>): Promise<void> {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (!token) throw new Error('No authentication token');

      await api.put(
        `${API_URL}/user/preferences/`,
        { preferences },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  }
}

export const isLoggedIn = async (): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (!token) {
      return false;
    }
    // Optionally, we can validate the token with the backend
    // For now, just check if token exists
    return true;
  } catch (error) {
    console.error('Error checking login status:', error);
    return false;
  }
};

export default {
  isLoggedIn,
  AuthService: new AuthService()
};
