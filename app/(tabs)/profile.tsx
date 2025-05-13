import { useState } from 'react';
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

export default function ProfileScreen() {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80');
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [userData, setUserData] = useState({
    name: 'Samuel Barns',
    phone: '+1 523 458 78 12',
    email: 'S.Barns@gmail.com',
    dob: '04/20/1996',
    gender: 'Male',
    address: 'KK 21 KG 102 St'
  });

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
    router.push('/(tabs)/settings');
  };

  const toggleEditMode = () => {
    if (isEditing) {
      // Save changes
      Alert.alert('Success', 'Profile updated successfully!');
    }
    setIsEditing(!isEditing);
  };

  const updateField = (field: string, value: string) => {
    setUserData({
      ...userData,
      [field]: value
    });
  };

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
            isEditing && profileStyles.saveButton
          ]}
          onPress={toggleEditMode}
        >
          {isEditing ? (
            <Text style={profileStyles.editButtonText}>Save</Text>
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
              value={userData.address}
              onChangeText={(text) => updateField('address', text)}
              editable={isEditing}
              placeholderTextColor="#B5B5B5"
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}