import { Text, View, ScrollView, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { ArrowLeft, Heart, Clock, Star, RefreshCw, Share2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { aiChatStyles } from '@/styles/aiChat.styles';

export default function AIChatScreen() {
  const router = useRouter();
  
  return (
    <View style={aiChatStyles.container}>
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1495195134817-aeb325a55b65?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }}
        style={aiChatStyles.headerBackground}
      >
        <TouchableOpacity style={aiChatStyles.backButton} onPress={() => router.back()}>
          <ArrowLeft color="#FFFFFF" size={30} />
        </TouchableOpacity>
      </ImageBackground>
      
      <View style={aiChatStyles.contentContainer}>
        <View style={aiChatStyles.handleContainer}>
          <View style={aiChatStyles.handle} />
        </View>
        
        <Text style={aiChatStyles.dishTitle}>Fruits & Caramel Syrup Pancakes</Text>
        
        <View style={aiChatStyles.imageContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }} 
            style={aiChatStyles.dishImage} 
          />
        </View>
        
        <View style={aiChatStyles.ingredientsContainer}>
          <Text style={aiChatStyles.sectionTitle}>Ingredients detected</Text>
          <Text style={aiChatStyles.ingredientsList}>
            Onions, garlic, tomatoes, olive oil, salt, black pepper, rice, chicken or vegetable stock.
          </Text>
          <TouchableOpacity style={aiChatStyles.editButton}>
            <Text style={aiChatStyles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView showsVerticalScrollIndicator={false}>
          {recipes.map((recipe, index) => (
            <View key={index} style={aiChatStyles.recipeCard}>
              <Image source={{ uri: recipe.image }} style={aiChatStyles.recipeImage} />
              <View style={aiChatStyles.recipeContent}>
                <Text style={aiChatStyles.recipeTitle}>{recipe.title}</Text>
                <Text style={aiChatStyles.recipeDescription}>{recipe.description}</Text>
                <View style={aiChatStyles.recipeDetails}>
                  <View style={aiChatStyles.detailItem}>
                    <Clock size={10} color="#202026" />
                    <Text style={aiChatStyles.detailText}>{recipe.time}</Text>
                  </View>
                  <View style={aiChatStyles.detailItem}>
                    <Star size={10} color="#FF6A00" />
                    <Text style={aiChatStyles.detailText}>{recipe.rating}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity style={aiChatStyles.heartButton}>
                <Heart size={16} color="#FF5353" />
              </TouchableOpacity>
            </View>
          ))}
          
          <View style={aiChatStyles.actionButtonsContainer}>
            <View style={aiChatStyles.externalLinkButtons}>
              <TouchableOpacity style={aiChatStyles.externalButton}>
                <View style={aiChatStyles.youtubeIcon}>
                  <Text style={aiChatStyles.youtubeIconText}>▶</Text>
                </View>
                <Text style={aiChatStyles.externalButtonText}>Make a delici...</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={aiChatStyles.externalButton}>
                <View style={aiChatStyles.googleIcon}>
                  <Text style={aiChatStyles.googleIconText}>G</Text>
                </View>
                <Text style={aiChatStyles.externalButtonText}>Make a delici...</Text>
              </TouchableOpacity>
            </View>
            
            <View style={aiChatStyles.circleButtonsContainer}>
              <TouchableOpacity style={aiChatStyles.circleButton}>
                <RefreshCw size={22} color="#FFFFFF" />
              </TouchableOpacity>
              
              <TouchableOpacity style={aiChatStyles.circleButton}>
                <Share2 size={22} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const recipes = [
  {
    title: "Egg & Avocado Sandwich",
    description: "An egg and avocado sandwich made with creamy avocado spread, a perfectly cooked egg, and fresh bread.",
    time: "15 min",
    rating: "4.2",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    title: "Vegetable Stir Fry",
    description: "A colorful vegetable stir fry with bell peppers, broccoli, carrots, and a savory sauce.",
    time: "20 min",
    rating: "4.5",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    title: "Berry Smoothie Bowl",
    description: "A refreshing smoothie bowl topped with fresh berries, granola, and a drizzle of honey.",
    time: "10 min",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1546039907-7fa05f864c02?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
];