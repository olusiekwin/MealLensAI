import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  StyleSheet,
  Linking,
  ActivityIndicator,
  Alert,
  Platform
} from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { 
  Send, 
  Camera, 
  Search, 
  ExternalLink, 
  Youtube, 
  Copy, 
  ArrowLeft,
  Info,
  Heart,
  RefreshCw,
  Share2,
  Clock,
  Star
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { trackAppUsage, searchFood } from '@/services/api';
import aiService from '@/services/aiService';
import { aiChatStyles } from '@/styles/aiChat.styles';

type Recipe = {
  id: string;
  title: string;
  image: string;
  cookTime: string;
  difficulty: string;
  description: string;
  rating: string;
};

export default function AIChatScreen() {
  const router = useRouter();
  const [detectedFood, setDetectedFood] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [cookingInstructions, setCookingInstructions] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);
  const params = useLocalSearchParams();

  useEffect(() => {
    try {
      // Check if we have data from camera
      if (params.result) {
        const result = JSON.parse(params.result as string);
        if (result.success && result.data) {
          // Process the data from the camera
          const { detectedItems } = result.data;
          if (detectedItems && detectedItems.length > 0) {
            // Set the first detected item as the main food
            setDetectedFood(detectedItems[0].name || 'Detected Food');
            
            // Process ingredients if available
            if (result.data.ingredients) {
              setIngredients(result.data.ingredients);
            }
            
            // Process instructions if available
            if (result.data.instructions) {
              setCookingInstructions(result.data.instructions);
            }
            
            // Process recipes if available
            if (result.data.recipes) {
              setRecipes(result.data.recipes);
            }
            
            setIsLoading(false);
            return;
          }
        }
      }
      
      // Fallback to mock data if no valid data from camera
      setDetectedFood('Avocado & Egg Sandwich');
      loadFoodData('Avocado & Egg Sandwich');
    } catch (error) {
      console.error('Error processing image data:', error);
      // Fallback to mock data on error
      setDetectedFood('Avocado & Egg Sandwich');
      loadFoodData('Avocado & Egg Sandwich');
    }
  }, [params]);

  const loadFoodData = async (foodName: string) => {
    setIsLoading(true);
    try {
      // Track usage (commented out as it was causing errors)
      // const usageStatus = await trackAppUsage();
      
      // Mock data for ingredients (fallback)
      setIngredients([
        '2 slices of bread (whole-grain or sourdough)',
        '1 ripe avocado (mashed or sliced)',
        '2 boiled eggs (hard or soft boiled)',
        'Salt and pepper',
        'Optional:',
        'Lemon Juice (a splash for the avocado)',
        'Fresh herbs (like parsley, chives or basil)'
      ]);
      
      // Mock data for cooking instructions (fallback)
      setCookingInstructions([
        '1. Toast the bread slices until golden brown.',
        '2. Mash the avocado in a bowl and season with salt, pepper, and a splash of lemon juice if using.',
        '3. Spread the avocado mixture evenly on both slices of toast.',
        '4. Slice the boiled eggs and arrange them on top of the avocado.',
        '5. Sprinkle with additional salt and pepper to taste.',
        '6. Add fresh herbs if desired.',
        '7. Serve immediately and enjoy!'
      ]);
      
      // Mock data for recipe suggestions (fallback)
      setRecipes([
        {
          id: '1',
          title: foodName || 'Egg & Avocado Sandwich',
          image: params.imageUri || 'https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          cookTime: '15 min',
          difficulty: 'Easy',
          description: 'An egg and avocado sandwich made with creamy avocado spread, a perfectly cooked egg, and fresh bread.',
          rating: '4.2'
        },
        {
          id: '2',
          title: 'Avocado Toast with Poached Eggs',
          image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          cookTime: '20 min',
          difficulty: 'Medium',
          description: 'Creamy avocado toast topped with perfectly poached eggs and a sprinkle of red pepper flakes.',
          rating: '4.5'
        },
        {
          id: '3',
          title: 'Breakfast Burrito with Avocado',
          image: 'https://images.unsplash.com/photo-1584278860047-22db9ff82bed?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          cookTime: '25 min',
          difficulty: 'Medium',
          description: 'A hearty breakfast burrito filled with scrambled eggs, avocado, cheese, and fresh salsa.',
          rating: '4.7'
        }
      ]);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading food data:', error);
      setIsLoading(false);
      Alert.alert('Error', 'Failed to load food information. Please try again.');
    }
  };

  const handleOpenLink = (url: string) => {
    Linking.openURL(url);
  };

  const handleShare = async () => {
    try {
      if (Platform.OS === 'web') {
        Alert.alert('Share', 'Sharing is not available on web');
        return;
      }
      
      Alert.alert('Share', `Sharing "${detectedFood}" recipe`);
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleRefresh = () => {
    loadFoodData(detectedFood);
  };

  const handleBackToCamera = () => {
    router.push('/camera');
  };

  const handleEditIngredients = () => {
    Alert.alert('Edit Ingredients', 'This feature will allow you to edit the detected ingredients.');
  };

  if (isLoading) {
    return (
      <View style={aiChatStyles.loadingContainer}>
        <LinearGradient
          colors={['#000000', '#FF8F47']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={aiChatStyles.headerBackground}
        >
          <TouchableOpacity 
            style={aiChatStyles.backButton}
            onPress={handleBackToCamera}
          >
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </LinearGradient>
        <View style={aiChatStyles.loadingContentContainer}>
          <ActivityIndicator size="large" color="#000000" />
          <Text style={aiChatStyles.loadingText}>Analyzing your food...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={aiChatStyles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <LinearGradient
        colors={['#000000', '#FF8F47']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={aiChatStyles.headerBackground}
      >
        <TouchableOpacity 
          style={aiChatStyles.backButton}
          onPress={handleBackToCamera}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </LinearGradient>
      
      {/* Content */}
      <ScrollView 
        style={aiChatStyles.contentContainer}
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
      >
        <View style={aiChatStyles.handleContainer}>
          <View style={aiChatStyles.handle} />
        </View>
        
        <Text style={aiChatStyles.dishTitle}>{detectedFood}</Text>
        
        {/* Dish Image */}
        <View style={aiChatStyles.imageContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }}
            style={aiChatStyles.dishImage}
          />
        </View>
        
        {/* Ingredients */}
        <View style={aiChatStyles.ingredientsContainer}>
          <Text style={aiChatStyles.sectionTitle}>Ingredient list</Text>
          <Text style={aiChatStyles.ingredientsList}>
            {ingredients.join('\n')}
          </Text>
          <TouchableOpacity 
            style={aiChatStyles.editButton}
            onPress={handleEditIngredients}
          >
            <Text style={aiChatStyles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
        
        {/* Recipe Suggestions */}
        <Text style={aiChatStyles.aiResponseTitle}>Recipe Suggestions</Text>
        
        {recipes.map((recipe, index) => (
          <View key={index} style={aiChatStyles.recipeCard}>
            <Image 
              source={{ uri: recipe.image }}
              style={aiChatStyles.recipeImage}
            />
            <View style={aiChatStyles.recipeContent}>
              <Text style={aiChatStyles.recipeTitle}>{recipe.title}</Text>
              <Text style={aiChatStyles.recipeDescription} numberOfLines={2}>
                {recipe.description}
              </Text>
              <View style={aiChatStyles.recipeDetails}>
                <View style={aiChatStyles.detailItem}>
                  <Star size={10} color="#000000" fill="#000000" />
                  <Text style={aiChatStyles.detailText}>{recipe.rating}</Text>
                </View>
                <View style={aiChatStyles.detailItem}>
                  <Clock size={10} color="#202026" />
                  <Text style={aiChatStyles.detailText}>{recipe.cookTime}</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={aiChatStyles.heartButton}>
              <Heart size={14} color="#FF5353" fill="#FF5353" />
            </TouchableOpacity>
          </View>
        ))}
        
        {/* Cooking Instructions */}
        <View style={aiChatStyles.recipeInstructionsContainer}>
          <Text style={aiChatStyles.recipeInstructionsTitle}>Cooking Instructions</Text>
          <View style={aiChatStyles.recipeInstructionsCard}>
            {cookingInstructions.map((step, index) => (
              <Text key={index} style={aiChatStyles.recipeInstructionsStep}>
                {step}
              </Text>
            ))}
          </View>
        </View>
        
        {/* Action Buttons */}
        <View style={aiChatStyles.actionButtonsContainer}>
          {/* External Links */}
          <View style={aiChatStyles.externalLinkButtons}>
            <TouchableOpacity 
              style={aiChatStyles.externalButton}
              onPress={() => handleOpenLink(`https://www.youtube.com/results?search_query=${encodeURIComponent(detectedFood)}+recipe`)}
            >
              <View style={aiChatStyles.youtubeIcon}>
                <Youtube size={18} color="#FFFFFF" />
              </View>
              <Text style={aiChatStyles.externalButtonText}>YouTube</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={aiChatStyles.externalButton}
              onPress={() => handleOpenLink(`https://www.google.com/search?q=${encodeURIComponent(detectedFood)}+recipe`)}
            >
              <View style={aiChatStyles.googleIcon}>
                <Text style={aiChatStyles.googleIconText}>G</Text>
              </View>
              <Text style={aiChatStyles.externalButtonText}>Google</Text>
            </TouchableOpacity>
          </View>
          
          {/* Circle Buttons */}
          <View style={aiChatStyles.circleButtonsContainer}>
            <TouchableOpacity 
              style={aiChatStyles.circleButton}
              onPress={handleRefresh}
            >
              <RefreshCw size={18} color="#FFFFFF" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={aiChatStyles.circleButton}
              onPress={handleShare}
            >
              <Share2 size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}