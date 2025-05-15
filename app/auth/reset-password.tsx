import { useState, useEffect } from 'react';
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
  ActivityIndicator
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react-native';
import { resetPasswordStyles } from '@/styles/resetPassword.styles';
import { authService } from '@/services/api';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { token } = useLocalSearchParams();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      Alert.alert(
        "Invalid Token",
        "The reset password link is invalid or has expired.",
        [{ text: "OK", onPress: () => router.push('/auth') }]
      );
    }
  }, [token, router]);

  const validateForm = () => {
    setError('');

    if (!password.trim() || password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      if (!token) {
        throw new Error('Reset token is missing');
      }
      
      await authService.resetPassword({
        token: token.toString(),
        password,
        confirmPassword
      });
      
      setIsSubmitted(true);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to reset password. Please try again.');
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
          
          <Text style={resetPasswordStyles.appTitle}>MealLensAI</Text>
          
          <ScrollView 
            contentContainerStyle={resetPasswordStyles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {!isSubmitted ? (
              <View style={resetPasswordStyles.formContainer}>
                <Text style={resetPasswordStyles.formTitle}>Reset Password</Text>
                <Text style={resetPasswordStyles.formDescription}>
                  Create a new password for your account
                </Text>
                
                {error ? (
                  <View style={resetPasswordStyles.errorContainer}>
                    <Text style={resetPasswordStyles.errorText}>{error}</Text>
                  </View>
                ) : null}
                
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
                      onChangeText={setConfirmPassword}
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
                </View>
                
                <TouchableOpacity 
                  style={[
                    resetPasswordStyles.submitButton,
                    isLoading && resetPasswordStyles.submitButtonDisabled
                  ]} 
                  onPress={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={resetPasswordStyles.submitButtonText}>
                      Reset Password
                    </Text>
                  )}
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