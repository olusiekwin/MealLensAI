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
  ActivityIndicator,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react-native';
import { authStyles } from '@/styles/auth.styles';
import { authService } from '@/services/authService';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = () => {
    setError('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateEmail()) {
      return;
    }

    setIsLoading(true);
    
    try {
      await authService.forgotPassword(email);
      setIsSubmitted(true);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to send reset email. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={authStyles.container}
    >
      <ImageBackground
        source={require('../../assets/images/loginbg.png')}
        style={authStyles.backgroundImage}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.6)']}
          style={authStyles.overlay}
        >
          <TouchableOpacity style={authStyles.backButton} onPress={goBack}>
            <ArrowLeft color="#FFFFFF" size={24} />
          </TouchableOpacity>
          
          <View style={authStyles.logoContainer}>
            <Image 
              source={require('../../assets/images/logo-2.svg')} 
              style={authStyles.logo}
            />
          </View>
          
          <ScrollView 
            contentContainerStyle={authStyles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {!isSubmitted ? (
              <View style={authStyles.formContainer}>
                <Text style={authStyles.formTitle}>Forgot Password</Text>
                <Text style={[authStyles.formDescription, { marginBottom: 24 }]}>
                  Enter your email address and we'll send you a link to reset your password
                </Text>
                
                {error ? (
                  <View style={authStyles.errorContainer}>
                    <Text style={authStyles.errorText}>{error}</Text>
                  </View>
                ) : null}
                
                <View style={authStyles.inputContainer}>
                  <Text style={authStyles.inputLabel}>Email Address</Text>
                  <View style={authStyles.inputWrapper}>
                    <Mail size={20} color="rgba(255, 255, 255, 0.7)" style={authStyles.inputIcon} />
                    <TextInput
                      style={authStyles.input}
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
                    authStyles.submitButton,
                    isLoading && authStyles.submitButtonDisabled
                  ]} 
                  onPress={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={authStyles.submitButtonText}>
                      Send Reset Link
                    </Text>
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={authStyles.switchModeContainer} 
                  onPress={goBack}
                >
                  <Text style={authStyles.switchModeText}>
                    Back to Login
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={authStyles.successContainer}>
                <CheckCircle size={80} color="#000000" />
                <Text style={authStyles.successTitle}>Email Sent!</Text>
                <Text style={authStyles.successDescription}>
                  We've sent a password reset link to {email}. Please check your inbox and follow the instructions.
                </Text>
                
                <TouchableOpacity 
                  style={authStyles.switchModeContainer} 
                  onPress={() => router.push('/auth')}
                >
                  <Text style={authStyles.switchModeText}>
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