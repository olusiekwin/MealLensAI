"use client"

import { useEffect, useRef } from "react"
import { View, Image, Animated, Dimensions, StyleSheet, ActivityIndicator, Text } from "react-native"
import * as SplashScreen from "expo-splash-screen"

const { width, height } = Dimensions.get("window")

interface CustomSplashScreenProps {
  onFinish: () => void
  isLoading?: boolean
}

export default function CustomSplashScreen({ onFinish, isLoading = true }: CustomSplashScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.8)).current
  const pulseAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    // Keep the native splash screen visible while we prepare the app
    SplashScreen.preventAutoHideAsync()

    // Start animations
    const startAnimations = () => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start()

      // Start pulsing animation for logo
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ).start()
    }

    startAnimations()

    // Hide splash screen after animations and loading complete
    if (!isLoading) {
      const timer = setTimeout(() => {
        SplashScreen.hideAsync()
        onFinish()
      }, 2000) // Show for at least 2 seconds

      return () => clearTimeout(timer)
    }
  }, [isLoading])

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }, { scale: pulseAnim }],
          },
        ]}
      >
        <Image source={require("../assets/images/halflogo.png")} style={styles.logo} resizeMode="contain" />
      </Animated.View>

      <Animated.View
        style={[
          styles.loadingContainer,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <ActivityIndicator size="large" color="#4ECDC4" style={styles.loader} />
        <Text style={styles.loadingText}>Loading MealLens AI...</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.brandContainer,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <Text style={styles.brandText}>MealLens AI</Text>
        <Text style={styles.taglineText}>Smart Nutrition Analysis</Text>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  logo: {
    width: Math.min(width * 0.6, 250),
    height: Math.min(width * 0.6, 250),
  },
  loadingContainer: {
    alignItems: "center",
    marginBottom: 80,
  },
  loader: {
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "500",
    letterSpacing: 0.5,
  },
  brandContainer: {
    alignItems: "center",
    position: "absolute",
    bottom: 100,
  },
  brandText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
    letterSpacing: 1,
  },
  taglineText: {
    fontSize: 14,
    color: "#4ECDC4",
    fontWeight: "500",
    letterSpacing: 0.5,
  },
})
