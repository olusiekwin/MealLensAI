import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Linking, Platform } from 'react-native';
import { X } from 'lucide-react-native';
import { useAdStore } from '@/context/adStore';

interface AdBannerProps {
  position: 'banner' | 'interstitial' | 'native';
}

export const AdBanner: React.FC<AdBannerProps> = ({ position }) => {
  const { ads, shouldShowAds, fetchAds, markAdViewed, markAdClicked } = useAdStore();
  
  useEffect(() => {
    if (shouldShowAds && ads.length === 0) {
      fetchAds();
    }
  }, [shouldShowAds]);
  
  // Don't render anything if ads shouldn't be shown or no ads available
  if (!shouldShowAds || ads.length === 0) {
    return null;
  }
  
  // Filter ads by position
  const relevantAds = ads.filter(ad => ad.position === position);
  if (relevantAds.length === 0) {
    return null;
  }
  
  // Select a random ad from the relevant ones
  const adIndex = Math.floor(Math.random() * relevantAds.length);
  const ad = relevantAds[adIndex];
  
  // Mark ad as viewed
  useEffect(() => {
    if (ad) {
      markAdViewed(ad.id);
    }
  }, [ad?.id]);
  
  const handleAdPress = () => {
    if (ad) {
      markAdClicked(ad.id);
      Linking.openURL(ad.targetUrl);
    }
  };
  
  if (position === 'banner') {
    return (
      <TouchableOpacity style={styles.bannerContainer} onPress={handleAdPress}>
        <Image source={{ uri: ad.imageUrl }} style={styles.bannerImage} />
        <View style={styles.bannerContent}>
          <View>
            <Text style={styles.adLabel}>Ad</Text>
            <Text style={styles.bannerTitle}>{ad.title}</Text>
            <Text style={styles.bannerDescription} numberOfLines={2}>{ad.description}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  
  if (position === 'native') {
    return (
      <TouchableOpacity style={styles.nativeContainer} onPress={handleAdPress}>
        <View style={styles.nativeHeader}>
          <Text style={styles.adLabel}>Ad</Text>
          <TouchableOpacity style={styles.closeButton}>
            <X size={16} color="#6B6B6B" />
          </TouchableOpacity>
        </View>
        <Image source={{ uri: ad.imageUrl }} style={styles.nativeImage} />
        <View style={styles.nativeContent}>
          <Text style={styles.nativeTitle}>{ad.title}</Text>
          <Text style={styles.nativeDescription} numberOfLines={2}>{ad.description}</Text>
        </View>
      </TouchableOpacity>
    );
  }
  
  return null;
};

const styles = StyleSheet.create({
  bannerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginVertical: 8,
    flexDirection: 'row',
    height: 80,
    ...(Platform.OS === 'web' ? { boxShadow: '0 2px 3px rgba(0,0,0,0.05)' } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
    }),
    elevation: 2,
  },
  bannerImage: {
    width: 80,
    height: 80,
  },
  bannerContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#202026',
    marginBottom: 4,
  },
  bannerDescription: {
    fontSize: 12,
    color: '#6B6B6B',
  },
  adLabel: {
    fontSize: 10,
    color: '#6B6B6B',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  nativeContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
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
  nativeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  closeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nativeImage: {
    width: '100%',
    height: 150,
  },
  nativeContent: {
    padding: 12,
  },
  nativeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202026',
    marginBottom: 4,
  },
  nativeDescription: {
    fontSize: 14,
    color: '#6B6B6B',
    lineHeight: 20,
  },
});

export default AdBanner;
