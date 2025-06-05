import { StyleSheet, Platform, Dimensions, StatusBar } from "react-native"

const { width, height } = Dimensions.get("window")

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },

  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  // Header section with back button and logo
  header: {
    paddingTop: Platform.OS === "ios" ? 50 : StatusBar.currentHeight ? StatusBar.currentHeight + 20 : 40,
    paddingHorizontal: 20,
    paddingBottom: 12,
    alignItems: "center",
    position: "relative",
  },

  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : StatusBar.currentHeight ? StatusBar.currentHeight + 20 : 40,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },

  logoContainer: {
    width: Math.min(width * 0.32, 120),
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 6,
  },

  logo: {
    width: "100%",
    height: "100%",
  },

  // Main content area
  keyboardAvoidingView: {
    flex: 1,
  },

  contentContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },

  formWrapper: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },

  formContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  // Registration specific container with tighter spacing
  formContainerRegister: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  formTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 16,
    textAlign: "center",
    letterSpacing: 0.5,
  },

  // Registration title with less margin
  formTitleRegister: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 12,
    textAlign: "center",
    letterSpacing: 0.5,
  },

  // Input styles
  inputContainer: {
    marginBottom: 12,
  },

  // Registration input container with tighter spacing
  inputContainerRegister: {
    marginBottom: 8,
  },

  inputLabel: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 5,
    fontWeight: "500",
    textAlign: "center",
  },

  // Registration label with less margin
  inputLabelRegister: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 4,
    fontWeight: "500",
    textAlign: "center",
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 46,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  // Registration input wrapper with smaller height
  inputWrapperRegister: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 40,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  inputWrapperFocused: {
    borderColor: "#202026",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    shadowColor: "#202026",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },

  inputIcon: {
    marginRight: 12,
  },

  // Registration icon with less margin
  inputIconRegister: {
    marginRight: 10,
  },

  input: {
    flex: 1,
    height: "100%",
    fontSize: 15,
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "400",
  },

  // Registration input with smaller font
  inputRegister: {
    flex: 1,
    height: "100%",
    fontSize: 14,
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "400",
  },

  eyeIcon: {
    padding: 6,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  // Registration eye icon smaller
  eyeIconRegister: {
    padding: 5,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 14,
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },

  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: 6,
  },

  forgotPasswordText: {
    fontWeight: "500",
    fontSize: 13,
    color: "#FFFFFF",
  },

  // Error handling
  errorContainer: {
    marginBottom: 10,
    alignItems: "center",
  },

  // Registration error with less margin
  errorContainerRegister: {
    marginBottom: 8,
    alignItems: "center",
  },

  errorText: {
    color: "#FF4444",
    fontSize: 13,
    textAlign: "center",
    fontWeight: "500",
  },

  // Registration error text smaller
  errorTextRegister: {
    color: "#FF4444",
    fontSize: 12,
    textAlign: "center",
    fontWeight: "500",
  },

  // Submit button
  submitButton: {
    width: "100%",
    height: 46,
    backgroundColor: "#202026",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 14,
    marginBottom: 10,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  // Registration submit button with tighter margins
  submitButtonRegister: {
    width: "100%",
    height: 42,
    backgroundColor: "#202026",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 8,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  submitButtonText: {
    fontWeight: "600",
    fontSize: 15,
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },

  // Registration button text smaller
  submitButtonTextRegister: {
    fontWeight: "600",
    fontSize: 14,
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },

  // Divider
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },

  // Registration divider with less margin
  dividerContainerRegister: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },

  dividerText: {
    fontWeight: "500",
    fontSize: 13,
    color: "#FFFFFF",
    marginHorizontal: 12,
  },

  // Registration divider text smaller
  dividerTextRegister: {
    fontWeight: "500",
    fontSize: 12,
    color: "#FFFFFF",
    marginHorizontal: 10,
  },

  // Social buttons
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },

  // Registration social buttons with less margin
  socialButtonsContainerRegister: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 6,
  },

  socialButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  // Registration social buttons smaller
  socialButtonRegister: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 6,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  googleIconContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#4285F4",
    justifyContent: "center",
    alignItems: "center",
  },

  // Registration google icon smaller
  googleIconContainerRegister: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#4285F4",
    justifyContent: "center",
    alignItems: "center",
  },

  // Mode switching
  switchModeContainer: {
    alignItems: "center",
    marginTop: 12,
    paddingBottom: 4,
  },

  // Registration switch mode with less margin
  switchModeContainerRegister: {
    alignItems: "center",
    marginTop: 8,
    paddingBottom: 4,
  },

  switchModeText: {
    fontWeight: "400",
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.8)",
  },

  // Registration switch text smaller
  switchModeTextRegister: {
    fontWeight: "400",
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
  },

  switchModeHighlight: {
    color: "#4ECDC4", // Changed from #202026 to a bright teal color for better visibility
    fontWeight: "600",
  },

  // Legacy styles for compatibility
  logoImage: {
    alignSelf: "center",
    marginTop: Platform.OS === "ios" ? 25 : 20,
    marginBottom: 20,
    width: width * 0.35,
    height: width * 0.14,
    position: "relative",
    zIndex: 1,
  },

  appTitle: {
    alignSelf: "center",
    fontWeight: "600",
    fontSize: 28,
    color: "#FFFFFF",
    marginTop: 40,
    marginBottom: 30,
  },

  formDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },

  submitButtonDisabled: {
    backgroundColor: "rgba(32, 32, 38, 0.7)",
  },

  successContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  successTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#FFFFFF",
    marginTop: 24,
    marginBottom: 12,
  },

  successDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 20,
  },

  socialIconsRow: {
    flexDirection: "row",
    justifyContent: "center",
  },

  googleButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },

  otherSocialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
  },
})
