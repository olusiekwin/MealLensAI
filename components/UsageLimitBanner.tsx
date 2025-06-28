import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { AlertCircle, Zap } from 'lucide-react-native';
import { useUserStore } from '@/context/userStore';
import RewardedAdModal from './RewardedAdModal';

interface UsageLimitBannerProps {
  onDismiss?: () => void;
}

export const UsageLimitBanner = ({ onDismiss }: UsageLimitBannerProps) => {
  const router = useRouter();
  const { usage, subscription, incrementDailyUsageRemaining } = useUserStore();
  const [adModalVisible, setAdModalVisible] = useState(false);
  
  // Don't show for premium users or if limit not reached
  if (subscription.status === 'premium' || !usage.reachedDailyLimit) {
    return null;
  }
  
  const handleUpgrade = () => {
    // Navigate to subscription screen
    router.push('/subscription/index' as any);
  };
  
  const handleWatchAd = () => {
    // Show the rewarded ad modal
    setAdModalVisible(true);
  };
  
  const handleAdCompleted = (success: boolean, remaining: number) => {
    setAdModalVisible(false);
    
    if (success) {
      // Update the user's remaining usage count
      incrementDailyUsageRemaining(1);
      
      Alert.alert(
        'Extra Scan Earned',
        'Thanks for watching! You have earned an additional scan.',
        [{ text: 'Continue', onPress: () => router.push('/camera' as any) }]
      );
    }
  };
  
  return (
    <>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <AlertCircle size={18} color="#FFFFFF" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Daily Limit Reached</Text>
          <Text style={styles.subtitle}>
            You've used {usage.dailyUsageCount} scans today. Upgrade to premium for unlimited scans.
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.adButton} onPress={handleWatchAd}>
            <Text style={styles.adButtonText}>Watch Ad</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgrade}>
            <Zap size={16} color="#FFFFFF" />
            <Text style={styles.upgradeButtonText}>Upgrade</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <RewardedAdModal
        visible={adModalVisible}
        onClose={() => setAdModalVisible(false)}
        onAdCompleted={handleAdCompleted}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    ...(Platform.OS === 'web' ? { boxShadow: '0 2px 3px rgba(0,0,0,0.05)' } : {
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
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  textContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202026',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B6B6B',
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  adButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  adButtonText: {
    color: '#202026',
    fontWeight: '600',
    fontSize: 14,
  },
  upgradeButton: {
    backgroundColor: '#000000',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginLeft: 8,
  },
  upgradeButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 4,
  },
});

export default UsageLimitBanner;
