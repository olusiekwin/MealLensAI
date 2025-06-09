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
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User } from 'lucide-react-native';
import { authStyles } from '@/styles/auth.styles';
import { authService } from '@/services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AuthScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [emailNotConfirmed, setEmailNotConfirmed] = useState(false);

  const validateForm = () => {
    setGeneralError('');
    setPasswordError('');

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      setGeneralError('Please enter a valid email address');
      return false;
    }

    // Password validation
    if (!password.trim() || password.length < 6) {
      setGeneralError('Password must be at least 6 characters');
      return false;
    }

    // Registration-specific validations
    if (!isLogin) {
      if (!username.trim()) {
        setGeneralError('Please enter your username');
        return false;
      }

      if (password !== confirmPassword) {
        setPasswordError("Passwords don't match");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setGeneralError(''); // Clear previous general errors
    setEmailNotConfirmed(false);
    
    try {
      if (isLogin) {
        // Login
        const responseData = await authService.login({ email, password });
        if (responseData && responseData.token) {
          await AsyncStorage.setItem('auth_token', responseData.token);
          // Optionally store user data if your backend sends it
          // if (responseData.user) {
          //   await AsyncStorage.setItem('user_data', JSON.stringify(responseData.user));
          // }
          router.push('/(tabs)');
        } else {
          // Handle case where token is not in response or responseData is falsy
          const error = responseData?.error || responseData?.message;
          let errorMessage = 'Login failed. Please try again.';
          
          if (typeof error === 'string') {
            errorMessage = error;
          } else if (error?.message) {
            errorMessage = error.message;
          }
          
          setGeneralError(errorMessage);
          
          if (errorMessage.toLowerCase().includes('email not confirmed')) {
            setEmailNotConfirmed(true);
          }
        }
      } else {
        // Register
        let dietaryPreferences: string[] = [];
        let cookingSkill: string = '';

        if (typeof params.dietaryPreferences === 'string') {
          try {
            dietaryPreferences = JSON.parse(params.dietaryPreferences);
          } catch (e) {
            console.error("Failed to parse dietaryPreferences from params:", e);
          }
        }
        if (typeof params.cookingSkill === 'string') {
          cookingSkill = params.cookingSkill;
        }

        const registrationData = {
          username: username,
          email,
          password,
          confirm_password: confirmPassword, // Send confirmPassword from state as confirm_password
        };

        const responseData = await authService.register(registrationData);
        if (responseData && responseData.token) {
          await AsyncStorage.setItem('auth_token', responseData.token);
          // Optionally store user data if your backend sends it
          // if (responseData.user) {
          //   await AsyncStorage.setItem('user_data', JSON.stringify(responseData.user));
          // }
          Alert.alert(
            "Registration Successful",
            "Your account has been created successfully!",
            [{ text: "OK", onPress: () => router.push('/(tabs)') }]
          );
        } else {
          // Handle case where token is not in response or responseData is falsy
          setGeneralError(responseData?.message || 'Registration failed. Please try again.');
        }
      }
    } catch (error: any) { // Explicitly type error
      if (error.response && error.response.data && error.response.data.message) {
        // Handle errors from backend (e.g., validation errors, user exists)
        setGeneralError(error.response.data.message);
      } else if (error instanceof Error) {
        setGeneralError(error.message);
      } else {
        setGeneralError('An unexpected error occurred. Please try again.');
      }
      console.error('Auth Error:', error.response?.data || error.message || error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push('/auth/forgot-password');
  };

  const handleResendConfirmation = async () => {
    if (!email) {
      setGeneralError('Please enter your email address first.');
      return;
    }
    setIsLoading(true);
    setGeneralError('');
    try {
      const response = await authService.resendConfirmationEmail(email);
      Alert.alert('Email Sent', response.message || 'A new confirmation email has been sent to your address.');
    } catch (error: any) {
      const errorMessage = typeof error === 'string' ? error : (error.message || 'An error occurred.');
      setGeneralError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    // Clear fields when switching modes
    setEmail("")
    setPassword("")
    setConfirmPassword("")
    setUsername("")
    setPasswordError("")
    setGeneralError("")
  };

  const handleSocialLogin = async (provider: "google" | "apple" | "facebook") => {
    try {
      setIsLoading(true)
      setGeneralError("")

      let result

      switch (provider) {
        case "google":
          result = await authService.signInWithGoogle()
          break
        case "apple":
          // Assuming authService has signInWithApple - based on socialAuthService.ts
          // result = await authService.signInWithApple();
          console.warn("Apple Sign In is not fully integrated in authService yet.")
          Alert.alert("Coming Soon!", "Apple Sign-In is not available yet.")
          break
        case "facebook":
          // Assuming authService will have signInWithFacebook
          console.warn("Facebook Sign In is not implemented yet.")
          Alert.alert("Coming Soon!", "Facebook Sign-In is not available yet.")
          break
        default:
          throw new Error("Unsupported provider")
      }

      if (result?.token) {
        router.replace("/(tabs)")
      }
    } catch (error) {
      console.error(`${provider} login error:`, error)
      let errorMessage = `Failed to sign in with ${provider}.`
      if (error instanceof Error) {
        errorMessage = error.message || errorMessage
      }
      Alert.alert("Error", errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      // If there's no screen to go back to (e.g., /auth was the first screen after a replace),
      // navigate to the initial route or a sensible default.
      router.replace('/'); // Navigates to app/index.tsx
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={authStyles.container}
    >
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }}
        style={authStyles.backgroundImage}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.5)']}
          style={authStyles.overlay}
        >
          <TouchableOpacity style={authStyles.backButton} onPress={goBack}>
            <ArrowLeft color="#FFFFFF" size={24} />
          </TouchableOpacity>
          
          <Text style={authStyles.appTitle}>MealLensAI</Text>
          
          <ScrollView 
            contentContainerStyle={authStyles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={authStyles.formContainer}>
              <Text style={authStyles.formTitle}>
                {isLogin ? "Welcome Back" : "Create Account"}
              </Text>
              
              {generalError ? (
                <View style={authStyles.errorContainer}>
                  <Text style={authStyles.errorText}>{generalError}</Text>
                </View>
              ) : null}
              
              {!isLogin && (
                <View style={authStyles.inputContainer}>
                  <Text style={authStyles.inputLabel}>Full Name</Text>
                  <View style={authStyles.inputWrapper}>
                    <User style={authStyles.inputIcon} color="#FFFFFF" size={20} />
                    <TextInput
                      style={authStyles.input}
                      placeholder="Username"
                      placeholderTextColor="rgba(255, 255, 255, 0.6)"
                      value={username}
                      onChangeText={setUsername}
                      autoCapitalize="none"
                    />
                  </View>
                </View>
              )}
              
              <View style={authStyles.inputContainer}>
                <Text style={authStyles.inputLabel}>
                  {isLogin ? "Email or Phone Number" : "Email Address"}
                </Text>
                <View style={authStyles.inputWrapper}>
                  <Mail size={20} color="rgba(255, 255, 255, 0.7)" style={authStyles.inputIcon} />
                  <TextInput
                    style={authStyles.input}
                    placeholder={isLogin ? "Enter your email" : "Enter your email address"}
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
              </View>
              
              <View style={authStyles.inputContainer}>
                <Text style={authStyles.inputLabel}>Password</Text>
                <View style={authStyles.inputWrapper}>
                  <Lock size={20} color="rgba(255, 255, 255, 0.7)" style={authStyles.inputIcon} />
                  <TextInput
                    style={authStyles.input}
                    placeholder="Enter your password"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity 
                    style={authStyles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color="rgba(255, 255, 255, 0.7)" />
                    ) : (
                      <Eye size={20} color="rgba(255, 255, 255, 0.7)" />
                    )}
                  </TouchableOpacity>
                </View>
                
                {isLogin && (
                  <TouchableOpacity 
                    style={authStyles.forgotPassword}
                    onPress={handleForgotPassword}
                  >
                    <Text style={authStyles.forgotPasswordText}>Forgot Password?</Text>
                  </TouchableOpacity>
                )}
                {emailNotConfirmed && (
                  <TouchableOpacity
                    style={authStyles.forgotPassword}
                    onPress={handleResendConfirmation}
                    disabled={isLoading}
                  >
                    <Text style={authStyles.forgotPasswordText}>Resend confirmation email</Text>
                  </TouchableOpacity>
                )}
              </View>
              
              {!isLogin && (
                <View style={authStyles.inputContainer}>
                  <Text style={authStyles.inputLabel}>Confirm Password</Text>
                  <View style={authStyles.inputWrapper}>
                    <Lock size={20} color="rgba(255, 255, 255, 0.7)" style={authStyles.inputIcon} />
                    <TextInput
                      style={authStyles.input}
                      placeholder="Confirm your password"
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                      secureTextEntry={!showConfirmPassword}
                      value={confirmPassword}
                      onChangeText={(text) => {
                        setConfirmPassword(text);
                        if (passwordError && text === password) {
                          setPasswordError('');
                        }
                      }}
                    />
                    <TouchableOpacity 
                      style={authStyles.eyeIcon}
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} color="rgba(255, 255, 255, 0.7)" />
                      ) : (
                        <Eye size={20} color="rgba(255, 255, 255, 0.7)" />
                      )}
                    </TouchableOpacity>
                  </View>
                  {passwordError ? (
                    <Text style={authStyles.errorText}>{passwordError}</Text>
                  ) : null}
                </View>
              )}
              
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
                    {isLogin ? "Login" : "Register"}
                  </Text>
                )}
              </TouchableOpacity>
              
              <View style={authStyles.dividerContainer}>
                <View style={authStyles.divider} />
                <Text style={authStyles.dividerText}>OR</Text>
                <View style={authStyles.divider} />
              </View>
              
              <View style={authStyles.socialButtonsContainer}>
                <TouchableOpacity style={authStyles.socialButton}>
                  <Image 
                    source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }} 
                    style={authStyles.googleIcon} 
                  />
                </TouchableOpacity>
                
                <TouchableOpacity style={authStyles.socialButton}>
                  <View style={authStyles.facebookIcon}>
                    <Text style={authStyles.facebookIconText}>f</Text>
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity style={authStyles.socialButton}>
                  <View style={authStyles.appleIcon}>
                    <Image 
                      source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Apple-logo.png' }} 
                      style={authStyles.appleLogoIcon} 
                    />
                  </View>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity 
                style={authStyles.switchModeContainer} 
                onPress={toggleAuthMode}
              >
                <Text style={authStyles.switchModeText}>
                  {isLogin 
                    ? "Don't have an account? " 
                    : "Already have an account? "}
                  <Text style={authStyles.switchModeHighlight}>
                    {isLogin ? "Register" : "Login"}
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </LinearGradient>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}