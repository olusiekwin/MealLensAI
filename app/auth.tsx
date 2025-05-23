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
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User } from 'lucide-react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { authStyles } from '@/styles/auth.styles';
import Logo from '@/assets/images/logo-2.svg';

const { width } = Dimensions.get('window');

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

  const validatePasswords = () => {
    if (!isLogin && password !== confirmPassword) {
      setPasswordError("Passwords don't match");
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = () => {
    // Validate inputs
    if (isLogin) {
      if (!email.trim() || !password.trim()) {
        Alert.alert('Error', 'Please enter both email and password');
        return;
      }
    } else {
      if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }
      
      if (!validatePasswords()) {
        return;
      }
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      router.push('/(tabs)');
    }, 1500);
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
            <ArrowLeft color="#FFFFFF" size={20} />
          </TouchableOpacity>

          <Logo width={width * 0.25} height={width * 0.1} style={authStyles.logo} />

          <ScrollView 
            contentContainerStyle={authStyles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={authStyles.formContainer}>
              <Text style={authStyles.formTitle}>
                {isLogin ? "Welcome Back" : "Create Account"}
              </Text>
              
              {!isLogin && (
                <View style={authStyles.inputContainer}>
                  <Text style={authStyles.inputLabel}>Full Name</Text>
                  <View style={authStyles.inputWrapper}>
                    <User size={18} color="rgba(255, 255, 255, 0.7)" style={authStyles.inputIcon} />
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
                  <Mail size={18} color="rgba(255, 255, 255, 0.7)" style={authStyles.inputIcon} />
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
                  <Lock size={18} color="rgba(255, 255, 255, 0.7)" style={authStyles.inputIcon} />
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
                      <EyeOff size={18} color="rgba(255, 255, 255, 0.7)" />
                    ) : (
                      <Eye size={18} color="rgba(255, 255, 255, 0.7)" />
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
                    <Lock size={18} color="rgba(255, 255, 255, 0.7)" style={authStyles.inputIcon} />
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
                        <EyeOff size={18} color="rgba(255, 255, 255, 0.7)" />
                      ) : (
                        <Eye size={18} color="rgba(255, 255, 255, 0.7)" />
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
                <Text style={authStyles.submitButtonText}>
                  {isLoading ? "Please wait..." : (isLogin ? "Login" : "Register")}
                </Text>
              </TouchableOpacity>
              
              <View style={authStyles.dividerContainer}>
                <View style={authStyles.divider} />
                <Text style={authStyles.dividerText}>OR</Text>
                <View style={authStyles.divider} />
              </View>
              
              <View style={authStyles.socialButtonsContainer}>
                <TouchableOpacity style={authStyles.socialButton}>
                  <AntDesign name="google" size={22} color="#DB4437" />
                </TouchableOpacity>
                
                <TouchableOpacity style={authStyles.socialButton}>
                  <FontAwesome name="facebook" size={24} color="#1877F2" />
                </TouchableOpacity>
                
                <TouchableOpacity style={[authStyles.socialButton, { backgroundColor: Platform.OS === 'ios' ? '#000' : '#FFFFFF' }]}>
                  <AntDesign 
                    name="apple1" 
                    size={24} 
                    color={Platform.OS === 'ios' ? '#FFFFFF' : '#000'} 
                  />
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