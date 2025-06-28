"use client"

import { useState, useRef, useEffect } from "react"
import {
  Text,
  View,
  TouchableOpacity,
  Platform,
  Image,
  Alert,
  ActivityIndicator,
  StatusBar,
  Dimensions,
} from "react-native"
import { CameraView, type CameraType, useCameraPermissions } from "expo-camera"
import { Image as ImageIcon, X, RefreshCw, Camera, ArrowLeft, FlashOff, Flash } from "lucide-react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import * as ImagePicker from "expo-image-picker"
import * as FileSystem from "expo-file-system"
import { aiService } from "@/services/aiService"
import { useAdStore } from "@/context/adStore"
import AnalysisLoadingScreen from "@/components/AnalysisLoadingScreen"
import AdPlaceholder from "@/components/AdPlaceholder"

const { width, height } = Dimensions.get("window")

export default function CameraScreen() {
  const router = useRouter()

  const [facing, setFacing] = useState<CameraType>("back")
  const [permission, requestPermission] = useCameraPermissions()
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showAd, setShowAd] = useState(false)
  const [mode, setMode] = useState<"food" | "ingredient">("food")
  const [flashMode, setFlashMode] = useState(false)
  const cameraRef = useRef(null)
  const params = useLocalSearchParams()
  const { fetchAds, shouldShowAds } = useAdStore()

  useEffect(() => {
    if (params.mode === "food" || params.mode === "ingredient") {
      setMode(params.mode as "food" | "ingredient")
    }
  }, [params])

  if (!permission) {
    return <View />
  }

  if (!permission.granted) {
    return (
      <View style={modernCameraStyles.permissionContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <View style={modernCameraStyles.permissionContent}>
          <Camera size={64} color="#FFFFFF" />
          <Text style={modernCameraStyles.permissionTitle}>Camera Access Required</Text>
          <Text style={modernCameraStyles.permissionMessage}>
            We need access to your camera to detect and analyze food items
          </Text>
          <TouchableOpacity style={modernCameraStyles.permissionButton} onPress={requestPermission}>
            <Text style={modernCameraStyles.permissionButtonText}>Grant Camera Access</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"))
  }

  function toggleFlash() {
    setFlashMode(!flashMode)
  }

  const handleCapture = async () => {
    if (!cameraRef.current || isCapturing) return

    setIsCapturing(true)

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
        exif: false,
      })

      setCapturedImage(photo.uri)
    } catch (error) {
      console.error("Failed to take picture:", error)
      Alert.alert("Error", "Failed to take picture")
    } finally {
      setIsCapturing(false)
    }
  }

  const handlePickImage = async () => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Sorry, we need camera roll permissions to access your photos.")
        return
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    })

    if (!result.canceled) {
      setCapturedImage(result.assets[0].uri)
    }
  }

  const handleRetake = () => {
    setCapturedImage(null)
  }

  const handleUsePhoto = async () => {
    if (!capturedImage) return

    setIsAnalyzing(true)
    try {
      const base64 = await FileSystem.readAsStringAsync(capturedImage, {
        encoding: FileSystem.EncodingType.Base64,
      })

      const result = await aiService.detectFood(base64)

      if (result && result.success) {
        router.push({
          pathname: "/detection-details",
          params: { detectionId: result.detection_id },
        })
      } else {
        Alert.alert("Error", "Failed to analyze image. Please try again.")
      }
    } catch (error) {
      console.error("Error analyzing image:", error)
      Alert.alert("Error", "Failed to analyze image. Please try again.")
    } finally {
      setIsAnalyzing(false)
      setCapturedImage(null)
    }
  }

  const handleBack = () => {
    router.back()
  }

  if (isAnalyzing) {
    return <AnalysisLoadingScreen />
  }

  if (showAd) {
    return <AdPlaceholder />
  }

  if (capturedImage) {
    return (
      <View style={modernCameraStyles.previewContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <Image source={{ uri: capturedImage }} style={modernCameraStyles.previewImage} />
        <View style={modernCameraStyles.previewOverlay}>
          <TouchableOpacity style={modernCameraStyles.previewCloseButton} onPress={handleRetake}>
            <X color="#FFFFFF" size={24} />
          </TouchableOpacity>

          <View style={modernCameraStyles.previewActions}>
            <TouchableOpacity style={modernCameraStyles.previewActionButton} onPress={handleRetake}>
              <RefreshCw color="#FFFFFF" size={20} />
              <Text style={modernCameraStyles.previewActionText}>Retake</Text>
            </TouchableOpacity>

            <TouchableOpacity style={modernCameraStyles.usePhotoButton} onPress={handleUsePhoto}>
              <Camera color="#FFFFFF" size={20} />
              <Text style={modernCameraStyles.usePhotoText}>Use Photo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View style={modernCameraStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <CameraView ref={cameraRef} style={modernCameraStyles.camera} facing={facing} flash={flashMode ? "on" : "off"}>
        <View style={modernCameraStyles.overlay}>
          {/* Header */}
          <View style={modernCameraStyles.header}>
            <TouchableOpacity style={modernCameraStyles.headerButton} onPress={handleBack}>
              <ArrowLeft color="#FFFFFF" size={24} />
            </TouchableOpacity>

            <View style={modernCameraStyles.modeIndicator}>
              <Text style={modernCameraStyles.modeText}>
                {mode === "food" ? "Food Detection" : "Ingredient Detection"}
              </Text>
            </View>

            <TouchableOpacity style={modernCameraStyles.headerButton} onPress={toggleFlash}>
              {flashMode ? <Flash color="#FFFFFF" size={24} /> : <FlashOff color="#FFFFFF" size={24} />}
            </TouchableOpacity>
          </View>

          {/* Center Focus Area */}
          <View style={modernCameraStyles.focusArea}>
            <View style={modernCameraStyles.focusFrame}>
              <View style={[modernCameraStyles.corner, modernCameraStyles.topLeft]} />
              <View style={[modernCameraStyles.corner, modernCameraStyles.topRight]} />
              <View style={[modernCameraStyles.corner, modernCameraStyles.bottomLeft]} />
              <View style={[modernCameraStyles.corner, modernCameraStyles.bottomRight]} />
            </View>

            <Text style={modernCameraStyles.instructionText}>
              {mode === "food" ? "Center the food in the frame" : "Center the ingredients in the frame"}
            </Text>
          </View>

          {/* Bottom Controls */}
          <View style={modernCameraStyles.controls}>
            <TouchableOpacity style={modernCameraStyles.controlButton} onPress={handlePickImage}>
              <ImageIcon color="#FFFFFF" size={28} />
            </TouchableOpacity>

            <TouchableOpacity style={modernCameraStyles.captureButton} onPress={handleCapture} disabled={isCapturing}>
              <View style={modernCameraStyles.captureButtonInner}>
                {isCapturing && <ActivityIndicator color="#FFFFFF" size="small" />}
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={modernCameraStyles.controlButton} onPress={toggleCameraFacing}>
              <RefreshCw color="#FFFFFF" size={28} />
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </View>
  )
}

const modernCameraStyles = {
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  permissionContent: {
    alignItems: "center",
    padding: 40,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#FFFFFF",
    marginTop: 24,
    marginBottom: 12,
    textAlign: "center",
  },
  permissionMessage: {
    fontSize: 16,
    color: "#CCCCCC",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  permissionButton: {
    backgroundColor: "#FF6A00",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modeIndicator: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  modeText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  focusArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  focusFrame: {
    width: width * 0.7,
    height: width * 0.7,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 30,
    height: 30,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: "#FFFFFF",
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: "#FFFFFF",
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: "#FFFFFF",
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: "#FFFFFF",
    borderBottomRightRadius: 8,
  },
  instructionText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
    marginTop: 32,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingBottom: Platform.OS === "ios" ? 40 : 30,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#FFFFFF",
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  previewContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  previewImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  previewOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  previewCloseButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 40,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  previewActions: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 40 : 30,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 40,
  },
  previewActionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  previewActionText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  usePhotoButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF6A00",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  usePhotoText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
}
