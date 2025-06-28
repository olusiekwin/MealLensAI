// Add types for detection, instructions, and resources
interface Detection {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  timestamp?: string;
  createdAt?: string;
  isFavorite?: boolean;
  items?: string[];
  confidence?: number | number[];
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

interface CookingInstructions {
  steps: string[];
  tips?: string[];
  estimatedTime?: number;
}

interface ResourceItem {
  title: string;
  url: string;
}

interface Resources {
  youtube: ResourceItem[];
  websites: ResourceItem[];
}

import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Heart, Clock, Star, Share2, ExternalLink } from 'lucide-react-native';
import { getDetectionById, getInstructions, getResources, toggleFavorite } from '@/services/detectionService';

export default function DetectionDetailsScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [detection, setDetection] = useState<Detection | null>(null);
  const [instructions, setInstructions] = useState<CookingInstructions | null>(null);
  const [resources, setResources] = useState<Resources | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingInstructions, setLoadingInstructions] = useState(false);
  const [loadingResources, setLoadingResources] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    loadDetectionDetails();
  }, [params.detectionId]);

  const loadDetectionDetails = async () => {
    if (!params.detectionId) return;
    setLoading(true);
    try {
      const detectionData = await getDetectionById(params.detectionId);
      if (detectionData) {
        setDetection(detectionData);
        setIsFavorite(detectionData.isFavorite || false);
      } else {
        Alert.alert('Error', 'Detection not found');
        router.back();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load detection details');
    } finally {
      setLoading(false);
    }
  };

  const handleGetInstructions = async () => {
    if (!detection) return;
    setLoadingInstructions(true);
    try {
      const result = await getInstructions(detection.title || detection.items[0]);
      setInstructions(result);
    } catch (error) {
      Alert.alert('Error', 'Failed to get cooking instructions');
    } finally {
      setLoadingInstructions(false);
    }
  };

  const handleGetResources = async () => {
    if (!detection) return;
    setLoadingResources(true);
    try {
      const foodItem = detection.title || (detection.items && detection.items.length > 0 ? detection.items[0] : '');
      if (!foodItem) throw new Error('No food item to search for');
      const resourcesData = await getResources(foodItem);
      setResources(resourcesData);
    } catch (error) {
      Alert.alert('Error', 'Failed to get resources');
    } finally {
      setLoadingResources(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!detection || !detection.id) return;
    try {
      const newFavoriteStatus = !isFavorite;
      const success = await toggleFavorite(detection.id, newFavoriteStatus);
      if (success) {
        setIsFavorite(newFavoriteStatus);
        Alert.alert(newFavoriteStatus ? 'Added to Favorites' : 'Removed from Favorites');
      } else {
        Alert.alert('Error', 'Failed to update favorite status');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update favorite status');
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF5353" />
      </View>
    );
  }

  if (!detection) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Detection not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeft size={24} color="#202026" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.favoriteButton} onPress={handleToggleFavorite}>
          <Heart size={24} color="#FF5353" fill={isFavorite ? "#FF5353" : "none"} />
        </TouchableOpacity>
      </View>
      
      {detection.imageUrl ? (
        <Image source={{ uri: detection.imageUrl }} style={styles.image} />
      ) : (
        <View style={styles.placeholderImage}>
          <Text style={styles.placeholderText}>Text Detection</Text>
        </View>
      )}
      
      <View style={styles.content}>
        <Text style={styles.title}>{detection.title || 'Unnamed Detection'}</Text>
        
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Clock size={16} color="#6E6E6E" />
            <Text style={styles.detailText}>{detection.createdAt || 'Unknown'}</Text>
          </View>
          <TouchableOpacity style={styles.shareButton}>
            <Share2 size={16} color="#6E6E6E" />
            <Text style={styles.shareText}>Share</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detected Items</Text>
          <View style={styles.itemsList}>
            {detection.items?.map((item, index) => (
              <View key={index} style={styles.detectedItem}>
                <Text style={styles.itemText}>{item}</Text>
                {detection.confidence && (
                  <Text style={styles.confidenceText}>
                    {typeof detection.confidence === 'object' 
                      ? `${Math.round(detection.confidence[index] * 100)}%`
                      : `${Math.round(detection.confidence * 100)}%`}
                  </Text>
                )}
              </View>
            ))}
          </View>
        </View>
        
        {detection.nutritionalInfo && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nutritional Information</Text>
            <View style={styles.nutritionGrid}>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{detection.nutritionalInfo.calories}</Text>
                <Text style={styles.nutritionLabel}>Calories</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{detection.nutritionalInfo.protein}g</Text>
                <Text style={styles.nutritionLabel}>Protein</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{detection.nutritionalInfo.carbs}g</Text>
                <Text style={styles.nutritionLabel}>Carbs</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{detection.nutritionalInfo.fat}g</Text>
                <Text style={styles.nutritionLabel}>Fat</Text>
              </View>
            </View>
          </View>
        )}
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, loadingInstructions && styles.loadingButton]} 
            onPress={handleGetInstructions}
            disabled={loadingInstructions}
          >
            {loadingInstructions ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.actionButtonText}>Get Cooking Instructions</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, loadingResources && styles.loadingButton]} 
            onPress={handleGetResources}
            disabled={loadingResources}
          >
            {loadingResources ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.actionButtonText}>Find Resources</Text>
            )}
          </TouchableOpacity>
        </View>
        
        {instructions && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cooking Instructions</Text>
            <View style={styles.instructionsList}>
              {instructions.steps.map((step, index) => (
                <View key={index} style={styles.instructionStep}>
                  <Text style={styles.stepNumber}>{index + 1}</Text>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
            </View>
            
            {instructions.tips && instructions.tips.length > 0 && (
              <View style={styles.tipsContainer}>
                <Text style={styles.tipsTitle}>Tips</Text>
                {instructions.tips.map((tip, index) => (
                  <Text key={index} style={styles.tipText}>• {tip}</Text>
                ))}
              </View>
            )}
            
            {instructions.estimatedTime && (
              <View style={styles.timeContainer}>
                <Clock size={16} color="#6E6E6E" />
                <Text style={styles.timeText}>
                  Estimated Time: {instructions.estimatedTime} minutes
                </Text>
              </View>
            )}
          </View>
        )}
        
        {resources && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resources</Text>
            
            <Text style={styles.resourcesSubtitle}>YouTube Videos</Text>
            <View style={styles.resourcesList}>
              {resources.youtube.map((video, index) => (
                <TouchableOpacity key={index} style={styles.resourceItem}>
                  <Text style={styles.resourceTitle}>{video.title}</Text>
                  <ExternalLink size={16} color="#FF5353" />
                </TouchableOpacity>
              ))}
            </View>
            
            <Text style={styles.resourcesSubtitle}>Websites</Text>
            <View style={styles.resourcesList}>
              {resources.websites.map((website, index) => (
                <TouchableOpacity key={index} style={styles.resourceItem}>
                  <Text style={styles.resourceTitle}>{website.title}</Text>
                  <ExternalLink size={16} color="#FF5353" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#FF5353',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FF5353',
    fontWeight: '600',
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 18,
    color: '#6E6E6E',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#202026',
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#6E6E6E',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shareText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#6E6E6E',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202026',
    marginBottom: 16,
  },
  itemsList: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 16,
  },
  detectedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  itemText: {
    fontSize: 16,
    color: '#202026',
  },
  confidenceText: {
    fontSize: 14,
    color: '#6E6E6E',
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 16,
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202026',
  },
  nutritionLabel: {
    fontSize: 14,
    color: '#6E6E6E',
    marginTop: 4,
  },
  actionButtons: {
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: '#FF5353',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  loadingButton: {
    opacity: 0.7,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  instructionsList: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 16,
  },
  instructionStep: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF5353',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '600',
    marginRight: 12,
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    color: '#202026',
    lineHeight: 24,
  },
  tipsContainer: {
    marginTop: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 16,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202026',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#202026',
    marginBottom: 4,
    lineHeight: 20,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  timeText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#6E6E6E',
  },
  resourcesList: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  resourcesSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202026',
    marginBottom: 8,
  },
  resourceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  resourceTitle: {
    fontSize: 16,
    color: '#202026',
    flex: 1,
    marginRight: 8,
  },
});
