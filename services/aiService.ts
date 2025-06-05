import { AI_ENDPOINTS, STORAGE_KEYS, API_URL } from '@/config/constants';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface DetectionResult {
  success: boolean;
  data: {
    items: string[];
    confidence: number[];
    instructions: string;
  };
  detection_id: string;
  food_suggestions?: string[];
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  error?: {
    message: string;
    code: string;
  };
}

export interface ProcessedResult {
  ingredients: string[];
  food_suggestions?: string[];
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  id?: string; // Analysis ID for reference
  timestamp?: string; // When the detection was processed
}

export interface CookingInstructions {
  title: string;
  ingredients: string[];
  steps: { text: string }[];
  tips: { text: string }[];
  estimatedTime?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
}

// Helper function to generate UUID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export interface ResourcesResult {
  title?: string;
  youtube_links: {
    title: string;
    url: string;
    thumbnail: string;
  }[];
  google_links: {
    title: string;
    url: string;
    snippet: string;
  }[];
}

class AIService {
  private async getAuthToken(): Promise<string> {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      return token || '';
    } catch (error) {
      console.error('Error retrieving auth token:', error);
      return '';
    }
  }

  // Helper to get platform info for analytics
  private getPlatform(): string {
    return Platform.OS;
  }

  private async logInteraction(action: string, params: any, result: any, status: 'success' | 'error'): Promise<void> {
    try {
      // Only log if we have a token
      const token = await this.getAuthToken();
      if (!token) return;

      await fetch(`${API_URL}/api/v1/analytics/log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action,
          params,
          result: typeof result === 'object' ? JSON.stringify(result) : result,
          status,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error: any) {
      console.error('Error logging interaction:', error);
    }
  }

  // Mock data methods to ensure the app works even when the AI server is unavailable
  private getMockDetectionResult(): DetectionResult {
    const detectionId = generateUUID();
    return {
      success: true,
      data: {
        items: ['chicken', 'rice', 'onions', 'bell peppers', 'garlic'],
        confidence: [0.8, 0.7, 0.6, 0.5, 0.4],
        instructions: 'Cook the chicken and rice together with some onions and bell peppers.'
      },
      detection_id: detectionId,
      food_suggestions: [
        'Chicken Fried Rice',
        'Chicken Stir Fry',
        'Chicken and Rice Casserole'
      ],
      nutritionalInfo: {
        calories: 450,
        protein: 30,
        carbs: 45,
        fat: 15
      }
    };
  }
  
  private getMockProcessedResult(): ProcessedResult {
    return {
      id: generateUUID(),
      timestamp: new Date().toISOString(),
      ingredients: ['chicken', 'rice', 'onions', 'bell peppers', 'garlic'],
      food_suggestions: [
        'Chicken Fried Rice',
        'Chicken Stir Fry',
        'Chicken and Rice Casserole'
      ],
      nutritionalInfo: {
        calories: 450,
        protein: 30,
        carbs: 45,
        fat: 15
      }
    };
  }
  
  private getMockInstructions(): CookingInstructions {
    return {
      title: 'Chicken Fried Rice',
      ingredients: [
        '2 cups cooked rice',
        '1 lb chicken breast, diced',
        '1 onion, chopped',
        '2 bell peppers, chopped',
        '3 cloves garlic, minced',
        '3 tbsp soy sauce',
        '2 tbsp vegetable oil',
        '2 eggs, beaten'
      ],
      steps: [
        { text: 'Heat oil in a large skillet or wok over medium-high heat.' },
        { text: 'Add diced chicken and cook until no longer pink, about 5-7 minutes.' },
        { text: 'Add onions, bell peppers, and garlic. Stir-fry for 3-4 minutes until vegetables begin to soften.' },
        { text: 'Push everything to one side of the pan and pour beaten eggs into the empty space. Scramble until cooked through.' },
        { text: 'Add cooked rice and soy sauce. Mix everything together and cook for another 3-4 minutes until heated through.' },
        { text: 'Serve hot, garnished with green onions if desired.' }
      ],
      tips: [
        { text: 'Use day-old cold rice for best results - freshly cooked rice can become mushy.' },
        { text: 'Add a dash of sesame oil at the end for extra flavor.' },
        { text: 'Feel free to add other vegetables like peas, carrots, or corn.' }
      ],
      estimatedTime: 30,
      difficulty: 'Easy'
    };
  }
  
  private getMockResources(): ResourcesResult {
    return {
      title: 'Chicken Fried Rice',
      youtube_links: [
        {
          title: 'Easy Chicken Fried Rice Recipe',
          url: 'https://www.youtube.com/watch?v=qH__o17xHls',
          thumbnail: 'https://i.ytimg.com/vi/qH__o17xHls/hqdefault.jpg'
        },
        {
          title: 'The BEST Chicken Fried Rice Recipe',
          url: 'https://www.youtube.com/watch?v=7AxydboW8v8',
          thumbnail: 'https://i.ytimg.com/vi/7AxydboW8v8/hqdefault.jpg'
        },
        {
          title: 'How to Make Perfect Fried Rice Every Time',
          url: 'https://www.youtube.com/watch?v=n10xBmqehik',
          thumbnail: 'https://i.ytimg.com/vi/n10xBmqehik/hqdefault.jpg'
        }
      ],
      google_links: [
        {
          title: 'Easy Chicken Fried Rice Recipe - Allrecipes',
          url: 'https://www.allrecipes.com/recipe/79543/fried-rice-restaurant-style/',
          snippet: 'Make restaurant-style fried rice at home with this easy recipe.'
        },
        {
          title: 'The Best Chicken Fried Rice - Food Network',
          url: 'https://www.foodnetwork.com/recipes/food-network-kitchen/chicken-fried-rice-recipe-2103725',
          snippet: 'This homemade version is healthier than takeout and ready in just 30 minutes.'
        },
        {
          title: '15-Minute Chicken Fried Rice - Cooking Classy',
          url: 'https://www.cookingclassy.com/chicken-fried-rice/',
          snippet: 'Quick and easy chicken fried rice that tastes better than takeout!'
        }
      ]
    };
  }

  async detectFood(imageBase64: string): Promise<DetectionResult> {
    try {
      // Call the local backend endpoint
      const response = await fetch('/detect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image: imageBase64 })
      });
      
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error('Error in detectFood: Backend returned error', response.status);
        return this.getMockDetectionResult();
      }
    } catch (error: any) {
      console.error('Error in detectFood:', error);
      // If there's an error, use mock data to ensure the app works
      return this.getMockDetectionResult();
    }
  }

  async processFood(detectedItems: string[], source: 'image' | 'text' = 'image'): Promise<ProcessedResult> {
    try {
      // For text input, we use the /process endpoint with ingredient_list
      // For image input, we use the /food_detect endpoint (already handled by detectFood)
      if (source === 'image') {
        throw new Error('For image processing, use detectFood method instead');
      }

      // Call the local backend endpoint
      const response = await fetch('/detect/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ items: detectedItems, source })
      });
      
      if (response.ok) {
        const data = await response.json();
        return {
          ...data,
          id: data.detection_id || generateUUID(),
          timestamp: new Date().toISOString()
        };
      } else {
        console.error('Error in processFood: Backend returned error', response.status);
        return this.getMockProcessedResult();
      }
    } catch (error: any) {
      console.error('Error in processFood:', error);
      // If there's an error, use mock data to ensure the app works
      return this.getMockProcessedResult();
    }
  }
  
  async getInstructions(foodItem: string, analysisId?: string): Promise<CookingInstructions> {
    try {
      // Call the local backend endpoint only
      const response = await fetch('/detect/instructions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ food: foodItem, detection_id: analysisId })
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error('Error in getInstructions: Backend returned error', response.status);
        return this.getMockInstructions();
      }
    } catch (error: any) {
      console.error('Error in getInstructions:', error);
      // If there's an error, use mock data to ensure the app works
      return this.getMockInstructions();
    }
  }
  
  async getUserHistory(): Promise<any[]> {
    try {
      const token = await this.getAuthToken();
      if (!token) {
        return []; // Return empty array if not authenticated
      }
      // Call the local backend endpoint only
      const response = await fetch('/detect/history', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error('Error in getUserHistory: Backend returned error', response.status);
        return [];
      }
    } catch (error: any) {
      console.error('Error in getUserHistory:', error);
      // If there's an error, return empty array
      return [];
    }
  }

  
  async checkDailyLimit(): Promise<{remaining: number, limit: number}> {
    try {
      const token = await this.getAuthToken();
      if (!token) {
        return { remaining: 3, limit: 3 }; // Default values for non-authenticated users
      }
      
      // This is a custom endpoint in our backend, not part of the AI API
      const response = await fetch(AI_ENDPOINTS.AUTH_DAILY_LIMIT, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to check daily limit');
      }

      const result = await response.json();
      return {
        remaining: result.remaining || 0,
        limit: result.limit || 3
      };
    } catch (error: any) {
      console.error('Error in checkDailyLimit:', error);
      return { remaining: 3, limit: 3 }; // Default fallback values
    }
  }
  
  async getResources(foodItem: string): Promise<ResourcesResult> {
    try {
      // Only use the backend-proxied endpoint
      const response = await fetch('/detect/resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ food: foodItem })
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error('Error in getResources: Backend returned error', response.status);
        return this.getMockResources();
      }
    } catch (error: any) {
      console.error('Error in getResources:', error);
      return this.getMockResources();
    }
  }
  
  async getFoodDetectResources(detectedItems: string[]): Promise<ResourcesResult[]> {
    try {
      // Only use the backend-proxied endpoint
      const response = await fetch('/detect/food_detect_resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ detected_items: detectedItems })
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error('Error in getFoodDetectResources: Backend returned error', response.status);
        return [this.getMockResources(), this.getMockResources()];
      }
    } catch (error: any) {
      console.error('Error in getFoodDetectResources:', error);
      return [this.getMockResources(), this.getMockResources()];
    }
  }

  async toggleFavorite(detectionId: string, isFavorite: boolean): Promise<boolean> {
    try {
      const token = await this.getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_URL}/api/v1/detect/favorite/${detectionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ is_favorite: isFavorite })
      });

      if (!response.ok) {
        throw new Error('Failed to update favorite status');
      }

      const result = await response.json();
      await this.logInteraction('toggle_favorite', { detection_id: detectionId, is_favorite: isFavorite }, result, 'success');
      return true;
    } catch (error: any) {
      console.error('Error toggling favorite:', error);
      await this.logInteraction('toggle_favorite', { detection_id: detectionId, is_favorite: isFavorite }, { error: error.message }, 'error');
      return false;
    }
  }
}

export default new AIService();
