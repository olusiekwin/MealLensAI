import { Stack } from 'expo-router';
import { useEffect, useState, useCallback } from 'react';
import { Platform } from 'react-native';
import { STORAGE_KEYS } from '@/config/constants';
import { testBackendConnection } from '../services/api';
import ENV from '../config/environment';
import { useUserStore } from '../context/userStore';
import { useAdStore } from '../context/adStore';
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, TouchableOpacity, Image, Modal, Animated, Alert, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import SubscriptionBanner from '@/components/SubscriptionBanner';
import UsageLimitBanner from '@/components/UsageLimitBanner';
import AppStateProvider from '@/components/AppStateProvider';
import { X, Star, CheckCircle2, Clock, Zap } from "lucide-react-native";
import { layoutStyles } from '../styles/layout.styles';
const LogoImage = require('../assets/images/icon.png');

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "index",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Handle font loading issues in a safer way
if (Platform.OS === 'web' && typeof window !== 'undefined') {
  // Instead of modifying FontFace directly, we'll use a more controlled approach
  // to handle font loading errors
  console.log('Setting up font loading error handling for web platform');
}

const { width } = Dimensions.get('window');

export default function RootLayout() {
  // Log API initialization
  useEffect(() => {
    console.log('✅ API initialized with base URL:', ENV.API_URL);
  }, []);

  // State management
  const [isReady, setIsReady] = useState(false);
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const [rating, setRating] = useState(0);
  const [popupAnimation] = useState(new Animated.Value(0));
  const router = useRouter();
  
  // User and ad store hooks
  const { 
    initialize: initializeUser, 
    usage, 
    subscription,
    isLoading: isUserLoading 
  } = useUserStore();
  
  const { refreshAdStatus } = useAdStore();
  
  // Show daily limit popup based on user store data
  const [showDailyLimitPopup, setShowDailyLimitPopup] = useState(false);
  
  // Track app initialization stages
  const [initStage, setInitStage] = useState('loading'); // loading -> onboarding -> auth -> home
  
  // Custom loading state for splash screen
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('Initializing...');
  const loadingAnimation = new Animated.Value(0);

  // Animation for loading progress
  useEffect(() => {
    Animated.timing(loadingAnimation, {
      toValue: loadingProgress,
      duration: 500,
      useNativeDriver: false
    }).start();
  }, [loadingProgress]);

  useEffect(() => {
    async function initializeApp() {
      try {
        // STAGE 1: LOADING
        console.log('🔄 RootLayout: Starting app initialization (LOADING stage)');
        setInitStage('loading');
        setLoadingProgress(10);
        setLoadingMessage('Initializing app...');
        
        // Keep splash screen visible during loading
        await SplashScreen.preventAutoHideAsync().catch(e => 
          console.warn('Error preventing splash screen auto-hide:', e)
        );
        
        // Test backend connection
        setLoadingProgress(20);
        setLoadingMessage('Connecting to backend...');
        try {
          const connectionStatus = await testBackendConnection();
          if (connectionStatus.success) {
            console.log('✅ Backend connection successful:', connectionStatus.message);
            setLoadingProgress(30);
          } else {
            console.warn('⚠️ Backend connection warning:', connectionStatus.message);
            setLoadingProgress(25);
          }
        } catch (error) {
          console.error('❌ Backend connection error:', error);
          // Continue anyway, as the app can work with some features offline
        }
        
        // Initialize user state (includes usage tracking)
        setLoadingProgress(40);
        setLoadingMessage('Loading user data...');
        await initializeUser();
        console.log('✅ RootLayout: User initialized');
        setLoadingProgress(60);
        
        // Refresh ad status based on subscription
        setLoadingMessage('Preparing ads service...');
        refreshAdStatus();
        console.log('✅ RootLayout: Ad status refreshed');
        setLoadingProgress(80);
        
        // STAGE 2: Check if user needs ONBOARDING
        setLoadingProgress(85);
        setLoadingMessage('Checking onboarding status...');
        const hasCompletedOnboarding = await AsyncStorage.getItem(STORAGE_KEYS.HAS_COMPLETED_ONBOARDING);
        if (!hasCompletedOnboarding) {
          console.log('🔄 RootLayout: User needs onboarding');
          setLoadingProgress(100);
          setLoadingMessage('Loading onboarding...');
          setInitStage('onboarding');
          
          // Small delay to show 100% before hiding splash screen
          await new Promise(resolve => setTimeout(resolve, 500));
          setIsReady(true);
          await SplashScreen.hideAsync();
          // Router will direct to index.tsx which contains onboarding
          return;
        }
        
        // STAGE 3: Check if user needs AUTH
        setLoadingProgress(90);
        setLoadingMessage('Checking authentication...');
        const authToken = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const userId = await AsyncStorage.getItem(STORAGE_KEYS.USER_ID);
        
        if (!authToken || !userId) {
          console.log('🔄 RootLayout: User needs authentication');
          setLoadingProgress(100);
          setLoadingMessage('Loading login screen...');
          setInitStage('auth');
          
          // Small delay to show 100% before hiding splash screen
          await new Promise(resolve => setTimeout(resolve, 500));
          setIsReady(true);
          await SplashScreen.hideAsync();
          return;
        } else {
          console.log('✅ RootLayout: User already authenticated');
          console.log('- Token:', authToken ? `${authToken.substring(0, 10)}...` : 'missing');
          console.log('- User ID:', userId || 'missing');
          
          // STAGE 4: Check if user needs PROFILE SETUP
          setLoadingProgress(95);
          setLoadingMessage('Checking profile status...');
          const profileSetupCompleted = await AsyncStorage.getItem(STORAGE_KEYS.PROFILE_SETUP_COMPLETED);
          
          if (profileSetupCompleted !== 'true') {
            console.log('🔄 RootLayout: User needs profile setup');
            setLoadingProgress(100);
            setLoadingMessage('Loading profile setup...');
            setInitStage('profile-setup');
            
            // Small delay to show 100% before hiding splash screen
            await new Promise(resolve => setTimeout(resolve, 500));
            setIsReady(true);
            await SplashScreen.hideAsync();
            return;
          }
          
          // Ensure user store is properly initialized with token and user ID
          try {
            // This will ensure the user stays logged in
            await useUserStore.getState().login(authToken, userId);
            console.log('✅ RootLayout: User login state restored');
          } catch (error) {
            console.error('❌ RootLayout: Error restoring user login state:', error);
          }
          
          // STAGE 4: Proceed to HOME
          console.log('🔄 RootLayout: Proceeding to home');
          setLoadingProgress(100);
          setLoadingMessage('Loading home...');
          setInitStage('home');
          
          // Show daily limit popup if limit is reached
          if (usage && usage.reachedDailyLimit) {
            setShowDailyLimitPopup(true);
          }
          
          // Show feedback popup after a few seconds if user has been active
          const lastFeedbackDate = await AsyncStorage.getItem(STORAGE_KEYS.LAST_FEEDBACK_DATE);
          const appOpenCount = await AsyncStorage.getItem(STORAGE_KEYS.APP_OPEN_COUNT) || '0';
          const openCount = parseInt(appOpenCount, 10);
          
          // Increment app open count
          await AsyncStorage.setItem('appOpenCount', (openCount + 1).toString());
          
          // Show feedback popup every 10 opens if not shown in the last 30 days
          const shouldShowFeedback = 
            !lastFeedbackDate || 
            (new Date().getTime() - new Date(lastFeedbackDate).getTime() > 30 * 24 * 60 * 60 * 1000);
          
          if (shouldShowFeedback && openCount > 0 && openCount % 10 === 0) {
            setTimeout(() => {
              setShowFeedbackPopup(true);
              Animated.spring(popupAnimation, {
                toValue: 1,
                useNativeDriver: true,
                friction: 8,
                tension: 40
              }).start();
            }, 5000);
          }
          
          // Finally, hide splash screen and mark app as ready
          setIsReady(true);
          await SplashScreen.hideAsync();
        }
        
      } catch (error) {
        console.error('❌ RootLayout: Error during initialization:', error);
        // Ensure we don't get stuck in loading state
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    }
    
    initializeApp();
  }, []);
  
  // Handle feedback submission
  const handleRateApp = (value: number) => {
    setRating(value);
  };
  
  const handleSubmitFeedback = async () => {
    try {
      // Record feedback submission date
      await AsyncStorage.setItem('lastFeedbackDate', new Date().toISOString());
      
      // Send feedback to backend
      // api.post('/feedback', { rating });
      
      // Thank user and close popup
      Alert.alert('Thank You!', 'We appreciate your feedback!');
      handleCloseFeedback();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      Alert.alert('Error', 'Failed to submit feedback. Please try again later.');
    }
  };
  
  const handleCloseFeedback = () => {
    Animated.timing(popupAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true
    }).start(() => {
      setShowFeedbackPopup(false);
      setRating(0);
    });
  };

  // Custom loading screen component
  const renderLoadingScreen = () => {
    return (
      <View style={layoutStyles.loadingContainer}>
        <LinearGradient
          colors={['#1A1A1A', '#333333']}
          style={layoutStyles.loadingBackground}
        >
          <Image 
            source={LogoImage} 
            style={layoutStyles.loadingLogo} 
            resizeMode="contain"
          />
          <Text style={layoutStyles.loadingTitle}>MealLens AI</Text>
          <Text style={layoutStyles.loadingMessage}>{loadingMessage}</Text>
          
          <View style={layoutStyles.progressBarContainer}>
            <Animated.View 
              style={[layoutStyles.progressBar, {
                width: loadingAnimation.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%']
                })
              }]} 
            />
          </View>
          
          <Text style={layoutStyles.loadingPercent}>{Math.round(loadingProgress)}%</Text>
        </LinearGradient>
      </View>
    );
  };

  if (!isReady) {
    return renderLoadingScreen();
  }
  
  return (
    <AppStateProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {initStage === 'onboarding' && (
          <Stack.Screen name="index" options={{ headerShown: false }} />
        )}
        {initStage === 'auth' && (
          <Stack.Screen name="auth" options={{ headerShown: false }} />
        )}
        {initStage === 'profile-setup' && (
          <Stack.Screen name="onboarding/profile-setup" options={{ headerShown: false }} />
        )}
      </Stack>
      
      {/* We've replaced the fixed subscription banner with contextual prompts */}
      {/* Feedback Popup */}
      <Modal
        visible={showFeedbackPopup}
        transparent={true}
        animationType="none"
      >
        <View style={layoutStyles.modalOverlay}>
          <Animated.View 
            style={[layoutStyles.feedbackPopup, {
              transform: [{ 
                translateY: popupAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [300, 0]
                })
              }],
              opacity: popupAnimation
            }]}
          >
            <View style={layoutStyles.feedbackHeader}>
              <Text style={layoutStyles.feedbackTitle}>How are you enjoying MealLens AI?</Text>
              <TouchableOpacity onPress={handleCloseFeedback} style={layoutStyles.closeButton}>
                <X size={20} color="#6B6B6B" />
              </TouchableOpacity>
            </View>
            
            <View style={layoutStyles.starsContainer}>
              {[1, 2, 3, 4, 5].map((value) => (
                <TouchableOpacity 
                  key={value} 
                  onPress={() => handleRateApp(value)}
                  style={layoutStyles.starButton}
                >
                  <Star 
                    size={32} 
                    color={value <= rating ? "#FFD700" : "#E0E0E0"}
                    fill={value <= rating ? "#FFD700" : "none"}
                  />
                </TouchableOpacity>
              ))}
            </View>
            
            <TouchableOpacity 
              style={[layoutStyles.submitFeedback, !rating && layoutStyles.submitDisabled]} 
              onPress={handleSubmitFeedback}
              disabled={!rating}
            >
              <Text style={layoutStyles.submitFeedbackText}>Submit Feedback</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </AppStateProvider>
  );
}
