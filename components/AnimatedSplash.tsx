import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Logo from '@/assets/images/logo-2.svg';

const { width } = Dimensions.get('window');

export const AnimatedSplash = () => {
  const logoScale = new Animated.Value(0.3);
  const logoOpacity = new Animated.Value(0);
  const bgOpacity = new Animated.Value(0);

  useEffect(() => {
    Animated.sequence([
      // Fade in background
      Animated.timing(bgOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      // Fade in and scale up logo
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.background, { opacity: bgOpacity }]}>
        <LinearGradient
          colors={['#FF6A00', '#FF8C00']}
          style={styles.gradient}
        />
      </Animated.View>
      <Animated.View style={[
        styles.logoContainer,
        {
          opacity: logoOpacity,
          transform: [{ scale: logoScale }]
        }
      ]}>
        <Logo width={width * 0.5} height={width * 0.2} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
