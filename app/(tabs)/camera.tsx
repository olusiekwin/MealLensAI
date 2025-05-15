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

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mode, setMode] = useState<'food' | 'recipe'>('food');
  const cameraRef = useRef(null);
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    if (params.mode === 'food' || params.mode === 'recipe') {
      setMode(params.mode as 'food' | 'recipe');
    }
    
    // Check if user has reached daily limit
    checkDailyLimit();
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
      // This is a mock since we can't actually take a photo in the simulator
      // In a real app, you would use cameraRef.current.takePictureAsync()
      setTimeout(() => {
        // Simulate capturing an image
        setCapturedImage('https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80');
        setIsCapturing(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to take picture:', error);
      Alert.alert('Error', 'Failed to take picture');
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
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setCapturedImage(result.assets[0].uri);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleUsePhoto = () => {
    setIsAnalyzing(true);
    
    // Simulate analyzing the image
    setTimeout(() => {
      setIsAnalyzing(false);
      
      // Navigate to AI chat with detected food
      router.push({
        pathname: '/ai-chat',
        params: { 
          foodName: mode === 'food' ? 'Avocado & Egg Sandwich' : 'Pancakes with Fruits & Caramel Syrup'
        }
      });
    }, 2000);
  };

  const handleBack = () => {
    router.back();
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