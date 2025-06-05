import { Text, View, ScrollView, Image, TouchableOpacity, Alert, Dimensions, ActivityIndicator } from "react-native";
import { Search, Bell, ChevronDown, Star, Heart } from "lucide-react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { homeStyles } from "@/styles/home.styles";
import { useState, useEffect } from "react";
import { useUserStore } from '@/context/userStore';
import { useAdStore } from '@/context/adStore';
import SubscriptionPrompt from '@/components/SubscriptionPrompt';
import UsageLimitBanner from '@/components/UsageLimitBanner';
import AdBanner from '@/components/AdBanner';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [hasNotifications, setHasNotifications] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [recentDetections, setRecentDetections] = useState<any[]>([]);
  const [showSubscriptionPrompt, setShowSubscriptionPrompt] = useState(false);

  const { 
    profile, 
    usage, 
    subscription, 
    trackUsage, 
    isLoading: isUserLoading,
    fetchProfile
  } = useUserStore();
  
  const { fetchAds, shouldShowAds } = useAdStore();

  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      try {
        // Fetch user profile if authenticated
        await fetchProfile();
        
        // Fetch ads if user is not premium
        if (subscription.status !== 'premium') {
          await fetchAds();
          
          // Randomly decide to show subscription prompt (20% chance)
          // This creates a non-intrusive experience while still promoting premium
          if (Math.random() < 0.2) {
            setShowSubscriptionPrompt(true);
          }
        }
      } catch (error) {
        console.error('Error initializing home screen:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initialize();
  }, []);

  const handleFoodFinderPress = async () => {
    try {
      // Track usage before navigating
      await trackUsage();
      
      // Check if daily limit is reached
      if (usage.reachedDailyLimit && subscription.status === 'free') {
        // Let the UsageLimitBanner handle this
        return;
      }
      
      // Prompt user to choose detection method
      Alert.alert(
        "Food Finder",
        "Would you like to detect ingredients using text or image? Results will be saved to your Detection History.",
        [
          {
            text: "Text",
            onPress: () => router.push('/text-detection?mode=food')
          },
          {
            text: "Image",
            onPress: () => router.push('/camera?mode=food' as any)
          }
        ],
        { cancelable: true }
      );
    } catch (error) {
      console.error('Error tracking usage:', error);
      // Default to camera if there's an error
      router.push('/camera?mode=food' as any);
    }
  };

  const handleRecipeFinderPress = async () => {
    try {
      // Track usage before navigating
      await trackUsage();
      
      // Check if daily limit is reached
      if (usage.reachedDailyLimit && subscription.status === 'free') {
        // Let the UsageLimitBanner handle this
        return;
      }
      
      // Prompt user to choose detection method
      Alert.alert(
        "Recipe Finder",
        "Would you like to detect recipes using text or image? Results will be saved to your Detection History.",
        [
          {
            text: "Text",
            onPress: () => router.push('/text-detection?mode=recipe')
          },
          {
            text: "Image",
            onPress: () => router.push('/camera?mode=recipe' as any)
          }
        ],
        { cancelable: true }
      );
    } catch (error) {
      console.error('Error tracking usage:', error);
      // Default to camera if there's an error
      router.push('/camera?mode=recipe' as any);
    }
  };
  
  const handleWatchAd = () => {
    // In a real app, this would show an ad
    Alert.alert(
      'Ad Simulation',
      'This is where an ad would play. After watching, you would get an additional scan.',
      [
        { 
          text: 'Complete Ad', 
          onPress: () => {
            Alert.alert('Thank you!', 'You have earned an additional scan.');
            router.push('/camera');
          } 
        }
      ]
    );
  };
  
  const handleNotificationPress = () => {
    Alert.alert(
      "Notifications",
      "You have 3 new recipe recommendations based on your preferences!",
      [{ text: "OK", onPress: () => setHasNotifications(false) }]
    );
  };

  if (isLoading || isUserLoading) {
    return (
      <View style={homeStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#000000" />
        <Text style={homeStyles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={homeStyles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={homeStyles.scrollContent}
      >
        {/* Header Section */}
        <LinearGradient
          colors={['#000000', '#FF8F47']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={homeStyles.headerGradient}
        >
          <View style={homeStyles.headerContent}>
            <View>
              <Text style={homeStyles.greeting}>Hi, {profile?.name?.split(' ')[0] || 'there'}</Text>
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
        
        {/* Finder Cards */}
        <View style={homeStyles.finderCardsContainer}>
          <TouchableOpacity 
            style={homeStyles.finderCard} 
            onPress={handleRecipeFinderPress}
          >
            <View style={homeStyles.finderIconContainer}>
              <Text style={homeStyles.finderIcon}>📝</Text>
            </View>
            <Text style={homeStyles.finderText}>Recipe Finder</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={homeStyles.finderCard} 
            onPress={handleFoodFinderPress}
          >
            <View style={homeStyles.finderIconContainer}>
              <Text style={homeStyles.finderIcon}>🥕</Text>
            </View>
            <Text style={homeStyles.finderText}>Food Finder</Text>
          </TouchableOpacity>
        </View>
        
        {/* Contextual Subscription Prompt (shows occasionally) */}
        {showSubscriptionPrompt && (
          <SubscriptionPrompt 
            contextType="general" 
            onDismiss={() => setShowSubscriptionPrompt(false)} 
          />
        )}
        
        {/* Usage Limit Banner if limit reached */}
        <UsageLimitBanner />
        
        {/* Ad Banner for free users */}
        {shouldShowAds && <AdBanner position="banner" />}
        
        {/* Featured Dish and Cooking Streak Cards */}
        <View style={homeStyles.featuredStreakContainer}>
          {/* Featured Dish Card */}
          <View style={homeStyles.featuredDishCard}>
            <View style={homeStyles.featuredDishContent}>
              <Text style={homeStyles.featuredDishLabel}>Featured Dish of the Day!</Text>
              <Text style={homeStyles.featuredDishName}>Honey sweet Korea Fried Chicken</Text>
              <TouchableOpacity 
                style={homeStyles.cookNowButton}
                onPress={() => router.push('/recipe-details')}
              >
                <Text style={homeStyles.cookNowText}>Cook Now</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Cooking Streak Card */}
          <View style={homeStyles.cookingStreakCard}>
            <View style={homeStyles.cookingStreakContent}>
              <Text style={homeStyles.cookingStreakTitle}>Cooking Streak</Text>
              <Text style={homeStyles.cookingStreakSubtitle}>Keep your streak alive by cooking today!</Text>
              
              <View style={homeStyles.streakInfoContainer}>
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80' }}
                  style={homeStyles.avatarImage}
                />
                <View style={homeStyles.streakProgressContainer}>
                  <View style={homeStyles.streakProgressCircle}>
                    <Text style={homeStyles.streakProgressText}>5/7</Text>
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
            <TouchableOpacity style={homeStyles.viewAllButton}>
              <Text style={homeStyles.viewAllText}>View All</Text>
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
                onPress={() => router.push('/nutritional-breakdown')}
              >
                <Image source={{ uri: recipe.image }} style={homeStyles.recipeImage} />
                <View style={homeStyles.recipeContent}>
                  <Text style={homeStyles.recipeTitle}>{recipe.title}</Text>
                  <View style={homeStyles.recipeDetails}>
                    <View style={homeStyles.recipeDetail}>
                      <Text style={homeStyles.detailText}>{recipe.time}</Text>
                    </View>
                    <View style={homeStyles.recipeDetail}>
                      <Star size={12} color="#000000" fill="#000000" />
                      <Text style={homeStyles.detailText}>{recipe.rating}</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity style={homeStyles.heartButton}>
                  <Heart size={14} color="#FF5353" fill="#FF5353" />
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