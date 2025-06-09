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
} from '../constants';

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
  token?: string;
  user?: User;
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
        api.post('/auth/register', userData)
      );
      console.log('✅ Registration response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Registration failed:', error.response?.data || error.message);
      throw error.response?.data?.error || 'Registration failed';
    }
  }

  // Resend confirmation email
  async resendConfirmationEmail(email: string) {
    try {
      console.log(`🔄 Resending confirmation for: ${email}`);
      const response = await retryRequest(() => 
        api.post('/auth/resend-confirmation-email', { email })
      );
      console.log('✅ Confirmation email resent:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Resend confirmation failed:', error.response?.data || error.message);
      throw error.response?.data?.error || 'Failed to resend confirmation email';
    }
  }

  // Login user
  async login(userData: LoginData): Promise<AuthResponse> {
    try {
      console.log('🔄 Attempting login with:', { email: userData.email });
      
      // Use axios directly with timeout configuration
      const response = await retryRequest(() => 
        api.post('/auth/login', userData, {
          timeout: REQUEST_TIMEOUT
        })
      );
      console.log('✅ Login response:', response.data);
      
      // Extract data from the response
      const responseData = response.data.data || response.data;
      
      // Create a modified response with token field and user data for compatibility
      const modifiedResponse = {
        success: response.data.success,
        message: response.data.message,
        error: response.data.error,
        token: responseData.session?.token || responseData.session?.access_token,
        user: responseData.user || { id: responseData.user_id || '' }
      };
      
      // Log the actual response to debug token issues
      console.log('Backend session token:', responseData.session?.token);
      console.log('Backend access token:', responseData.session?.access_token);
      
      // Log the response structure to help with debugging
      console.log('Backend response:', response.data);
      console.log('Modified response structure:', {
        success: modifiedResponse.success,
        hasToken: !!modifiedResponse.token,
        hasUser: !!modifiedResponse.user,
        userId: modifiedResponse.user?.id
      });
      
      if (modifiedResponse.success && modifiedResponse.token) {
        console.log('🔑 Storing auth token...');
        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, modifiedResponse.token);
        await AsyncStorage.setItem(STORAGE_KEYS.USER_EMAIL, userData.email);
        
        // Store user ID if available
        if (modifiedResponse.user?.id) {
          await AsyncStorage.setItem(STORAGE_KEYS.USER_ID, modifiedResponse.user.id);
          console.log('✅ User ID stored:', modifiedResponse.user.id);
        }
        
        const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        console.log('✅ Token stored:', token ? 'Yes' : 'No');
      } else {
        console.warn('⚠️ No access token in response:', modifiedResponse);
      }
      
      return modifiedResponse;
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
        api.post('/auth/forgot-password', { email })
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
        url: '/auth/user/delete'
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
    const clientId = GOOGLE_CONFIG.WEB_CLIENT_ID;
    if (!clientId) {
      throw new Error("Google Web Client ID is not configured in .env file.");
    }
    
    try {
      const discovery = await AuthSession.fetchDiscoveryAsync('https://accounts.google.com');
      const authRequest = new AuthSession.AuthRequest({
        responseType: ResponseType.Code,
        clientId: clientId,
        scopes: ['profile', 'email'],
        redirectUri: AuthSession.makeRedirectUri({
          scheme: 'meallensai',
          path: 'auth'
        }),
      });

      // Prompt user to sign in
      const authResult = await authRequest.promptAsync(discovery);
      
      if (authResult.type === 'success') {
        const { code } = authResult.params;
        
        // Exchange code for tokens with backend
        const response = await api.post('/auth/google/callback', { code });
        
        if (response.data?.token) {
          await AsyncStorage.setItem('auth_token', response.data.token);
          return { token: response.data.token };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Google Sign-In Error:", error);
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
        `/user/preferences/`,
        { preferences },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();
