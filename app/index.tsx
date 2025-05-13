import { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as SplashScreen from 'expo-splash-screen';
import { onboardingStyles } from '@/styles/onboarding.styles';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const onboardingScreens = [
  {
    image: require('@/assets/images/onboarding1.jpg'),
    title: "Find recipes with your ingredients or meals easily",
    description: "Just snap a quick photo of your meal or ingredients and discover new recipes instantly!",
    showCameraFrame: true
  },
  {
    image: require('@/assets/images/onboarding2.jpg'),
    title: "Smart Shopping List",
    description: "Create your shopping list and stay on track, so you never forget to buy anything again!",
    showCameraFrame: false
  },
  {
    image: require('@/assets/images/onboarding3.jpg'),
    title: "Save Your Favorite Recipes",
    description: "Save your favorite recipes to cook whenever you like or share them with friends for extra inspiration!",
    showCameraFrame: false
  }
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentScreen, setCurrentScreen] = useState(0);

  const onLayoutRootView = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  const handleNext = () => {
    if (currentScreen < onboardingScreens.length - 1) {
      setCurrentScreen(currentScreen + 1);
    } else {
      router.push('/auth');
    }
  };

  const renderCameraFrame = () => {
    if (!onboardingScreens[currentScreen].showCameraFrame) return null;
    
    return (
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
    );
  };

  return (
    <View style={onboardingStyles.container} onLayout={onLayoutRootView}>
      <ImageBackground
        source={onboardingScreens[currentScreen].image}
        style={onboardingStyles.backgroundImage}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.25)', 'rgba(0,0,0,0.25)']}
          style={onboardingStyles.overlay}
        />
        <Text style={onboardingStyles.welcomeText}>Welcome to MealLens</Text>
        {renderCameraFrame()}
      </ImageBackground>

      <View style={onboardingStyles.contentCard}>
        <Text style={onboardingStyles.headingText}>
          {onboardingScreens[currentScreen].title}
        </Text>
        <Text style={onboardingStyles.descriptionText}>
          {onboardingScreens[currentScreen].description}
        </Text>
        
        <View style={onboardingStyles.paginationContainer}>
          {onboardingScreens.map((_, index) => (
            <View 
              key={index} 
              style={[
                onboardingStyles.paginationDot, 
                currentScreen === index && onboardingStyles.activeDot
              ]} 
            />
          ))}
        </View>
        
        <TouchableOpacity style={onboardingStyles.nextButton} onPress={handleNext}>
          <Text style={onboardingStyles.nextButtonText}>
            {currentScreen === onboardingScreens.length - 1 ? "Get Started" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}