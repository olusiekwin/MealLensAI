"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useUserStore } from "@/context/userStore"
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
  StyleSheet,
} from "react-native"
import { useRouter } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User } from "lucide-react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { authStyles } from "@/styles/auth.styles"
import * as authService from "@/services/authService"

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#202026',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
})

export default function AuthScreen(): React.ReactElement {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [initError, setInitError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [username, setUsername] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [generalError, setGeneralError] = useState("")
  const [focusedInput, setFocusedInput] = useState<"email" | "password" | "confirmPassword" | "username" | null>(null)
  const [canGoBack, setCanGoBack] = useState(false)

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.95)).current

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setIsLoading(true)
        const isLoggedIn = await authService.isLoggedIn()
        if (isLoggedIn) {
          router.replace('/(tabs)/index')
        }
      } catch (error) {
        console.error('Error checking auth status:', error)
        setInitError('Failed to initialize. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
    checkAuthStatus()
  }, [router])

  if (isLoading) {
    return (
      <SafeAreaView style={authStyles.container}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={authStyles.subtitle}>Loading...</Text>
      </SafeAreaView>
    )
  }

  if (initError) {
    return (
      <SafeAreaView style={authStyles.container}>
        <Text style={authStyles.title}>Error</Text>
        <Text style={authStyles.subtitle}>{initError}</Text>
        <TouchableOpacity 
          style={authStyles.primaryButton} 
          onPress={() => {
            setInitError(null)
            setIsLoading(true)
            // Retry initialization
            const checkAuthStatus = async () => {
              try {
                const isLoggedIn = await authService.isLoggedIn()
                if (isLoggedIn) {
                  router.replace('/(tabs)/index')
                }
              } catch (error) {
                console.error('Retry failed:', error)
                setInitError('Failed to initialize. Please try again.')
              } finally {
                setIsLoading(false)
              }
            }
            checkAuthStatus()
          }}
        >
          <Text style={authStyles.primaryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  const validateForm = () => {
    setGeneralError("")
    setPasswordError("")

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim() || !emailRegex.test(email)) {
      setGeneralError("Please enter a valid email address")
      return false
    }

    // Password validation
    if (!password.trim() || password.length < 6) {
      setGeneralError("Password must be at least 6 characters")
      return false
    }

    // Registration-specific validations
    if (!isLogin) {
      if (!username.trim()) {
        setGeneralError("Please enter your username")
        return false
      }

      if (password !== confirmPassword) {
        setPasswordError("Passwords don't match")
        return false
      }
    }

    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setGeneralError("")
    setPasswordError("")

    try {
      if (isLogin) {
        // Check if authService is defined before calling login
        if (!authService || typeof authService.login !== "function") {
          console.error("Auth service or login method is not available")
          setGeneralError("Authentication service is not available. Please try again later.")
          setIsLoading(false)
          return
        }

        const response = await authService.login({
          email,
          password,
        })

        console.log("Login response:", response)

        if (response.success && response.token) {
          // Use userStore to handle authentication properly
          console.log("✅ Auth: User logged in successfully with token:", response.token.substring(0, 10) + "...")

          // Get user ID from response or use email as fallback
          const userId = response.user?.id || email

          // Initialize userStore with token and user ID
          try {
            await useUserStore.getState().login(response.token, userId)
            console.log("✅ User store initialized with token and ID:", userId)

            // Navigate to home tabs
            router.replace("/(tabs)")
          } catch (error) {
            console.error("Failed to initialize user store:", error)
            setGeneralError("Login successful but failed to load user data. Please try again.")
          }
        } else if (response.error?.code === "email_not_confirmed") {
          setGeneralError("Please check your email to verify your account before logging in.")
        } else if (response.error?.message) {
          setGeneralError(response.error.message)
          if (response.error.code === "invalid_credentials") {
            setPasswordError("Invalid email or password")
          }
        } else {
          setGeneralError("Login failed. Please try again.")
        }
      } else {
        const response = await authService.register({
          email,
          password,
          confirm_password: confirmPassword,
          username,
        })

        if (response.success) {
          // Show verification modal
          Alert.alert(
            "Registration Successful!",
            "Please check your email to verify your account. You will need to verify your email before you can log in.",
            [
              {
                text: "OK",
                onPress: () => {
                  setIsLogin(true)
                  setEmail("")
                  setPassword("")
                  setConfirmPassword("")
                  setUsername("")
                },
              },
            ],
          )
        } else if (response.error?.message) {
          setGeneralError(response.error.message)
          if (response.error.code === "email_taken") {
            setGeneralError("This email is already registered. Please try logging in.")
          }
        } else {
          setGeneralError("Registration failed. Please try again.")
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error)
      if (error.message === "Network Error") {
        setGeneralError("Unable to connect to server. Please check your internet connection.")
      } else if (error.response?.data?.error?.message) {
        setGeneralError(error.response.data.error.message)
      } else {
        setGeneralError("An error occurred. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = () => {
    router.push("/auth/forgot-password")
  }

  const toggleAuthMode = () => {
    setIsLogin(!isLogin)
    // Clear fields when switching modes
    setEmail("")
    setPassword("")
    setConfirmPassword("")
    setUsername("")
    setPasswordError("")
    setGeneralError("")
  }

  const handleSocialLogin = async (provider: "google") => {
    try {
      setIsLoading(true)
      setGeneralError("")

      const result = await authService.signInWithGoogle()

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
    // Check if we can go back, otherwise navigate to a safe fallback
    if (router.canGoBack()) {
      router.back()
    } else {
      // Navigate to your app's main screen or home screen
      router.replace("/(tabs)") // or wherever your main app screen is
      // Alternative options:
      // router.push('/') // if you have a home route
      // router.replace('/welcome') // if you have a welcome screen
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
          {/* Hide the custom header */}
          <View style={{ display: 'none' }}>
            <View style={authStyles.header}>
              <TouchableOpacity 
                style={authStyles.backButton} 
                onPress={() => router.back()}
              >
                <ArrowLeft size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={authStyles.logoContainer}>
                <Image 
                  source={require('../assets/images/logo-2.svg')} 
                  style={authStyles.logo} 
                  resizeMode="contain"
                />
              </View>
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
                <View style={isLogin ? authStyles.formContainer : authStyles.formContainerRegister}>
                  <View style={styles.header}>
                    <Text style={styles.headerTitle}>{isLogin ? 'Welcome Back' : 'Create Account'}</Text>
                    <Text style={styles.headerSubtitle}>
                      {isLogin ? 'Sign in to continue' : 'Fill in your details to get started'}
                  </Text>
                  </View>

                  {generalError ? (
                    <View style={isLogin ? authStyles.errorContainer : authStyles.errorContainerRegister}>
                      <Text style={isLogin ? authStyles.errorText : authStyles.errorTextRegister}>{generalError}</Text>
                    </View>
                  ) : null}

                  {!isLogin && (
                    <View style={isLogin ? authStyles.inputContainer : authStyles.inputContainerRegister}>
                      <Text style={isLogin ? authStyles.inputLabel : authStyles.inputLabelRegister}>Full Name</Text>
                      <View
                        style={[
                          isLogin ? authStyles.inputWrapper : authStyles.inputWrapperRegister,
                          focusedInput === "username" && authStyles.inputWrapperFocused,
                        ]}
                      >
                        <User
                          size={18}
                          color={focusedInput === "username" ? "#000000" : "rgba(255, 255, 255, 0.7)"}
                          style={isLogin ? authStyles.inputIcon : authStyles.inputIconRegister}
                        />
                        <TextInput
                          style={isLogin ? authStyles.input : authStyles.inputRegister}
                          placeholder="Username"
                          placeholderTextColor="rgba(255, 255, 255, 0.4)"
                          value={username}
                          onFocus={() => setFocusedInput("username")}
                          onBlur={() => setFocusedInput(null)}
                          onChangeText={setUsername}
                          textAlign="center"
                        />
                      </View>
                    </View>
                  )}

                  <View style={isLogin ? authStyles.inputContainer : authStyles.inputContainerRegister}>
                    <Text style={isLogin ? authStyles.inputLabel : authStyles.inputLabelRegister}>
                      {isLogin ? "Email or Phone Number" : "Email Address"}
                    </Text>
                    <View
                      style={[
                        isLogin ? authStyles.inputWrapper : authStyles.inputWrapperRegister,
                        focusedInput === "email" && authStyles.inputWrapperFocused,
                      ]}
                    >
                      <Mail
                        size={18}
                        color={focusedInput === "email" ? "#000000" : "rgba(255, 255, 255, 0.7)"}
                        style={isLogin ? authStyles.inputIcon : authStyles.inputIconRegister}
                      />
                      <TextInput
                        style={isLogin ? authStyles.input : authStyles.inputRegister}
                        placeholder={isLogin ? "Enter your email" : "Enter your email address"}
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

                  <View style={isLogin ? authStyles.inputContainer : authStyles.inputContainerRegister}>
                    <Text style={isLogin ? authStyles.inputLabel : authStyles.inputLabelRegister}>Password</Text>
                    <View
                      style={[
                        isLogin ? authStyles.inputWrapper : authStyles.inputWrapperRegister,
                        focusedInput === "password" && authStyles.inputWrapperFocused,
                      ]}
                    >
                      <Lock
                        size={18}
                        color={focusedInput === "password" ? "#000000" : "rgba(255, 255, 255, 0.7)"}
                        style={isLogin ? authStyles.inputIcon : authStyles.inputIconRegister}
                      />
                      <TextInput
                        style={isLogin ? authStyles.input : authStyles.inputRegister}
                        placeholder="Enter your password"
                        placeholderTextColor="rgba(255, 255, 255, 0.4)"
                        secureTextEntry={!showPassword}
                        value={password}
                        onFocus={() => setFocusedInput("password")}
                        onBlur={() => setFocusedInput(null)}
                        onChangeText={setPassword}
                        textAlign="center"
                      />
                      <TouchableOpacity
                        style={isLogin ? authStyles.eyeIcon : authStyles.eyeIconRegister}
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
                      <TouchableOpacity style={authStyles.forgotPassword} onPress={handleForgotPassword}>
                        <Text style={authStyles.forgotPasswordText}>Forgot Password?</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  {!isLogin && (
                    <View style={isLogin ? authStyles.inputContainer : authStyles.inputContainerRegister}>
                      <Text style={isLogin ? authStyles.inputLabel : authStyles.inputLabelRegister}>
                        Confirm Password
                      </Text>
                      <View
                        style={[
                          isLogin ? authStyles.inputWrapper : authStyles.inputWrapperRegister,
                          focusedInput === "confirmPassword" && authStyles.inputWrapperFocused,
                        ]}
                      >
                        <Lock
                          size={18}
                          color={focusedInput === "confirmPassword" ? "#000000" : "rgba(255, 255, 255, 0.7)"}
                          style={isLogin ? authStyles.inputIcon : authStyles.inputIconRegister}
                        />
                        <TextInput
                          style={isLogin ? authStyles.input : authStyles.inputRegister}
                          placeholder="Confirm your password"
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
                          style={isLogin ? authStyles.eyeIcon : authStyles.eyeIconRegister}
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
                  )}

                  <TouchableOpacity
                    style={[
                      isLogin ? authStyles.submitButton : authStyles.submitButtonRegister,
                      { backgroundColor: "#202026" },
                    ]}
                    onPress={handleSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={isLogin ? authStyles.submitButtonText : authStyles.submitButtonTextRegister}>
                        {isLogin ? "Sign In" : "Create Account"}
                      </Text>
                    )}
                  </TouchableOpacity>

                  {/* Social Login Buttons */}
                  <View style={isLogin ? authStyles.dividerContainer : authStyles.dividerContainerRegister}>
                    <View style={authStyles.divider} />
                    <Text style={isLogin ? authStyles.dividerText : authStyles.dividerTextRegister}>OR</Text>
                    <View style={authStyles.divider} />
                  </View>

                  <View style={isLogin ? authStyles.socialButtonsContainer : authStyles.socialButtonsContainerRegister}>
                    <TouchableOpacity
                      style={isLogin ? authStyles.socialButton : authStyles.socialButtonRegister}
                      onPress={() => handleSocialLogin("google")}
                    >
                      <View style={isLogin ? authStyles.googleIconContainer : authStyles.googleIconContainerRegister}>
                        <MaterialCommunityIcons name="google" size={16} color="#FFFFFF" />
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={isLogin ? authStyles.socialButton : authStyles.socialButtonRegister}
                      onPress={() => handleSocialLogin("apple")}
                    >
                      <MaterialCommunityIcons name="apple" size={20} color="#FFFFFF" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={isLogin ? authStyles.socialButton : authStyles.socialButtonRegister}
                      onPress={() => handleSocialLogin("facebook")}
                    >
                      <MaterialCommunityIcons name="facebook" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    style={isLogin ? authStyles.switchModeContainer : authStyles.switchModeContainerRegister}
                    onPress={toggleAuthMode}
                  >
                    <Text style={isLogin ? authStyles.switchModeText : authStyles.switchModeTextRegister}>
                      {isLogin ? "Don't have an account? " : "Already have an account? "}
                      <Text style={authStyles.switchModeHighlight}>{isLogin ? "Register" : "Login"}</Text>
                    </Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </View>
          </KeyboardAvoidingView>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  )
}
