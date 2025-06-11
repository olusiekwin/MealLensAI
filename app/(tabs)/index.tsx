<<<<<<< HEAD
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
          <LinearGradient
            colors={['rgba(32, 32, 38, 0.05)', 'rgba(255, 255, 255, 0.06)']}
            style={homeStyles.featuredGradient}
          >
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
          </LinearGradient>
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
=======
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, RefreshControl, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useUserStore } from "@/context/userStore";
import api from "@/services/api";

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feed, setFeed] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { isAuthenticated, profile } = useUserStore();
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const fetchFeed = async () => {
    try {
      setError(null);
      // Temporarily disabled feed fetching until backend is ready
      // const response = await api.get('/feed');
      // setFeed(response.data.data || []);
      setFeed([]); // Empty feed for now
    } catch (err: any) {
      console.error('Feed error:', err);
      // Don't show error to user, just set empty feed
      setFeed([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsCheckingAuth(false);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (!isCheckingAuth) {
      fetchFeed();
    }
  }, [isCheckingAuth]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchFeed();
  };

  if (isCheckingAuth) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.messageText}>Loading your profile...</Text>
      </SafeAreaView>
    );
  }

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.messageText}>Please log in to continue</Text>
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => router.push('/auth')}
          >
            <Text style={styles.loginButtonText}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome back, {profile?.username || profile?.name || 'Friend'}!</Text>
          <Text style={styles.subText}>What would you like to do today?</Text>
        </View>
        
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/(tabs)/detection')}
          >
            <Text style={styles.actionButtonText}>Detect Food</Text>
            <Text style={styles.actionButtonSubText}>Take a photo or enter ingredients</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/(tabs)/favorites')}
          >
            <Text style={styles.actionButtonText}>View Favorites</Text>
            <Text style={styles.actionButtonSubText}>See your saved items</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <Text style={styles.actionButtonText}>Update Profile</Text>
            <Text style={styles.actionButtonSubText}>Manage your preferences</Text>
          </TouchableOpacity>
          </View>

        {feed.length > 0 && (
          <View style={styles.feedContainer}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            {feed.map((item, index) => (
              <View key={item.id || index} style={styles.feedItem}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  subText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  messageText: {
    fontSize: 18,
    color: Colors.text,
    textAlign: "center",
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  loginButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  actionContainer: {
    padding: 16,
  },
  actionButton: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  actionButtonSubText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  feedContainer: {
    paddingTop: 24,
  },
  feedItem: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
>>>>>>> the-moredern-features
