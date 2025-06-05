import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';

interface AdPlaceholderProps {
  onClose?: () => void;
  duration?: number; // Duration in milliseconds
  autoClose?: boolean;
}

const { width } = Dimensions.get('window');

export default function AdPlaceholder({ 
  onClose, 
  duration = 5000, 
  autoClose = true 
}: AdPlaceholderProps) {
  const [timeLeft, setTimeLeft] = useState(Math.ceil(duration / 1000));
  
  useEffect(() => {
    // Start countdown
    const countdownInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          if (autoClose && onClose) {
            onClose();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Auto close after duration
    if (autoClose) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, duration);
      
      return () => {
        clearTimeout(timer);
        clearInterval(countdownInterval);
      };
    }
    
    return () => clearInterval(countdownInterval);
  }, [duration, autoClose, onClose]);
  
  return (
    <View style={styles.container}>
      <View style={styles.adContainer}>
        <Text style={styles.adLabel}>Advertisement</Text>
        
        <Image 
          source={require('../assets/images/halflogo.png')} 
          style={styles.adImage}
          resizeMode="contain"
        />
        
        <Text style={styles.adTitle}>MealLensAI Premium</Text>
        <Text style={styles.adDescription}>
          Upgrade to Premium for unlimited scans and no ads!
        </Text>
        
        <TouchableOpacity style={styles.adButton}>
          <Text style={styles.adButtonText}>Learn More</Text>
        </TouchableOpacity>
        
        {autoClose && (
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>Ad closes in {timeLeft}s</Text>
          </View>
        )}
        
        {!autoClose && (
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        )}
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
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  adContainer: {
    width: width * 0.85,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    overflow: 'hidden',
  },
  adLabel: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    fontSize: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  adImage: {
    width: 120,
    height: 120,
    marginBottom: 15,
  },
  adTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  adDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
    color: '#666',
    paddingHorizontal: 10,
  },
  adButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginTop: 5,
  },
  adButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  timerContainer: {
    marginTop: 15,
    padding: 5,
  },
  timerText: {
    fontSize: 12,
    color: '#999',
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  }
});
