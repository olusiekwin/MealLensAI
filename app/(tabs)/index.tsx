import { Text, View, ScrollView, Image, TouchableOpacity, ImageBackground, Alert } from "react-native";
import { Search, Bell, ChevronDown, Clock, Star, Heart } from "lucide-react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { homeStyles } from "@/styles/home.styles";
import { useState } from "react";

export default function HomeScreen() {
  const router = useRouter();
  const [hasNotifications, setHasNotifications] = useState(true);

  const handleFoodFinderPress = () => {
    router.push('/camera');
  };

  const handleRecipeFinderPress = () => {
    router.push('/recipes');
  };
  
  const handleNotificationPress = () => {
    Alert.alert(
      "Notifications",
      "You have 3 new recipe recommendations based on your preferences!",
      [{ text: "OK", onPress: () => setHasNotifications(false) }]
    );
  };

  return (
    <View style={homeStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }}
          style={homeStyles.headerBackground}
        >
          <LinearGradient
            colors={['rgba(70, 70, 69, 0.4)', 'rgba(70, 70, 69, 0.4)']}
            style={homeStyles.headerOverlay}
          >
            <View style={homeStyles.headerContent}>
              <View>
                <Text style={homeStyles.greeting}>Hi, Frank Mount</Text>
                <Text style={homeStyles.welcomeBack}>Welcome back!</Text>
              </View>
              <View style={homeStyles.headerIcons}>
                <TouchableOpacity style={homeStyles.iconButton}>
                  <Search color="#FFFFFF" size={20} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={homeStyles.iconButton}
                  onPress={handleNotificationPress}
                >
                  <Bell color="#FFFFFF" size={20} />
                  {hasNotifications && <View style={homeStyles.notificationDot} />}
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={homeStyles.locationContainer}>
              <Text style={homeStyles.locationLabel}>Your Location</Text>
              <View style={homeStyles.locationRow}>
                <Text style={homeStyles.locationText}>Kigali, Rwanda</Text>
                <ChevronDown color="#FFFFFF" size={16} />
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
        
        {/* Finder Cards */}
        <View style={homeStyles.finderCardsContainer}>
          <TouchableOpacity style={homeStyles.finderCard} onPress={handleRecipeFinderPress}>
            <View style={homeStyles.finderIconContainer}>
              <Text style={homeStyles.finderIcon}>📝</Text>
            </View>
            <Text style={homeStyles.finderText}>Recipe Finder</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={homeStyles.finderCard} onPress={handleFoodFinderPress}>
            <View style={homeStyles.finderIconContainer}>
              <Text style={homeStyles.finderIcon}>🥕</Text>
            </View>
            <Text style={homeStyles.finderText}>Food Finder</Text>
          </TouchableOpacity>
        </View>
        
        {/* Featured Dish */}
        <View style={homeStyles.featuredContainer}>
          <View style={homeStyles.featuredGradient}>
            <View style={homeStyles.featuredContent}>
              <View style={homeStyles.featuredLeft}>
                <Text style={homeStyles.featuredTitle}>Featured Dish of the Day!</Text>
                <Text style={homeStyles.featuredDishName}>Honey sweet Korea Fried Chicken</Text>
                <TouchableOpacity 
                  style={homeStyles.cookNowButton}
                  onPress={() => router.push('/recipe-details')}
                >
                  <Text style={homeStyles.cookNowText}>Cook Now</Text>
                </TouchableOpacity>
              </View>
              
              <View style={homeStyles.streakContainer}>
                <Text style={homeStyles.streakTitle}>Cooking Streak</Text>
                <View style={homeStyles.streakCard}>
                  <Text style={homeStyles.streakText}>
                    Keep your streak alive by cooking today!
                  </Text>
                </View>
                <View style={homeStyles.streakProgressContainer}>
                  <View style={homeStyles.streakProgressBg}>
                    <View style={homeStyles.streakProgressFill}>
                      <Text style={homeStyles.streakCount}>5/7</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
        
        {/* Recipe Suggestions */}
        <View style={homeStyles.suggestionsContainer}>
          <View style={homeStyles.sectionHeader}>
            <Text style={homeStyles.sectionTitle}>Recipe Suggestions</Text>
            <TouchableOpacity style={homeStyles.sortButton}>
              <Text style={homeStyles.sortIcon}>≡</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={homeStyles.recipesContainer}
          >
            {recipes.map((recipe, index) => (
              <TouchableOpacity 
                key={index} 
                style={homeStyles.recipeCard}
                onPress={() => router.push('/recipe-details')}
              >
                <Image source={{ uri: recipe.image }} style={homeStyles.recipeImage} />
                <View style={homeStyles.recipeContent}>
                  <Text style={homeStyles.recipeTitle}>{recipe.title}</Text>
                  <View style={homeStyles.recipeDetails}>
                    <View style={homeStyles.recipeDetail}>
                      <Clock size={12} color="#202026" />
                      <Text style={homeStyles.detailText}>{recipe.time}</Text>
                    </View>
                    <View style={homeStyles.recipeDetail}>
                      <Star size={12} color="#FF6A00" />
                      <Text style={homeStyles.detailText}>{recipe.rating}</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity style={homeStyles.heartButton}>
                  <Heart size={14} color="#FF5353" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <View style={homeStyles.pagination}>
            <View style={[homeStyles.paginationDot, homeStyles.activeDot]} />
            <View style={homeStyles.paginationDot} />
            <View style={homeStyles.paginationDot} />
            <View style={homeStyles.paginationDot} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const recipes = [
  {
    title: "Egg & Avocado Sandwich",
    time: "15 min",
    rating: "4.2",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    title: "Vegetable Stir Fry",
    time: "20 min",
    rating: "4.5",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    title: "Berry Smoothie Bowl",
    time: "10 min",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1546039907-7fa05f864c02?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
];