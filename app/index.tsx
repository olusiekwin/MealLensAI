"use client"

import { useCallback, useState, useEffect } from "react"
import { View, Text, TouchableOpacity, ImageBackground, Dimensions, StyleSheet } from "react-native"
import { Platform } from "react-native"
import { useRouter } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import * as SplashScreen from "expo-splash-screen"
import { ArrowRight, Sparkles, Camera, ChefHat } from "lucide-react-native"
import AsyncStorage from '@react-native-async-storage/async-storage'

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync()

const { width, height } = Dimensions.get("window")

const onboardingData = [
  {
    id: 0,
    title: "Welcome to MealLens",
    subtitle: "Your AI-powered cooking companion",
    description: "Discover recipes from ingredients or meals with just a photo or text input.",
    icon: Sparkles,
    background: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
    buttonText: "Next"
  },
  {
    id: 1,
    title: "Snap & Cook",
    subtitle: "Turn photos into recipes",
    description: "Take a photo of ingredients or a dish, and get personalized recipe suggestions instantly.",
    icon: Camera,
    background: "https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
    buttonText: "Next"
  },
  {
    id: 2,
    title: "Personalized Experience",
    subtitle: "Tailored just for you",
    description: "Get recipe recommendations based on your preferences, dietary needs, and cooking skills.",
    icon: ChefHat,
    background: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
    buttonText: "Get Started"
  }
]

export default function OnboardingScreen() {
  const router = useRouter()
  const [currentScreen, setCurrentScreen] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const onLayoutRootView = useCallback(async () => {
    try {
      await SplashScreen.hideAsync()
      console.log("✅ Main app: Splash screen hidden successfully")
    } catch (e) {
      console.warn("❌ Main app: Error hiding splash screen:", e)
    }
  }, [])

  const handleNext = async () => {
    if (isAnimating) return
    
    setIsAnimating(true)
    
    if (currentScreen < onboardingData.length - 1) {
      // Move to next onboarding screen
      setTimeout(() => {
        setCurrentScreen(currentScreen + 1)
        setIsAnimating(false)
      }, 200)
    } else {
      // Complete onboarding and navigate to auth
      try {
        await AsyncStorage.setItem('hasCompletedOnboarding', 'true')
        // Also mark in sessionService for consistency
        if (typeof sessionService !== 'undefined') {
          await sessionService.completeOnboarding?.();
        }
        console.log('✅ Onboarding completed and saved to storage')
        router.replace('/auth')
      } catch (error) {
        console.error('❌ Error saving onboarding data:', error)
        router.replace('/auth')
      }
    }
  }

  const handleSkip = async () => {
    try {
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true')
      if (typeof sessionService !== 'undefined') {
        await sessionService.completeOnboarding?.();
      }
      router.replace('/auth')
    } catch (error) {
      console.error('❌ Error saving skip status:', error)
      router.replace('/auth')
    }
  }

  const currentData = onboardingData[currentScreen]
  const IconComponent = currentData.icon

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <ImageBackground 
        source={{ uri: currentData.background }} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient 
          colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0.7)"]} 
          style={styles.overlay} 
        />

        {/* Progress Indicators */}
        <View style={styles.progressContainer}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                index === currentScreen && styles.progressDotActive,
                index < currentScreen && styles.progressDotCompleted
              ]}
            />
          ))}
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <View style={styles.iconContainer}>
            <IconComponent size={48} color="#FFFFFF" />
          </View>
          
          <Text style={styles.title}>{currentData.title}</Text>
          <Text style={styles.subtitle}>{currentData.subtitle}</Text>
          <Text style={styles.description}>{currentData.description}</Text>
        </View>

        {/* Bottom Actions */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity 
            style={styles.nextButton} 
            onPress={handleNext}
            disabled={isAnimating}
          >
            <Text style={styles.nextButtonText}>{currentData.buttonText}</Text>
            <ArrowRight size={20} color="#FFFFFF" style={styles.buttonIcon} />
          </TouchableOpacity>

          {currentScreen < onboardingData.length - 1 && (
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>
          )}
        </View>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressDotActive: {
    backgroundColor: '#FFFFFF',
    width: 24,
  },
  progressDotCompleted: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  bottomContainer: {
    paddingHorizontal: 32,
    paddingBottom: 50,
    gap: 16,
  },
  nextButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 8px 16px rgba(255, 107, 53, 0.3)' }
      : {
          shadowColor: '#FF6B35',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.3,
          shadowRadius: 16,
        }),
    elevation: 8,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  skipButtonText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    fontWeight: '500',
  },
})