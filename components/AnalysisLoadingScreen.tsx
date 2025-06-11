import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image, Dimensions, Platform } from 'react-native';

interface AnalysisLoadingScreenProps {
  message?: string;
}

const { width, height } = Dimensions.get('window');

export default function AnalysisLoadingScreen({ message = 'Analyzing your image...' }: AnalysisLoadingScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image 
          source={require('../assets/images/halflogo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        
        <ActivityIndicator size="large" color="#000000" style={styles.spinner} />
        
        <Text style={styles.loadingText}>{message}</Text>
        
        <Text style={styles.poweredByText}>Powered by MealLensAI</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  content: {
    width: width * 0.8,
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    ...(Platform.OS === 'web' ? { boxShadow: '0 2px 3.84px rgba(0, 0, 0, 0.25)' } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    }),
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  spinner: {
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  poweredByText: {
    fontSize: 12,
    color: '#888',
    marginTop: 20,
  }
});
