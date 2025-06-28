import api from './api';

export async function detectFromIngredients(ingredientList: string, token: string) {
  const formData = new FormData();
  formData.append('image_or_ingredient_list', 'ingredient_list');
  formData.append('ingredient_list', ingredientList);

  return api.post('/api/v1/detect/process', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`,
    },
  });
}

export async function detectFromImage(imageFile: any, token: string) {
  const formData = new FormData();
  formData.append('image_or_ingredient_list', 'image');
  formData.append('image', {
    uri: imageFile.uri,
    name: imageFile.name || 'photo.jpg',
    type: imageFile.type || 'image/jpeg',
  });

  return api.post('/api/v1/detect/process', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`,
    },
  });
}

export async function getFoodResources(foodDetected: string[]) {
  return api.post('/api/v1/detect/food_detect_resources', { food_detected: foodDetected });
}
