import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  ActivityIndicator,
  Image,
  Dimensions
} from 'react-native';
import { X, Zap, Clock } from 'lucide-react-native';
import { useAdStore } from '@/context/adStore';
import { useUserStore } from '@/context/userStore';
import adService, { Ad } from '@/services/adService';

const { width } = Dimensions.get('window');

interface RewardedAdModalProps {
  visible: boolean;
  onClose: () => void;
  onAdCompleted: (success: boolean, remaining: number) => void;
}

const RewardedAdModal: React.FC<RewardedAdModalProps> = ({ 
  visible, 
  onClose,
  onAdCompleted
}) => {
  const [currentAd, setCurrentAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);
  const [watching, setWatching] = useState(false);
  const [watchComplete, setWatchComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(15); // 15 seconds for ad viewing
  
  const { trackAdView, trackAdClick } = useAdStore();
  
  useEffect(() => {
    if (visible) {
      loadAd();
    } else {
      // Reset state when modal is closed
      setCurrentAd(null);
      setLoading(true);
      setWatching(false);
      setWatchComplete(false);
      setError(null);
      setTimeRemaining(15);
    }
  }, [visible]);
  
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    
    if (watching && timeRemaining > 0) {
      timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (watching && timeRemaining === 0) {
      setWatchComplete(true);
      setWatching(false);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [watching, timeRemaining]);
  
  const loadAd = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const ad = await adService.fetchNextAd(true); // Prefer rewarded ads
      
      if (ad) {
        setCurrentAd(ad);
        // Track ad view after a short delay
        setTimeout(() => {
          if (ad.id) {
            trackAdView(ad.id);
            adService.trackAdInteraction(ad.id, 'view');
          }
        }, 1000);
      } else {
        setError('No ads available at the moment. Please try again later.');
      }
    } catch (err) {
      console.error('Error loading rewarded ad:', err);
      setError('Failed to load ad. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleStartWatching = () => {
    if (currentAd) {
      setWatching(true);
      
      // Track ad click
      trackAdClick(currentAd.id);
      adService.trackAdInteraction(currentAd.id, 'click');
    }
  };
  
  const handleCompleteAd = async () => {
    if (currentAd) {
      try {
        // Track the ad completion with the backend
        await adService.trackAdInteraction(currentAd.id, 'complete');
        
        // Update the user's remaining usage in the store
        const userStore = useUserStore.getState();
        userStore.incrementDailyUsageRemaining(currentAd.rewardAmount || 1);
        
        // Call the callback with success
        onAdCompleted(true, userStore.usage.dailyUsageCount);
      } catch (err) {
        console.error('Error completing rewarded ad:', err);
        onAdCompleted(false, 0);
      }
    }
  };
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.adContainer}>
          <View style={styles.adHeader}>
            <Text style={styles.adTitle}>Watch Ad for Extra Scan</Text>
            {!watching && (
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <X size={20} color="#6B6B6B" />
              </TouchableOpacity>
            )}
          </View>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#000000" />
              <Text style={styles.loadingText}>Loading ad...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={loadAd}>
                <Text style={styles.retryButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : currentAd ? (
            <View style={styles.adContent}>
              {!watching && !watchComplete ? (
                <>
                  <Image 
                    source={{ uri: currentAd.imageUrl }} 
                    style={styles.adImage}
                    resizeMode="cover"
                  />
                  <Text style={styles.adDescription}>{currentAd.description}</Text>
                  <View style={styles.rewardInfo}>
                    <Zap size={20} color="#000000" />
                    <Text style={styles.rewardText}>
                      Watch to earn {currentAd.rewardAmount} extra scan{currentAd.rewardAmount > 1 ? 's' : ''}
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.watchButton}
                    onPress={handleStartWatching}
                  >
                    <Text style={styles.watchButtonText}>Watch Now</Text>
                  </TouchableOpacity>
                </>
              ) : watching ? (
                <>
                  <Image 
                    source={{ uri: currentAd.imageUrl }} 
                    style={styles.adImage}
                    resizeMode="cover"
                  />
                  <View style={styles.timerContainer}>
                    <Clock size={20} color="#6B6B6B" />
                    <Text style={styles.timerText}>
                      {timeRemaining} seconds remaining
                    </Text>
                  </View>
                  <Text style={styles.watchingText}>
                    Please watch the entire ad to receive your reward.
                  </Text>
                </>
              ) : watchComplete ? (
                <View style={styles.completeContainer}>
                  <View style={styles.successIcon}>
                    <Zap size={32} color="#FFFFFF" />
                  </View>
                  <Text style={styles.completeTitle}>Ad Completed!</Text>
                  <Text style={styles.completeText}>
                    You've earned {currentAd.rewardAmount} extra scan{currentAd.rewardAmount > 1 ? 's' : ''}.
                  </Text>
                  <TouchableOpacity 
                    style={styles.claimButton}
                    onPress={handleCompleteAd}
                  >
                    <Text style={styles.claimButtonText}>Claim Reward</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          ) : null}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  adContainer: {
    width: width - 40,
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
  },
  adHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  adTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202026',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#6B6B6B',
  },
  errorContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#F8F8F8',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#202026',
  },
  adContent: {
    padding: 16,
  },
  adImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 16,
  },
  adDescription: {
    fontSize: 14,
    color: '#202026',
    marginBottom: 16,
    lineHeight: 20,
  },
  rewardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9F5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  rewardText: {
    fontSize: 14,
    color: '#202026',
    marginLeft: 8,
    fontWeight: '500',
  },
  watchButton: {
    backgroundColor: '#000000',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  watchButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  timerText: {
    fontSize: 14,
    color: '#6B6B6B',
    marginLeft: 8,
  },
  watchingText: {
    fontSize: 14,
    color: '#202026',
    textAlign: 'center',
    lineHeight: 20,
  },
  completeContainer: {
    alignItems: 'center',
    padding: 16,
  },
  successIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#67C74F',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  completeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#202026',
    marginBottom: 8,
  },
  completeText: {
    fontSize: 14,
    color: '#202026',
    textAlign: 'center',
    marginBottom: 20,
  },
  claimButton: {
    backgroundColor: '#000000',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  claimButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default RewardedAdModal;
