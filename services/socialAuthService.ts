import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';
import { STORAGE_KEYS } from '@/config/constants';

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com', // From Firebase Console
  offlineAccess: true,
});

export const socialAuthService = {
  // Google Sign In
  signInWithGoogle: async () => {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      
      // Get the users ID token
      const { idToken } = await GoogleSignin.signIn();

      // Send the token to our backend for verification and account creation/login
      const response = await api.post('/api/v1/auth/google', {
        idToken: idToken
      });

      if (response.data.success) {
        // Store the backend-issued token
        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);

      return {
        success: true,
        user: response.data.user,
          token: response.data.token
      };
      }

      throw new Error('Backend authentication failed');
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  },

  // Apple Sign In
  signInWithApple: async () => {
    try {
      // Start the sign-in request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      // Ensure Apple returned a user identityToken
      if (!appleAuthRequestResponse.identityToken) {
        throw new Error('Apple Sign-In failed - no identity token returned');
      }

      // Send the token to our backend for verification and account creation/login
      const response = await api.post('/api/v1/auth/apple', {
        identityToken: appleAuthRequestResponse.identityToken,
        nonce: appleAuthRequestResponse.nonce,
        fullName: appleAuthRequestResponse.fullName
      });

      if (response.data.success) {
        // Store the backend-issued token
        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);

      return {
        success: true,
        user: response.data.user,
          token: response.data.token
      };
      }

      throw new Error('Backend authentication failed');
    } catch (error) {
      console.error('Apple Sign-In Error:', error);
      throw error;
    }
  },

  // Sign out
  signOut: async () => {
    try {
      // Revoke access on the client side
      await GoogleSignin.revokeAccess().catch(() => {});
      await GoogleSignin.signOut().catch(() => {});
      
      // Call backend to invalidate the session
      await api.post('/api/v1/auth/logout');
      
      // Clear local storage
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      
      return { success: true };
    } catch (error) {
      console.error('Sign Out Error:', error);
      throw error;
    }
  },
};

export default socialAuthService;
