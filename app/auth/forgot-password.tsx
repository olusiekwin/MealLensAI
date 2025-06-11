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
  ActivityIndicator,
  Image,
  Animated,
  SafeAreaView,
  StatusBar as RNStatusBar,
} from "react-native"
import { useRouter } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import { ArrowLeft, Mail, CheckCircle } from "lucide-react-native"
import { authStyles } from "@/styles/auth.styles"
import authService from "@/services/authService"

export default function ForgotPasswordScreen(): React.ReactElement {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [focusedInput, setFocusedInput] = useState<"email" | null>(null)
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
  }, [fadeAnim, scaleAnim])

  const validateEmail = () => {
    setError("")
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim() || !emailRegex.test(email)) {
      setError("Please enter a valid email address")
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validateEmail()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await authService.forgotPassword(email)

      if (response.success) {
        setIsSubmitted(true)
      } else if (response.error?.message) {
        setError(response.error.message)
      } else {
        setError("Failed to send reset email. Please try again.")
      }
    } catch (error: any) {
      console.error("Forgot password error:", error)
      if (error.message === "Network Error") {
        setError("Unable to connect to server. Please check your internet connection.")
      } else if (error.response?.data?.error?.message) {
        setError(error.response.data.error.message)
      } else {
        setError("Failed to send reset email. Please try again.")
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
                    <Text style={authStyles.formTitle}>Forgot Password</Text>
                    <Text style={authStyles.formDescription}>
                      Enter your email address and we'll send you a link to reset your password
                    </Text>

                    {error ? (
                      <View style={authStyles.errorContainer}>
                        <Text style={authStyles.errorText}>{error}</Text>
                      </View>
                    ) : null}

                    <View style={authStyles.inputContainer}>
                      <Text style={authStyles.inputLabel}>Email Address</Text>
                      <View
                        style={[authStyles.inputWrapper, focusedInput === "email" && authStyles.inputWrapperFocused]}
                      >
                        <Mail
                          size={18}
                          color={focusedInput === "email" ? "#000000" : "rgba(255, 255, 255, 0.7)"}
                          style={authStyles.inputIcon}
                        />
                        <TextInput
                          style={authStyles.input}
                          placeholder="Enter your email address"
                          placeholderTextColor="rgba(255, 255, 255, 0.4)"
                          keyboardType="email-address"
                          autoCapitalize="none"
                          value={email}
                          onFocus={() => setFocusedInput("email")}
                          onBlur={() => setFocusedInput(null)}
                          onChangeText={setEmail}
                          textAlign="center"
                        />
                      </View>
                    </View>

                    <TouchableOpacity
                      style={[authStyles.submitButton, { backgroundColor: "#202026" }]}
                      onPress={handleSubmit}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <Text style={authStyles.submitButtonText}>Send Reset Link</Text>
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity style={authStyles.switchModeContainer} onPress={goBack}>
                      <Text style={authStyles.switchModeText}>
                        <Text style={authStyles.switchModeHighlight}>Back to Login</Text>
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={authStyles.successContainer}>
                    <CheckCircle size={80} color="#4ECDC4" />
                    <Text style={authStyles.successTitle}>Email Sent!</Text>
                    <Text style={authStyles.successDescription}>
                      We've sent a password reset link to {email}. Please check your inbox and follow the instructions.
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
