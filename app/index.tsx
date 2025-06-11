"use client"

import { useCallback, useState, useEffect } from "react"
import { View, Text, TouchableOpacity, ImageBackground, Dimensions, StyleSheet } from "react-native"
import { Platform } from "react-native"
import { useRouter } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import * as SplashScreen from "expo-splash-screen"
import { Check } from "lucide-react-native"
import { onboardingStyles } from "@/styles/onboarding.styles"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync()

const { width } = Dimensions.get("window")

const dietaryPreferences = [
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "pescatarian", label: "Pescatarian" },
  { id: "keto", label: "Keto" },
  { id: "paleo", label: "Paleo" },
  { id: "gluten_free", label: "Gluten-Free" },
  { id: "dairy_free", label: "Dairy-Free" },
  { id: "no_restrictions", label: "No Restrictions" },
]

const cookingSkills = [
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
]

export default function OnboardingScreen() {
  const router = useRouter()
  const [currentScreen, setCurrentScreen] = useState(0)
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([])
  const [cookingSkill, setCookingSkill] = useState<string>("")
  const [appIsReady, setAppIsReady] = useState(true)

  useEffect(() => {
    // Hide splash screen immediately
    SplashScreen.hideAsync().catch((e) => {})
    checkOnboardingStatus()
  }, [])

  // Check if user has already completed onboarding
  const checkOnboardingStatus = async () => {
    try {
      const hasCompleted = await AsyncStorage.getItem("hasCompletedOnboarding")
      const sessionViewed = await AsyncStorage.getItem("onboardingViewedThisSession")

      if (hasCompleted === "true" || sessionViewed === "true") {
        // Skip onboarding and go directly to auth
        router.replace("/auth")
        return
      }

      // Mark as viewed for this session
      await AsyncStorage.setItem("onboardingViewedThisSession", "true")
    } catch (error) {
      console.error("Error checking onboarding status:", error)
    }
  }

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      try {
        await SplashScreen.hideAsync()
        console.log("✅ Main app: Splash screen hidden successfully")
      } catch (e) {
        console.warn("❌ Main app: Error hiding splash screen:", e)
      }
    }
  }, [appIsReady])

  const handleNext = async () => {
    if (currentScreen < 2) {
      // Move to next onboarding screen
      setCurrentScreen(currentScreen + 1)
    } else {
      // Save onboarding completion status
      try {
        await AsyncStorage.setItem("hasCompletedOnboarding", "true")
        console.log("✅ Onboarding completed and saved to storage")

        // Save user preferences if they were selected
        if (selectedPreferences.length > 0) {
          await AsyncStorage.setItem("userPreferences", JSON.stringify(selectedPreferences))
        }

        if (cookingSkill) {
          await AsyncStorage.setItem("cookingSkill", cookingSkill)
        }

        // Navigate to auth screen
        router.replace("/auth")
      } catch (error) {
        console.error("❌ Error saving onboarding data:", error)
        // Even if there's an error, try to proceed to auth
        router.replace("/auth")
      }
    }
  }

  const handleSkip = async () => {
    try {
      await AsyncStorage.setItem("hasCompletedOnboarding", "true")
      router.replace("/auth")
    } catch (error) {
      console.error("❌ Error saving skip status:", error)
      router.replace("/auth")
    }
  }

  const togglePreference = (id: string) => {
    if (selectedPreferences.includes(id)) {
      setSelectedPreferences(selectedPreferences.filter((item) => item !== id))
    } else {
      setSelectedPreferences([...selectedPreferences, id])
    }
  }

  const selectCookingSkill = (id: string) => {
    setCookingSkill(id)
  }

  const getBackgroundImage = () => {
    switch (currentScreen) {
      case 0:
        return {
          uri: "https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        }
      case 1:
        return {
          uri: "https://images.unsplash.com/photo-1543352634-99045d0b5c99?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        }
      case 2:
        return {
          uri: "https://images.unsplash.com/photo-1543353071-873f17a7a088?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        }
      default:
        return {
          uri: "https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        }
    }
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 0:
        return (
          <View style={onboardingStyles.contentCard}>
            <Text style={onboardingStyles.headingText}>Welcome to MealLens</Text>
            <Text style={onboardingStyles.descriptionText}>
              Discover recipes from ingredients or meals with just a photo or text input. Let's set up your preferences!
            </Text>

            <TouchableOpacity style={onboardingStyles.nextButton} onPress={handleNext}>
              <Text style={onboardingStyles.nextButtonText}>Get Started</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipButtonText}>Skip Setup</Text>
            </TouchableOpacity>
          </View>
        )
      case 1:
        return (
          <View style={onboardingStyles.contentCard}>
            <Text style={onboardingStyles.headingText}>Dietary Preferences</Text>
            <Text style={onboardingStyles.descriptionText}>
              Select any dietary preferences or restrictions you have:
            </Text>

            <View style={styles.preferencesContainer}>
              {dietaryPreferences.map((preference) => (
                <TouchableOpacity
                  key={preference.id}
                  style={[
                    styles.preferenceButton,
                    selectedPreferences.includes(preference.id) && styles.preferenceButtonSelected,
                  ]}
                  onPress={() => togglePreference(preference.id)}
                >
                  <Text
                    style={[
                      styles.preferenceButtonText,
                      selectedPreferences.includes(preference.id) && styles.preferenceButtonTextSelected,
                    ]}
                  >
                    {preference.label}
                  </Text>
                  {selectedPreferences.includes(preference.id) && <Check size={16} color="#FFFFFF" />}
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={onboardingStyles.nextButton} onPress={handleNext}>
              <Text style={onboardingStyles.nextButtonText}>Continue</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>
          </View>
        )
      case 2:
        return (
          <View style={onboardingStyles.contentCard}>
            <Text style={onboardingStyles.headingText}>Cooking Experience</Text>
            <Text style={onboardingStyles.descriptionText}>What's your level of cooking experience?</Text>

            <View style={styles.skillsContainer}>
              {cookingSkills.map((skill) => (
                <TouchableOpacity
                  key={skill.id}
                  style={[styles.skillButton, cookingSkill === skill.id && styles.skillButtonSelected]}
                  onPress={() => selectCookingSkill(skill.id)}
                >
                  <Text style={[styles.skillButtonText, cookingSkill === skill.id && styles.skillButtonTextSelected]}>
                    {skill.label}
                  </Text>
                  {cookingSkill === skill.id && (
                    <View style={styles.skillSelectedIndicator}>
                      <Check size={14} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[onboardingStyles.nextButton, !cookingSkill && styles.disabledButton]}
              onPress={handleNext}
              disabled={!cookingSkill}
            >
              <Text style={onboardingStyles.nextButtonText}>Complete Setup</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>
          </View>
        )
      default:
        return null
    }
  }

  // Fallback UI in case of rendering errors
  const [hasError, setHasError] = useState(false)

  // Simple error handler for the main component
  useEffect(() => {
    const handleError = (error: any) => {
      console.error("Caught error in main component:", error)
      setHasError(true)
    }

    // Use a safer approach for error handling that works across all React Native environments
    const errorHandler = (error: Error, isFatal?: boolean) => {
      handleError(error)
      console.log("Error caught:", error.message, "Fatal:", isFatal)
    }

    // Set up error boundary
    if (Platform.OS !== "web") {
      // Only use this approach on native platforms
      const originalHandler = global.ErrorUtils?.getGlobalHandler?.()

      if (global.ErrorUtils?.setGlobalHandler) {
        global.ErrorUtils.setGlobalHandler((error, isFatal) => {
          errorHandler(error, isFatal)
          // Still call original handler if it exists
          if (originalHandler) {
            originalHandler(error, isFatal)
          }
        })
      }

      return () => {
        // Restore the original handler when component unmounts
        if (global.ErrorUtils?.setGlobalHandler && originalHandler) {
          global.ErrorUtils.setGlobalHandler(originalHandler)
        }
      }
    }
  }, [])

  if (hasError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Something went wrong</Text>
        <Text style={styles.errorMessage}>The app encountered an error.</Text>
        <TouchableOpacity
          style={styles.errorButton}
          onPress={() => {
            setHasError(false)
            if (Platform.OS === "web") {
              window.location.reload()
            }
          }}
        >
          <Text style={styles.errorButtonText}>Reload App</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={onboardingStyles.container} onLayout={onLayoutRootView}>
      <ImageBackground source={getBackgroundImage()} style={onboardingStyles.backgroundImage}>
        <LinearGradient colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.5)"]} style={onboardingStyles.overlay} />

        {/* Professional Progress Bar */}
        {currentScreen > 0 && (
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: `${(currentScreen / 2) * 100}%` }]} />
            </View>
            <Text style={styles.progressText}>{currentScreen} of 2</Text>
          </View>
        )}

        {currentScreen === 0 && (
          <>
            <Text style={onboardingStyles.welcomeText}>MealLens AI</Text>

            <View style={onboardingStyles.cameraFrame}>
              <View style={[onboardingStyles.corner, onboardingStyles.topLeft]}>
                <View style={onboardingStyles.horizontalLine} />
                <View style={onboardingStyles.verticalLine} />
              </View>
              <View style={[onboardingStyles.corner, onboardingStyles.topRight]}>
                <View style={onboardingStyles.horizontalLine} />
                <View style={onboardingStyles.verticalLine} />
              </View>
              <View style={[onboardingStyles.corner, onboardingStyles.bottomLeft]}>
                <View style={onboardingStyles.horizontalLine} />
                <View style={onboardingStyles.verticalLine} />
              </View>
              <View style={[onboardingStyles.corner, onboardingStyles.bottomRight]}>
                <View style={onboardingStyles.horizontalLine} />
                <View style={onboardingStyles.verticalLine} />
              </View>
            </View>
          </>
        )}
      </ImageBackground>

      {renderScreen()}
    </View>
  )
}

const styles = StyleSheet.create({
  // Professional Progress Bar
  progressBarContainer: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10,
  },
  progressBarBackground: {
    flex: 1,
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 2,
    marginRight: 12,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 2,
  },
  progressText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
    minWidth: 40,
  },

  // Skip button
  skipButton: {
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
  },
  skipButtonText: {
    color: "#6A6A6A",
    fontSize: 16,
    fontWeight: "500",
  },

  // Preferences
  preferencesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 20,
    width: "100%",
  },
  preferenceButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "48%",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    minHeight: 48,
  },
  preferenceButtonSelected: {
    backgroundColor: "#202026",
  },
  preferenceButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#202026",
    marginRight: 6,
    textAlign: "center",
  },
  preferenceButtonTextSelected: {
    color: "#FFFFFF",
  },

  // Skills
  skillsContainer: {
    marginVertical: 20,
    width: "100%",
  },
  skillButton: {
    position: "relative",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
    minHeight: 56,
    justifyContent: "center",
  },
  skillButtonSelected: {
    backgroundColor: "#202026",
    borderWidth: 1,
    borderColor: "#202026",
  },
  skillButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#202026",
    textAlign: "center",
  },
  skillButtonTextSelected: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  skillSelectedIndicator: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#4ECDC4",
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },

  // Error handling
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 20,
  },
  errorTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "600",
  },
  errorMessage: {
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    marginBottom: 20,
    fontSize: 16,
    lineHeight: 24,
  },
  errorButton: {
    padding: 12,
    backgroundColor: "#202026",
    borderRadius: 8,
    minWidth: 120,
    alignItems: "center",
  },
  errorButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
})
