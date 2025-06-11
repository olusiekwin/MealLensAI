"use client"

import React, { useEffect, useState } from "react"
import { Stack } from "expo-router"
import { View, Text } from "react-native"
import * as SplashScreen from "expo-splash-screen"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useRouter } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import { Image } from "react-native"
import { AuthProvider } from "@/context/AuthContext"

// Prevent the splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync()

export const unstable_settings = {
  initialRouteName: "index",
}

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false)
  const [initializationStage, setInitializationStage] = useState<"loading" | "ready">("loading")
  const router = useRouter()

  useEffect(() => {
    async function prepare() {
      try {
        console.log("🚀 App initialization started")

        // Check onboarding status
        const hasCompletedOnboarding = await AsyncStorage.getItem("hasCompletedOnboarding")
        const sessionViewed = await AsyncStorage.getItem("onboardingViewedThisSession")

        console.log("📋 Onboarding status:", {
          completed: hasCompletedOnboarding,
          sessionViewed: sessionViewed,
        })

        // Small delay to ensure smooth transitions
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setInitializationStage("ready")
        } catch (error) {
        console.error("❌ App initialization error:", error)
        // Continue anyway to prevent app from being stuck
        setInitializationStage("ready")
      } finally {
        setAppIsReady(true)
      }
    }

    prepare()
  }, [])

  const onLayoutRootView = React.useCallback(async () => {
    if (appIsReady) {
      try {
        await SplashScreen.hideAsync()
        console.log("✅ Splash screen hidden successfully")
      } catch (error) {
        console.warn("⚠️ Error hiding splash screen:", error)
      }
    }
  }, [appIsReady])

  // Custom loading screen
  const renderLoadingScreen = () => {
    return (
      <View style={{ flex: 1 }}>
        <LinearGradient
          colors={["#1A1A1A", "#333333"]}
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Image
            source={require("../assets/images/halflogo.png")}
            style={{ width: 120, height: 120, marginBottom: 20 }}
            resizeMode="contain"
          />
          <Text style={{ color: "#FFFFFF", fontSize: 24, fontWeight: "700", marginBottom: 8 }}>MealLens AI</Text>
          <Text style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: 16 }}>Loading...</Text>
        </LinearGradient>
      </View>
    )
  }

  useEffect(() => {
    // Hide splash screen immediately
    SplashScreen.hideAsync().catch((e) => {
      console.warn('Error hiding splash screen:', e);
    });

    // Check onboarding status for initial route
    const getInitialRoute = async () => {
      try {
        const hasCompletedOnboarding = await AsyncStorage.getItem('hasCompletedOnboarding');
        return hasCompletedOnboarding === 'true' ? '/auth' : '/index';
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        return '/index'; // Default to onboarding on error
      }
    };

    getInitialRoute().then((route) => {
      router.replace(route);
    });
  }, []);

  // If app is not ready, show loading screen
  if (!appIsReady || initializationStage === 'loading') {
    return renderLoadingScreen();
  }

  return (
    <AuthProvider>
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding/profile-setup" options={{ headerShown: false }} />
          <Stack.Screen name="auth/forgot-password" options={{ headerShown: false }} />
        </Stack>
      </View>
    </AuthProvider>
  )
}
