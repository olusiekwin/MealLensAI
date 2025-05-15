import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal, Animated, Dimensions, Alert } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import { X, Star, CheckCircle2, Clock, Zap } from "lucide-react-native";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "index",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const { width } = Dimensions.get('window');

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [totalUsageCount, setTotalUsageCount] = useState(0);
  const [dailyUsageCount, setDailyUsageCount] = useState(0);
  const [showDailyLimitPopup, setShowDailyLimitPopup] = useState(false);
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const [rating, setRating] = useState(0);
  const [popupAnimation] = useState(new Animated.Value(0));
  const router = useRouter();

  useEffect(() => {
    async function prepare() {
      try {
        // Get current date as string (YYYY-MM-DD)
        const today = new Date().toISOString().split('T')[0];
        
        // Get last usage date
        const lastUsageDate = await AsyncStorage.getItem('last_usage_date');
        
        // Get total usage count
        const totalCount = await AsyncStorage.getItem('usage_count');
        const newTotalCount = totalCount ? parseInt(totalCount) : 0;
        setTotalUsageCount(newTotalCount);
        
        // Check if it's a new day
        if (lastUsageDate !== today) {
          // Reset daily count for new day
          await AsyncStorage.setItem('daily_usage_count', '0');
          await AsyncStorage.setItem('last_usage_date', today);
          setDailyUsageCount(0);
        } else {
          // Get current daily usage count
          const dailyCount = await AsyncStorage.getItem('daily_usage_count');
          const currentDailyCount = dailyCount ? parseInt(dailyCount) : 0;
          setDailyUsageCount(currentDailyCount);
          
          // Show daily limit popup if exceeded 3 uses per day
          if (currentDailyCount >= 3) {
            setShowDailyLimitPopup(true);
            animatePopup();
          }
        }
        
        // Show feedback popup after 5 total uses
        if (newTotalCount === 5) {
          setTimeout(() => {
            setShowFeedbackPopup(true);
            animatePopup();
          }, 2000);
        }
      } catch (e) {
        console.warn("Error preparing app:", e);
      } finally {
        setIsReady(true);
        SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  const animatePopup = () => {
    Animated.sequence([
      Animated.timing(popupAnimation, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(popupAnimation, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(popupAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleWatchAd = () => {
    setShowDailyLimitPopup(false);
    // In a real app, this would show an ad
    setTimeout(() => {
      Alert.alert(
        'Ad Completed',
        'Thanks for watching! You have earned an additional scan.',
        [{ text: 'Continue', onPress: () => router.push('/camera') }]
      );
    }, 500);
  };

  const handleClosePopup = () => {
    setShowDailyLimitPopup(false);
  };

  const handleLimitedAccess = () => {
    setShowDailyLimitPopup(false);
    router.push('/');
  };

  const handleRateApp = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleSubmitFeedback = () => {
    // In a real app, this would submit the feedback to a server
    setShowFeedbackPopup(false);
    Alert.alert('Thank You!', 'Your feedback helps us improve the app.');
  };

  const handleCloseFeedback = () => {
    setShowFeedbackPopup(false);
  };

  if (!isReady) {
    return null;
  }

  return (
    <>
      <RootLayoutNav />
      
      {/* Daily Usage Limit Popup */}
      <Modal
        visible={showDailyLimitPopup}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.popupContainer,
              {
                transform: [
                  { scale: popupAnimation }
                ]
              }
            ]}
          >
            <LinearGradient
              colors={['#FF6A00', '#FF8F47']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.popupHeader}
            >
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={handleClosePopup}
              >
                <X size={20} color="#FFFFFF" />
              </TouchableOpacity>
              
              <View style={styles.limitReachedContainer}>
                <Zap size={28} color="#FFFFFF" />
                <Text style={styles.limitReachedText}>Daily Limit Reached</Text>
              </View>
              
              <Text style={styles.limitDescription}>
                You've used your 3 free scans for today!
              </Text>
            </LinearGradient>
            
            <View style={styles.popupContent}>
              <View style={styles.upgradeInfoContainer}>
                <Text style={styles.upgradeTitle}>Continue Using MealLens</Text>
                <Text style={styles.upgradeDescription}>
                  Watch a short ad to get an additional scan or wait until tomorrow for your free scans to reset.
                </Text>
              </View>
              
              <TouchableOpacity 
                style={styles.watchAdButton}
                onPress={handleWatchAd}
              >
                <Text style={styles.watchAdButtonText}>Watch Ad for Free Scan</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.limitedAccessButton}
                onPress={handleLimitedAccess}
              >
                <Text style={styles.limitedAccessText}>Return to Home</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Feedback Popup */}
      <Modal
        visible={showFeedbackPopup}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.popupContainer,
              {
                transform: [
                  { scale: popupAnimation }
                ]
              }
            ]}
          >
            <View style={styles.feedbackHeader}>
              <TouchableOpacity 
                style={styles.feedbackCloseButton}
                onPress={handleCloseFeedback}
              >
                <X size={20} color="#202026" />
              </TouchableOpacity>
              
              <Text style={styles.feedbackTitle}>Enjoying MealLens?</Text>
              <Text style={styles.feedbackSubtitle}>
                We'd love to hear your feedback! Please rate your experience.
              </Text>
            </View>
            
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => handleRateApp(star)}
                  style={styles.starButton}
                >
                  <Star 
                    size={36} 
                    color="#FF6A00" 
                    fill={rating >= star ? "#FF6A00" : "none"} 
                  />
                </TouchableOpacity>
              ))}
            </View>
            
            <TouchableOpacity 
              style={[
                styles.submitFeedbackButton,
                !rating && styles.disabledButton
              ]}
              onPress={handleSubmitFeedback}
              disabled={!rating}
            >
              <Text style={styles.submitFeedbackText}>Submit Feedback</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  // Daily Limit Popup Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  popupContainer: {
    width: width - 40,
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  popupHeader: {
    padding: 20,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  limitReachedContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  limitReachedText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 10,
  },
  limitDescription: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  popupContent: {
    padding: 20,
  },
  upgradeInfoContainer: {
    marginBottom: 20,
  },
  upgradeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#202026',
    marginBottom: 8,
    textAlign: 'center',
  },
  upgradeDescription: {
    fontSize: 14,
    color: '#6A6A6A',
    textAlign: 'center',
    lineHeight: 20,
  },
  watchAdButton: {
    backgroundColor: '#FF6A00',
    borderRadius: 30,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#FF6A00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  watchAdButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  limitedAccessButton: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  limitedAccessText: {
    fontSize: 14,
    color: '#6A6A6A',
  },
  
  // Feedback Popup Styles
  feedbackHeader: {
    padding: 20,
    position: 'relative',
    alignItems: 'center',
  },
  feedbackCloseButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  feedbackTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#202026',
    marginTop: 10,
    marginBottom: 10,
  },
  feedbackSubtitle: {
    fontSize: 14,
    color: '#6A6A6A',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  starButton: {
    marginHorizontal: 8,
  },
  submitFeedbackButton: {
    backgroundColor: '#FF6A00',
    borderRadius: 30,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#FF6A00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitFeedbackText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  disabledButton: {
    backgroundColor: '#FFB380',
  },
});