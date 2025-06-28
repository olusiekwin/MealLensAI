"use client"

import { Text, View, ScrollView, Image, TouchableOpacity, Alert, Modal, TextInput, Button } from "react-native"
import { Search, Bell, ChevronDown, Star, Heart, Camera, Type, X, Play, List, Pizza } from "lucide-react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import { homeStyles, modalStyles } from "@/styles/home.styles"
import { useState, useEffect } from "react"
import aiService from "@/services/aiService"
import { getUserProfile, saveUserProfile } from "@/services/userLocalStorage"
import profileService from "@/services/profileService"
import { DonutProgress } from "@/components/DonutProgress"
import { LoadingScreen } from "@/components/LoadingScreen"

export default function HomeScreen() {
  const router = useRouter()
  const [hasNotifications, setHasNotifications] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [showIngredientModal, setShowIngredientModal] = useState(false)
  const [showFoodModal, setShowFoodModal] = useState(false)
  const [showAdModal, setShowAdModal] = useState(false)
  const [showNotificationModal, setShowNotificationModal] = useState(false)
  const [ingredientStep, setIngredientStep] = useState("choose-method")
  const [ingredientInput, setIngredientInput] = useState("")
  const [currentStreak, setCurrentStreak] = useState(5)
  const [streakGoal] = useState(7)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [preferences, setPreferences] = useState<any>(null)

  useEffect(() => {
    const loadProfile = async () => {
      setFetchError(null)
      setIsLoading(true)
      try {
        // Try to get from local storage first
        const cached = await getUserProfile()
        if (cached) {
          setProfile(cached)
          setPreferences(cached.preferences)
        }
        // Always try to fetch fresh from API via profileService
        const fresh = await profileService.getProfile()
        if (fresh) {
          setProfile(fresh)
          setPreferences(fresh.preferences)
          await saveUserProfile(fresh)
        }
        setIsLoading(false)
      } catch (err: any) {
        setFetchError(err?.message || "Failed to load profile")
        setIsLoading(false)
      }
    }
    loadProfile()
  }, [])

  const trackAppUsage = aiService.checkDailyLimit

  const detections = [
    {
      title: "Chicken Stir Fry",
      time: "2 hours ago",
      accuracy: "95%",
      image:
        "https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    },
    {
      title: "Vegetable Medley",
      time: "5 hours ago",
      accuracy: "88%",
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    },
    {
      title: "Berry Bowl",
      time: "1 day ago",
      accuracy: "92%",
      image:
        "https://images.unsplash.com/photo-1546039907-7fa05f864c02?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    },
  ]

  const notifications = [
    {
      icon: "🎯",
      title: "Detection Complete",
      description: "Your chicken stir fry analysis is ready with 95% accuracy",
      time: "2 hours ago",
    },
    {
      icon: "🔥",
      title: "Streak Alert",
      description: "You're 2 detections away from your weekly goal!",
      time: "1 day ago",
    },
    {
      icon: "📊",
      title: "Weekly Summary",
      description: "You detected 12 items this week with 91% average accuracy",
      time: "2 days ago",
    },
    {
      icon: "💡",
      title: "Tip of the Day",
      description: "Better lighting improves detection accuracy by up to 15%",
      time: "3 days ago",
    },
  ]

  const handleFoodDetectionPress = async () => {
    try {
      const usageStatus = await trackAppUsage()
      if (usageStatus.remaining <= 0) {
        setShowAdModal(true)
        return
      }
      setShowFoodModal(true)
    } catch (error) {
      console.error("Error tracking usage:", error)
      setShowFoodModal(true)
    }
  }

  const handleIngredientDetectionPress = async () => {
    try {
      const usageStatus = await trackAppUsage()
      if (usageStatus.remaining <= 0) {
        setShowAdModal(true)
        return
      }
      setShowIngredientModal(true)
    } catch (error) {
      console.error("Error tracking usage:", error)
      setShowIngredientModal(true)
    }
  }

  const handleWatchAd = () => {
    setShowAdModal(false)
    setTimeout(() => {
      Alert.alert("Thank you!", "You have earned an additional scan.", [
        { text: "OK", onPress: () => setShowIngredientModal(true) },
      ])
    }, 2000)
  }

  const handleNotificationPress = () => {
    setShowNotificationModal(true)
    setHasNotifications(false)
  }

  const resetIngredientModal = () => {
    setShowIngredientModal(false)
    setIngredientStep("choose-method")
    setIngredientInput("")
  }

  const handleIngredientImageUpload = () => {
    resetIngredientModal()
    router.push("/camera?mode=ingredient&type=image")
  }

  const handleIngredientTextSubmit = () => {
    if (!ingredientInput.trim()) return
    resetIngredientModal()
    router.push(`/camera?mode=ingredient&type=text&ingredients=${encodeURIComponent(ingredientInput)}`)
  }

  const handleFoodImageUpload = () => {
    setShowFoodModal(false)
    router.push("/camera?mode=food&type=image")
  }

  // Retry handler
  const handleRetry = () => {
    setIsLoading(true)
    setFetchError(null)
    setProfile(null)
    setPreferences(null)
    ;(async () => {
      try {
        const fresh = await profileService.getProfile()
        if (fresh) {
          setProfile(fresh)
          setPreferences(fresh.preferences)
          await saveUserProfile(fresh)
        }
        setIsLoading(false)
      } catch (err: any) {
        setFetchError(err?.message || "Failed to load profile")
        setIsLoading(false)
      }
    })()
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  if (fetchError && !profile) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 32 }}>
        <Text style={{ fontSize: 18, color: "#FF5353", marginBottom: 16, textAlign: "center" }}>{fetchError}</Text>
        <Button title="Retry" onPress={handleRetry} />
      </View>
    )
  }

  return (
    <View style={homeStyles.container}>
      {/* Background Image */}
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        }}
        style={homeStyles.backgroundImage}
        blurRadius={20}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={homeStyles.scrollContent}>
        {/* Header Section */}
        <LinearGradient
          colors={["rgba(255, 106, 0, 0.9)", "rgba(255, 143, 71, 0.9)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={homeStyles.headerGradientFullWidth}
        >
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
            }}
            style={homeStyles.headerBackgroundImage}
          />

          <View style={homeStyles.headerContent}>
            <View>
              <Text style={homeStyles.greeting}>Hi, {profile?.firstName || profile?.name || "User"}</Text>
              <Text style={homeStyles.welcomeBack}>Welcome back!</Text>
              {preferences && (
                <View style={homeStyles.preferencesInHeader}>
                  <Text style={homeStyles.preferencesHeaderText}>Skill: {preferences.cookingSkillLevel || "N/A"}</Text>
                  <Text style={homeStyles.preferencesHeaderText}>
                    Dietary: {preferences.dietaryRestrictions?.join(", ") || "None"}
                  </Text>
                </View>
              )}
            </View>
            <View style={homeStyles.headerIcons}>
              <TouchableOpacity style={homeStyles.iconButton}>
                <Search color="#FFFFFF" size={20} />
              </TouchableOpacity>
              <TouchableOpacity style={homeStyles.iconButton} onPress={handleNotificationPress}>
                <Bell color="#FFFFFF" size={20} />
                {hasNotifications && <View style={homeStyles.notificationDot} />}
              </TouchableOpacity>
            </View>
          </View>

          <View style={homeStyles.locationContainer}>
            <Text style={homeStyles.locationLabel}>Your Location</Text>
            <View style={homeStyles.locationRow}>
              <Text style={homeStyles.locationText}>{profile?.location || profile?.address || "Kigali, Rwanda"}</Text>
              <ChevronDown color="#FFFFFF" size={16} />
            </View>
          </View>
        </LinearGradient>

        {/* Detection Cards */}
        <View style={homeStyles.finderCardsContainer}>
          <TouchableOpacity style={homeStyles.finderCard} onPress={handleIngredientDetectionPress}>
            <View style={homeStyles.finderIconContainer}>
              <List size={24} color="#202026" />
            </View>
            <Text style={homeStyles.finderText}>Detect Ingredients</Text>
          </TouchableOpacity>

          <TouchableOpacity style={homeStyles.finderCard} onPress={handleFoodDetectionPress}>
            <View style={homeStyles.finderIconContainer}>
              <Pizza size={24} color="#202026" />
            </View>
            <Text style={homeStyles.finderText}>Detect Food</Text>
          </TouchableOpacity>
        </View>

        {/* Featured Dish and Cooking Streak Cards */}
        <View style={homeStyles.featuredStreakContainer}>
          <View style={homeStyles.featuredDishCard}>
            <View style={homeStyles.featuredDishContent}>
              <Text style={homeStyles.featuredDishLabel}>Featured Dish of the Day!</Text>
              <Text style={homeStyles.featuredDishName}>Honey Sweet Korean Fried Chicken</Text>
              <TouchableOpacity style={homeStyles.cookNowButton} onPress={handleFoodDetectionPress}>
                <Text style={homeStyles.cookNowText}>Detect Now</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={homeStyles.cookingStreakCard}>
            <View style={homeStyles.cookingStreakContent}>
              <Text style={homeStyles.cookingStreakTitle}>Detection Streak</Text>
              <Text style={homeStyles.cookingStreakSubtitle}>Keep your streak alive by detecting today!</Text>

              <View style={homeStyles.streakInfoContainer}>
                <Image
                  source={{
                    uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
                  }}
                  style={homeStyles.avatarImage}
                />
                <View style={homeStyles.streakProgressContainer}>
                  <DonutProgress current={currentStreak} total={streakGoal} />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Detection Suggestions */}
        <View style={homeStyles.suggestionsContainer}>
          <View style={homeStyles.sectionHeader}>
            <Text style={homeStyles.sectionTitle}>Recent Detections</Text>
            <TouchableOpacity style={homeStyles.viewAllButton}>
              <Text style={homeStyles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={homeStyles.recipesContainer}
          >
            {detections.map((detection, index) => (
              <TouchableOpacity key={index} style={homeStyles.recipeCard}>
                <Image source={{ uri: detection.image }} style={homeStyles.recipeImage} />
                <View style={homeStyles.recipeContent}>
                  <Text style={homeStyles.recipeTitle}>{detection.title}</Text>
                  <View style={homeStyles.recipeDetails}>
                    <View style={homeStyles.recipeDetail}>
                      <Text style={homeStyles.detailText}>{detection.time}</Text>
                    </View>
                    <View style={homeStyles.recipeDetail}>
                      <Star size={12} color="#FF6A00" fill="#FF6A00" />
                      <Text style={homeStyles.detailText}>{detection.accuracy}</Text>
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

      {/* Ingredient Detection Modal */}
      <Modal
        visible={showIngredientModal}
        animationType="slide"
        transparent={true}
        onRequestClose={resetIngredientModal}
      >
        <View style={modalStyles.modalOverlay}>
          <View style={modalStyles.modalContainer}>
            <View style={modalStyles.header}>
              <View style={modalStyles.headerContent}>
                <Text style={modalStyles.title}>
                  {ingredientStep === "choose-method" ? "Detect Ingredients" : "Enter Ingredients"}
                </Text>
                <Text style={modalStyles.subtitle}>
                  {ingredientStep === "choose-method"
                    ? "Choose how you'd like to detect ingredients"
                    : "List your available ingredients to get detection results"}
                </Text>
              </View>
              <TouchableOpacity style={modalStyles.closeButton} onPress={resetIngredientModal}>
                <X size={20} color="#202026" />
              </TouchableOpacity>
            </View>

            <View style={modalStyles.content}>
              {ingredientStep === "choose-method" ? (
                <>
                  <TouchableOpacity style={modalStyles.optionCard} onPress={handleIngredientImageUpload}>
                    <View style={modalStyles.optionIcon}>
                      <Camera size={24} color="#202026" />
                    </View>
                    <View style={modalStyles.optionContent}>
                      <Text style={modalStyles.optionTitle}>Take/Upload Photo</Text>
                      <Text style={modalStyles.optionDescription}>Capture or select ingredients from gallery</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity style={modalStyles.optionCard} onPress={() => setIngredientStep("text-input")}>
                    <View style={modalStyles.optionIcon}>
                      <Type size={24} color="#202026" />
                    </View>
                    <View style={modalStyles.optionContent}>
                      <Text style={modalStyles.optionTitle}>Type Ingredients</Text>
                      <Text style={modalStyles.optionDescription}>Manually enter your available ingredients</Text>
                    </View>
                  </TouchableOpacity>
                </>
              ) : (
                <View style={modalStyles.inputContainer}>
                  <Text style={modalStyles.inputLabel}>Your Ingredients</Text>
                  <TextInput
                    style={modalStyles.textArea}
                    placeholder="Enter your ingredients separated by commas&#10;e.g. chicken breast, rice, onions, garlic, bell peppers"
                    placeholderTextColor="#B0B0B0"
                    value={ingredientInput}
                    onChangeText={setIngredientInput}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                  <Text style={modalStyles.helperText}>💡 Be specific for better detection results</Text>
                </View>
              )}
            </View>

            <View style={modalStyles.footer}>
              {ingredientStep === "text-input" && (
                <TouchableOpacity style={modalStyles.backButton} onPress={() => setIngredientStep("choose-method")}>
                  <Text style={modalStyles.backButtonText}>Back</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[
                  modalStyles.primaryButton,
                  ingredientStep === "text-input" && !ingredientInput.trim() && modalStyles.disabledButton,
                ]}
                onPress={ingredientStep === "choose-method" ? resetIngredientModal : handleIngredientTextSubmit}
                disabled={ingredientStep === "text-input" && !ingredientInput.trim()}
              >
                <Text style={modalStyles.primaryButtonText}>
                  {ingredientStep === "choose-method" ? "Cancel" : "Start Detection"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Food Detection Modal */}
      <Modal
        visible={showFoodModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFoodModal(false)}
      >
        <View style={modalStyles.modalOverlay}>
          <View style={modalStyles.modalContainer}>
            <View style={modalStyles.header}>
              <View style={modalStyles.headerContent}>
                <Text style={modalStyles.title}>Detect Food</Text>
                <Text style={modalStyles.subtitle}>Take or upload a photo of your food for detailed analysis</Text>
              </View>
              <TouchableOpacity style={modalStyles.closeButton} onPress={() => setShowFoodModal(false)}>
                <X size={20} color="#202026" />
              </TouchableOpacity>
            </View>

            <View style={modalStyles.content}>
              <TouchableOpacity style={modalStyles.optionCard} onPress={handleFoodImageUpload}>
                <View style={modalStyles.optionIcon}>
                  <Camera size={24} color="#202026" />
                </View>
                <View style={modalStyles.optionContent}>
                  <Text style={modalStyles.optionTitle}>Take/Upload Photo</Text>
                  <Text style={modalStyles.optionDescription}>Capture or select food image for analysis</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={modalStyles.footer}>
              <TouchableOpacity style={modalStyles.primaryButton} onPress={() => setShowFoodModal(false)}>
                <Text style={modalStyles.primaryButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Ad Modal */}
      <Modal visible={showAdModal} animationType="fade" transparent={true} onRequestClose={() => setShowAdModal(false)}>
        <View style={modalStyles.adOverlay}>
          <View style={modalStyles.adContainer}>
            <TouchableOpacity style={modalStyles.adCloseButton} onPress={() => setShowAdModal(false)}>
              <X size={20} color="#202026" />
            </TouchableOpacity>

            <View style={modalStyles.adContent}>
              <Text style={modalStyles.adTitle}>Daily Limit Reached</Text>
              <Text style={modalStyles.adDescription}>
                You've used your 3 free detections today. Watch a short ad to continue or try again tomorrow.
              </Text>

              <View style={modalStyles.adVideoPlaceholder}>
                <Play size={40} color="#FFFFFF" />
                <Text style={modalStyles.adVideoText}>Ad Video</Text>
              </View>

              <TouchableOpacity style={modalStyles.watchAdButton} onPress={handleWatchAd}>
                <Text style={modalStyles.watchAdButtonText}>Watch Ad (30s)</Text>
              </TouchableOpacity>

              <TouchableOpacity style={modalStyles.tryTomorrowButton} onPress={() => setShowAdModal(false)}>
                <Text style={modalStyles.tryTomorrowButtonText}>Try Tomorrow</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Notification Modal */}
      <Modal
        visible={showNotificationModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowNotificationModal(false)}
      >
        <View style={modalStyles.modalOverlay}>
          <View style={modalStyles.modalContainer}>
            <View style={modalStyles.header}>
              <View style={modalStyles.headerContent}>
                <Text style={modalStyles.title}>Notifications</Text>
                <Text style={modalStyles.subtitle}>Stay updated with your detection activity</Text>
              </View>
              <TouchableOpacity style={modalStyles.closeButton} onPress={() => setShowNotificationModal(false)}>
                <X size={20} color="#202026" />
              </TouchableOpacity>
            </View>

            <ScrollView style={modalStyles.notificationList}>
              {notifications.map((notification, index) => (
                <View key={index} style={modalStyles.notificationItem}>
                  <View style={modalStyles.notificationIcon}>
                    <Text style={modalStyles.notificationEmoji}>{notification.icon}</Text>
                  </View>
                  <View style={modalStyles.notificationContent}>
                    <Text style={modalStyles.notificationTitle}>{notification.title}</Text>
                    <Text style={modalStyles.notificationDescription}>{notification.description}</Text>
                    <Text style={modalStyles.notificationTime}>{notification.time}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={modalStyles.footer}>
              <TouchableOpacity style={modalStyles.primaryButton} onPress={() => setShowNotificationModal(false)}>
                <Text style={modalStyles.primaryButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}
