import React from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';

interface LoadingScreenProps {
  message?: string;
}

const { width, height } = Dimensions.get('window');

export default function LoadingScreen({ message = 'Loading...' }: LoadingScreenProps) {
  return (
    <View style={styles.container}>
      {/* Top half with logo */}
      <View style={styles.topHalf}>
        <Image 
          source={require('../assets/images/halflogo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      
      {/* Bottom half with loading indicator and text */}
      <View style={styles.bottomHalf}>
        <ActivityIndicator size="large" color="#000000" style={styles.spinner} />
        <Text style={styles.loadingText}>{message}</Text>
        <Text style={styles.poweredByText}>Powered by MealLensAI</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topHalf: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  bottomHalf: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    paddingTop: 20,
  },
  logo: {
    width: width * 0.6,
    height: width * 0.6,
    marginBottom: 20,
  },
  spinner: {
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
    fontWeight: '500',
  },
  poweredByText: {
    position: 'absolute',
    bottom: 40,
    fontSize: 14,
    color: '#888',
  }
});
