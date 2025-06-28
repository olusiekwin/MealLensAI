import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Animated } from 'react-native';
import { Button, TextInput, HelperText, useTheme } from 'react-native-paper';
import { router } from 'expo-router';
import profileService from '../../services/profileService';
import sessionService from '../../services/sessionService';
import { ArrowLeft, ArrowRight, MapPin, Crown, Zap } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_COMPLETED_KEY = 'ONBOARDING_COMPLETED';

const ProfileSetupScreen = () => {
  const theme = useTheme();
  const [user, setUser] = useState<any>(null); // Use local state for user if needed
  
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [slideAnim] = useState(new Animated.Value(0));
  
  // Form state
  const [formData, setFormData] = useState({
    location: '',
    subscriptionTier: 'free'
  });
  
  // Error state
  const [errors, setErrors] = useState({});

  const steps = [
    {
      id: 'location',
      title: 'Where are you located?',
      subtitle: 'Help us suggest local ingredients and seasonal recipes',
      icon: MapPin,
      component: 'LocationStep'
    },
    {
      id: 'subscription',
      title: 'Choose your plan',
      subtitle: 'Select the plan that works best for you',
      icon: Crown,
      component: 'SubscriptionStep'
    }
  ];

  const subscriptionPlans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0/month',
      features: [
        'Basic recipe suggestions',
        'Photo recognition',
        'Limited daily searches',
        'Standard support'
      ],
      icon: Zap,
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$9.99/month',
      features: [
        'Unlimited recipe suggestions',
        'Advanced AI recommendations',
        'Unlimited daily searches',
        'Priority support',
        'Meal planning tools',
        'Nutrition tracking'
      ],
      icon: Crown,
      popular: true
    }
  ];

  // Load existing profile data if available
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await profileService.getProfile();
        if (profile) {
          setUser(profile);
          setFormData(prev => ({
            ...prev,
            location: profile.location || '',
            subscriptionTier: profile.subscription_status || 'free'
          }));
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };
    loadProfile();
  }, []);

  // Animate step transitions
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: currentStep,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [currentStep]);

  const validateCurrentStep = () => {
    const step = steps[currentStep];
    const newErrors = {};
    
    switch (step.id) {
      case 'location':
        if (!formData.location.trim()) {
          newErrors.location = 'Location helps us provide better recommendations';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = async () => {
    try {
      // Mark onboarding and profile setup as completed
      await sessionService.completeProfileSetup();
      await sessionService.completeOnboarding();
      await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
      const value = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY);
      console.log('✅ Onboarding marked as completed (skip), AsyncStorage value:', value);
      if (value === 'true') {
        router.replace('/(tabs)');
      } else {
        console.warn('❌ Failed to persist onboarding completion in AsyncStorage (skip)');
      }
    } catch (err) {
      console.error('Error in handleSkip:', err);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Prepare profile data according to your schema
      const profileData = {
        full_name: user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : '',
        preferences: {
          location: formData.location,
          subscription_tier: formData.subscriptionTier,
          setup_completed: true,
          setup_date: new Date().toISOString()
        }
      };
      let updatedProfile = null;
      updatedProfile = await profileService.updateProfile(profileData);
      
      if (updatedProfile) {
        setUser(updatedProfile);
      }
      // Mark onboarding and profile setup as completed
      await sessionService.completeProfileSetup();
      await sessionService.completeOnboarding();
      await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
      const value = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY);
      console.log('✅ Onboarding marked as completed (submit), AsyncStorage value:', value);
      if (value === 'true') {
        router.replace('/(tabs)');
      } else {
        console.warn('❌ Failed to persist onboarding completion in AsyncStorage (submit)');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      // Even if there's an error, try to proceed
      await sessionService.completeProfileSetup();
      await sessionService.completeOnboarding();
      await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
      const value = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY);
      console.log('✅ Onboarding marked as completed (submit error), AsyncStorage value:', value);
      if (value === 'true') {
        router.replace('/(tabs)');
      } else {
        console.warn('❌ Failed to persist onboarding completion in AsyncStorage (submit error)');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    const step = steps[currentStep];
    
    switch (step.component) {
      case 'LocationStep':
        return (
          <View style={styles.stepContent}>
            <TextInput
              label="City, Country"
              value={formData.location}
              onChangeText={text => setFormData(prev => ({ ...prev, location: text }))}
              mode="outlined"
              style={styles.input}
              placeholder="e.g., New York, USA"
              theme={{
                colors: {
                  primary: '#000000',
                  outline: '#E0E0E0',
                }
              }}
            />
            {errors.location && <HelperText type="error">{errors.location}</HelperText>}
            
            <Text style={styles.helpText}>
              This helps us suggest local ingredients, seasonal recipes, and nearby stores.
            </Text>
          </View>
        );

      case 'SubscriptionStep':
        return (
          <View style={styles.stepContent}>
            <View style={styles.plansContainer}>
              {subscriptionPlans.map((plan) => {
                const PlanIcon = plan.icon;
                const isSelected = formData.subscriptionTier === plan.id;
                
                return (
                  <TouchableOpacity
                    key={plan.id}
                    style={[
                      styles.planCard,
                      isSelected && styles.planCardSelected,
                      plan.popular && styles.planCardPopular
                    ]}
                    onPress={() => setFormData(prev => ({ ...prev, subscriptionTier: plan.id }))}
                  >
                    {plan.popular && (
                      <View style={styles.popularBadge}>
                        <Text style={styles.popularBadgeText}>Most Popular</Text>
                      </View>
                    )}
                    
                    <View style={styles.planHeader}>
                      <View style={[styles.planIconContainer, isSelected && styles.planIconContainerSelected]}>
                        <PlanIcon size={24} color={isSelected ? '#FFFFFF' : '#000000'} />
                      </View>
                      <View style={styles.planInfo}>
                        <Text style={[styles.planName, isSelected && styles.planNameSelected]}>
                          {plan.name}
                        </Text>
                        <Text style={[styles.planPrice, isSelected && styles.planPriceSelected]}>
                          {plan.price}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.planFeatures}>
                      {plan.features.map((feature, index) => (
                        <Text key={index} style={[styles.planFeature, isSelected && styles.planFeatureSelected]}>
                          • {feature}
                        </Text>
                      ))}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
            
            <Text style={styles.subscriptionNote}>
              You can change your plan anytime in settings. Premium features will be available immediately.
            </Text>
          </View>
        );

      default:
        return null;
    }
  };

  const currentStepData = steps[currentStep];
  const IconComponent = currentStepData.icon;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${((currentStep + 1) / steps.length) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {currentStep + 1} of {steps.length}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Step Header */}
        <View style={styles.stepHeader}>
          <View style={styles.iconContainer}>
            <IconComponent size={32} color="#000000" />
          </View>
          <Text style={styles.stepTitle}>{currentStepData.title}</Text>
          <Text style={styles.stepSubtitle}>{currentStepData.subtitle}</Text>
        </View>

        {/* Step Content */}
        <Animated.View 
          style={[
            styles.contentContainer,
            {
              transform: [{
                translateX: slideAnim.interpolate({
                  inputRange: [0, steps.length - 1],
                  outputRange: [0, 0],
                })
              }]
            }
          ]}
        >
          {renderStepContent()}
        </Animated.View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {currentStep > 0 && (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeft size={20} color="#666666" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}
        <View style={styles.spacer} />
        {/* Always show skip button */}
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.nextButton,
            loading && styles.nextButtonDisabled
          ]} 
          onPress={handleNext}
          disabled={loading}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          {currentStep < steps.length - 1 && (
            <ArrowRight size={20} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  progressContainer: {
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#F0F0F0',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#000000',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  stepHeader: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
  },
  contentContainer: {
    flex: 1,
    paddingBottom: 40,
  },
  stepContent: {
    gap: 16,
  },
  input: {
    backgroundColor: '#FFFFFF',
  },
  helpText: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 8,
  },
  plansContainer: {
    gap: 16,
  },
  planCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  planCardSelected: {
    borderColor: '#000000',
    backgroundColor: '#F8F8F8',
  },
  planCardPopular: {
    borderColor: '#000000',
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    left: 20,
    backgroundColor: '#000000',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  planIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  planIconContainerSelected: {
    backgroundColor: '#000000',
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  planNameSelected: {
    color: '#000000',
  },
  planPrice: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666666',
  },
  planPriceSelected: {
    color: '#000000',
  },
  planFeatures: {
    gap: 8,
  },
  planFeature: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  planFeatureSelected: {
    color: '#1A1A1A',
  },
  subscriptionNote: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 16,
    marginTop: 16,
  },
  bottomNav: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  spacer: {
    flex: 1,
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 12,
  },
  skipButtonText: {
    fontSize: 16,
    color: '#999999',
    fontWeight: '500',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#000000',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  nextButtonDisabled: {
    opacity: 0.6,
  },
  nextButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default ProfileSetupScreen;