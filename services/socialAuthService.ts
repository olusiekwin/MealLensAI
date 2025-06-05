import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

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

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      const userCredential = await auth().signInWithCredential(googleCredential);
      
      // Get the user's ID token
      const token = await userCredential.user.getIdToken();
      
      // Store the token in AsyncStorage
      await AsyncStorage.setItem('auth_token', token);
      
      // Register/Login with your backend only (never remote)
      const response = await api.post('/auth/social', {
        provider: 'google',
        token: token,
        email: userCredential.user.email,
        name: userCredential.user.displayName,
      });

      return {
        success: true,
        user: response.data.user,
        token: response.data.token, // Always use backend-issued token
      };

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

      // Create a Firebase credential from the response
      const { identityToken, nonce } = appleAuthRequestResponse;
      const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);

      // Sign in with the credential
      const userCredential = await auth().signInWithCredential(appleCredential);
      
      // Get the user's ID token
      const token = await userCredential.user.getIdToken();
      
      // Store the token in AsyncStorage
      await AsyncStorage.setItem('auth_token', token);
      
      // Register/Login with your backend
      const response = await api.post('/auth/social', {
        provider: 'apple',
        token: token,
        email: userCredential.user.email,
        name: appleAuthRequestResponse.fullName?.givenName,
      });

      return {
        success: true,
        user: response.data.user,
        token: token,
      };
    } catch (error) {
      console.error('Apple Sign-In Error:', error);
      throw error;
    }
  },

  // Sign out
  signOut: async () => {
    try {
      await auth().signOut();
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      await AsyncStorage.removeItem('auth_token');
      return { success: true };
    } catch (error) {
      console.error('Sign Out Error:', error);
      throw error;
    }
  },
};

export default socialAuthService;
