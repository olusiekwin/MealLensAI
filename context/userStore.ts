import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '@/services/api';
import { STORAGE_KEYS } from '@/config/constants';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  dob?: string; // Added for backward compatibility
  gender?: string;
  address?: string;
  location?: string;
  profileImage?: string;
}

export interface UserPreferences {
  dietaryRestrictions: string[];
  cookingSkillLevel: string;
  favorites: string[];
}

export interface UserSubscription {
  status: 'free' | 'premium';
  plan?: 'weekly' | 'monthly' | 'annual';
  expiryDate?: string;
  paymentMethod?: string;
  autoRenew?: boolean;
}

export interface UserUsage {
  totalUsageCount: number;
  dailyUsageCount: number;
  lastUsageDate: string;
  reachedDailyLimit: boolean;
}

export interface PaymentHistory {
  id: string;
  date: string;
  amount: number;
  plan: string;
  status: 'completed' | 'pending' | 'failed';
}

interface UserState {
  isAuthenticated: boolean;
  isLoading: boolean;
  profile: UserProfile | null;
  preferences: UserPreferences | null;
  subscription: UserSubscription;
  usage: UserUsage;
  paymentHistory: PaymentHistory[];
  
  // Actions
  initialize: () => Promise<void>;
  initializeUsage: () => Promise<void>;
  login: (token: string, userId: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  fetchSubscription: () => Promise<void>;
  fetchPaymentHistory: () => Promise<void>;
  trackUsage: () => Promise<void>;
  incrementDailyUsageRemaining: (amount: number) => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  updatePreferences: (data: Partial<UserPreferences>) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  isAuthenticated: false,
  isLoading: true,
  profile: null,
  preferences: null,
  subscription: {
    status: 'free'
  },
  usage: {
    totalUsageCount: 0,
    dailyUsageCount: 0,
    lastUsageDate: new Date().toISOString().split('T')[0],
    reachedDailyLimit: false
  },
  paymentHistory: [],
  
  initialize: async () => {
    set({ isLoading: true });
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (token) {
        const userId = await AsyncStorage.getItem(STORAGE_KEYS.USER_ID);
        if (userId) {
          await get().login(token, userId);
        } else {
          await get().logout();
        }
      }
      
      // Initialize usage data from local storage
      await get().initializeUsage();
      
    } catch (error) {
      console.error('Failed to initialize user state:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  
  initializeUsage: async () => {
    try {
      // Get current date as string (YYYY-MM-DD)
      const today = new Date().toISOString().split('T')[0];
      
      // Get last usage date
      const lastUsageDate = await AsyncStorage.getItem(STORAGE_KEYS.LAST_USAGE_DATE) || today;
      
      // Get total usage count
      const totalCountStr = await AsyncStorage.getItem(STORAGE_KEYS.USAGE_COUNT);
      const totalCount = totalCountStr ? parseInt(totalCountStr) : 0;
      
      // Check if it's a new day
      if (lastUsageDate !== today) {
        // Reset daily count for new day
        await AsyncStorage.setItem(STORAGE_KEYS.DAILY_USAGE_COUNT, '0');
        await AsyncStorage.setItem(STORAGE_KEYS.LAST_USAGE_DATE, today);
        
        set(state => ({
          usage: {
            ...state.usage,
            dailyUsageCount: 0,
            lastUsageDate: today,
            totalUsageCount: totalCount,
            reachedDailyLimit: false
          }
        }));
      } else {
        // Get current daily usage count
        const dailyCountStr = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_USAGE_COUNT);
        const dailyCount = dailyCountStr ? parseInt(dailyCountStr) : 0;
        
        // Check if daily limit is reached (5 for free users)
        const reachedLimit = get().subscription.status === 'free' && dailyCount >= 5;
        
        set(state => ({
          usage: {
            ...state.usage,
            dailyUsageCount: dailyCount,
            lastUsageDate: lastUsageDate,
            totalUsageCount: totalCount,
            reachedDailyLimit: reachedLimit
          }
        }));
      }
    } catch (error) {
      console.error('Failed to initialize usage data:', error);
    }
  },
  
  login: async (token: string, userId: string) => {
    try {
      console.log('🔑 UserStore: Storing authentication data...');
      console.log('- Token:', token ? `${token.substring(0, 10)}...` : 'missing');
      console.log('- User ID:', userId || 'missing');
      
      // Validate inputs
      if (!token) {
        throw new Error('Cannot login: Token is missing or invalid');
      }
      
      if (!userId) {
        throw new Error('Cannot login: User ID is missing or invalid');
      }
      
      // Store authentication data
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_ID, userId);
      
      // Verify storage
      const storedToken = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const storedUserId = await AsyncStorage.getItem(STORAGE_KEYS.USER_ID);
      
      console.log('✅ Token stored successfully:', !!storedToken);
      console.log('✅ User ID stored successfully:', !!storedUserId);
      
      // Update authentication state
      set({ isAuthenticated: true });
      console.log('✅ Authentication state updated');
      
      // Fetch user data after login
      console.log('🔄 Fetching user data...');
      await Promise.all([
        get().fetchProfile(),
        get().fetchSubscription(),
        get().fetchPaymentHistory()
      ]);
      console.log('✅ User data fetched successfully');
    } catch (error) {
      console.error('❌ Login error:', error);
      console.log('🔄 Attempting to logout due to login error...');
      await get().logout();
    }
  },
  
  logout: async () => {
    try {
      // Call the logout endpoint if authenticated
      if (get().isAuthenticated) {
        try {
          await api.post('/auth/logout');
        } catch (error) {
          console.error('Logout API error:', error);
          // Continue with local logout even if API call fails
        }
      }
      
      // Clear auth-related items from storage
      const keysToRemove = [
        STORAGE_KEYS.AUTH_TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.USER_ID,
        STORAGE_KEYS.USER_EMAIL
      ];
      
      await AsyncStorage.multiRemove(keysToRemove);
      
      // Reset state
      set({
        isAuthenticated: false,
        profile: null,
        preferences: null,
        subscription: {
          status: 'free'
        },
        paymentHistory: []
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },
  
  fetchProfile: async () => {
    if (!get().isAuthenticated) {
      console.log('⚠️ Skipping profile fetch - not authenticated');
      return;
    }
    
    try {
      console.log('🔄 Fetching user profile...');
      const response = await api.get('/user/profile');
      console.log('✅ Profile response:', response.data);
      
      // Handle different response structures
      if (response.data && response.data.success) {
        const profileData = response.data.data || {};
        console.log('📋 Profile data:', profileData);
        
        set({
          profile: {
            id: profileData.id || '',
            name: `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim() || profileData.name || '',
            email: profileData.email || '',
            username: profileData.username || '',
            firstName: profileData.firstName || '',
            lastName: profileData.lastName || '',
            phone: profileData.phone || '',
            dateOfBirth: profileData.dateOfBirth || profileData.dob || '',
            gender: profileData.gender || '',
            address: profileData.address || '',
            location: profileData.location || '',
            profileImage: profileData.avatar_url || profileData.profileImage || ''
          },
          preferences: profileData.preferences || null
        });
        
        console.log('✅ Profile updated in store');
      } else {
        console.warn('⚠️ Invalid profile response format:', response.data);
      }
    } catch (error) {
      console.error('❌ Failed to fetch user profile:', error);
      
      // If API fails, use mock data
      if (!get().profile) {
        console.log('ℹ️ Using mock profile data');
        set({
          profile: {
            id: 'mock-id',
            name: 'Samuel Barns',
            email: 'S.Barns@gmail.com',
            phone: '+1 523 458 78 12',
            dob: '04/20/1996',
            gender: 'Male',
            address: 'KK 21 KG 102 St'
          },
          preferences: {
            dietaryRestrictions: ['vegetarian'],
            cookingSkillLevel: 'intermediate',
            favorites: []
          }
        });
      }
    }
  },
  
  fetchSubscription: async () => {
    if (!get().isAuthenticated) return;
    
    try {
      const response = await api.get('/payment/subscription-status');
      
      if (response.data && response.data.success) {
        set({
          subscription: {
            status: response.data.data.status,
            plan: response.data.data.plan,
            expiryDate: response.data.data.expiry_date,
            autoRenew: response.data.data.auto_renew
          }
        });
      }
    } catch (error) {
      console.error('Failed to fetch subscription status:', error);
      
      // If API fails, use mock subscription data
      set({
        subscription: {
          status: 'free',
          plan: undefined,
          expiryDate: undefined,
          autoRenew: false
        }
      });
    }
  },
  
  fetchPaymentHistory: async () => {
    if (!get().isAuthenticated) return;
    
    try {
      const response = await api.get('/payment/history');
      
      if (response.data && response.data.success) {
        set({
          paymentHistory: response.data.data
        });
      }
    } catch (error) {
      console.error('Failed to fetch payment history:', error);
      
      // If API fails, use mock payment history
      set({
        paymentHistory: [
          {
            id: 'mock-payment-1',
            date: '2025-05-01T12:00:00Z',
            amount: 3.99,
            plan: 'monthly',
            status: 'completed'
          }
        ]
      });
    }
  },
  
  trackUsage: async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const lastUsageDate = get().usage.lastUsageDate;
      const totalCount = get().usage.totalUsageCount;
      const newTotalCount = totalCount + 1;
      
      // Update total count
      await AsyncStorage.setItem(STORAGE_KEYS.USAGE_COUNT, newTotalCount.toString());
      
      // Check if it's a new day
      if (lastUsageDate !== today) {
        await AsyncStorage.setItem(STORAGE_KEYS.DAILY_USAGE_COUNT, '1');
        await AsyncStorage.setItem(STORAGE_KEYS.LAST_USAGE_DATE, today);
        
        set(state => ({
          usage: {
            ...state.usage,
            totalUsageCount: newTotalCount,
            dailyUsageCount: 1,
            lastUsageDate: today,
            reachedDailyLimit: false
          }
        }));
        
        return;
      }
      
      // Same day, increment daily count
      const dailyCount = get().usage.dailyUsageCount;
      const newDailyCount = dailyCount + 1;
      await AsyncStorage.setItem(STORAGE_KEYS.DAILY_USAGE_COUNT, newDailyCount.toString());
      
      // Check if daily limit is reached (5 for free users)
      const reachedLimit = get().subscription.status === 'free' && newDailyCount >= 5;
      
      set(state => ({
        usage: {
          ...state.usage,
          totalUsageCount: newTotalCount,
          dailyUsageCount: newDailyCount,
          reachedDailyLimit: reachedLimit
        }
      }));
      
      // If user is authenticated, also track usage on server
      if (get().isAuthenticated) {
        try {
          await api.post('/usage/track');
        } catch (error) {
          console.error('Failed to track usage on server:', error);
        }
      }
    } catch (error) {
      console.error('Usage tracking failed:', error);
    }
  },
  
  incrementDailyUsageRemaining: (amount: number) => {
    try {
      // If user is premium, they already have unlimited usage
      if (get().subscription.status === 'premium') {
        return;
      }
      
      // Define constants
      const dailyLimit = 5; // Free user limit
      
      // Get current values
      const currentUsage = get().usage;
      const dailyUsageRemaining = dailyLimit - currentUsage.dailyUsageCount;
      const newDailyUsageRemaining = Math.min(dailyLimit, dailyUsageRemaining + amount);
      const newDailyCount = dailyLimit - newDailyUsageRemaining;
      const reachedLimit = newDailyCount >= dailyLimit;
      
      // Update usage state
      set(state => ({
        usage: {
          ...state.usage,
          dailyUsageCount: newDailyCount,
          reachedDailyLimit: reachedLimit
        }
      }));
      
      // Save updated usage to local storage
      AsyncStorage.setItem(
        STORAGE_KEYS.DAILY_USAGE_COUNT,
        newDailyCount.toString()
      ).catch(error => {
        console.error('Failed to save updated usage to storage:', error);
      });
    } catch (error) {
      console.error('Failed to increment daily usage remaining:', error);
    }
  },
  
  updateProfile: async (data: Partial<UserProfile>) => {
    if (!get().isAuthenticated) return;
    
    try {
      const response = await api.put('/user/profile', data);
      
      if (response.data && response.data.success) {
        set(state => ({
          profile: {
            ...state.profile!,
            ...data
          }
        }));
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      
      // If API fails, update local state anyway for better UX
      set(state => ({
        profile: {
          ...state.profile!,
          ...data
        }
      }));
    }
  },
  
  updatePreferences: async (data: Partial<UserPreferences>) => {
    if (!get().isAuthenticated) return;
    
    try {
      const response = await api.put('/user/preferences', data);
      
      if (response.data && response.data.success) {
        set(state => ({
          preferences: {
            ...state.preferences!,
            ...data
          }
        }));
      }
    } catch (error) {
      console.error('Failed to update preferences:', error);
      
      // If API fails, update local state anyway for better UX
      set(state => ({
        preferences: {
          ...state.preferences!,
          ...data
        }
      }));
    }
  }
}));
