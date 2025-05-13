import { useState, useRef } from 'react';
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
import { Image as ImageIcon, X, RefreshCw } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { cameraStyles } from '@/styles/camera.styles';

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef(null);
  const router = useRouter();

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
        setCapturedImage('https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80');
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
              Position your ingredients or meal in the frame
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