import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import api from '@/services/api';

interface User {
  id: string;
  email: string;
  username?: string;
  // Add other user fields as needed
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        const response = await api.get('/user/profile');
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Error loading user:', error);
      await signOut();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await api.post('/api/v1/auth/login', { email, password });
      if (response.data.success) {
        setUser(response.data.user);
        setToken(response.data.token);
        await AsyncStorage.setItem('auth_token', response.data.token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, username: string) => {
    try {
      setLoading(true);
      const response = await api.post('/api/v1/auth/register', { email, password, username });
      if (response.data.success) {
        setUser(response.data.user);
        setToken(response.data.token);
        await AsyncStorage.setItem('auth_token', response.data.token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('auth_token');
      setUser(null);
      setToken(null);
      router.replace('/auth');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn: login, signOut, signUp: register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 