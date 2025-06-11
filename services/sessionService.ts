import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../config/constants';
import api from './api';

export interface OnboardingStatus {
  hasCompletedOnboarding: boolean;
  hasCompletedProfileSetup: boolean;
}

class SessionService {
  /**
   * Check if user is logged in and token is valid
   */
  async isLoggedIn(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (!token) return false;

      // Validate token with backend
      try {
        const response = await api.get('/api/v1/auth/validate-token');
        return response.data.valid === true;
      } catch (e) {
        console.warn('Token validation failed:', e);
        return false;
      }
    } catch (error) {
      console.error('Error checking login status:', error);
      return false;
    }
  }

  /**
   * Get token expiration time in seconds
   */
  async getTokenExpiration(): Promise<number | null> {
    try {
      const response = await api.get('/api/v1/auth/token-info');
      return response.data.expiration || null;
    } catch (error) {
      console.error('Error getting token expiration:', error);
      return null;
    }
  }

  /**
   * Check if token needs refresh (expires in less than 5 minutes)
   */
  async needsTokenRefresh(): Promise<boolean> {
    try {
      const expiration = await this.getTokenExpiration();
      if (!expiration) return true;

      const currentTime = Date.now() / 1000;
      const timeUntilExpiration = expiration - currentTime;
      
      // Return true if token expires in less than 5 minutes
      return timeUntilExpiration < 300;
    } catch (error) {
      console.error('Error checking token refresh:', error);
      return true;
    }
  }

  /**
   * Check if user has completed onboarding
   */
  async getOnboardingStatus(): Promise<OnboardingStatus> {
    try {
      const hasCompletedOnboarding = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
      const hasCompletedProfileSetup = await AsyncStorage.getItem(STORAGE_KEYS.PROFILE_SETUP_COMPLETED);
      
      return {
        hasCompletedOnboarding: hasCompletedOnboarding === 'true',
        hasCompletedProfileSetup: hasCompletedProfileSetup === 'true'
      };
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      return {
        hasCompletedOnboarding: false,
        hasCompletedProfileSetup: false
      };
    }
  }

  /**
   * Mark onboarding as completed
   */
  async completeOnboarding(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
    } catch (error) {
      console.error('Error setting onboarding status:', error);
    }
  }

  /**
   * Mark profile setup as completed
   */
  async completeProfileSetup(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PROFILE_SETUP_COMPLETED, 'true');
    } catch (error) {
      console.error('Error setting profile setup status:', error);
    }
  }

  /**
   * Clear all session data (for logout)
   */
  async clearSession(): Promise<void> {
    try {
      const keysToPreserve = [STORAGE_KEYS.ONBOARDING_COMPLETED];
      
      // Get all keys
      const allKeys = await AsyncStorage.getAllKeys();
      
      // Filter out keys to preserve
      const keysToRemove = allKeys.filter(key => !keysToPreserve.includes(key));
      
      // Remove filtered keys
      await AsyncStorage.multiRemove(keysToRemove);
    } catch (error) {
      console.error('Error clearing session:', error);
    }
  }
}

export default new SessionService();
