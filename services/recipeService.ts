import api from './api';

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  cookingTime: number;
  difficulty: string;
  image?: string;
  tags: string[];
}

class RecipeService {
  async getRecipes(query?: string, category?: string): Promise<Recipe[]> {
    try {
      const params: any = {};
      if (query) params.query = query;
      if (category) params.category = category;
      
      const response = await api.get('/recipe/search/', { params });
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
      return [];
    }
  }

  async getRecipeById(id: string): Promise<Recipe | null> {
    try {
      const response = await api.get(`/recipe/${id}/`);
      return response.data.data || null;
    } catch (error) {
      console.error(`Failed to fetch recipe ${id}:`, error);
      return null;
    }
  }

  async getFavorites(): Promise<Recipe[]> {
    try {
      const response = await api.get('/favorites/');
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
      return [];
    }
  }

  async addToFavorites(recipeId: string): Promise<boolean> {
    try {
      const response = await api.post('/favorites/', { recipe_id: recipeId });
      return response.data.success || false;
    } catch (error) {
      console.error(`Failed to add recipe ${recipeId} to favorites:`, error);
      return false;
    }
  }

  async removeFromFavorites(recipeId: string): Promise<boolean> {
    try {
      const response = await api.delete(`/favorites/${recipeId}/`);
      return response.data.success || false;
    } catch (error) {
      console.error(`Failed to remove recipe ${recipeId} from favorites:`, error);
      return false;
    }
  }
}

export default new RecipeService();
