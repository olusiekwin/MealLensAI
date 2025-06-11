import api from './api';

export const foodService = {
  searchFood: async (query: string) => {
    try {
      const response = await api.get('/food/search', { params: { query } });
      return response.data;
    } catch (error: any) {
      console.error('❌ Food search failed:', error.message);
      throw error;
    }
  },

  analyzeImage: async (imageBase64: string) => {
    try {
      const response = await api.post('/detect/analyze', { image: imageBase64 });
      return response.data;
    } catch (error: any) {
      console.error('❌ Image analysis failed:', error.message);
      throw error;
    }
  },

  getFoodDetails: async (foodId: string) => {
    try {
      const response = await api.get(`/recipe/${foodId}`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Food details fetch failed:', error.message);
      throw error;
    }
  }
};
