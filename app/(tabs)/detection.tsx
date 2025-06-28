"use client"

import { useState, useEffect } from "react"
import {
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
  Keyboard,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native"
import { Search, Filter, Clock, Star, Heart, Camera, UtensilsCrossed, Plus, Type, Upload, X } from "lucide-react-native"
import { useRouter } from "expo-router"
import { detectionStyles } from "../../styles/detection.styles"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../config/constants';
import { detectFromIngredients } from '../../services/detectionService';
import { useAuth } from '../../context/AuthContext';

const { width, height } = Dimensions.get("window")

interface DetectionItem {
  id: string
  title: string
  description: string
  image?: string
  timestamp: string
  accuracy: string
  isFavorite: boolean
  category: string
}

export default function DetectionScreen() {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [detectionHistory, setDetectionHistory] = useState<DetectionItem[]>([])
  const [ingredientInput, setIngredientInput] = useState("")
  const [isDetecting, setIsDetecting] = useState(false)
  const [detectError, setDetectError] = useState<string | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [detectionStep, setDetectionStep] = useState<
    | "choose-type"
    | "food-method"
    | "ingredient-method"
    | "food-upload"
    | "food-camera"
    | "ingredient-text"
    | "ingredient-upload"
  >("choose-type")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const { isAuthenticated } = useAuth();

  // Mock data for demonstration
  useEffect(() => {
    const mockHistory: DetectionItem[] = [
      {
        id: "1",
        title: "Chicken Stir Fry",
        description: "Detected from uploaded food image",
        image: "https://placehold.co/100x100", // Updated placeholder image
        timestamp: new Date().toISOString(),
        accuracy: "95%",
        isFavorite: true,
        category: "Food",
      },
      {
        id: "2",
        title: "Pasta Detection",
        description: "Detected from ingredient list: pasta, tomatoes, basil",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        accuracy: "88%",
        isFavorite: false,
        category: "Ingredients",
      },
    ]
    setDetectionHistory(mockHistory)
  }, [])

  const handleDetectionPress = (item: DetectionItem) => {
    router.push({
      pathname: "/detection-details",
      params: { detectionId: item.id },
    })
  }

  const toggleFavorite = (item: DetectionItem) => {
    setDetectionHistory((prev) =>
      prev.map((det) => (det.id === item.id ? { ...det, isFavorite: !det.isFavorite } : det)),
    )
  }

  const handleIngredientDetect = async () => {
    if (!ingredientInput.trim()) return;
    setIsDetecting(true);
    setDetectError(null);
    Keyboard.dismiss();

    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (!token) throw new Error('You must be logged in to use detection.');
      const response = await detectFromIngredients(ingredientInput, token);
      if (response?.data?.data) {
        // If backend returns a detection ID, navigate to details screen
        const detectionId = response.data.data.id || response.data.data.detection_id;
        if (detectionId) {
          router.push({ pathname: '/detection-details', params: { detectionId } });
        } else {
          // If backend returns full detection result, pass as param
          router.push({ pathname: '/detection-details', params: { detection: JSON.stringify(response.data.data) } });
        }
        resetModal();
      } else {
        throw new Error('No detection result returned.');
      }
    } catch (error: any) {
      setDetectError(error?.message || 'Detection failed.');
    } finally {
      setIsDetecting(false);
    }
  }

  const handleCameraCapture = () => {
    Alert.alert("Camera", "Camera functionality would be implemented here")
    setSelectedImage("https://via.placeholder.com/200x200")
  }

  const handleImageUpload = () => {
    Alert.alert("Upload", "Image picker would be implemented here")
    setSelectedImage("https://via.placeholder.com/200x200")
  }

  const handleImageDetection = async (type: "food" | "ingredient") => {
    if (!selectedImage) return
    setIsDetecting(true)
    setDetectError(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const newDetection: DetectionItem = {
        id: Date.now().toString(),
        title: type === "food" ? "Food Detection" : "Ingredient Detection",
        description: `Detected from uploaded ${type} image`,
        image: selectedImage,
        timestamp: new Date().toISOString(),
        accuracy: "94%",
        isFavorite: false,
        category: type === "food" ? "Food" : "Ingredients",
      }

      setDetectionHistory((prev) => [newDetection, ...prev])
      resetModal()
    } catch (error: any) {
      setDetectError(error?.message || "Detection failed.")
    } finally {
      setIsDetecting(false)
    }
  }

  const resetModal = () => {
    setIsModalVisible(false)
    setDetectionStep("choose-type")
    setIngredientInput("")
    setSelectedImage(null)
    setDetectError(null)
  }

  const filteredDetections = searchQuery.trim()
    ? detectionHistory.filter(
        (detection) =>
          detection.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          detection.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : detectionHistory

  const categories = ["All", "Food", "Ingredients"]

  const getModalTitle = () => {
    switch (detectionStep) {
      case "choose-type":
        return "Choose Detection Method"
      case "food-method":
        return "Food Detection"
      case "ingredient-method":
        return "Ingredient Detection"
      case "food-upload":
      case "food-camera":
        return "Upload Food Image"
      case "ingredient-text":
        return "Enter Ingredients"
      case "ingredient-upload":
        return "Upload Ingredient Image"
      default:
        return "Detection"
    }
  }

  const getModalSubtitle = () => {
    switch (detectionStep) {
      case "choose-type":
        return "Select how'd like to detect and analyze your food or ingredients"
      case "food-method":
        return "Choose how to capture your food image for analysis"
      case "ingredient-method":
        return "Choose how to provide your ingredient information"
      case "food-upload":
      case "food-camera":
        return "Upload a clear image of your food for accurate detection"
      case "ingredient-text":
        return "List your available ingredients to get detection results"
      case "ingredient-upload":
        return "Take or upload a photo of your ingredients"
      default:
        return ""
    }
  }

  const renderModalContent = () => {
    switch (detectionStep) {
      case "choose-type":
        return (
          <View style={modalStyles.form}>
            <TouchableOpacity style={modalStyles.optionCard} onPress={() => setDetectionStep("food-method")}>
              <View style={modalStyles.optionIcon}>
                <UtensilsCrossed size={24} color="#202026" />
              </View>
              <View style={modalStyles.optionContent}>
                <Text style={modalStyles.optionTitle}>Food Detection</Text>
                <Text style={modalStyles.optionDescription}>Analyze complete meals and dishes</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={modalStyles.optionCard} onPress={() => setDetectionStep("ingredient-method")}>
              <View style={modalStyles.optionIcon}>
                <Camera size={24} color="#202026" />
              </View>
              <View style={modalStyles.optionContent}>
                <Text style={modalStyles.optionTitle}>Ingredient Detection</Text>
                <Text style={modalStyles.optionDescription}>Find detection results from your ingredients</Text>
              </View>
            </TouchableOpacity>
          </View>
        )

      case "food-method":
        return (
          <View style={modalStyles.form}>
            <TouchableOpacity style={modalStyles.methodCard} onPress={() => setDetectionStep("food-upload")}>
              <Upload size={20} color="#202026" />
              <View style={modalStyles.methodContent}>
                <Text style={modalStyles.methodTitle}>Upload from Gallery</Text>
                <Text style={modalStyles.methodDescription}>Choose an existing photo</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={modalStyles.methodCard} onPress={() => setDetectionStep("food-camera")}>
              <Camera size={20} color="#202026" />
              <View style={modalStyles.methodContent}>
                <Text style={modalStyles.methodTitle}>Take Photo</Text>
                <Text style={modalStyles.methodDescription}>Use your camera</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={modalStyles.backButton} onPress={() => setDetectionStep("choose-type")}>
              <Text style={modalStyles.backButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
        )

      case "ingredient-method":
        return (
          <View style={modalStyles.form}>
            <TouchableOpacity style={modalStyles.methodCard} onPress={() => setDetectionStep("ingredient-text")}>
              <Type size={20} color="#202026" />
              <View style={modalStyles.methodContent}>
                <Text style={modalStyles.methodTitle}>Type Ingredients</Text>
                <Text style={modalStyles.methodDescription}>Enter ingredients manually</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={modalStyles.methodCard} onPress={() => setDetectionStep("ingredient-upload")}>
              <Camera size={20} color="#202026" />
              <View style={modalStyles.methodContent}>
                <Text style={modalStyles.methodTitle}>Photo of Ingredients</Text>
                <Text style={modalStyles.methodDescription}>Take or upload ingredient photo</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={modalStyles.backButton} onPress={() => setDetectionStep("choose-type")}>
              <Text style={modalStyles.backButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
        )

      case "food-upload":
      case "food-camera":
        return (
          <View style={modalStyles.form}>
            <View style={modalStyles.uploadArea}>
              {selectedImage ? (
                <View style={modalStyles.imagePreview}>
                  <Image source={{ uri: selectedImage }} style={modalStyles.previewImage} />
                  <Text style={modalStyles.previewText}>Image ready for analysis</Text>
                </View>
              ) : (
                <View style={modalStyles.uploadPlaceholder}>
                  <View style={modalStyles.uploadIcon}>
                    <Camera size={32} color="#B0B0B0" />
                  </View>
                  <Text style={modalStyles.uploadText}>
                    {detectionStep === "food-upload" ? "Upload food image" : "Take a photo of your food"}
                  </Text>
                </View>
              )}

              <TouchableOpacity
                style={modalStyles.uploadButton}
                onPress={detectionStep === "food-upload" ? handleImageUpload : handleCameraCapture}
                disabled={isDetecting}
              >
                <Text style={modalStyles.uploadButtonText}>
                  {selectedImage
                    ? "Change Image"
                    : detectionStep === "food-upload"
                      ? "Choose from Gallery"
                      : "Open Camera"}
                </Text>
              </TouchableOpacity>
            </View>

            {detectError && <Text style={modalStyles.errorText}>{detectError}</Text>}

            <View style={modalStyles.buttonRow}>
              <TouchableOpacity
                style={modalStyles.secondaryButton}
                onPress={() => setDetectionStep("food-method")}
                disabled={isDetecting}
              >
                <Text style={modalStyles.secondaryButtonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[modalStyles.primaryButton, (!selectedImage || isDetecting) && modalStyles.disabledButton]}
                onPress={() => handleImageDetection("food")}
                disabled={!selectedImage || isDetecting}
              >
                {isDetecting ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={modalStyles.primaryButtonText}>Analyze Food</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )

      case "ingredient-text":
        return (
          <View style={modalStyles.form}>
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
                editable={!isDetecting}
              />
              <Text style={modalStyles.helperText}>💡 Be specific for better detection results</Text>
            </View>

            {detectError && <Text style={modalStyles.errorText}>{detectError}</Text>}

            <View style={modalStyles.buttonRow}>
              <TouchableOpacity
                style={modalStyles.secondaryButton}
                onPress={() => setDetectionStep("ingredient-method")}
                disabled={isDetecting}
              >
                <Text style={modalStyles.secondaryButtonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  modalStyles.primaryButton,
                  (!ingredientInput.trim() || isDetecting) && modalStyles.disabledButton,
                ]}
                onPress={handleIngredientDetect}
                disabled={!ingredientInput.trim() || isDetecting}
              >
                {isDetecting ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={modalStyles.primaryButtonText}>Start Detection</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )

      case "ingredient-upload":
        return (
          <View style={modalStyles.form}>
            <View style={modalStyles.uploadMethodRow}>
              <TouchableOpacity
                style={modalStyles.uploadMethodCard}
                onPress={handleCameraCapture}
                disabled={isDetecting}
              >
                <View style={modalStyles.uploadMethodIcon}>
                  <Camera size={20} color="#202026" />
                </View>
                <Text style={modalStyles.uploadMethodText}>Camera</Text>
              </TouchableOpacity>

              <TouchableOpacity style={modalStyles.uploadMethodCard} onPress={handleImageUpload} disabled={isDetecting}>
                <View style={modalStyles.uploadMethodIcon}>
                  <Upload size={20} color="#202026" />
                </View>
                <Text style={modalStyles.uploadMethodText}>Gallery</Text>
              </TouchableOpacity>
            </View>

            {selectedImage && (
              <View style={modalStyles.selectedImageContainer}>
                <Image source={{ uri: selectedImage }} style={modalStyles.selectedImage} />
              </View>
            )}

            {detectError && <Text style={modalStyles.errorText}>{detectError}</Text>}

            <View style={modalStyles.buttonRow}>
              <TouchableOpacity
                style={modalStyles.secondaryButton}
                onPress={() => setDetectionStep("ingredient-method")}
                disabled={isDetecting}
              >
                <Text style={modalStyles.secondaryButtonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[modalStyles.primaryButton, (!selectedImage || isDetecting) && modalStyles.disabledButton]}
                onPress={() => handleImageDetection("ingredient")}
                disabled={!selectedImage || isDetecting}
              >
                {isDetecting ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={modalStyles.primaryButtonText}>Analyze Ingredients</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )

      default:
        return null
    }
  }

  return (
    <View style={detectionStyles.container}>
      {/* Header */}
      <View style={detectionStyles.header}>
        <Text style={detectionStyles.title}>Detection History</Text>
        <View style={detectionStyles.headerIcons}>
          <TouchableOpacity style={detectionStyles.iconButton}>
            <Search size={20} color="#202026" />
          </TouchableOpacity>
          <TouchableOpacity style={detectionStyles.iconButton}>
            <Filter size={20} color="#202026" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[detectionStyles.iconButton, { backgroundColor: "#202026" }]}
            onPress={() => setIsModalVisible(true)}
          >
            <Plus size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={detectionStyles.searchContainer}>
        <View style={detectionStyles.searchBar}>
          <Search size={20} color="#B5B5B5" style={detectionStyles.searchIcon} />
          <TextInput
            style={detectionStyles.searchInput}
            placeholder="Search detections"
            placeholderTextColor="#B5B5B5"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Categories */}
      <View style={detectionStyles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={[
                detectionStyles.categoryButton,
                activeCategory === category && detectionStyles.activeCategoryButton,
              ]}
              onPress={() => setActiveCategory(category)}
            >
              <Text
                style={[
                  detectionStyles.categoryText,
                  activeCategory === category && detectionStyles.activeCategoryText,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Detection List */}
      <FlatList
        data={filteredDetections}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={detectionStyles.recipesList}
        renderItem={({ item }) => (
          <TouchableOpacity style={detectionStyles.recipeCard} onPress={() => handleDetectionPress(item)}>
            {item.image ? (
              <Image source={{ uri: item.image }} style={detectionStyles.recipeImage} />
            ) : (
              <View
                style={{
                  width: 100,
                  height: 100,
                  backgroundColor: "#F0F0F0",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 15,
                }}
              >
                <UtensilsCrossed size={24} color="#B5B5B5" />
              </View>
            )}
            <View style={detectionStyles.recipeContent}>
              <Text style={detectionStyles.recipeTitle}>{item.title}</Text>
              <Text style={detectionStyles.recipeDescription}>{item.description}</Text>
              <View style={detectionStyles.recipeDetails}>
                <View style={detectionStyles.detailItem}>
                  <Clock size={12} color="#202026" />
                  <Text style={detectionStyles.detailText}>{new Date(item.timestamp).toLocaleDateString()}</Text>
                </View>
                <View style={detectionStyles.detailItem}>
                  <Star size={12} color="#000000" />
                  <Text style={detectionStyles.detailText}>{item.accuracy}</Text>
                </View>
                <TouchableOpacity style={detectionStyles.openButton} onPress={() => handleDetectionPress(item)}>
                  <Text style={detectionStyles.openButtonText}>Open</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={detectionStyles.heartButton} onPress={() => toggleFavorite(item)}>
              <Heart size={14} color="#FF5353" fill={item.isFavorite ? "#FF5353" : "transparent"} />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View style={detectionStyles.emptyStateContainer}>
            <View style={detectionStyles.emptyStateIconContainer}>
              <Camera size={30} color="#202026" />
            </View>
            <Text style={detectionStyles.emptyStateTitle}>No Detections Yet</Text>
            <Text style={detectionStyles.emptyStateDescription}>Start detecting food or ingredients</Text>
            <TouchableOpacity style={detectionStyles.emptyStateButton} onPress={() => setIsModalVisible(true)}>
              <Text style={detectionStyles.emptyStateButtonText}>Start Detection</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Detection Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true} onRequestClose={resetModal}>
        <View style={modalStyles.modalOverlay}>
          <View style={[modalStyles.modalContainer, { height: height * 0.75 }]}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={modalStyles.container}>
              <ScrollView contentContainerStyle={modalStyles.scrollContent}>
                <View style={modalStyles.header}>
                  <View style={modalStyles.headerContent}>
                    <Text style={modalStyles.title}>{getModalTitle()}</Text>
                    <Text style={modalStyles.subtitle}>{getModalSubtitle()}</Text>
                  </View>
                  <TouchableOpacity style={modalStyles.closeButton} onPress={resetModal}>
                    <X size={20} color="#202026" />
                  </TouchableOpacity>
                </View>

                {renderModalContent()}
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const modalStyles = {
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerContent: {
    flex: 1,
    paddingRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#202026",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    lineHeight: 22,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  form: {
    flex: 1,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  optionIcon: {
    width: 48,
    height: 48,
    backgroundColor: "#F5F5F5",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#202026",
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  methodContent: {
    flex: 1,
    marginLeft: 12,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#202026",
    marginBottom: 2,
  },
  methodDescription: {
    fontSize: 13,
    color: "#666",
  },
  backButton: {
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  uploadArea: {
    marginBottom: 24,
  },
  uploadPlaceholder: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 32,
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    marginBottom: 16,
  },
  uploadIcon: {
    width: 64,
    height: 64,
    backgroundColor: "#F0F0F0",
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  uploadText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    fontWeight: "500",
  },
  uploadButton: {
    backgroundColor: "#F5F5F5",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  uploadButtonText: {
    fontSize: 14,
    color: "#202026",
    fontWeight: "500",
  },
  imagePreview: {
    alignItems: "center",
    marginBottom: 16,
  },
  previewImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
    backgroundColor: "#F0F0F0",
    marginBottom: 12,
  },
  previewText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#202026",
    marginBottom: 8,
  },
  textArea: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 16,
    fontSize: 16,
    color: "#202026",
    minHeight: 100,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  helperText: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
    fontStyle: "italic",
  },
  uploadMethodRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  uploadMethodCard: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  uploadMethodIcon: {
    width: 40,
    height: 40,
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  uploadMethodText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#202026",
  },
  selectedImageContainer: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    padding: 8,
    backgroundColor: "#FAFAFA",
    marginBottom: 20,
  },
  selectedImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    backgroundColor: "#F0F0F0",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: "auto",
    paddingTop: 24,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#202026",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  secondaryButtonText: {
    color: "#202026",
    fontSize: 16,
    fontWeight: "500",
  },
  disabledButton: {
    opacity: 0.6,
  },
  errorText: {
    color: "#FF5353",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },
}
