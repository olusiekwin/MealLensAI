"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
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
  Animated,
  SafeAreaView,
  StatusBar as RNStatusBar,
  StyleSheet,
} from "react-native"
import { useRouter } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { authStyles } from "@/styles/auth.styles"

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#FFFFFF", // Changed to white for better visibility
    textAlign: "center",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)", // Changed to white with opacity
    textAlign: "center",
    marginBottom: 24,
  },
})

export default function AuthScreen(): React.ReactElement {
  const router = useRouter()
  // Use the correct function names from AuthContext
  // signIn: for login, signUp: for registration, signOut: for logout
  // user: current user object, loading: auth loading state
  const { signIn, signUp, signOut, user, loading, loginError, loginSuccess, clearLoginMessages } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false) // Changed from true to false
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

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.95)).current

  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start()

    const checkAuthStatus = async () => {
      try {
        setIsLoading(true)
        const isLoggedIn = await isLoggedIn()
        if (isLoggedIn) {
          router.replace("/(tabs)")
        }
      } catch (error) {
        console.error("Error checking auth status:", error)
        setInitError("Failed to initialize. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    // Only check auth status, don't set loading to true initially
    // checkAuthStatus()
  }, [fadeAnim, scaleAnim, router])

  useEffect(() => {
    if (loginError) {
      Alert.alert('Login Failed', loginError, [
        { text: 'OK', onPress: clearLoginMessages }
      ])
    } else if (loginSuccess) {
      Alert.alert('Login Successful', loginSuccess, [
        { text: 'OK', onPress: clearLoginMessages }
      ])
    }
  }, [loginError, loginSuccess])

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
        // Use signIn from AuthContext (email, password)
        const response = await signIn(email, password)
        console.log('Login response:', response)
        if (response.success) {
          // Redirect to home tabs
          router.replace('/(tabs)')
        } else if (response.error) {
          setGeneralError(response.error)
        } else {
          setGeneralError('Login failed. Please try again.')
        }
      } else {
        // Use signUp from AuthContext (email, password, username)
        const response = await signUp(email, password, username)
        if (response.success) {
          Alert.alert(
            'Registration Successful!',
            'Please check your email to verify your account. You will need to verify your email before you can log in.',
            [
              {
                text: 'OK',
                onPress: () => {
                  setIsLogin(true)
                  setEmail('')
                  setPassword('')
                  setConfirmPassword('')
                  setUsername('')
                },
              },
            ],
          )
        } else if (response.error) {
          setGeneralError(response.error)
        } else {
          setGeneralError('Registration failed. Please try again.')
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error)
      if (error.message === 'Network Error') {
        setGeneralError('Unable to connect to server. Please check your internet connection.')
      } else if (error.response?.data?.error?.message) {
        setGeneralError(error.response.data.error.message)
      } else {
        setGeneralError('An error occurred. Please try again.')
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

  const handleSocialLogin = async (provider: "google" | "apple" | "facebook") => {
    try {
      setIsLoading(true)
      setGeneralError("")

      if (provider === "google") {
        const result = await signInWithGoogle()
        if (result?.token) {
          router.replace("/(tabs)")
        }
      } else {
        // Handle other providers
        Alert.alert("Coming Soon", `${provider} login will be available soon.`)
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

  // Show loading screen if initializing
  if (isLoading && !email && !password) {
    return (
      <SafeAreaView style={authStyles.container}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={{ color: "#FFFFFF", marginTop: 16 }}>Loading...</Text>
        </View>
      </SafeAreaView>
    )
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
          {/* Header - Now visible, but no back button */}
          <View style={authStyles.header}>
            {/* Removed back button for auth screen */}
            <View style={authStyles.logoContainer}>
              <View
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  borderRadius: 8,
                  padding: 8,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ color: "#FFFFFF", fontWeight: "bold" }}>LOGO</Text>
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
                  <View style={{ marginBottom: 20 }}>
                    <Text style={styles.headerTitle}>{isLogin ? "Welcome Back" : "Create Account"}</Text>
                    <Text style={styles.headerSubtitle}>
                      {isLogin ? "Sign in to continue" : "Fill in your details to get started"}
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
                          color={focusedInput === "username" ? "#202026" : "rgba(255, 255, 255, 0.7)"}
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
                        color={focusedInput === "email" ? "#202026" : "rgba(255, 255, 255, 0.7)"}
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
                        color={focusedInput === "password" ? "#202026" : "rgba(255, 255, 255, 0.7)"}
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
                          color={focusedInput === "confirmPassword" ? "#202026" : "rgba(255, 255, 255, 0.7)"}
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
