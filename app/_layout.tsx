"use client"

import React, { useEffect, useState, useRef } from "react"
import { Stack } from "expo-router"
import { View, Text } from "react-native"
import * as SplashScreen from "expo-splash-screen"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useRouter, usePathname } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import { Image } from "react-native"
import { AuthProvider } from "@/context/AuthContext"
import { STORAGE_KEYS } from "@/config/constants"
import { GlobalErrorBanner } from '@/components/GlobalErrorBanner';

// Prevent the splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync()

export const unstable_settings = {
  initialRouteName: "index",
}

function MainLayout() {
  // Centralized onboarding/session logic: do not duplicate in other screens!
  const [appIsReady, setAppIsReady] = useState(false)
  const [initializationStage, setInitializationStage] = useState<"loading" | "ready">("loading")
  const router = useRouter()
  const pathname = usePathname()
  const didInit = useRef(false)

  useEffect(() => {
    async function prepare() {
      if (didInit.current) return; // Prevent multiple initializations
      didInit.current = true;
      try {
        console.log("🚀 App initialization started")
        // Check onboarding status using correct storage keys
        const hasCompletedOnboarding = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED)
        const sessionViewed = await AsyncStorage.getItem("onboardingViewedThisSession")
        const authToken = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
        console.log("📋 Onboarding status:", {
          completed: hasCompletedOnboarding,
          sessionViewed: sessionViewed,
          authToken: !!authToken,
        })
        // Small delay to ensure smooth transitions
        await new Promise((resolve) => setTimeout(resolve, 500))
        setInitializationStage("ready")
        // Routing logic
        if (!authToken) {
          // Not authenticated: go to auth
          if (pathname !== '/auth') router.replace('/auth')
        } else if (hasCompletedOnboarding !== 'true') {
          // Authenticated but not completed onboarding: go to onboarding
          if (pathname !== '/onboarding/profile-setup') {
            router.replace('/onboarding/profile-setup')
          }
        } // else, let the user access the app (/(tabs)/home or wherever they are)
      } catch (err) {
        console.error("❌ App initialization error:", err)
        setInitializationStage("ready")
        if (pathname !== '/auth') router.replace('/auth')
      } finally {
        setAppIsReady(true)
      }
    }
    prepare()
    // Only run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // If app is not ready, show loading screen
  if (!appIsReady || initializationStage === 'loading') {
    return renderLoadingScreen();
  }

  return (
    <AuthProvider>
      <GlobalErrorBanner />
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding/profile-setup" options={{ headerShown: false }} />
          <Stack.Screen name="auth/forgot-password" options={{ headerShown: false }} />
        </Stack>
      </View>
    </AuthProvider>
  )
}

export default MainLayout;
