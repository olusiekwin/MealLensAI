import { useState, useRef, useEffect } from 'react';
import { 
  Text, 
  View, 
  TouchableOpacity, 
  Platform, 
  Image, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Image as ImageIcon, X, RefreshCw, Camera, ArrowLeft } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { cameraStyles } from '@/styles/camera.styles';
import { hasReachedDailyLimit } from '@/services/api';
import * as FileSystem from 'expo-file-system';
import { aiService } from '@/services/aiService';
import { useAdStore } from '@/context/adStore';
import LoadingScreen from '@/components/LoadingScreen';
import AnalysisLoadingScreen from '@/components/AnalysisLoadingScreen';
import AdPlaceholder from '@/components/AdPlaceholder';

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [mode, setMode] = useState<'food' | 'recipe'>('food');
  const cameraRef = useRef(null);
  const router = useRouter();
  const params = useLocalSearchParams();
  const { fetchAds, shouldShowAds } = useAdStore();

  useEffect(() => {
    if (params.mode === 'food' || params.mode === 'recipe') {
      setMode(params.mode as 'food' | 'recipe');
    }
    
    // Skip daily limit check for now
  // checkDailyLimit();
  }, [params]);

  const checkDailyLimit = async () => {
    try {
      const limitReached = await hasReachedDailyLimit();
      if (limitReached) {
        Alert.alert(
          'Daily Limit Reached',
          'You have used your 3 free scans for today. Please try again tomorrow or watch an ad to continue.',
          [
            { 
              text: 'Watch Ad', 
              onPress: () => handleWatchAd() 
            },
            { 
              text: 'Back to Home', 
              onPress: () => router.push('/') 
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error checking daily limit:', error);
    }
  };

  const handleWatchAd = () => {
    // In a real app, this would show an ad
    Alert.alert(
      'Ad Simulation',
      'This is where an ad would play. After watching, you would get an additional scan.',
      [
        { 
          text: 'Complete Ad', 
          onPress: () => Alert.alert('Thank you!', 'You have earned an additional scan.') 
        }
      ]
    );
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={cameraStyles.container}>
        <Text style={cameraStyles.message}>We need your permission to use the camera</Text>
        <TouchableOpacity style={cameraStyles.permissionButton} onPress={requestPermission}>
          <Text style={cameraStyles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const handleCapture = async () => {
    if (!cameraRef.current || isCapturing) return;
    
    setIsCapturing(true);
    
    try {
      // Take a photo using the camera
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
        exif: false
      });
      
      setCapturedImage(photo.uri);
    } catch (error) {
      console.error('Failed to take picture:', error);
      Alert.alert('Error', 'Failed to take picture');
    } finally {
      setIsCapturing(false);
    }
  };

  const handlePickImage = async () => {
    // Request permissions
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to access your photos.');
        return;
      }
    }

    // Launch image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled) {
      setCapturedImage(result.assets[0].uri);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleUsePhoto = async () => {
    if (!capturedImage) return;
    
    setIsAnalyzing(true);
    try {
      // Convert image to base64
      const base64 = await FileSystem.readAsStringAsync(capturedImage, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      // Call AI service to detect food
      const result = await aiService.detectFood(base64);
      
      if (result && result.success) {
        // Navigate to results screen with detection ID
          router.push({
          pathname: '/detection-details',
          params: { detectionId: result.detection_id }
          });
        } else {
        Alert.alert('Error', 'Failed to analyze image. Please try again.');
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      Alert.alert('Error', 'Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
      setCapturedImage(null);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (isAnalyzing) {
    return <AnalysisLoadingScreen />;
  }

  if (showAd) {
    return <AdPlaceholder />;
  }

  if (capturedImage) {
  return (
        <View style={cameraStyles.previewContainer}>
        <Image source={{ uri: capturedImage }} style={cameraStyles.previewImage} />
          <View style={cameraStyles.previewOverlay}>
          <TouchableOpacity style={cameraStyles.closeButton} onPress={handleRetake}>
            <X color="#FFFFFF" size={24} />
          </TouchableOpacity>
          <View style={cameraStyles.previewActions}>
            <TouchableOpacity 
              style={[cameraStyles.previewActionButton]} 
              onPress={handleRetake}
            >
              <RefreshCw color="#FFFFFF" size={20} />
              <Text style={cameraStyles.previewActionText}>Retake</Text>
            </TouchableOpacity>
                  <TouchableOpacity 
                    style={[cameraStyles.previewActionButton, cameraStyles.usePhotoButton]}
                    onPress={handleUsePhoto}
                  >
              <Camera color="#FFFFFF" size={20} />
              <Text style={[cameraStyles.previewActionText, cameraStyles.usePhotoText]}>
                Use Photo
              </Text>
                  </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={cameraStyles.container}>
        <CameraView 
        ref={cameraRef}
          style={cameraStyles.camera} 
        type={facing}
        >
          <View style={cameraStyles.overlay}>
            <View style={cameraStyles.headerContainer}>
            <TouchableOpacity style={cameraStyles.backButton} onPress={handleBack}>
              <ArrowLeft color="#FFFFFF" size={24} />
              </TouchableOpacity>
          </View>
              
              <View style={cameraStyles.modeIndicator}>
                <Text style={cameraStyles.modeText}>
              {mode === 'food' ? 'Food Detection' : 'Recipe Detection'}
                </Text>
                <Text style={cameraStyles.modeDescription}>
                  {mode === 'food' 
                ? 'Point camera at food to identify ingredients' 
                : 'Point camera at recipe to capture instructions'}
                </Text>
            </View>
            
            <View style={cameraStyles.cameraFrame}>
              <View style={[cameraStyles.corner, cameraStyles.topLeft]}>
                <View style={cameraStyles.horizontalLine} />
                <View style={cameraStyles.verticalLine} />
              </View>
              <View style={[cameraStyles.corner, cameraStyles.topRight]}>
                <View style={cameraStyles.horizontalLine} />
                <View style={cameraStyles.verticalLine} />
              </View>
              <View style={[cameraStyles.corner, cameraStyles.bottomLeft]}>
                <View style={cameraStyles.horizontalLine} />
                <View style={cameraStyles.verticalLine} />
              </View>
              <View style={[cameraStyles.corner, cameraStyles.bottomRight]}>
                <View style={cameraStyles.horizontalLine} />
                <View style={cameraStyles.verticalLine} />
              </View>
            </View>
            
            <Text style={cameraStyles.instructionText}>
              {mode === 'food' 
              ? 'Center the food in the frame for best results' 
              : 'Center the recipe text in the frame'}
            </Text>
            
            <View style={cameraStyles.buttonContainer}>
            <TouchableOpacity style={cameraStyles.flipButton} onPress={toggleCameraFacing}>
              <RefreshCw color="#FFFFFF" size={24} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={cameraStyles.captureButton} 
                onPress={handleCapture}
                disabled={isCapturing}
              >
                  <View style={cameraStyles.captureButtonInner} />
              </TouchableOpacity>
              
            <TouchableOpacity style={cameraStyles.galleryButton} onPress={handlePickImage}>
              <ImageIcon color="#FFFFFF" size={24} />
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
    </View>
  );
}