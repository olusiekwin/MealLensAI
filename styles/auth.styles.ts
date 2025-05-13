import { StyleSheet, Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get('window');

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: Platform.OS === 'ios' ? 45 : 30,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 40,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    alignSelf: 'center',
    marginTop: Platform.OS === 'ios' ? 25 : 20,
    marginBottom: 20,
    width: width * 0.35,
    height: width * 0.14,
    position: 'relative',
    zIndex: 1,
  },
  appTitle: {
    alignSelf: 'center',
    fontWeight: '600',
    fontSize: 28,
    color: '#FFFFFF',
    marginTop: 40,
    marginBottom: 30,
  },
  scrollContent: {
    flexGrow: 0,
    marginTop: 10,
    paddingBottom: 20,
    justifyContent: 'center',
  },
  formContainer: {
    flex: 1,
    paddingTop: 10,
    width: '100%',
  },
  formTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 12,
  },
  inputLabel: {
    fontWeight: '600',
    fontSize: 13,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    height: 50,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  eyeIcon: {
    padding: 8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 6,
  },
  forgotPasswordText: {
    fontWeight: '500',
    fontSize: 13,
    color: '#FFFFFF',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 8,
  },
  submitButton: {
    height: 48,
    backgroundColor: '#FF6A00',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: 'rgba(255, 106, 0, 0.7)',
  },
  submitButtonText: {
    fontWeight: '600',
    fontSize: 16,
    color: '#FFFFFF',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dividerText: {
    fontWeight: '500',
    fontSize: 14,
    color: '#FFFFFF',
    marginHorizontal: 10,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 8,
  },
  socialButton: {
    marginHorizontal: 12,
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },

  switchModeContainer: {
    alignItems: 'center',
    marginTop: 15,
  },
  switchModeText: {
    fontWeight: '400',
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.75)',
  },
  switchModeHighlight: {
    fontWeight: '600',
    color: '#FF6A00',
  },
});