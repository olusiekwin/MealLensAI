import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../config/constants';
import sessionService from './sessionService';

export interface UserProfile {
  id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  location?: string;
  avatar_url?: string;
  auth_provider?: string;
  created_at?: string;
  updated_at?: string;
}

class ProfileService {
  /**
   * Get user profile from backend
   */
  async getProfile(): Promise<UserProfile | null> {
    try {
      const response = await api.get('/user/profile');
      
      if (response.data?.success && response.data?.data) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(profileData: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const response = await api.put('/user/profile', profileData);
      
      if (response.data?.success && response.data?.data) {
        // Mark profile setup as completed if we have all required fields
        if (this.isProfileComplete(response.data.data)) {
          await sessionService.completeProfileSetup();
        }
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error('Error updating profile:', error);
      return null;
    }
  }

  /**
   * Check if profile has all required fields
   */
  isProfileComplete(profile: UserProfile): boolean {
    return !!(
      profile.firstName &&
      profile.lastName &&
      profile.username &&
      profile.email &&
      profile.dateOfBirth &&
      profile.gender
    );
  }

  /**
   * Get user preferences
   */
  async getPreferences(): Promise<any> {
    try {
      const response = await api.get('/user/preferences/');
      
      if (response.data?.success && response.data?.data) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching preferences:', error);
      return null;
    }
  }

  /**
   * Update user preferences
   */
  async updatePreferences(preferences: any): Promise<any> {
    try {
      const response = await api.put('/user/preferences/', preferences);
      
      if (response.data?.success && response.data?.data) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error('Error updating preferences:', error);
      return null;
    }
  }
}

export default new ProfileService();
