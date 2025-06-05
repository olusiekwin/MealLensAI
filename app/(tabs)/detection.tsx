import { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, CookingPot, Filter, Heart, Clock, Search } from 'lucide-react-native';
import { recipesStyles } from '@/styles/recipes.styles';
import { useUserStore } from '@/context/userStore';
import aiService from '@/services/aiService';

export default function DetectionHistoryScreen() {
  const router = useRouter();
  const { isAuthenticated } = useUserStore();
  const [detections, setDetections] = useState([]);
  const [filteredDetections, setFilteredDetections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    if (isAuthenticated) {
      fetchDetectionHistory();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    filterDetections();
  }, [searchQuery, selectedCategory, detections]);

  const fetchDetectionHistory = async () => {
    try {
      const history = await aiService.getUserHistory();
      setDetections(history);
      setFilteredDetections(history);
    } catch (error) {
      console.error('Error fetching detection history:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchDetectionHistory();
  };

  const filterDetections = () => {
    let filtered = [...detections];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => {
        const titleMatch = item.title && item.title.toLowerCase().includes(query);
        const itemsMatch = item.items && item.items.some(i => i.toLowerCase().includes(query));
        return titleMatch || itemsMatch;
      });
    }

    // Apply category filter
    if (selectedCategory !== 'All') {
      if (selectedCategory === 'Image') {
        filtered = filtered.filter(item => item.detectionType === 'image');
      } else if (selectedCategory === 'Text') {
        filtered = filtered.filter(item => item.detectionType === 'text');
      } else if (selectedCategory === 'Favorites') {
        filtered = filtered.filter(item => item.isFavorite);
      } else if (selectedCategory === 'Recent') {
        // Sort by most recent first
        filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        // Limit to last 5
        filtered = filtered.slice(0, 5);
      }
    }

    setFilteredDetections(filtered);
  };

  interface Detection {
    id: string;
    title?: string;
    timestamp: string;
    items?: string[];
    isFavorite?: boolean;
    image?: string;
    detectionType?: 'image' | 'text';
    nutritionalInfo?: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    };
  }

  const handleDetectionPress = (detection: Detection) => {
    router.push({
      pathname: '/detection-details',
      params: { detectionId: detection.id }
    });
  };

  const handleCameraPress = () => {
    router.push('/camera');
  };

  const handleTextDetectionPress = () => {
    router.push('/text-detection');
  };

  const renderDetectionItem = ({ item }) => {
    const date = new Date(item.timestamp);
    const formattedDate = `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    return (
      <TouchableOpacity 
        style={recipesStyles.detectionCard} 
        onPress={() => handleDetectionPress(item)}
      >
        <View style={recipesStyles.detectionCardContent}>
          <View style={recipesStyles.detectionCardImageContainer}>
            {item.image ? (
              <Image 
                source={{ uri: item.image }} 
                style={recipesStyles.detectionCardImage} 
                resizeMode="cover" 
              />
            ) : (
              <View style={recipesStyles.detectionCardImagePlaceholder}>
                <CookingPot size={24} color="#B5B5B5" />
              </View>
            )}
          </View>

          <View style={recipesStyles.detectionCardDetails}>
            <Text style={recipesStyles.detectionCardTitle} numberOfLines={1}>
              {item.title}
            </Text>

            <View style={recipesStyles.detectionCardMeta}>
              <Clock size={12} color="#6E6E6E" style={recipesStyles.detectionCardMetaIcon} />
              <Text style={recipesStyles.detectionCardMetaText}>{formattedDate}</Text>
            </View>

            {item.items && item.items.length > 0 && (
              <Text style={recipesStyles.detectionCardIngredients} numberOfLines={1}>
                {item.items.slice(0, 3).join(', ')}{item.items.length > 3 ? '...' : ''}
              </Text>
            )}
          </View>

          <TouchableOpacity style={recipesStyles.detectionCardFavorite}>
            <Heart 
              size={16} 
              color={item.isFavorite ? '#FF5353' : '#B5B5B5'} 
              fill={item.isFavorite ? '#FF5353' : 'none'} 
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={recipesStyles.emptyContainer}>
          <ActivityIndicator size="large" color="#FF5353" />
          <Text style={styles.loadingText}>Loading detection history...</Text>
        </View>
      );
    }

    if (!isAuthenticated) {
      return (
        <View style={recipesStyles.emptyContainer}>
          <View style={recipesStyles.emptyIconContainer}>
            <CookingPot size={48} color="#B5B5B5" />
          </View>
          <Text style={recipesStyles.emptyTitle}>Sign in to view your detection history</Text>
          <Text style={recipesStyles.emptyText}>
            Create an account or sign in to save and view your detection history.
          </Text>
          <TouchableOpacity 
            style={recipesStyles.emptyButton}
            onPress={() => router.push('/login')}
          >
            <Text style={recipesStyles.emptyButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (detections.length === 0) {
      return (
        <View style={recipesStyles.emptyContainer}>
          <View style={recipesStyles.emptyIconContainer}>
            <CookingPot size={48} color="#B5B5B5" />
          </View>
          <Text style={recipesStyles.emptyTitle}>No detections yet</Text>
          <Text style={recipesStyles.emptyText}>
            Start by detecting ingredients using text or camera.
          </Text>
          <View style={recipesStyles.emptyButtonsRow}>
            <TouchableOpacity 
              style={recipesStyles.emptyButtonSecondary}
              onPress={handleTextDetectionPress}
            >
              <Text style={recipesStyles.emptyButtonSecondaryText}>Use Text</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={recipesStyles.emptyButton}
              onPress={handleCameraPress}
            >
              <Text style={recipesStyles.emptyButtonText}>Use Camera</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    if (filteredDetections.length === 0) {
      return (
        <View style={recipesStyles.emptyContainer}>
          <View style={recipesStyles.emptyIconContainer}>
            <Search size={48} color="#B5B5B5" />
          </View>
          <Text style={recipesStyles.emptyTitle}>No matching detections</Text>
          <Text style={recipesStyles.emptyText}>
            Try adjusting your search or filters to find what you're looking for.
          </Text>
          <TouchableOpacity 
            style={recipesStyles.emptyButton}
            onPress={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
          >
            <Text style={recipesStyles.emptyButtonText}>Clear Filters</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={recipesStyles.container}>
      <View style={recipesStyles.header}>
        <Text style={recipesStyles.headerTitle}>Your Detections</Text>
        <View style={recipesStyles.headerActions}>
          <TouchableOpacity 
            style={recipesStyles.headerActionButton}
            onPress={handleCameraPress}
          >
            <Camera size={20} color="#202026" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={recipesStyles.headerActionButton}
            onPress={handleTextDetectionPress}
          >
            <CookingPot size={20} color="#202026" />
          </TouchableOpacity>
          <TouchableOpacity style={recipesStyles.headerActionButton}>
            <Filter size={20} color="#202026" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={recipesStyles.searchContainer}>
        <View style={recipesStyles.searchInputContainer}>
          <Search size={16} color="#6E6E6E" style={recipesStyles.searchIcon} />
          <TextInput
            style={recipesStyles.searchInput}
            placeholder="Search detection history"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#B5B5B5"
          />
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={recipesStyles.categoriesContainer}
        contentContainerStyle={recipesStyles.categoriesContent}
      >
        {['All', 'Image', 'Text', 'Favorites', 'Recent'].map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              recipesStyles.categoryButton,
              selectedCategory === category && recipesStyles.selectedCategoryButton
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                recipesStyles.categoryButtonText,
                selectedCategory === category && recipesStyles.selectedCategoryButtonText
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {renderEmptyState() || (
        <FlatList
          data={filteredDetections}
          renderItem={renderDetectionItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={recipesStyles.detectionsList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#FF5353']}
              tintColor="#FF5353"
            />
          }
        />
      )}
    </View>
  );
}

const categories = [
  "All", "Image", "Text", "Favorites", "Recent"
];

const styles = StyleSheet.create({
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#202026',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#FF5353',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  }
});
