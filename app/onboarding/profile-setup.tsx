import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, TextInput, HelperText, RadioButton, useTheme } from 'react-native-paper';
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useUserStore } from '../../context/userStore';
import profileService from '../../services/profileService';
import sessionService from '../../services/sessionService';

const ProfileSetupScreen = () => {
  const theme = useTheme();
  const { user, updateUser } = useUserStore();
  
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    dateOfBirth: new Date(2000, 0, 1),
    gender: 'prefer-not-to-say',
    address: '',
    location: ''
  });
  
  // Error state
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    username: '',
    dateOfBirth: '',
  });

  // Load existing profile data if available
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await profileService.getProfile();
        
        if (profile) {
          setFormData(prev => ({
            ...prev,
            firstName: profile.firstName || '',
            lastName: profile.lastName || '',
            username: profile.username || '',
            dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth) : prev.dateOfBirth,
            gender: profile.gender || 'prefer-not-to-say',
            address: profile.address || '',
            location: profile.location || ''
          }));
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };
    
    loadProfile();
  }, []);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      firstName: '',
      lastName: '',
      username: '',
      dateOfBirth: '',
    };
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    }
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    }
    
    const today = new Date();
    const birthDate = new Date(formData.dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    
    if (age < 13) {
      newErrors.dateOfBirth = 'You must be at least 13 years old';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Format date as ISO string for API
      const formattedData = {
        ...formData,
        dateOfBirth: formData.dateOfBirth.toISOString().split('T')[0]
      };
      
      const updatedProfile = await profileService.updateProfile(formattedData);
      
      if (updatedProfile) {
        // Update local user state
        updateUser(updatedProfile);
        
        // Mark profile setup as completed
        await sessionService.completeProfileSetup();
        
        // Navigate to main app
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData(prev => ({ ...prev, dateOfBirth: selectedDate }));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>
            Please provide the following information to personalize your experience
          </Text>
        </View>
        
        <View style={styles.form}>
          <TextInput
            label="First Name"
            value={formData.firstName}
            onChangeText={text => setFormData(prev => ({ ...prev, firstName: text }))}
            mode="outlined"
            error={!!errors.firstName}
            style={styles.input}
          />
          {errors.firstName ? <HelperText type="error">{errors.firstName}</HelperText> : null}
          
          <TextInput
            label="Last Name"
            value={formData.lastName}
            onChangeText={text => setFormData(prev => ({ ...prev, lastName: text }))}
            mode="outlined"
            error={!!errors.lastName}
            style={styles.input}
          />
          {errors.lastName ? <HelperText type="error">{errors.lastName}</HelperText> : null}
          
          <TextInput
            label="Username"
            value={formData.username}
            onChangeText={text => setFormData(prev => ({ ...prev, username: text }))}
            mode="outlined"
            error={!!errors.username}
            style={styles.input}
          />
          {errors.username ? <HelperText type="error">{errors.username}</HelperText> : null}
          
          <TextInput
            label="Date of Birth"
            value={formData.dateOfBirth.toLocaleDateString()}
            onFocus={() => setShowDatePicker(true)}
            mode="outlined"
            error={!!errors.dateOfBirth}
            style={styles.input}
            right={<TextInput.Icon icon="calendar" onPress={() => setShowDatePicker(true)} />}
          />
          {errors.dateOfBirth ? <HelperText type="error">{errors.dateOfBirth}</HelperText> : null}
          
          {showDatePicker && (
            <DateTimePicker
              value={formData.dateOfBirth}
              mode="date"
              display="default"
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}
          
          <Text style={styles.sectionTitle}>Gender</Text>
          <RadioButton.Group
            onValueChange={value => setFormData(prev => ({ ...prev, gender: value }))}
            value={formData.gender}
          >
            <View style={styles.radioOption}>
              <RadioButton value="male" />
              <Text>Male</Text>
            </View>
            <View style={styles.radioOption}>
              <RadioButton value="female" />
              <Text>Female</Text>
            </View>
            <View style={styles.radioOption}>
              <RadioButton value="non-binary" />
              <Text>Non-binary</Text>
            </View>
            <View style={styles.radioOption}>
              <RadioButton value="prefer-not-to-say" />
              <Text>Prefer not to say</Text>
            </View>
          </RadioButton.Group>
          
          <TextInput
            label="Home Address (Optional)"
            value={formData.address}
            onChangeText={text => setFormData(prev => ({ ...prev, address: text }))}
            mode="outlined"
            style={styles.input}
          />
          
          <TextInput
            label="Location (Optional)"
            value={formData.location}
            onChangeText={text => setFormData(prev => ({ ...prev, location: text }))}
            mode="outlined"
            style={styles.input}
          />
          
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Complete Profile
          </Button>
          
          <Button
            mode="text"
            onPress={() => router.replace('/(tabs)')}
            style={styles.skipButton}
          >
            Skip for now
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#202026',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  form: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  button: {
    marginTop: 24,
    paddingVertical: 8,
  },
  skipButton: {
    marginTop: 12,
  },
});

export default ProfileSetupScreen;
