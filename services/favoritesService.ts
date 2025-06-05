import api from './api';
import { Recipe } from '@/types/recipe';
// All favorites requests use backend endpoints only.

export interface FavoritesResponse {
  success: boolean;
  favorites: Recipe[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: {
    message: string;
    code: string;
  };
}

/**
 * Get user favorites with pagination
 */
export const getFavorites = async (page = 1, limit = 20): Promise<FavoritesResponse> => {
  try {
    const response = await api.get(`/favorites/?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching favorites:', error);
    return {
      success: false,
      favorites: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0
      },
      error: {
        message: error.message || 'Failed to fetch favorites',
        code: error.code || 'UNKNOWN_ERROR'
      }
    };
  }
};

/**
 * Add a recipe to favorites
 */
export const addToFavorites = async (recipeId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.post('/favorites/', { recipe_id: recipeId });
    return response.data;
  } catch (error: any) {
    console.error('Error adding to favorites:', error);
    return {
      success: false,
      message: error.message || 'Failed to add recipe to favorites'
    };
  }
};

/**
 * Remove a recipe from favorites
 */
export const removeFromFavorites = async (recipeId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.delete(`/favorites/${recipeId}/`);
    return response.data;
  } catch (error: any) {
    console.error('Error removing from favorites:', error);
    return {
      success: false,
      message: error.message || 'Failed to remove recipe from favorites'
    };
  }
};

/**
 * Check if a recipe is in favorites
 */
export const isInFavorites = async (recipeId: string): Promise<boolean> => {
  try {
    const response = await getFavorites(1, 100);
    if (!response.success) return false;
    
    return response.favorites.some(recipe => recipe.id === recipeId);
  } catch (error) {
    console.error('Error checking favorites status:', error);
    return false;
  }
};
