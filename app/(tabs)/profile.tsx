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
  ActivityIndicator
} from 'react-native';
import { Settings, Camera, Edit, Trophy } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { profileStyles } from '@/styles/profile.styles';
import { authService } from '@/services/api';

interface UserProfileData {
  name: string;
  phone: string;
  email: string;
  dob: string;
  gender: string;
  address: string;
  profileImageUrl?: string;
  dietaryPrefs?: string[];
  skillLevel?: string;
}

export default function ProfileScreen() {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/150');
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [userData, setUserData] = useState<Partial<UserProfileData>>({
    name: 'Loading...',
    phone: '...',
    email: '...',
    dob: '...',
    gender: '...',
    address: '...'
  });
  const [userDietaryPreferences, setUserDietaryPreferences] = useState<string[]>([]);
  const [userCookingSkill, setUserCookingSkill] = useState<string>('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [initialProfileImageUrl, setInitialProfileImageUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoadingProfile(true);
      try {
        const data: UserProfileData = await authService.getUserProfile();
        setUserData({
          name: data.name || '',
          phone: data.phone || '',
          email: data.email || '',
          dob: data.dob || '',
          gender: data.gender || '',
          address: data.address || '',
        });
        if (data.profileImageUrl) {
          setProfileImage(data.profileImageUrl);
          setInitialProfileImageUrl(data.profileImageUrl);
        }
        if (data.dietaryPrefs) {
          setUserDietaryPreferences(data.dietaryPrefs);
        }
        if (data.skillLevel) {
          setUserCookingSkill(data.skillLevel);
        }
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
        Alert.alert('Error', 'Could not load your profile. Please try again later.');
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchProfileData();
  }, []);

  const pickImage = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to change your profile picture.');
        return;
      }
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSaveChanges = async () => {
    setIsSavingProfile(true);
    try {
      const updatedProfileData: Partial<UserProfileData> = { ...userData };

      if (profileImage !== initialProfileImageUrl && profileImage.startsWith('file://')) {
        // This is a simplified assumption. Real image upload is more complex.
        // For now, we'll just pretend we're sending the local URI if it changed.
        // In a real app, you'd upload `profileImage` to a server/storage,
        // get a new URL, and send that URL in `updatedProfileData.profileImageUrl`.
        // For this example, we won't send the image URI if it's local, to avoid backend errors.
        // Alert.alert("Image Upload Note", "Image has changed. Implement actual upload to server.");
        // updatedProfileData.profileImageUrl = profileImage; // Or new URL from server
      } else if (profileImage === initialProfileImageUrl) {
        delete updatedProfileData.profileImageUrl;
      }
      
      updatedProfileData.dietaryPrefs = userDietaryPreferences;
      updatedProfileData.skillLevel = userCookingSkill;

      const response = await authService.updateUserProfile(updatedProfileData);
      Alert.alert('Success', 'Profile updated successfully!');
      setIsEditing(false);
      // Optionally, update state with response if backend returns the full updated profile
      // setUserData(response.user); 
      // if (response.user.profileImageUrl) setProfileImage(response.user.profileImageUrl);

    } catch (error) {
      console.error('Failed to update profile:', error);
      Alert.alert('Error', 'Could not update your profile. Please try again.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSettingsPress = () => {
    router.push('/(tabs)/settings');
  };

  const toggleEditMode = () => {
    if (isEditing) {
      handleSaveChanges();
    } else {
      setIsEditing(true);
    }
  };

  const updateField = (field: keyof Omit<UserProfileData, 'dietaryPrefs' | 'skillLevel'>, value: string) => {
    setUserData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };

  const handleDietaryPreferenceChange = (newPreferences: string[]) => {
    setUserDietaryPreferences(newPreferences);
  };

  const handleCookingSkillChange = (newSkill: string) => {
    setUserCookingSkill(newSkill);
  };

  if (isLoadingProfile) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}> 
        <ActivityIndicator size="large" color="#FF6A00" />
        <Text style={{ marginTop: 10, fontSize: 16, color: '#333' }}>Loading Profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={profileStyles.container}>
      <View style={profileStyles.header}>
        <Text style={profileStyles.headerTitle}>Profile</Text>
        <TouchableOpacity 
          style={profileStyles.settingsButton}
          onPress={handleSettingsPress}
        >
          <Settings size={24} color="#202026" />
        </TouchableOpacity>
      </View>
      
      <View style={profileStyles.profileSection}>
        <TouchableOpacity 
          style={profileStyles.profileImageContainer}
          onPress={pickImage}
          disabled={isUploading}
        >
          {isUploading ? (
            <View style={profileStyles.uploadingContainer}>
              <ActivityIndicator size="large" color="#FF6A00" />
            </View>
          ) : (
            <Image 
              source={{ uri: profileImage }} 
              style={profileStyles.profileImage} 
            />
          )}
          <TouchableOpacity 
            style={profileStyles.cameraButton}
            onPress={pickImage}
            disabled={isUploading}
          >
            <Camera size={17} color="#202026" />
          </TouchableOpacity>
        </TouchableOpacity>
        
        <Text style={profileStyles.profileName}>{userData.name}</Text>
        <Text style={profileStyles.profilePhone}>{userData.phone}</Text>
        
        <View style={profileStyles.statsContainer}>
          <View style={profileStyles.statItem}>
            <View style={profileStyles.statIconContainer}>
              <Trophy size={16} color="#FFFFFF" />
            </View>
            <View>
              <Text style={profileStyles.statValue}>5/7</Text>
              <Text style={profileStyles.statLabel}>Cooking Streak</Text>
            </View>
          </View>
          
          <View style={profileStyles.statDivider} />
          
          <View style={profileStyles.statItem}>
            <View style={[profileStyles.statIconContainer, { backgroundColor: '#67C74F' }]}>
              <Trophy size={16} color="#FFFFFF" />
            </View>
            <View>
              <Text style={profileStyles.statValue}>12</Text>
              <Text style={profileStyles.statLabel}>Recipes Cooked</Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity 
          style={[
            profileStyles.editButton,
            isEditing && profileStyles.saveButton,
            isSavingProfile && { opacity: 0.7 }
          ]}
          onPress={toggleEditMode}
          disabled={isSavingProfile}
        >
          {isEditing ? (
            isSavingProfile ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={profileStyles.editButtonText}>Save</Text>
            )
          ) : (
            <View style={profileStyles.editButtonContent}>
              <Edit size={16} color="#FFFFFF" style={profileStyles.editIcon} />
              <Text style={profileStyles.editButtonText}>Edit Profile</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      
      <View style={profileStyles.formSection}>
        <View style={profileStyles.formGroup}>
          <Text style={profileStyles.formLabel}>Email Address</Text>
          <View style={profileStyles.inputContainer}>
            <TextInput
              style={[
                profileStyles.input,
                isEditing && profileStyles.inputEditable
              ]}
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
              value={userData.address || ''}
              onChangeText={(text) => updateField('address', text)}
              editable={isEditing}
              placeholderTextColor="#B5B5B5"
            />
          </View>
        </View>

        {/* Dietary Preferences Section */}
        <View style={profileStyles.formGroup}>
          <Text style={profileStyles.formLabel}>Dietary Preferences</Text>
          {isEditing ? (
            <View style={profileStyles.inputContainer}> 
              {/* Placeholder for multi-select component for dietary preferences */}
              {/* For now, using a simple text input as a placeholder for editing */}
              <TextInput
                style={profileStyles.inputEditable} // Assuming inputEditable makes it look like an input
                value={userDietaryPreferences.join(', ')} // Display as comma-separated
                onChangeText={(text) => handleDietaryPreferenceChange(text.split(',').map(s => s.trim()).filter(s => s))}
                placeholder="e.g., Vegetarian, Gluten-Free"
                placeholderTextColor="#B5B5B5"
              />
              <Text style={{ fontSize: 12, color: '#666', marginTop: 4 }}> (Comma-separated. Proper multi-select recommended)</Text>
            </View>
          ) : (
            <Text style={{ ...profileStyles.input, backgroundColor: 'transparent', borderColor: 'transparent' }}>
              {userDietaryPreferences.length > 0 ? userDietaryPreferences.join(', ') : 'Not set'}
            </Text>
          )}
        </View>

        {/* Cooking Skill Section */}
        <View style={profileStyles.formGroup}>
          <Text style={profileStyles.formLabel}>Cooking Skill</Text>
          {isEditing ? (
            <View style={profileStyles.inputContainer}>
              {/* Placeholder for a picker component, using TextInput for now */}
              <TextInput
                style={profileStyles.inputEditable}
                value={userCookingSkill}
                onChangeText={handleCookingSkillChange} // Assumes handleCookingSkillChange updates string state
                placeholder="e.g., Beginner, Intermediate, Advanced"
                placeholderTextColor="#B5B5B5"
              />
            </View>
          ) : (
            <Text style={{ ...profileStyles.input, backgroundColor: 'transparent', borderColor: 'transparent' }}>{userCookingSkill || 'Not set'}</Text>
          )}
        </View>

      </View>
    </ScrollView>
  );
}