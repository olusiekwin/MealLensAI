import { Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { recipeOptionsStyles } from "@/styles/recipeOptions.styles";

export default function RecipeOptionsScreen() {
  const router = useRouter();
  
  return (
    <View style={recipeOptionsStyles.container}>
      <TouchableOpacity 
        style={recipeOptionsStyles.backButton}
        onPress={() => router.back()}
      >
        <View style={recipeOptionsStyles.handle} />
      </TouchableOpacity>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }} 
          style={recipeOptionsStyles.headerImage} 
        />
        
        {/* Instructions */}
        <View style={recipeOptionsStyles.sectionContainer}>
          <Text style={recipeOptionsStyles.sectionTitle}>Instructions</Text>
          
          <View style={recipeOptionsStyles.instructionsContainer}>
            <View style={recipeOptionsStyles.instructionItem}>
              <Text style={recipeOptionsStyles.bulletPoint}>•</Text>
              <Text style={recipeOptionsStyles.instructionText}>Mix flour and salt in a bowl</Text>
            </View>
            <View style={recipeOptionsStyles.instructionItem}>
              <Text style={recipeOptionsStyles.bulletPoint}>•</Text>
              <Text style={recipeOptionsStyles.instructionText}>Heat oil in non-stick pan</Text>
            </View>
            <View style={recipeOptionsStyles.instructionItem}>
              <Text style={recipeOptionsStyles.bulletPoint}>-</Text>
              <Text style={recipeOptionsStyles.instructionText}>2 boiled eggs ( hard or soft boiled)</Text>
            </View>
            <View style={recipeOptionsStyles.instructionItem}>
              <Text style={recipeOptionsStyles.bulletPoint}>•</Text>
              <Text style={recipeOptionsStyles.instructionText}>Pour batter into pan and cook 2-3 minutes</Text>
            </View>
            
            <Text style={recipeOptionsStyles.optionalTitle}>Optional</Text>
            
            <View style={recipeOptionsStyles.instructionItem}>
              <Text style={recipeOptionsStyles.bulletPoint}>•</Text>
              <Text style={recipeOptionsStyles.instructionText}>Add eggs and gradually add milk</Text>
            </View>
            <View style={recipeOptionsStyles.instructionItem}>
              <Text style={recipeOptionsStyles.bulletPoint}>-</Text>
              <Text style={recipeOptionsStyles.instructionText}>whisking until smooth and thick.</Text>
            </View>
          </View>
        </View>
        
        {/* Recipe */}
        <View style={recipeOptionsStyles.sectionContainer}>
          <Text style={recipeOptionsStyles.sectionTitle}>Recipe</Text>
          
          <View style={recipeOptionsStyles.recipeContainer}>
            <View style={recipeOptionsStyles.ingredientItem}>
              <Text style={recipeOptionsStyles.ingredientDash}>-</Text>
              <Text style={recipeOptionsStyles.ingredientText}>2 slices of bread (whole-grain or sourdough)</Text>
            </View>
            <View style={recipeOptionsStyles.ingredientItem}>
              <Text style={recipeOptionsStyles.ingredientDash}>-</Text>
              <Text style={recipeOptionsStyles.ingredientText}>1 ripe avocado (mashed or sliced)</Text>
            </View>
            <View style={recipeOptionsStyles.ingredientItem}>
              <Text style={recipeOptionsStyles.ingredientDash}>-</Text>
              <Text style={recipeOptionsStyles.ingredientText}>2 boiled eggs (hard or soft boiled)</Text>
            </View>
            <View style={recipeOptionsStyles.ingredientItem}>
              <Text style={recipeOptionsStyles.ingredientDash}>-</Text>
              <Text style={recipeOptionsStyles.ingredientText}>Salt and pepper</Text>
            </View>
            
            <Text style={recipeOptionsStyles.optionalTitle}>Optional</Text>
            
            <View style={recipeOptionsStyles.ingredientItem}>
              <Text style={recipeOptionsStyles.ingredientDash}>-</Text>
              <Text style={recipeOptionsStyles.ingredientText}>Lemon Juice (a splash for the avocado)</Text>
            </View>
            <View style={recipeOptionsStyles.ingredientItem}>
              <Text style={recipeOptionsStyles.ingredientDash}>-</Text>
              <Text style={recipeOptionsStyles.ingredientText}>Fresh herbs (like parsley, chives or basil</Text>
            </View>
          </View>
        </View>
        
        {/* Useful Links */}
        <View style={recipeOptionsStyles.linksContainer}>
          <TouchableOpacity style={recipeOptionsStyles.linkButton}>
            <View style={recipeOptionsStyles.youtubeIcon}>
              <Text style={recipeOptionsStyles.youtubeIconText}>▶</Text>
            </View>
            <Text style={recipeOptionsStyles.linkText}>Make a delicious sandwich</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={recipeOptionsStyles.linkButton}>
            <View style={recipeOptionsStyles.googleIcon}>
              <Text style={recipeOptionsStyles.googleIconText}>G</Text>
            </View>
            <Text style={recipeOptionsStyles.linkText}>Make a delicious sandwich</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}