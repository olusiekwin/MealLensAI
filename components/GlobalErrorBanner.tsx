import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface GlobalErrorBannerProps {
  message: string | null;
}

export const GlobalErrorBanner: React.FC<GlobalErrorBannerProps> = ({ message }) => {
  if (!message) return null;
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ff3333',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
