import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../config/constants';

export interface OnboardingStatus {
  hasCompletedOnboarding: boolean;
  hasCompletedProfileSetup: boolean;
}

class SessionService {
  /**
   * Check if user is logged in
   */
  async isLoggedIn(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      return !!token;
    } catch (error) {
      console.error('Error checking login status:', error);
      return false;
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
