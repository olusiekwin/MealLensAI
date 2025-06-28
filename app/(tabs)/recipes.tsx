import { useState } from 'react';
import { Text, View, ScrollView, Image, TouchableOpacity, FlatList, TextInput, ActivityIndicator } from 'react-native';
import { Search, Filter, Clock, Star, Heart } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { recipesStyles } from '@/styles/recipes.styles';
import { useUserStore } from '@/context/userStore';
import { detectFromIngredients } from '@/services/detectionService';

export default function RecipesScreen() {
  const router = useRouter();
  const { token } = useUserStore();
  const [ingredientInput, setIngredientInput] = useState('');
  const [detectionResult, setDetectionResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDetect = async () => {
    setLoading(true);
    setError('');
    setDetectionResult(null);
    try {
      const response = await detectFromIngredients(ingredientInput, token);
      if (response.data.success) {
        setDetectionResult(response.data.data);
      } else {
        setError(response.data.error?.message || 'Detection failed');
      }
    } catch (err: any) {
      setError('Detection failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={recipesStyles.container}>
      <View style={recipesStyles.header}>
        <Text style={recipesStyles.title}>AI Recipe Suggestions</Text>
      </View>
      <View style={{ padding: 16 }}>
        <TextInput
          style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 8 }}
          placeholder="Enter ingredients (comma separated)"
          value={ingredientInput}
          onChangeText={setIngredientInput}
        />
        <TouchableOpacity onPress={handleDetect} style={{ backgroundColor: '#FF6B6B', padding: 12, borderRadius: 8, alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontWeight: '600' }}>Detect Recipes</Text>
        </TouchableOpacity>
      </View>
      {loading && <ActivityIndicator size="large" color="#FF6B6B" style={{ marginTop: 20 }} />}
      {error ? <Text style={{ color: 'red', textAlign: 'center', marginTop: 10 }}>{error}</Text> : null}
      {detectionResult && (
        <ScrollView style={{ marginTop: 16 }}>
          <View>
            <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>AI Suggestions:</Text>
            <Text style={{ marginBottom: 8 }}>{detectionResult.response}</Text>
            {detectionResult.food_suggestions && detectionResult.food_suggestions.length > 0 && (
              <View>
                <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Food Suggestions:</Text>
                {detectionResult.food_suggestions.map((item: any, idx: number) => (
                  <Text key={idx} style={{ marginLeft: 8 }}>- {item}</Text>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}