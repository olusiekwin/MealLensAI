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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react-native';
import { resetPasswordStyles } from '@/styles/resetPassword.styles';
import Logo from '@/assets/images/logo-2.svg';

const { width } = Dimensions.get('window');

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { token } = useLocalSearchParams();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const validatePasswords = () => {
    if (password !== confirmPassword) {
      setPasswordError("Passwords don't match");
      return false;
    }
    
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return false;
    }
    
    setPasswordError('');
    return true;
  };

  const handleSubmit = () => {
    // Validate inputs
    if (!password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Please enter both password fields');
      return;
    }
    
    if (!validatePasswords()) {
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
      style={resetPasswordStyles.container}
    >
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }}
        style={resetPasswordStyles.backgroundImage}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.5)']}
          style={resetPasswordStyles.overlay}
        >
          <TouchableOpacity style={resetPasswordStyles.backButton} onPress={goBack}>
            <ArrowLeft color="#FFFFFF" size={24} />
          </TouchableOpacity>

          <Logo
            width={width * 0.2}
            height={width * 0.08}
            style={resetPasswordStyles.logo}
          />

          <ScrollView 
            contentContainerStyle={resetPasswordStyles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {!isSubmitted ? (
              <View style={resetPasswordStyles.formContainer}>
                <Text style={resetPasswordStyles.formDescription}>
                  Create a new password for your account
                </Text>
                
                <View style={resetPasswordStyles.inputContainer}>
                  <Text style={resetPasswordStyles.inputLabel}>New Password</Text>
                  <View style={resetPasswordStyles.inputWrapper}>
                    <Lock size={20} color="rgba(255, 255, 255, 0.7)" style={resetPasswordStyles.inputIcon} />
                    <TextInput
                      style={resetPasswordStyles.input}
                      placeholder="Enter new password"
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                      secureTextEntry={!showPassword}
                      value={password}
                      onChangeText={setPassword}
                    />
                    <TouchableOpacity 
                      style={resetPasswordStyles.eyeIcon}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff size={20} color="rgba(255, 255, 255, 0.7)" />
                      ) : (
                        <Eye size={20} color="rgba(255, 255, 255, 0.7)" />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={resetPasswordStyles.inputContainer}>
                  <Text style={resetPasswordStyles.inputLabel}>Confirm New Password</Text>
                  <View style={resetPasswordStyles.inputWrapper}>
                    <Lock size={20} color="rgba(255, 255, 255, 0.7)" style={resetPasswordStyles.inputIcon} />
                    <TextInput
                      style={resetPasswordStyles.input}
                      placeholder="Confirm new password"
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
                      style={resetPasswordStyles.eyeIcon}
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
                    <Text style={resetPasswordStyles.errorText}>{passwordError}</Text>
                  ) : null}
                </View>
                
                <TouchableOpacity 
                  style={[
                    resetPasswordStyles.submitButton,
                    isLoading && resetPasswordStyles.submitButtonDisabled
                  ]} 
                  onPress={handleSubmit}
                  disabled={isLoading}
                >
                  <Text style={resetPasswordStyles.submitButtonText}>
                    {isLoading ? "Updating..." : "Reset Password"}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={resetPasswordStyles.successContainer}>
                <CheckCircle size={80} color="#FF6A00" />
                <Text style={resetPasswordStyles.successTitle}>Password Reset!</Text>
                <Text style={resetPasswordStyles.successDescription}>
                  Your password has been successfully reset. You can now log in with your new password.
                </Text>
                
                <TouchableOpacity 
                  style={resetPasswordStyles.backToLoginButton} 
                  onPress={() => router.push('/auth')}
                >
                  <Text style={resetPasswordStyles.backToLoginButtonText}>
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