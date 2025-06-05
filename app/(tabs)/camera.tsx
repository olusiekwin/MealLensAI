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

  const analyzeImage = async () => {
    if (!capturedImage) return;
    
    setIsAnalyzing(true);
    
    try {
      // Encode image to base64
      const base64 = await FileSystem.readAsStringAsync(capturedImage, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      // First, check with backend if we should show an ad (premium status check)
      // This leverages the backend to make the decision rather than frontend
      const api = require('@/services/api').default;
      
      // Request ad from backend if needed - backend will determine if user should see ads
      if (shouldShowAds) {
        try {
          const adResponse = await api.get('/ads/should-display', {
            params: { context: 'detection', mode }
          });
          
          if (adResponse.data && adResponse.data.showAd) {
            // Show ad from backend or placeholder
            setShowAd(true);
            // Wait for ad display duration
            await new Promise(resolve => setTimeout(resolve, 5000));
            setShowAd(false);
            
            // Notify backend that ad was viewed
            await api.post('/ads/viewed', { 
              adId: adResponse.data.adId || 'placeholder',
              context: 'detection'
            }).catch(err => console.log('Ad view tracking error:', err));
          }
        } catch (error) {
          console.log('Ad service error, continuing with analysis:', error);
        }
      }
      
      // Call backend API based on mode - letting backend handle the heavy processing
      if (mode === 'food') {
        // Send image to backend for processing
        const result = await api.post('/analysis/food', { 
          image: base64,
          saveHistory: true
        });
        
        if (result.data && result.data.success) {
          router.push({
            pathname: '/(tabs)/nutritional-breakdown',
            params: { 
              imageUri: capturedImage,
              analysisId: result.data.id || result.data.analysisId
            }
          });
        } else {
          Alert.alert('Error', result.data?.error || 'Failed to analyze image');
        }
      } else if (mode === 'recipe') {
        // Send image to backend for recipe processing
        const result = await api.post('/analysis/recipe', { 
          image: base64,
          saveHistory: true
        });
        
        if (result.data && result.data.success) {
          router.push({
            pathname: '/(tabs)/recipes',
            params: { 
              imageUri: capturedImage,
              analysisId: result.data.id || result.data.analysisId
            }
          });
        } else {
          Alert.alert('Error', result.data?.error || 'Failed to analyze recipe image');
        }
      }
      
    } catch (error) {
      console.error('Error analyzing image:', error);
      Alert.alert(
        'Analysis Failed',
        error.message || 'Failed to analyze image. Please try again.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={cameraStyles.container}>
      {/* Analysis Loading Overlay */}
      {isAnalyzing && !showAd && <AnalysisLoadingScreen message="Analyzing your image..." />}
      
      {/* Ad Placeholder */}
      {showAd && <AdPlaceholder onClose={() => setShowAd(false)} />}
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
              {isAnalyzing ? (
                <View style={cameraStyles.analyzingContainer}>
                  <ActivityIndicator size="large" color="#FFFFFF" />
                  <Text style={cameraStyles.analyzingText}>Analyzing image...</Text>
                </View>
              ) : (
                <>
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
                </>
              )}
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
            <View style={cameraStyles.headerContainer}>
              <TouchableOpacity 
                style={cameraStyles.backButton}
                onPress={handleBack}
              >
                <ArrowLeft size={24} color="#FFFFFF" />
              </TouchableOpacity>
              
              <View style={cameraStyles.modeIndicator}>
                <Text style={cameraStyles.modeText}>
                  {mode === 'food' ? 'Food Finder' : 'Recipe Finder'}
                </Text>
                <Text style={cameraStyles.modeDescription}>
                  {mode === 'food' 
                    ? 'Snap ingredients to get recipe ideas' 
                    : 'Snap a meal to get the recipe'}
                </Text>
              </View>
              
              <View style={{ width: 40 }} />
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
                ? 'Position your ingredients in the frame' 
                : 'Position your meal in the frame'}
            </Text>
            
            <View style={cameraStyles.buttonContainer}>
              <TouchableOpacity 
                style={cameraStyles.flipButton} 
                onPress={toggleCameraFacing}
              >
                <Text style={cameraStyles.flipButtonText}>Flip</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={cameraStyles.captureButton} 
                onPress={handleCapture}
                disabled={isCapturing}
              >
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
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      )}
    </View>
  );
}