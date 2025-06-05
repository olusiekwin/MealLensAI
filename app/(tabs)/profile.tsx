import { useState, useEffect } from 'react';
import { 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  Alert, 
  Platform,
  ActivityIndicator,
  Switch
} from 'react-native';
import { Settings, Camera, Edit, Trophy, Star, Clock, CheckCircle, AlertCircle, ChevronRight, CreditCard } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { profileStyles } from '@/styles/profile.styles';
import { useUserStore } from '@/context/userStore';
import aiService from '@/services/aiService';

export default function ProfileScreen() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [usageStats, setUsageStats] = useState({ remaining: 0, limit: 3 });
  const [isPremium, setIsPremium] = useState(false);
  
  // Get user state from the store
  const { profile, updateProfile, fetchProfile, isAuthenticated, login } = useUserStore();
  
  const [userData, setUserData] = useState({
    name: '',
    phone: '',
    email: '',
    dob: '',
    gender: '',
    address: ''
  });
  
  const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80');
  
  useEffect(() => {
    loadProfile();
  }, [isAuthenticated]);
  
  const loadProfile = async () => {
    setIsLoading(true);
    try {
      if (isAuthenticated) {
        await fetchProfile();
        
        // Get usage limits
        const limits = await aiService.checkDailyLimit();
        setUsageStats(limits);
        
        // Check if user is premium
        setIsPremium(profile?.isPremium || false);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (profile) {
      setUserData({
        name: profile.name || '',
        phone: profile.phone || '',
        email: profile.email || '',
        dob: profile.dob || '',
        gender: profile.gender || '',
        address: profile.address || ''
      });
      
      if (profile.profileImage) {
        setProfileImage(profile.profileImage);
      }
    }
  }, [profile]);

  const pickImage = async () => {
    // Request permissions
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to change your profile picture.');
        return;
      }
    }

    setIsUploading(true);

    // Launch image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    setIsUploading(false);

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSettingsPress = () => {
    router.push('/settings');
  };
  
  const handleSubscriptionPress = () => {
    router.push('/subscription');
  };
  
  const handlePaymentMethodsPress = () => {
    router.push('/payment-methods');
  };

  const toggleEditMode = async () => {
    if (isEditing) {
      try {
        // Save changes to backend
        await updateProfile(userData);
        Alert.alert('Success', 'Profile updated successfully!');
      } catch (error) {
        console.error('Error updating profile:', error);
        Alert.alert('Error', 'Failed to update profile. Please try again.');
      }
    }
    setIsEditing(!isEditing);
  };

  const updateField = (field: string, value: string) => {
    setUserData({
      ...userData,
      [field]: value
    });
  };

  const handleLoginPress = () => {
    router.push('/login');
  };

  if (isLoading) {
    return (
      <View style={profileStyles.container}>
        <View style={profileStyles.header}>
          <Text style={profileStyles.headerTitle}>Profile</Text>
          <TouchableOpacity style={profileStyles.settingsButton} onPress={handleSettingsPress}>
            <Settings size={20} color="#202026" />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#000000" />
          <Text style={{ marginTop: 16, fontSize: 16 }}>Loading profile...</Text>
        </View>
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <View style={profileStyles.container}>
        <View style={profileStyles.header}>
          <Text style={profileStyles.headerTitle}>Profile</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <Text style={{ fontSize: 24, fontWeight: '600', marginBottom: 16 }}>Sign in to view your profile</Text>
          <Text style={{ fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 24 }}>Create an account to save your detections and access them anytime.</Text>
          <TouchableOpacity 
            style={{
              backgroundColor: '#FF5353',
              paddingVertical: 12,
              paddingHorizontal: 24,
              borderRadius: 8,
            }}
            onPress={handleLoginPress}
          >
            <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 16 }}>Sign In / Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView 
      style={profileStyles.container} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <View style={profileStyles.header}>
        <Text style={profileStyles.headerTitle}>Profile</Text>
        <TouchableOpacity style={profileStyles.settingsButton} onPress={handleSettingsPress}>
          <Settings size={20} color="#202026" />
        </TouchableOpacity>
      </View>
      <View style={profileStyles.profileSection}>
        <TouchableOpacity 
          style={profileStyles.profileImageContainer}
          onPress={pickImage}
        >
          {isUploading ? (
            <View style={profileStyles.uploadingContainer}>
              <ActivityIndicator size="small" color="#000000" />
            </View>
          ) : (
            <>
              <Image 
                source={{ uri: profileImage }} 
                style={profileStyles.profileImage} 
              />
              <View style={profileStyles.cameraButton}>
                <Camera size={16} color="#202026" />
              </View>
            </>
          )}
        </TouchableOpacity>
        
        <Text style={profileStyles.profileName}>{userData.name || 'Your Name'}</Text>
        <Text style={profileStyles.profilePhone}>{userData.phone || 'Add your phone number'}</Text>
        
        <View style={profileStyles.statsContainer}>
          <View style={profileStyles.statItem}>
            <View style={[profileStyles.statIconContainer, { backgroundColor: '#FF5353' }]}>
              <Star size={16} color="#FFFFFF" />
            </View>
            <View>
              <Text style={profileStyles.statValue}>{usageStats.remaining}/{usageStats.limit}</Text>
              <Text style={profileStyles.statLabel}>Daily Limit</Text>
            </View>
          </View>
          
          <View style={profileStyles.statDivider} />
          
          <View style={profileStyles.statItem}>
            <View style={[profileStyles.statIconContainer, { backgroundColor: isPremium ? '#67C74F' : '#B5B5B5' }]}>
              <Trophy size={16} color="#FFFFFF" />
            </View>
            <View>
              <Text style={profileStyles.statValue}>{isPremium ? 'Premium' : 'Free'}</Text>
              <Text style={profileStyles.statLabel}>Account</Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity 
          style={profileStyles.editButton}
          onPress={toggleEditMode}
        >
          <View style={profileStyles.editButtonContent}>
            {isEditing ? (
              <>
                <CheckCircle size={16} color="#F5F5F5" style={profileStyles.editIcon} />
                <Text style={profileStyles.editButtonText}>Save Changes</Text>
              </>
            ) : (
              <>
                <Edit size={16} color="#F5F5F5" style={profileStyles.editIcon} />
                <Text style={profileStyles.editButtonText}>Edit Profile</Text>
              </>
            )}
          </View>
        </TouchableOpacity>
            

          
          <View style={profileStyles.formSection}>
            <Text style={profileStyles.sectionTitle}>Personal Information</Text>
            
            <View style={profileStyles.formGroup}>
              <Text style={profileStyles.formLabel}>Email Address</Text>
              <View style={profileStyles.inputContainer}>
                <TextInput
                  style={[profileStyles.input, isEditing && profileStyles.inputEditable]}
                  value={userData.email}
                  onChangeText={(text) => updateField('email', text)}
                  editable={isEditing}
                  placeholderTextColor="#B5B5B5"
                  keyboardType="email-address"
                />
              </View>
            </View>
            
            <View style={profileStyles.formGroup}>
              <Text style={profileStyles.formLabel}>Date of birth</Text>
              <View style={profileStyles.inputContainer}>
                <TextInput
                  style={[
                    profileStyles.input,
                    isEditing && profileStyles.inputEditable
                  ]}
                  value={userData.dob}
                  onChangeText={(text) => updateField('dob', text)}
                  editable={isEditing}
                  placeholderTextColor="#B5B5B5"
                />
              </View>
            </View>
            
            <View style={profileStyles.formGroup}>
              <Text style={profileStyles.formLabel}>Gender</Text>
              <View style={profileStyles.genderContainer}>
                <TouchableOpacity 
                  style={profileStyles.genderOption}
                  onPress={() => isEditing && updateField('gender', 'Male')}
                >
                  <View style={userData.gender === 'Male' ? profileStyles.radioSelected : profileStyles.radioUnselected}>
                    {userData.gender === 'Male' && <View style={profileStyles.radioInner} />}
                  </View>
                  <Text style={profileStyles.genderText}>Male</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={profileStyles.genderOption}
                  onPress={() => isEditing && updateField('gender', 'Female')}
                >
                  <View style={userData.gender === 'Female' ? profileStyles.radioSelected : profileStyles.radioUnselected}>
                    {userData.gender === 'Female' && <View style={profileStyles.radioInner} />}
                  </View>
                  <Text style={profileStyles.genderText}>Female</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={profileStyles.formGroup}>
              <Text style={profileStyles.formLabel}>Address</Text>
              <View style={profileStyles.inputContainer}>
                <TextInput
                  style={[
                    profileStyles.input,
                    isEditing && profileStyles.inputEditable
                  ]}
                  value={userData.address}
                  onChangeText={(text) => updateField('address', text)}
                  editable={isEditing}
                  placeholderTextColor="#B5B5B5"
                />
              </View>
            </View>
          </View>
      </View>
    </ScrollView>
  );
}