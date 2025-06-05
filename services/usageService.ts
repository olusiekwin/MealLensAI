import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';
import { STORAGE_KEYS } from '@/config/constants';
import { useUserStore } from '@/context/userStore';

export interface UsageData {
  totalUsageCount: number;
  dailyUsageCount: number;
  lastUsageDate: string;
  reachedDailyLimit: boolean;
}

class UsageService {
  async trackUsage(): Promise<UsageData> {
    try {
      // Get current values
      const today = new Date().toISOString().split('T')[0];
      const lastUsageDate = await AsyncStorage.getItem(STORAGE_KEYS.LAST_USAGE_DATE) || today;
      const totalCountStr = await AsyncStorage.getItem(STORAGE_KEYS.USAGE_COUNT);
      const totalCount = totalCountStr ? parseInt(totalCountStr) : 0;
      const newTotalCount = totalCount + 1;
      
      // Update total count
      await AsyncStorage.setItem(STORAGE_KEYS.USAGE_COUNT, newTotalCount.toString());
      
      // Check if it's a new day
      if (lastUsageDate !== today) {
        await AsyncStorage.setItem(STORAGE_KEYS.DAILY_USAGE_COUNT, '1');
        await AsyncStorage.setItem(STORAGE_KEYS.LAST_USAGE_DATE, today);
        
        // Try to update usage on server if authenticated
        try {
          await api.post('/user/usage/track', { date: today, count: 1 });
        } catch (error) {
          console.error('Failed to track usage on server:', error);
          // Continue with local tracking
        }
        
        return { 
          totalUsageCount: newTotalCount, 
          dailyUsageCount: 1,
          lastUsageDate: today,
          reachedDailyLimit: false
        };
      }
      
      // Same day, increment daily count
      const dailyCountStr = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_USAGE_COUNT);
      const dailyCount = dailyCountStr ? parseInt(dailyCountStr) : 0;
      const newDailyCount = dailyCount + 1;
      await AsyncStorage.setItem(STORAGE_KEYS.DAILY_USAGE_COUNT, newDailyCount.toString());
      
      // Check if daily limit is reached (5 for free users)
      const userState = useUserStore.getState();
      const reachedLimit = userState.subscription.status === 'free' && newDailyCount >= 5;
      
      // Try to update usage on server if authenticated
      try {
        await api.post('/user/usage/track', { date: today, count: newDailyCount });
      } catch (error) {
        console.error('Failed to track usage on server:', error);
        // Continue with local tracking
      }
      
      return { 
        totalUsageCount: newTotalCount, 
        dailyUsageCount: newDailyCount,
        lastUsageDate: today,
        reachedDailyLimit: reachedLimit
      };
    } catch (error: any) {
      console.error('❌ Usage tracking failed:', error.message);
      throw error;
    }
  }

  async checkDailyLimit(): Promise<boolean> {
    try {
      const dailyCountStr = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_USAGE_COUNT);
      const dailyCount = dailyCountStr ? parseInt(dailyCountStr) : 0;
      
      // Check if user is premium
      const userState = useUserStore.getState();
      if (userState.subscription.status === 'premium') {
        return false; // Premium users don't have limits
      }
      
      return dailyCount >= 5; // Free users have a limit of 5 scans per day
    } catch (error: any) {
      console.error('❌ Daily limit check failed:', error.message);
      throw error;
    }
  }

  async addUsageAfterAd(): Promise<UsageData> {
    try {
      // Try to call the backend endpoint
      try {
        const response = await api.post('/user/usage/ad-watched');
        if (response.data && response.data.success) {
          return response.data.data;
        }
      } catch (error) {
        console.error('Failed to update usage after ad on server:', error);
        // Continue with local implementation if API fails
      }
      
      // Local implementation as fallback
      const today = new Date().toISOString().split('T')[0];
      const dailyCountStr = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_USAGE_COUNT);
      const dailyCount = dailyCountStr ? parseInt(dailyCountStr) : 0;
      
      // Add one more usage after watching an ad
      const newDailyCount = dailyCount - 1 >= 0 ? dailyCount - 1 : 0;
      await AsyncStorage.setItem(STORAGE_KEYS.DAILY_USAGE_COUNT, newDailyCount.toString());
      
      const totalCountStr = await AsyncStorage.getItem(STORAGE_KEYS.USAGE_COUNT);
      const totalCount = totalCountStr ? parseInt(totalCountStr) : 0;
      
      return {
        totalUsageCount: totalCount,
        dailyUsageCount: newDailyCount,
        lastUsageDate: today,
        reachedDailyLimit: newDailyCount >= 5
      };
    } catch (error: any) {
      console.error('❌ Ad usage tracking failed:', error.message);
      throw error;
    }
  }
}

export default new UsageService();
