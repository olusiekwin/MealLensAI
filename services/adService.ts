import api from './api';
import ENV from '../config/environment';

export interface Ad {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  targetUrl: string;
  type: 'banner' | 'interstitial' | 'rewarded';
}

/**
 * AdService - Handles all ad-related operations by leveraging the backend
 * This service communicates with the backend to determine when and what ads to show
 * reducing frontend processing and ensuring consistent ad policies
 */
class AdService {
  private mockAdsEnabled = ENV.USE_MOCK_ADS === true;
  
  /**
   * Check if ads should be displayed for the current user and context
   * @param context The context where the ad would be shown
   * @returns Boolean indicating if an ad should be shown
   */
  async shouldDisplayAd(context: string = 'general'): Promise<boolean> {
    try {
      // If using mock ads, always return true for testing
      if (this.mockAdsEnabled) return true;
      
      const response = await api.get('/ads/should-display', {
        params: { context }
      });
      
      return response.data?.showAd || false;
    } catch (error) {
      console.error('Error checking ad display status:', error);
      return false; // Default to not showing ads on error
    }
  }
  
  /**
   * Track ad interaction on the backend
   * @param adId The ID of the ad
   * @param eventType The type of interaction (view, click, complete)
   * @returns Success status
   */
  async trackAdInteraction(adId: string, eventType: 'view' | 'click' | 'complete'): Promise<boolean> {
    try {
      if (this.mockAdsEnabled) return true;
      
      const response = await api.post('/ads/track', {
        ad_id: adId,
        event_type: eventType,
        timestamp: new Date().toISOString()
      });
      
      return response.data && response.data.success;
    } catch (error) {
      console.error('Error tracking ad interaction:', error);
      return false;
    }
  }

  /**
   * Get the user's daily detection limit and remaining detections
   * @returns Daily limit information
   */
  async getDailyLimit(): Promise<{
    limit: number;
    remaining: number;
    resetTime: string;
  } | null> {
    try {
      if (this.mockAdsEnabled) {
        return {
          limit: 10,
          remaining: 5,
          resetTime: new Date(new Date().setHours(24, 0, 0, 0)).toISOString()
        };
      }
      
      const response = await api.get('/ads/daily-limit');
      
      if (response.data && response.data.success) {
        return response.data.data;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching daily limit:', error);
      return null;
    }
  }
  
  /**
   * Fetch ads from the backend based on context
   * @param context The context where the ad will be shown
   * @returns Array of ads or empty array if none available
   */
  async fetchAds(context: string = 'general'): Promise<Ad[]> {
    try {
      // Use mock ads for development
      if (this.mockAdsEnabled) {
        return this.getMockAds(context);
      }

      const response = await api.get('/ads/list', {
        params: { context }
      });

      // Check response data instead of status to handle both Axios responses and mock responses
      if (!response.data?.success || !response.data?.ads) {
        console.warn('No ads returned from backend, using mock ads');
        return this.getMockAds(context);
      }

      return response.data.ads;
    } catch (error) {
      console.error('Error fetching ads:', error);
      return this.getMockAds(context);
    }
  }

  /**
   * Track ad impression on the backend
   * @param adId ID of the ad that was shown
   * @param context Context where the ad was shown
   */
  async trackAdImpression(adId: string, context: string = 'general'): Promise<void> {
    try {
      if (this.mockAdsEnabled) return;

      await api.post('/ads/impression', { adId, context });
      console.log(`✅ Ad impression tracked: ${adId} in ${context}`);
    } catch (error) {
      console.error('Error tracking ad impression:', error);
    }
  }

  /**
   * Track ad click on the backend
   * @param adId ID of the ad that was clicked
   * @param context Context where the ad was clicked
   */
  async trackAdClick(adId: string, context: string = 'general'): Promise<void> {
    try {
      if (this.mockAdsEnabled) return;

      await api.post('/ads/click', { adId, context });
      console.log(`✅ Ad click tracked: ${adId} in ${context}`);
    } catch (error) {
      console.error('Error tracking ad click:', error);
    }
  }

  /**
   * Get mock ads for development and testing
   * @param context The context to get mock ads for
   * @returns Array of mock ads
   */
  private getMockAds(context: string): Ad[] {
    const mockAds: Record<string, Ad[]> = {
      general: [
        {
          id: 'mock-ad-1',
          title: 'Premium MealLensAI',
          description: 'Upgrade to Premium for unlimited scans and no ads!',
          imageUrl: 'https://via.placeholder.com/300x200?text=Premium+MealLensAI',
          targetUrl: 'https://meallensai.com/premium',
          type: 'banner'
        }
      ],
      detection: [
        {
          id: 'mock-ad-2',
          title: 'MealLensAI Pro Features',
          description: 'Get detailed nutritional analysis with Pro!',
          imageUrl: 'https://via.placeholder.com/300x600?text=MealLensAI+Pro',
          targetUrl: 'https://meallensai.com/pro',
          type: 'interstitial'
        }
      ],
      results: [
        {
          id: 'mock-ad-3',
          title: 'MealLensAI Recipes',
          description: 'Discover thousands of recipes with MealLensAI!',
          imageUrl: 'https://via.placeholder.com/320x50?text=MealLensAI+Recipes',
          targetUrl: 'https://meallensai.com/recipes',
          type: 'banner'
        }
      ]
    };

    return mockAds[context] || mockAds.general;
  }
  
  /**
   * Watch a rewarded ad to earn rewards (e.g., additional detections)
   * @returns Promise resolving to success status and reward amount
   */
  async watchRewardedAd(): Promise<{ success: boolean; rewardAmount: number }> {
    try {
      if (this.mockAdsEnabled) {
        // Simulate watching a rewarded ad
        return { success: true, rewardAmount: 1 };
      }
      
      const response = await api.post('/ads/watch-rewarded');
      
      if (response.data && response.data.success) {
        return {
          success: true,
          rewardAmount: response.data.rewardAmount || 1
        };
      }
      
      return { success: false, rewardAmount: 0 };
    } catch (error) {
      console.error('Error watching rewarded ad:', error);
      return { success: false, rewardAmount: 0 };
    }
  }
}

// Export a singleton instance of the AdService
export default new AdService();
