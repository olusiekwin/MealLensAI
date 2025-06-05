import { Text, View, ScrollView, Image, TouchableOpacity, Share } from 'react-native';
import { ArrowLeft, Share2, Heart } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { recipeDetailsStyles } from "@/styles/recipeDetails.styles";
import { useState } from 'react';

export default function RecipeDetailsScreen() {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  
  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Check out this delicious Egg & Avocado Sandwich recipe I found on MealLens!',
        url: 'https://meallens.app/recipes/egg-avocado-sandwich',
      });
    } catch (error) {
      console.log(error);
    }
  };
  
  return (
    <View style={recipeDetailsStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={recipeDetailsStyles.headerContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }} 
            style={recipeDetailsStyles.headerImage} 
          />
          
          <TouchableOpacity 
            style={recipeDetailsStyles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft color="#000000" size={24} />
          </TouchableOpacity>
          
          <View style={recipeDetailsStyles.headerActions}>
            <TouchableOpacity 
              style={recipeDetailsStyles.actionButton}
              onPress={handleShare}
            >
              <Share2 color="#000000" size={20} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={recipeDetailsStyles.actionButton}
              onPress={() => setIsFavorite(!isFavorite)}
            >
              <Heart 
                color="#000000" 
                size={20} 
                fill={isFavorite ? "#000000" : "transparent"} 
              />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Recipe Info */}
        <View style={recipeDetailsStyles.recipeInfoContainer}>
          <Text style={recipeDetailsStyles.recipeTitle}>Egg & Avocado Sandwich</Text>
          
          <View style={recipeDetailsStyles.recipeMetaContainer}>
            <View style={recipeDetailsStyles.ratingContainer}>
              <Text style={recipeDetailsStyles.ratingIcon}>★</Text>
              <Text style={recipeDetailsStyles.ratingText}>4.2</Text>
            </View>
            
            <View style={recipeDetailsStyles.timeContainer}>
              <View style={recipeDetailsStyles.timeIconContainer}>
                <Text style={recipeDetailsStyles.timeIcon}>⏱</Text>
              </View>
              <Text style={recipeDetailsStyles.timeText}>15 min</Text>
            </View>
          </View>
        </View>
        
        {/* Ingredients */}
        <View style={recipeDetailsStyles.sectionContainer}>
          <Text style={recipeDetailsStyles.sectionTitle}>Ingredient list</Text>
          
          <View style={recipeDetailsStyles.ingredientsContainer}>
            {ingredients.map((ingredient, index) => (
              <View key={index} style={recipeDetailsStyles.ingredientItem}>
                <Text style={recipeDetailsStyles.ingredientDash}>-</Text>
                <Text style={recipeDetailsStyles.ingredientText}>{ingredient}</Text>
              </View>
            ))}
            
            <Text style={recipeDetailsStyles.optionalTitle}>Optional</Text>
            
            {optionalIngredients.map((ingredient, index) => (
              <View key={index} style={recipeDetailsStyles.ingredientItem}>
                <Text style={recipeDetailsStyles.ingredientDash}>-</Text>
                <Text style={recipeDetailsStyles.ingredientText}>{ingredient}</Text>
              </View>
            ))}
          </View>
        </View>
        
        {/* Instructions */}
        <View style={recipeDetailsStyles.sectionContainer}>
          <Text style={recipeDetailsStyles.sectionTitle}>Cooking Instructions</Text>
          
          <View style={recipeDetailsStyles.instructionsContainer}>
            {instructions.map((instruction, index) => (
              <View key={index} style={recipeDetailsStyles.ingredientItem}>
                <Text style={recipeDetailsStyles.ingredientDash}>-</Text>
                <Text style={recipeDetailsStyles.ingredientText}>{instruction}</Text>
              </View>
            ))}
            
            <Text style={recipeDetailsStyles.optionalTitle}>Optional</Text>
            
            {optionalInstructions.map((instruction, index) => (
              <View key={index} style={recipeDetailsStyles.ingredientItem}>
                <Text style={recipeDetailsStyles.ingredientDash}>-</Text>
                <Text style={recipeDetailsStyles.ingredientText}>{instruction}</Text>
              </View>
            ))}
          </View>
        </View>
        
        {/* Useful Links */}
        <View style={recipeDetailsStyles.sectionContainer}>
          <Text style={recipeDetailsStyles.sectionTitle}>Useful links</Text>
          
          <View style={recipeDetailsStyles.linksContainer}>
            <TouchableOpacity style={recipeDetailsStyles.linkButton}>
              <View style={recipeDetailsStyles.youtubeIcon}>
                <Text style={recipeDetailsStyles.youtubeIconText}>▶</Text>
              </View>
              <Text style={recipeDetailsStyles.linkText}>Make a delicious sandwich</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={recipeDetailsStyles.linkButton}>
              <View style={recipeDetailsStyles.googleIcon}>
                <Text style={recipeDetailsStyles.googleIconText}>G</Text>
              </View>
              <Text style={recipeDetailsStyles.linkText}>Make a delicious sandwich</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const ingredients = [
  "2 slices of bread (whole-grain or sourdough)",
  "1 ripe avocado (mashed or sliced)",
  "2 boiled eggs (hard or soft boiled)",
  "Salt and pepper",
];

const optionalIngredients = [
  "Lemon Juice (a splash for the avocado)",
  "Fresh herbs (like parsley, chives or basil",
];

const instructions = [
  "2 slices of bread (whole-grain or sourdough)",
  "1 ripe avocado (mashed or sliced)",
  "2 boiled eggs (hard or soft boiled)",
  "Salt and pepper",
];

const optionalInstructions = [
  "Lemon Juice (a splash for the avocado)",
  "Fresh herbs (like parsley, chives or basil",
];