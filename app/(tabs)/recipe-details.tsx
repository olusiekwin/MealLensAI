import { Text, View, ScrollView, Image, TouchableOpacity, Share } from 'react-native';
import { ArrowLeft, Share2, Heart } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { recipeDetailsStyles } from "@/styles/recipeDetails.styles";
import { useState, useEffect } from 'react';
import { getInstructions, getResources } from '@/services/detectionService';

export default function RecipeDetailsScreen() {
  const router = useRouter();
  const [instructions, setInstructions] = useState<string[]>([]);
  const [resources, setResources] = useState<{ youtube: any[]; websites: any[] }>({ youtube: [], websites: [] });
  const [loading, setLoading] = useState(true);
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
  
  useEffect(() => {
    // Fetch instructions and resources from backend using detection/recipe ID or params
    const fetchData = async () => {
      setLoading(true);
      try {
        // Replace with actual ID/param as needed
        const instr = await getInstructions(/* pass correct param here */);
        setInstructions(instr.steps || []);
        const res = await getResources(/* pass correct param here */);
        setResources(res);
      } catch (err) {
        setInstructions([]);
        setResources({ youtube: [], websites: [] });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={recipeDetailsStyles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={recipeDetailsStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Image and Back Button */}
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
          </View>
        </View>
        
        {/* Useful Links */}
        <View style={recipeDetailsStyles.sectionContainer}>
          <Text style={recipeDetailsStyles.sectionTitle}>Useful links</Text>
          
          <View style={recipeDetailsStyles.linksContainer}>
            {resources.youtube.map((video, idx) => (
              <TouchableOpacity key={idx} style={recipeDetailsStyles.linkButton}>
                <View style={recipeDetailsStyles.youtubeIcon}>
                  <Text style={recipeDetailsStyles.youtubeIconText}>▶</Text>
                </View>
                <Text style={recipeDetailsStyles.linkText}>{video.title}</Text>
              </TouchableOpacity>
            ))}
            {resources.websites.map((site, idx) => (
              <TouchableOpacity key={idx} style={recipeDetailsStyles.linkButton}>
                <View style={recipeDetailsStyles.googleIcon}>
                  <Text style={recipeDetailsStyles.googleIconText}>G</Text>
                </View>
                <Text style={recipeDetailsStyles.linkText}>{site.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}