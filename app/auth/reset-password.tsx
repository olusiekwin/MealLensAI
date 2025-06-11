<<<<<<< HEAD
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
=======
"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Image,
  Animated,
  SafeAreaView,
  StatusBar as RNStatusBar,
} from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle } from "lucide-react-native"
import { authStyles } from "@/styles/auth.styles"
import authService from "@/services/authService"

export default function ResetPasswordScreen(): React.ReactElement {
  const router = useRouter()
  const { token } = useLocalSearchParams()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [focusedInput, setFocusedInput] = useState<"password" | "confirmPassword" | null>(null)
  const [canGoBack, setCanGoBack] = useState(false)

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.95)).current

  useEffect(() => {
    const fadeIn = () => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start()
    }
    fadeIn()

    setCanGoBack(router.canGoBack())

    if (!token) {
      Alert.alert("Invalid Token", "The reset password link is invalid or has expired.", [
        { text: "OK", onPress: () => router.replace("/auth") },
      ])
    }
  }, [fadeAnim, scaleAnim, token])

  const validateForm = () => {
    setError("")
    setPasswordError("")

    if (!password.trim() || password.length < 6) {
      setError("Password must be at least 6 characters")
      return false
    }

    if (password !== confirmPassword) {
      setPasswordError("Passwords don't match")
      return false
    }

    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      if (!token) {
        throw new Error("Reset token is missing")
      }

      const response = await authService.resetPassword({
        token: token.toString(),
        password,
        confirmPassword,
      })

      if (response.success) {
        setIsSubmitted(true)
      } else if (response.error?.message) {
        setError(response.error.message)
      } else {
        setError("Failed to reset password. Please try again.")
      }
    } catch (error: any) {
      console.error("Reset password error:", error)
      if (error.message === "Network Error") {
        setError("Unable to connect to server. Please check your internet connection.")
      } else if (error.response?.data?.error?.message) {
        setError(error.response.data.error.message)
      } else {
        setError("Failed to reset password. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const goBack = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace("/auth")
    }
  }

  return (
    <SafeAreaView style={authStyles.container}>
      {Platform.OS !== "web" && <RNStatusBar barStyle="light-content" />}

      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1495195134817-aeb325a55b65?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        }}
        style={authStyles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient colors={["rgba(0,0,0,0.5)", "rgba(0,0,0,0.3)"]} style={authStyles.overlay}>
          {/* Header with back button and logo */}
          <View style={authStyles.header}>
            {canGoBack && (
              <TouchableOpacity style={authStyles.backButton} onPress={goBack}>
                <ArrowLeft color="#FFFFFF" size={24} />
              </TouchableOpacity>
            )}

            <View style={authStyles.logoContainer}>
              <Image source={require("../../assets/images/logo-2.svg")} style={authStyles.logo} resizeMode="contain" />
            </View>
          </View>

          {/* Main content area */}
          <KeyboardAvoidingView
            style={authStyles.keyboardAvoidingView}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
          >
            <View style={authStyles.contentContainer}>
              <Animated.View
                style={[
                  authStyles.formWrapper,
                  {
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }],
                  },
                ]}
              >
                {!isSubmitted ? (
                  <View style={authStyles.formContainer}>
                    <Text style={authStyles.formTitle}>Reset Password</Text>
                    <Text style={authStyles.formDescription}>Create a new password for your account</Text>

                    {error ? (
                      <View style={authStyles.errorContainer}>
                        <Text style={authStyles.errorText}>{error}</Text>
                      </View>
                    ) : null}

                    <View style={authStyles.inputContainer}>
                      <Text style={authStyles.inputLabel}>New Password</Text>
                      <View
                        style={[authStyles.inputWrapper, focusedInput === "password" && authStyles.inputWrapperFocused]}
                      >
                        <Lock
                          size={18}
                          color={focusedInput === "password" ? "#000000" : "rgba(255, 255, 255, 0.7)"}
                          style={authStyles.inputIcon}
                        />
                        <TextInput
                          style={authStyles.input}
                          placeholder="Enter new password"
                          placeholderTextColor="rgba(255, 255, 255, 0.4)"
                          secureTextEntry={!showPassword}
                          value={password}
                          onFocus={() => setFocusedInput("password")}
                          onBlur={() => setFocusedInput(null)}
                          onChangeText={setPassword}
                          textAlign="center"
                        />
                        <TouchableOpacity style={authStyles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
                          {showPassword ? (
                            <EyeOff size={18} color="rgba(255, 255, 255, 0.7)" />
                          ) : (
                            <Eye size={18} color="rgba(255, 255, 255, 0.7)" />
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View style={authStyles.inputContainer}>
                      <Text style={authStyles.inputLabel}>Confirm New Password</Text>
                      <View
                        style={[
                          authStyles.inputWrapper,
                          focusedInput === "confirmPassword" && authStyles.inputWrapperFocused,
                        ]}
                      >
                        <Lock
                          size={18}
                          color={focusedInput === "confirmPassword" ? "#000000" : "rgba(255, 255, 255, 0.7)"}
                          style={authStyles.inputIcon}
                        />
                        <TextInput
                          style={authStyles.input}
                          placeholder="Confirm new password"
                          placeholderTextColor="rgba(255, 255, 255, 0.4)"
                          secureTextEntry={!showConfirmPassword}
                          value={confirmPassword}
                          onFocus={() => setFocusedInput("confirmPassword")}
                          onBlur={() => setFocusedInput(null)}
                          textAlign="center"
                          onChangeText={(text) => {
                            setConfirmPassword(text)
                            if (passwordError && text === password) {
                              setPasswordError("")
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
                      {passwordError ? <Text style={authStyles.errorText}>{passwordError}</Text> : null}
                    </View>

                    <TouchableOpacity
                      style={[authStyles.submitButton, { backgroundColor: "#202026" }]}
                      onPress={handleSubmit}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <Text style={authStyles.submitButtonText}>Reset Password</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={authStyles.successContainer}>
                    <CheckCircle size={80} color="#4ECDC4" />
                    <Text style={authStyles.successTitle}>Password Reset!</Text>
                    <Text style={authStyles.successDescription}>
                      Your password has been successfully reset. You can now log in with your new password.
                    </Text>

                    <TouchableOpacity
                      style={[authStyles.submitButton, { backgroundColor: "#202026" }]}
                      onPress={() => router.replace("/auth")}
                    >
                      <Text style={authStyles.submitButtonText}>Back to Login</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </Animated.View>
            </View>
          </KeyboardAvoidingView>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  )
}
>>>>>>> the-moredern-features
