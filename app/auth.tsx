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
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User } from 'lucide-react-native';
import { authStyles } from '@/styles/auth.styles';
import { authService } from '@/services/api';

export default function AuthScreen() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');

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
      if (!name.trim()) {
        setGeneralError('Please enter your name');
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
    
    try {
      if (isLogin) {
        // Login
        await authService.login({ email, password });
        router.push('/(tabs)');
      } else {
        // Register
        await authService.register({ name, email, password, confirmPassword });
        Alert.alert(
          "Registration Successful",
          "Your account has been created successfully!",
          [{ text: "OK", onPress: () => router.push('/(tabs)') }]
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        setGeneralError(error.message);
      } else {
        setGeneralError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push('/auth/forgot-password');
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    // Clear fields when switching modes
    setPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setGeneralError('');
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
                    <User size={20} color="rgba(255, 255, 255, 0.7)" style={authStyles.inputIcon} />
                    <TextInput
                      style={authStyles.input}
                      placeholder="Enter your full name"
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                      value={name}
                      onChangeText={setName}
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