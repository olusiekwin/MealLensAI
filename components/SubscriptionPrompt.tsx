import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Zap, X, Crown } from 'lucide-react-native';
import { useUserStore } from '@/context/userStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/config/constants';

interface SubscriptionPromptProps {
  contextType?: 'feature' | 'usage' | 'general';
  featureName?: string;
  onDismiss?: () => void;
}

export const SubscriptionPrompt: React.FC<SubscriptionPromptProps> = ({ 
  contextType = 'general',
  featureName,
  onDismiss
}) => {
  const router = useRouter();
  const { subscription } = useUserStore();
  const [visible, setVisible] = useState(true);
  const [animation] = useState(new Animated.Value(0));
  
  // Don't show for premium users
  if (subscription.status === 'premium') {
    return null;
  }

  useEffect(() => {
    // Animate in
    Animated.spring(animation, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
      tension: 40
    }).start();

    // Check if we should show this prompt based on last shown time
    const checkPromptHistory = async () => {
      const lastPromptTime = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SUBSCRIPTION_PROMPT);
      if (lastPromptTime) {
        const lastTime = new Date(lastPromptTime).getTime();
        const now = new Date().getTime();
        const daysSinceLastPrompt = (now - lastTime) / (1000 * 60 * 60 * 24);
        
        // If shown in the last 3 days, don't show again
        if (daysSinceLastPrompt < 3) {
          handleDismiss();
        }
      }
    };
    
    checkPromptHistory();
  }, []);
  
  const handleUpgrade = () => {
    // Record that user clicked on upgrade
    AsyncStorage.setItem(STORAGE_KEYS.LAST_SUBSCRIPTION_PROMPT, new Date().toISOString());
    router.push('/subscription/index' as any);
  };
  
  const handleDismiss = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true
    }).start(() => {
      setVisible(false);
      if (onDismiss) onDismiss();
    });
    
    // Record that user saw the prompt
    AsyncStorage.setItem(STORAGE_KEYS.LAST_SUBSCRIPTION_PROMPT, new Date().toISOString());
  };

  // Different messages based on context
  let title = 'Upgrade to Premium';
  let subtitle = 'Unlock all features and remove ads';
  
  if (contextType === 'feature' && featureName) {
    title = `Unlock ${featureName}`;
    subtitle = 'This is a premium feature. Upgrade to access it.';
  } else if (contextType === 'usage') {
    title = 'Reached Usage Limit';
    subtitle = 'Upgrade to premium for unlimited usage';
  }
  
  if (!visible) return null;
  
  return (
    <Animated.View 
      style={[
        styles.container,
        { 
          opacity: animation,
          transform: [{ 
            translateY: animation.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0]
            })
          }]
        }
      ]}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Crown size={18} color="#FFFFFF" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={handleDismiss}>
          <X size={16} color="#6B6B6B" />
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleUpgrade}>
          <Zap size={16} color="#FFFFFF" />
          <Text style={styles.buttonText}>Upgrade Now</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.laterButton} onPress={handleDismiss}>
          <Text style={styles.laterButtonText}>Maybe Later</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
  closeButton: {
    padding: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#000000',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginRight: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 4,
  },
  laterButton: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  laterButtonText: {
    color: '#6B6B6B',
    fontWeight: '500',
    fontSize: 14,
  },
});

export default SubscriptionPrompt;
