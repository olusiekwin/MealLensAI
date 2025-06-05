import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  ScrollView
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Send, CookingPot } from 'lucide-react-native';
import { recipesStyles } from '@/styles/recipes.styles';
import aiService from '@/services/aiService';
import { useUserStore } from '@/context/userStore';

export default function TextDetectionScreen() {
  const [textInput, setTextInput] = useState('');
  const [processingText, setProcessingText] = useState(false);
  const [mode, setMode] = useState<'food' | 'recipe'>('food');
  const router = useRouter();
  const params = useLocalSearchParams();
  const { isAuthenticated, trackUsage, usage, subscription } = useUserStore();

  useEffect(() => {
    if (params.mode === 'food' || params.mode === 'recipe') {
      setMode(params.mode as 'food' | 'recipe');
    }
  }, [params]);

  const handleSubmit = async () => {
    if (!textInput.trim()) {
      Alert.alert('Error', 'Please enter some ingredients or a recipe name');
      return;
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
      Alert.alert(
        'Login Required',
        'Please login to use this feature',
        [{ text: 'Login', onPress: () => router.push('/login') }]
      );
      return;
    }

    // Check daily limit
    try {
      await trackUsage();
      if (usage.reachedDailyLimit && subscription.status === 'free') {
        // Let the UsageLimitBanner handle this
        return;
      }
    } catch (error) {
      console.error('Error tracking usage:', error);
    }
    
    setProcessingText(true);
    try {
      // Split the input by commas to get an array of ingredients
      const ingredients = textInput.split(',').map(item => item.trim()).filter(item => item);
      
      // Process the ingredients using the text endpoint
      const result = await aiService.processFood(ingredients, 'text');
      
      // Navigate to detection details with the result
      if (result && result.id) {
        router.push({
          pathname: '/detection-details',
          params: { detectionId: result.id }
        });
      } else {
        Alert.alert('Error', 'Failed to process ingredients');
      }
    } catch (error) {
      console.error('Error processing text input:', error);
      Alert.alert('Error', 'Failed to process ingredients');
    } finally {
      setProcessingText(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBack}
        >
          <ArrowLeft size={24} color="#202026" />
        </TouchableOpacity>
        <Text style={styles.title}>
          {mode === 'food' ? 'Food Finder' : 'Recipe Finder'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.instructionContainer}>
          <CookingPot size={30} color="#FF5353" />
          <Text style={styles.instructionTitle}>
            {mode === 'food' 
              ? 'Enter ingredients to find recipes' 
              : 'Describe a meal to find its recipe'}
          </Text>
          <Text style={styles.instructionText}>
            {mode === 'food' 
              ? 'Separate multiple ingredients with commas (e.g., chicken, rice, broccoli)' 
              : 'Describe the meal you want to make (e.g., Chicken Parmesan)'}
          </Text>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.inputContainer}
        >
          <Text style={recipesStyles.inputLabel}>
            {mode === 'food' ? 'Enter ingredients' : 'Enter recipe name'}
          </Text>
          <View style={recipesStyles.textInputWrapper}>
            <TextInput
              style={recipesStyles.textInputField}
              placeholder={mode === 'food' 
                ? "Enter ingredients separated by commas..." 
                : "Enter recipe name or description..."}
              value={textInput}
              onChangeText={setTextInput}
              multiline
              numberOfLines={5}
              placeholderTextColor="#B5B5B5"
              autoFocus
            />
          </View>
          
          <TouchableOpacity 
            style={[
              recipesStyles.detectButton, 
              (!textInput.trim() || processingText) && recipesStyles.disabledButton
            ]}
            onPress={handleSubmit}
            disabled={!textInput.trim() || processingText}
          >
            {processingText ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={recipesStyles.detectButtonText}>
                {mode === 'food' ? 'Find Recipes' : 'Find Recipe'}
              </Text>
            )}
          </TouchableOpacity>
        </KeyboardAvoidingView>

        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>Tips:</Text>
          {mode === 'food' ? (
            <>
              <Text style={styles.tipText}>• Be specific about ingredients</Text>
              <Text style={styles.tipText}>• Include quantities if known</Text>
              <Text style={styles.tipText}>• Add any dietary preferences</Text>
              <Text style={styles.tipText}>• Include cooking methods if relevant</Text>
            </>
          ) : (
            <>
              <Text style={styles.tipText}>• Be specific about the dish name</Text>
              <Text style={styles.tipText}>• Include cuisine type if known</Text>
              <Text style={styles.tipText}>• Mention key ingredients</Text>
              <Text style={styles.tipText}>• Add any dietary restrictions</Text>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#202026',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  instructionContainer: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202026',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 14,
    color: '#6E6E6E',
    textAlign: 'center',
    paddingHorizontal: 16,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  tipsContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 16,
    marginBottom: 24,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202026',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#202026',
    marginBottom: 4,
    lineHeight: 20,
  },
});
