import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useUserStore } from '@/context/userStore';
import { useAdStore } from '@/context/adStore';
import * as SplashScreen from 'expo-splash-screen';

interface AppStateProviderProps {
  children: React.ReactNode;
}

export const AppStateProvider: React.FC<AppStateProviderProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [initAttempts, setInitAttempts] = useState(0);
  const { initialize: initializeUser, isLoading: isUserLoading } = useUserStore();
  const { refreshAdStatus } = useAdStore();
  
  // Simple initialization to prevent loading screen issues
  useEffect(() => {
    // Set initialized to true immediately to prevent loading screen
    setIsInitialized(true);
    
    // Hide splash screen
    SplashScreen.hideAsync().catch(e => {});
  }, []);
  
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🔄 AppStateProvider: Initializing user state...');
        // Initialize user state
        await initializeUser();
        console.log('✅ AppStateProvider: User state initialized');
        
        console.log('🔄 AppStateProvider: Refreshing ad status...');
        // Refresh ad status based on subscription
        refreshAdStatus();
        console.log('✅ AppStateProvider: Ad status refreshed');
        
        // Force completion after a timeout to prevent infinite loading
        setTimeout(() => {
          if (!isInitialized) {
            console.log('⚠️ AppStateProvider: Forcing initialization completion after timeout');
            setIsInitialized(true);
            // Force hide splash screen
            SplashScreen.hideAsync().catch(e => console.warn('Error hiding splash screen:', e));
          }
        }, 3000); // 3 second timeout
        
        setIsInitialized(true);
        console.log('✅ AppStateProvider: Initialization complete');
        
        // Hide splash screen after initialization
        try {
          await SplashScreen.hideAsync();
        } catch (e) {
          console.warn('Error hiding splash screen:', e);
        }
      } catch (e) {
        console.error('Error initializing app state:', e);
        setError(e as Error);
        
        // Hide splash screen even if there's an error
        try {
          await SplashScreen.hideAsync();
        } catch (splashError) {
          console.warn('Error hiding splash screen:', splashError);
        }
        
        // Force completion after error to prevent being stuck
        setIsInitialized(true);
      }
    };

    // Only attempt initialization if we haven't tried too many times
    if (!isInitialized && initAttempts < 3) {
      console.log('🔄 AppStateProvider: Initializing app state...');
      initializeApp();
      setInitAttempts(prev => prev + 1);
    } else if (!isInitialized && initAttempts >= 3) {
      // Force completion after too many attempts
      console.log('⚠️ AppStateProvider: Forcing initialization after too many attempts');
      setIsInitialized(true);
      SplashScreen.hideAsync().catch(e => console.warn('Error hiding splash screen:', e));
    }
  }, [isInitialized, initAttempts]);

  const handleRetry = () => {
    setIsInitialized(false);
    setError(null);
    setInitAttempts(prev => prev + 1);
  };
  
  if (!isInitialized || isUserLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000000" />
        <Text style={styles.loadingText}>
          Loading MealLensAI...
        </Text>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Error Initializing App</Text>
        <Text style={styles.errorMessage}>{error.message}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return <>{children}</>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A1A'
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#FFFFFF'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    padding: 20
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10
  },
  errorMessage: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20
  },
  retryButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default AppStateProvider;
