// Unified social authentication service for Google and Apple sign-in.
// Use these methods from AuthContext to provide social login in your app.

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';
import { STORAGE_KEYS } from '@/config/constants';

// Configure Google Sign-In (replace with your actual web client ID)
GoogleSignin.configure({
  webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com', // From Firebase Console
  offlineAccess: true,
});

/**
 * Social authentication service for Google and Apple sign-in.
 * Returns user and token on success, throws on error.
 */
export const socialAuthService = {
  /**
   * Sign in with Google. Returns { success, user, token } on success.
   */
  signInWithGoogle: async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const { idToken } = await GoogleSignin.signIn();
      const response = await api.post('/api/v1/auth/google', { idToken });
      if (response.data.success) {
        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
        return {
          success: true,
          user: response.data.user,
          token: response.data.token,
        };
      }
      throw new Error('Backend authentication failed');
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  },

  /**
   * Sign in with Apple. Returns { success, user, token } on success.
   */
  signInWithApple: async () => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });
      if (!appleAuthRequestResponse.identityToken) {
        throw new Error('Apple Sign-In failed - no identity token returned');
      }
      const response = await api.post('/api/v1/auth/apple', {
        identityToken: appleAuthRequestResponse.identityToken,
        nonce: appleAuthRequestResponse.nonce,
        fullName: appleAuthRequestResponse.fullName,
      });
      if (response.data.success) {
        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
        return {
          success: true,
          user: response.data.user,
          token: response.data.token,
        };
      }
      throw new Error('Backend authentication failed');
    } catch (error) {
      console.error('Apple Sign-In Error:', error);
      throw error;
    }
  },

  /**
   * Sign out from all social providers and backend.
   */
  signOut: async () => {
    try {
      await GoogleSignin.revokeAccess().catch(() => {});
      await GoogleSignin.signOut().catch(() => {});
      await api.post('/api/v1/auth/logout');
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      return { success: true };
    } catch (error) {
      console.error('Sign Out Error:', error);
      throw error;
    }
  },
};

export default socialAuthService;
