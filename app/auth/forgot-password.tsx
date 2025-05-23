import { useState } from 'react';
import { 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ImageBackground, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Alert,
  Dimensions,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react-native';
import { forgotPasswordStyles } from '@/styles/forgotPassword.styles';
import Logo from '@/assets/images/logo-2.svg';

const { width } = Dimensions.get('window');

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    // Validate email
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const goBack = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={forgotPasswordStyles.container}
    >
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }}
        style={forgotPasswordStyles.backgroundImage}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.5)']}
          style={forgotPasswordStyles.overlay}
        >
          <TouchableOpacity style={forgotPasswordStyles.backButton} onPress={goBack}>
            <ArrowLeft color="#FFFFFF" size={24} />
          </TouchableOpacity>

          <Logo
            width={width * 0.2}
            height={width * 0.08}
            style={forgotPasswordStyles.logo}
          />

          <ScrollView 
            contentContainerStyle={forgotPasswordStyles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {!isSubmitted ? (
              <View style={forgotPasswordStyles.formContainer}>
                <Text style={forgotPasswordStyles.formDescription}>
                  Enter your email address and we'll send you a link to reset your password
                </Text>
                
                <View style={forgotPasswordStyles.inputContainer}>
                  <Text style={forgotPasswordStyles.inputLabel}>Email Address</Text>
                  <View style={forgotPasswordStyles.inputWrapper}>
                    <Mail size={20} color="rgba(255, 255, 255, 0.7)" style={forgotPasswordStyles.inputIcon} />
                    <TextInput
                      style={forgotPasswordStyles.input}
                      placeholder="Enter your email address"
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={email}
                      onChangeText={setEmail}
                    />
                  </View>
                </View>
                
                <TouchableOpacity 
                  style={[
                    forgotPasswordStyles.submitButton,
                    isLoading && forgotPasswordStyles.submitButtonDisabled
                  ]} 
                  onPress={handleSubmit}
                  disabled={isLoading}
                >
                  <Text style={forgotPasswordStyles.submitButtonText}>
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={forgotPasswordStyles.backToLoginContainer} 
                  onPress={goBack}
                >
                  <Text style={forgotPasswordStyles.backToLoginText}>
                    Back to Login
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={forgotPasswordStyles.successContainer}>
                <CheckCircle size={80} color="#FF6A00" />
                <Text style={forgotPasswordStyles.successTitle}>Email Sent!</Text>
                <Text style={forgotPasswordStyles.successDescription}>
                  We've sent a password reset link to {email}. Please check your inbox and follow the instructions.
                </Text>
                
                <TouchableOpacity 
                  style={forgotPasswordStyles.backToLoginButton} 
                  onPress={() => router.push('/auth')}
                >
                  <Text style={forgotPasswordStyles.backToLoginButtonText}>
                    Back to Login
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </LinearGradient>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}