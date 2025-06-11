<<<<<<< HEAD
import { useState, useRef } from 'react';
=======
import { useState, useRef, useEffect } from 'react';
>>>>>>> the-moredern-features
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
<<<<<<< HEAD
import { Image as ImageIcon, X, RefreshCw } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { cameraStyles } from '@/styles/camera.styles';
=======
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
>>>>>>> the-moredern-features

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
<<<<<<< HEAD
  const cameraRef = useRef(null);
  const router = useRouter();
=======
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
>>>>>>> the-moredern-features

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
<<<<<<< HEAD
      // This is a mock since we can't actually take a photo in the simulator
      // In a real app, you would use cameraRef.current.takePictureAsync()
      setTimeout(() => {
        // Simulate capturing an image
        setCapturedImage('https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80');
        setIsCapturing(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to take picture:', error);
      Alert.alert('Error', 'Failed to take picture');
=======
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
>>>>>>> the-moredern-features
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
<<<<<<< HEAD
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
=======
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
>>>>>>> the-moredern-features
    });

    if (!result.canceled) {
      setCapturedImage(result.assets[0].uri);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

<<<<<<< HEAD
  const handleUsePhoto = () => {
    // Navigate to AI Chat with the captured image
    router.push('/ai-chat');
  };

  return (
    <View style={cameraStyles.container}>
      {capturedImage ? (
        <View style={cameraStyles.previewContainer}>
          <Image 
            source={{ uri: capturedImage }} 
            style={cameraStyles.previewImage} 
          />
          
          <View style={cameraStyles.previewOverlay}>
            <TouchableOpacity 
              style={cameraStyles.closeButton}
              onPress={handleRetake}
            >
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
            
            <View style={cameraStyles.previewActions}>
              <TouchableOpacity 
                style={cameraStyles.previewActionButton}
                onPress={handleRetake}
              >
                <RefreshCw size={20} color="#FFFFFF" />
                <Text style={cameraStyles.previewActionText}>Retake</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[cameraStyles.previewActionButton, cameraStyles.usePhotoButton]}
                onPress={handleUsePhoto}
              >
                <Text style={cameraStyles.usePhotoText}>Use Photo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <CameraView 
          style={cameraStyles.camera} 
          facing={facing}
          ref={cameraRef}
        >
          <View style={cameraStyles.overlay}>
=======
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
            
>>>>>>> the-moredern-features
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
<<<<<<< HEAD
              Position your ingredients or meal in the frame
            </Text>
            
            <View style={cameraStyles.buttonContainer}>
              <TouchableOpacity 
                style={cameraStyles.flipButton} 
                onPress={toggleCameraFacing}
              >
                <Text style={cameraStyles.flipButtonText}>Flip</Text>
=======
              {mode === 'food' 
              ? 'Center the food in the frame for best results' 
              : 'Center the recipe text in the frame'}
            </Text>
            
            <View style={cameraStyles.buttonContainer}>
            <TouchableOpacity style={cameraStyles.flipButton} onPress={toggleCameraFacing}>
              <RefreshCw color="#FFFFFF" size={24} />
>>>>>>> the-moredern-features
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={cameraStyles.captureButton} 
                onPress={handleCapture}
                disabled={isCapturing}
              >
<<<<<<< HEAD
                {isCapturing ? (
                  <ActivityIndicator size="large" color="#FFFFFF" />
                ) : (
                  <View style={cameraStyles.captureButtonInner} />
                )}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={cameraStyles.galleryButton}
                onPress={handlePickImage}
              >
                <ImageIcon size={24} color="#FFFFFF" />
=======
                  <View style={cameraStyles.captureButtonInner} />
              </TouchableOpacity>
              
            <TouchableOpacity style={cameraStyles.galleryButton} onPress={handlePickImage}>
              <ImageIcon color="#FFFFFF" size={24} />
>>>>>>> the-moredern-features
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
<<<<<<< HEAD
      )}
=======
>>>>>>> the-moredern-features
    </View>
  );
}