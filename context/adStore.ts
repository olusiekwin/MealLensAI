import { create } from 'zustand';
import api from '@/services/api';
import { useUserStore } from './userStore';

export interface Ad {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  targetUrl: string;
  position: 'banner' | 'interstitial' | 'native' | 'rewarded';
  isRewarded?: boolean;
  rewardAmount?: number;
  type?: string;
}

interface AdState {
  isLoading: boolean;
  ads: Ad[];
  shouldShowAds: boolean;
  
  // Actions
  fetchAds: () => Promise<void>;
  refreshAdStatus: () => void;
  markAdViewed: (adId: string) => Promise<void>;
  markAdClicked: (adId: string) => Promise<void>;
  trackAdView: (adId: string) => void;
  trackAdClick: (adId: string) => void;
  fetchRewardedAd: () => Promise<Ad | null>;
}

export const useAdStore = create<AdState>((set, get) => ({
  isLoading: false,
  ads: [],
  shouldShowAds: true,
  
  fetchAds: async () => {
    // Don't fetch ads for premium users
    const userSubscription = useUserStore.getState().subscription;
    if (userSubscription.status === 'premium') {
      set({ shouldShowAds: false, ads: [] });
      return;
    }
    
    set({ isLoading: true });
    try {
      // The backend endpoint might be unavailable in development
      // Fall back to mock ads if the API call fails
      console.log('🔄 Fetching ads from backend...');
      
      // Use mock ads in development to avoid unnecessary API calls
      if (process.env.NODE_ENV === 'development') {
        console.log('📱 Using mock ads in development mode');
        useMockAds();
        return;
      }
      
      try {
        const response = await api.get('/ads/list');
        
        // Check for successful response with data
        if (response.data && response.data.success && response.data.data) {
          console.log('✅ Successfully fetched ads from backend');
          set({
            ads: response.data.data,
            isLoading: false,
            shouldShowAds: true
          });
          return;
        }
        
        // If we get a 404 or any other non-success response, use mock ads
        console.log('⚠️ Using mock ads due to API response:', response.status);
        useMockAds();
      } catch (apiError) {
        console.error('❌ Failed to fetch ads from backend:', apiError);
        useMockAds();
      }
    } catch (error) {
      console.error('❌ Unexpected error in fetchAds:', error);
      useMockAds();
    }
    
    // Helper function to set mock ads
    function useMockAds() {
      set({
        ads: [
          {
            id: 'mock-ad-1',
            title: 'Premium Cooking Tools',
            description: 'Upgrade your kitchen with professional-grade tools',
            imageUrl: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            targetUrl: 'https://example.com/cooking-tools',
            position: 'banner'
          },
          {
            id: 'mock-ad-2',
            title: 'Organic Ingredients Delivery',
            description: 'Fresh organic ingredients delivered to your door',
            imageUrl: 'https://images.unsplash.com/photo-1543168256-418811576931?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            targetUrl: 'https://example.com/organic-delivery',
            position: 'native'
          }
        ],
        isLoading: false,
        shouldShowAds: true
      });
    }
  },
  
  refreshAdStatus: () => {
    const userSubscription = useUserStore.getState().subscription;
    set({ shouldShowAds: userSubscription.status !== 'premium' });
    
    // If user is premium and we have ads loaded, clear them
    if (userSubscription.status === 'premium' && get().ads.length > 0) {
      set({ ads: [] });
    } else if (userSubscription.status !== 'premium' && get().ads.length === 0) {
      // If user is not premium and we don't have ads, fetch them
      get().fetchAds();
    }
  },
  
  markAdViewed: async (adId: string) => {
    try {
      // Check if we're using mock ads
      if (process.env.NODE_ENV === 'development' || get().ads.find(ad => ad.id === adId)?.id.startsWith('mock-')) {
        console.log('📱 Using mock ads - skipping API call to mark ad viewed');
        return;
      }
      
      await api.post(`/ads/${adId}/view`);
    } catch (error) {
      console.error('Failed to mark ad as viewed:', error);
      // Continue silently if API fails
    }
  },
  
  markAdClicked: async (adId: string) => {
    try {
      // Check if we're using mock ads
      if (process.env.NODE_ENV === 'development' || get().ads.find(ad => ad.id === adId)?.id.startsWith('mock-')) {
        console.log('📱 Using mock ads - skipping API call to mark ad clicked');
        return;
      }
      
      await api.post(`/ads/${adId}/click`);
    } catch (error) {
      console.error('Failed to mark ad as clicked:', error);
      // Continue silently if API fails
    }
  },
  
  // Track ad view for analytics (wrapper around markAdViewed)
  trackAdView: (adId: string) => {
    get().markAdViewed(adId);
  },
  
  // Track ad click for analytics (wrapper around markAdClicked)
  trackAdClick: (adId: string) => {
    get().markAdClicked(adId);
  },
  
  // Fetch a rewarded ad
  fetchRewardedAd: async () => {
    try {
      const response = await api.get('/ads/next?rewarded=true');
      
      if (response.data && response.data.success) {
        return response.data.data;
      }
      
      // Return mock rewarded ad if API fails
      return {
        id: 'mock-rewarded-ad-1',
        title: 'Watch to Earn Extra Scans',
        description: 'Watch this short video to earn 1 additional scan today!',
        imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        targetUrl: 'https://example.com/rewarded',
        position: 'rewarded',
        isRewarded: true,
        rewardAmount: 1,
        type: 'video'
      };
    } catch (error) {
      console.error('Failed to fetch rewarded ad:', error);
      
      // Return mock rewarded ad if API fails
      return {
        id: 'mock-rewarded-ad-1',
        title: 'Watch to Earn Extra Scans',
        description: 'Watch this short video to earn 1 additional scan today!',
        imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        targetUrl: 'https://example.com/rewarded',
        position: 'rewarded',
        isRewarded: true,
        rewardAmount: 1,
        type: 'video'
      };
    }
  }
}));
