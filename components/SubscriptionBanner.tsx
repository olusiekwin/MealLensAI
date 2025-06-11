import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Zap, Crown } from 'lucide-react-native';
import { useUserStore } from '@/context/userStore';

export const SubscriptionBanner = () => {
  const router = useRouter();
  const { subscription } = useUserStore();
  
  // Don't show for premium users
  if (subscription.status === 'premium') {
    return null;
  }
  
  const handleUpgrade = () => {
    // Use the correct path format for Expo Router
    router.push('/subscription/index' as any);
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Crown size={18} color="#FFFFFF" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Upgrade to Premium</Text>
        <Text style={styles.subtitle}>Unlimited scans, no ads, and more features</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleUpgrade}>
        <Zap size={16} color="#FFFFFF" />
        <Text style={styles.buttonText}>Upgrade</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    ...(Platform.OS === 'web' ? { boxShadow: '0 2px 3px rgba(0, 0, 0, 0.05)' } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
    }),
    elevation: 2,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202026',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#6B6B6B',
  },
  button: {
    backgroundColor: '#000000',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 4,
  },
});

export default SubscriptionBanner;
