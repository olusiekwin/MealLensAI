import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import api from '@/services/api';
import profileService from '@/services/profileService';
import { STORAGE_KEYS } from '@/config/constants';

// User type for authentication context
interface User {
  id: string;
  email: string;
  username?: string;
}

// Auth context type for global state
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<{ success: boolean; error?: string }>;
  loginError: string | null;
  loginSuccess: string | null;
  clearLoginMessages: () => void;
  /**
   * True if the user is authenticated (token is valid and profile fetch succeeded).
   * False if only a token exists or if profile fetch failed.
   */
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState<string | null>(null);

  // Loads user from storage and backend
  useEffect(() => {
    let retryCount = 0;
    const MAX_RETRIES = 2;
    let lastError = '';
    const loadUser = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }
        try {
          const profile = await profileService.getProfile();
          setUser(profile);
          // Only set onboarding/profile flags after successful profile fetch
          await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
          console.log('✅ Set hasCompletedOnboarding to true');
          await AsyncStorage.setItem('profile_setup_completed', 'true');
          console.log('✅ Set profile_setup_completed to true');
        } catch (profileError: any) {
          setUser(null);
          await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          let errorMsg = 'Session expired or profile fetch failed. Please log in again.';
          if (profileError.code === 'ECONNABORTED' || profileError.message?.includes('timeout')) {
            errorMsg = 'Cannot connect to server. Please check your internet connection or try again later.';
          } else if (profileError.response?.status === 401) {
            errorMsg = 'Session expired. Please log in again.';
          } else if (profileError.message) {
            errorMsg = profileError.message;
          }
          // Prevent spamming the same error
          if (lastError !== errorMsg) {
            setLoginError(errorMsg);
            lastError = errorMsg;
          }
          router.replace('/auth');
        }
      } catch (error: any) {
        setUser(null);
        await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        let errorMsg = 'Failed to load user. Please log in again.';
        if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
          errorMsg = 'Cannot connect to server. Please check your internet connection or try again later.';
        } else if (error.message) {
          errorMsg = error.message;
        }
        if (lastError !== errorMsg) {
          setLoginError(errorMsg);
          lastError = errorMsg;
        }
        router.replace('/auth');
      } finally {
        setLoading(false);
      }
    };
    // Only run loadUser if token exists, and limit retries
    const checkAndLoad = async () => {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (token && retryCount < MAX_RETRIES) {
        retryCount++;
        await loadUser();
      } else {
        setUser(null);
        setLoading(false);
      }
    };
    checkAndLoad();
  }, []);

  // Handles login, shows backend error if present
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setLoginError(null);
    setLoginSuccess(null);
    try {
      const response = await api.post('/api/v1/auth/login', { email, password });
      console.log('[Auth] Login response:', response.data);
      // Extract token and user from response.data.data
      let token, user;
      if (response.data && response.data.data) {
        token = response.data.data.token;
        user = response.data.data.user;
      }
      if (!token) {
        setLoginError('No token returned from backend.');
        return { success: false, error: 'No token returned from backend.' };
      }
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      if (user) {
        await AsyncStorage.setItem('userData', JSON.stringify(user));
      }
      try {
        const profile = await profileService.getProfile();
        setUser(profile);
        setLoginSuccess('Login successful!');
        return { success: true };
      } catch (profileError: any) {
        // If profile fetch fails after login, log out and show error
        await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        setUser(null);
        let errorMsg = 'Login succeeded but failed to fetch profile. Please try again.';
        if (profileError.code === 'ECONNABORTED' || profileError.message?.includes('timeout')) {
          errorMsg = 'Cannot connect to server. Please check your internet connection or try again later.';
        }
        setLoginError(errorMsg);
        return { success: false, error: errorMsg };
      }
      // Show backend error to user, with clear message
      let errorMsg = 'Login failed. Please try again.';
      if (response.data?.error) errorMsg = response.data.error;
      setLoginError(errorMsg);
      return { success: false, error: errorMsg };
    } catch (error: any) {
      // Provide clear error for debugging and user
      let errorMsg = 'Login failed. Please try again.';
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        errorMsg = 'Cannot connect to server. Please check your internet connection or try again later.';
      } else if (error.response?.data?.error) errorMsg = error.response.data.error;
      else if (error.message) errorMsg = error.message;
      else errorMsg = JSON.stringify(error);
      // Log for developer
      console.error('AuthContext signIn error:', errorMsg, error);
      setLoginError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Handles registration
  const signUp = async (email: string, password: string, username: string) => {
    setLoading(true);
    try {
      const response = await api.post('/api/v1/auth/register', { email, password, username });
      if (response.data.success) {
        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
        try {
          const profile = await profileService.getProfile();
          setUser(profile);
          return { success: true };
        } catch (profileError: any) {
          await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          setUser(null);
          let errorMsg = 'Registration succeeded but failed to fetch profile. Please try again.';
          if (profileError.code === 'ECONNABORTED' || profileError.message?.includes('timeout')) {
            errorMsg = 'Cannot connect to server. Please check your internet connection or try again later.';
          }
          setLoginError(errorMsg);
          return { success: false, error: errorMsg };
        }
      }
      // Show backend error to user, with clear message
      let errorMsg = 'Registration failed.';
      if (response.data?.error) errorMsg = response.data.error;
      setLoginError(errorMsg);
      return { success: false, error: errorMsg };
    } catch (error: any) {
      // Provide clear error for debugging and user
      let errorMsg = 'Registration failed. Please try again.';
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        errorMsg = 'Cannot connect to server. Please check your internet connection or try again later.';
      } else if (error.response?.data?.error) errorMsg = error.response.data.error;
      else if (error.message) errorMsg = error.message;
      else errorMsg = JSON.stringify(error);
      // Log for developer
      console.error('AuthContext signUp error:', errorMsg, error);
      setLoginError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Handles logout
  const signOut = async () => {
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    setUser(null);
    router.replace('/auth');
  };

  const clearLoginMessages = () => {
    setLoginError(null);
    setLoginSuccess(null);
  };

  // Derived value: true if user is authenticated (profile fetch succeeded)
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, signUp, loginError, loginSuccess, clearLoginMessages, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for using auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}