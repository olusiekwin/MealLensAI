import { useCallback, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Dimensions, TextInput, StyleSheet } from 'react-native';
// Import Platform for platform-specific code
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as SplashScreen from 'expo-splash-screen';
import { Camera, ChevronRight, Search, Check } from 'lucide-react-native';
import { onboardingStyles } from '@/styles/onboarding.styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const { width } = Dimensions.get('window');

const dietaryPreferences = [
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'pescatarian', label: 'Pescatarian' },
  { id: 'keto', label: 'Keto' },
  { id: 'paleo', label: 'Paleo' },
  { id: 'gluten_free', label: 'Gluten-Free' },
  { id: 'dairy_free', label: 'Dairy-Free' },
  { id: 'no_restrictions', label: 'No Restrictions' }
];

const cookingSkills = [
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' }
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentScreen, setCurrentScreen] = useState(0);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [cookingSkill, setCookingSkill] = useState<string>('');
  const [ingredientInput, setIngredientInput] = useState('');
  const [inputMethod, setInputMethod] = useState<string>('');
  // Always ready to prevent loading issues
  const [appIsReady, setAppIsReady] = useState(true);

  useEffect(() => {
    // Hide splash screen immediately
    SplashScreen.hideAsync().catch(e => {});
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      try {
        await SplashScreen.hideAsync();
        console.log('✅ Main app: Splash screen hidden successfully');
      } catch (e) {
        console.warn('❌ Main app: Error hiding splash screen:', e);
      }
    }
  }, [appIsReady]);

  const handleNext = async () => {
    if (currentScreen < 2) {
      // Move to next onboarding screen
      setCurrentScreen(currentScreen + 1);
    } else {
      // Save onboarding completion status
      try {
        await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
        console.log('✅ Onboarding completed and saved to storage');
        
        // Save user preferences if they were selected
        if (selectedPreferences.length > 0) {
          await AsyncStorage.setItem('userPreferences', JSON.stringify(selectedPreferences));
        }
        
        if (cookingSkill) {
          await AsyncStorage.setItem('cookingSkill', cookingSkill);
        }
        
        // Navigate to auth screen
        router.replace('/auth');
      } catch (error) {
        console.error('❌ Error saving onboarding data:', error);
        // Even if there's an error, try to proceed to auth
        router.replace('/auth');
      }
    }
  };

  const togglePreference = (id: string) => {
    if (selectedPreferences.includes(id)) {
      setSelectedPreferences(selectedPreferences.filter(item => item !== id));
    } else {
      setSelectedPreferences([...selectedPreferences, id]);
    }
  };

  const selectCookingSkill = (id: string) => {
    setCookingSkill(id);
  };

  const selectInputMethod = (method: string) => {
    setInputMethod(method);
    if (currentScreen === 3) {
      // If this is the last screen, navigate to auth after selecting input method
      setTimeout(() => {
        router.push('/auth');
      }, 500);
    } else {
      handleNext();
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 0:
        return (
          <View style={onboardingStyles.contentCard}>
            <Text style={onboardingStyles.headingText}>
              Welcome to MealLens
            </Text>
            <Text style={onboardingStyles.descriptionText}>
              Discover recipes from ingredients or meals with just a photo or text input. Let's set up your preferences!
            </Text>
            
            <TouchableOpacity style={onboardingStyles.nextButton} onPress={handleNext}>
              <Text style={onboardingStyles.nextButtonText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        );
      case 1:
        return (
          <View style={onboardingStyles.contentCard}>
            <Text style={onboardingStyles.headingText}>
              Dietary Preferences
            </Text>
            <Text style={onboardingStyles.descriptionText}>
              Select any dietary preferences or restrictions you have:
            </Text>
            
            <View style={styles.preferencesContainer}>
              {dietaryPreferences.map(preference => (
                <TouchableOpacity
                  key={preference.id}
                  style={[
                    styles.preferenceButton,
                    selectedPreferences.includes(preference.id) && styles.preferenceButtonSelected
                  ]}
                  onPress={() => togglePreference(preference.id)}
                >
                  <Text 
                    style={[
                      styles.preferenceButtonText,
                      selectedPreferences.includes(preference.id) && styles.preferenceButtonTextSelected
                    ]}
                  >
                    {preference.label}
                  </Text>
                  {selectedPreferences.includes(preference.id) && (
                    <Check size={16} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
            
            <TouchableOpacity style={onboardingStyles.nextButton} onPress={handleNext}>
              <Text style={onboardingStyles.nextButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        );
      case 2:
        return (
          <View style={onboardingStyles.contentCard}>
            <Text style={onboardingStyles.headingText}>
              Cooking Experience
            </Text>
            <Text style={onboardingStyles.descriptionText}>
              What's your level of cooking experience?
            </Text>
            
            <View style={styles.skillsContainer}>
              {cookingSkills.map(skill => (
                <TouchableOpacity
                  key={skill.id}
                  style={[
                    styles.skillButton,
                    cookingSkill === skill.id && styles.skillButtonSelected
                  ]}
                  onPress={() => selectCookingSkill(skill.id)}
                >
                  <Text 
                    style={[
                      styles.skillButtonText,
                      cookingSkill === skill.id && styles.skillButtonTextSelected
                    ]}
                  >
                    {skill.label}
                  </Text>
                  {cookingSkill === skill.id && (
                    <View style={styles.skillSelectedIndicator} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
            
            <TouchableOpacity 
              style={[
                onboardingStyles.nextButton,
                !cookingSkill && styles.disabledButton
              ]} 
              onPress={handleNext}
              disabled={!cookingSkill}
            >
              <Text style={onboardingStyles.nextButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  // Fallback UI in case of rendering errors
  const [hasError, setHasError] = useState(false);

  // Simple error handler for the main component
  useEffect(() => {
    const handleError = (error: any) => {
      console.error('Caught error in main component:', error);
      setHasError(true);
    };

    // Use a safer approach for error handling that works across all React Native environments
    const errorHandler = (error: Error, isFatal?: boolean) => {
      handleError(error);
      console.log('Error caught:', error.message, 'Fatal:', isFatal);
    };
    
    // Set up error boundary
    if (Platform.OS !== 'web') {
      // Only use this approach on native platforms
      const originalHandler = global.ErrorUtils?.getGlobalHandler?.();
      
      if (global.ErrorUtils?.setGlobalHandler) {
        global.ErrorUtils.setGlobalHandler((error, isFatal) => {
          errorHandler(error, isFatal);
          // Still call original handler if it exists
          if (originalHandler) {
            originalHandler(error, isFatal);
          }
        });
      }
      
      return () => {
        // Restore the original handler when component unmounts
        if (global.ErrorUtils?.setGlobalHandler && originalHandler) {
          global.ErrorUtils.setGlobalHandler(originalHandler);
        }
      };
    }
  }, []);

  if (hasError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1A1A1A' }}>
        <Text style={{ color: '#000000', fontSize: 20, marginBottom: 10 }}>Something went wrong</Text>
        <Text style={{ color: 'white', textAlign: 'center', marginBottom: 20 }}>The app encountered an error.</Text>
        <TouchableOpacity 
          style={{ padding: 12, backgroundColor: '#000000', borderRadius: 8 }}
          onPress={() => {
            setHasError(false);
            window.location.reload();
          }}
        >
          <Text style={{ color: 'white' }}>Reload App</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={onboardingStyles.container} onLayout={onLayoutRootView}>
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }}
        style={onboardingStyles.backgroundImage}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.25)', 'rgba(0,0,0,0.25)']}
          style={onboardingStyles.overlay}
        />
        
        {currentScreen === 0 && (
          <>
            <Text style={onboardingStyles.welcomeText}>MealLens AI</Text>
            
            <View style={onboardingStyles.cameraFrame}>
              <View style={[onboardingStyles.corner, onboardingStyles.topLeft]}>
                <View style={onboardingStyles.horizontalLine} />
                <View style={onboardingStyles.verticalLine} />
              </View>
              <View style={[onboardingStyles.corner, onboardingStyles.topRight]}>
                <View style={onboardingStyles.horizontalLine} />
                <View style={onboardingStyles.verticalLine} />
              </View>
              <View style={[onboardingStyles.corner, onboardingStyles.bottomLeft]}>
                <View style={onboardingStyles.horizontalLine} />
                <View style={onboardingStyles.verticalLine} />
              </View>
              <View style={[onboardingStyles.corner, onboardingStyles.bottomRight]}>
                <View style={onboardingStyles.horizontalLine} />
                <View style={onboardingStyles.verticalLine} />
              </View>
            </View>
          </>
        )}
      </ImageBackground>

      {renderScreen()}
      
      {currentScreen > 0 && currentScreen < 3 && (
        <View style={styles.progressContainer}>
          {[1, 2, 3].map((step) => (
            <View 
              key={step} 
              style={[
                styles.progressStep,
                currentScreen >= step && styles.progressStepActive
              ]} 
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  preferencesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  preferenceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  preferenceButtonSelected: {
    backgroundColor: '#202026',
  },
  preferenceButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#202026',
    marginRight: 6,
  },
  preferenceButtonTextSelected: {
    color: '#FFFFFF',
  },
  skillsContainer: {
    marginVertical: 20,
  },
  skillButton: {
    position: 'relative',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  skillButtonSelected: {
    backgroundColor: 'rgba(32, 32, 38, 0.1)',
    borderWidth: 1,
    borderColor: '#202026',
  },
  skillButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#202026',
    textAlign: 'center',
  },
  skillButtonTextSelected: {
    color: '#202026',
    fontWeight: '600',
  },
  skillSelectedIndicator: {
    position: 'absolute',
    top: -1,
    right: -1,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#202026',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
  },
  progressStep: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  progressStepActive: {
    backgroundColor: '#202026',
    width: 24,
  },
  inputMethodsContainer: {
    marginVertical: 20,
  },
  inputMethodCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  inputMethodIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(32, 32, 38, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  inputMethodTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202026',
    marginBottom: 8,
  },
  inputMethodDescription: {
    fontSize: 14,
    color: '#6A6A6A',
    lineHeight: 20,
    marginRight: 20,
  },
  inputMethodArrow: {
    position: 'absolute',
    right: 20,
    top: '50%',
    marginTop: -10,
  },
  ingredientInputContainer: {
    marginVertical: 20,
  },
  ingredientInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#202026',
    marginBottom: 16,
  },
});