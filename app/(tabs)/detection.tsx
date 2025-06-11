import { useState, useEffect } from 'react';
import { Text, View, ScrollView, Image, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { Search, Filter, Clock, Star, Heart, Camera, UtensilsCrossed } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import aiService from '@/services/aiService';
import { detectionStyles } from '../../styles/detection.styles';

export default function DetectionScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [detectionHistory, setDetectionHistory] = useState<any[]>([]);
  const [detectionItems, setDetectionItems] = useState(detectionHistory);

  useEffect(() => {
    loadDetectionHistory();
  }, []);

  const loadDetectionHistory = async () => {
    try {
      const history = await aiService.getUserHistory();
      setDetectionHistory(history);
      setDetectionItems(history);
    } catch (error) {
      console.error('Error loading detection history:', error);
    }
  };

  const handleDetectionPress = (item: any) => {
    router.push({
      pathname: '/detection-details',
      params: { detectionId: item.id }
    });
  };

  const toggleFavorite = async (item: any) => {
    try {
      await aiService.toggleFavorite(item.id, !item.isFavorite);
      setDetectionHistory(detectionHistory.map(det => 
        det.id === item.id ? { ...det, isFavorite: !det.isFavorite } : det
      ));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleNewDetection = () => {
    router.push('/camera');
  };

  const filteredDetections = searchQuery.trim() 
    ? detectionItems.filter(detection => 
        detection.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        detection.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : detectionItems;

  const categories = ["All", "Recipe", "Foods"];

  return (
    <View style={detectionStyles.container}>
      <View style={detectionStyles.header}>
        <Text style={detectionStyles.title}>Detection History</Text>
        <View style={detectionStyles.headerIcons}>
          <TouchableOpacity style={detectionStyles.iconButton}>
            <Search size={20} color="#202026" />
          </TouchableOpacity>
          <TouchableOpacity style={detectionStyles.iconButton}>
            <Filter size={20} color="#202026" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={detectionStyles.searchContainer}>
        <View style={detectionStyles.searchBar}>
          <Search size={20} color="#B5B5B5" style={detectionStyles.searchIcon} />
          <TextInput
            style={detectionStyles.searchInput}
            placeholder="Search detections"
            placeholderTextColor="#B5B5B5"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      
      <View style={detectionStyles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category, index) => (
            <TouchableOpacity 
              key={index} 
              style={[
                detectionStyles.categoryButton,
                activeCategory === category && detectionStyles.activeCategoryButton,
              ]}
              onPress={() => setActiveCategory(category)}
            >
              <Text 
                style={[
                  detectionStyles.categoryText,
                  activeCategory === category && detectionStyles.activeCategoryText,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <FlatList
        data={filteredDetections}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={detectionStyles.recipesList}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={detectionStyles.recipeCard}
            onPress={() => handleDetectionPress(item)}
          >
            {item.image ? (
              <Image source={{ uri: item.image }} style={detectionStyles.recipeImage} />
            ) : (
              <View style={{ width: 100, height: 100, backgroundColor: '#F0F0F0', alignItems: 'center', justifyContent: 'center' }}>
                <UtensilsCrossed size={24} color="#B5B5B5" />
              </View>
            )}
            <View style={detectionStyles.recipeContent}>
              <Text style={detectionStyles.recipeTitle}>{item.title}</Text>
              <Text style={detectionStyles.recipeDescription}>{item.description}</Text>
              <View style={detectionStyles.recipeDetails}>
                <View style={detectionStyles.detailItem}>
                  <Clock size={12} color="#202026" />
                  <Text style={detectionStyles.detailText}>{item.timestamp ? new Date(item.timestamp).toLocaleDateString() : 'N/A'}</Text>
                </View>
                <View style={detectionStyles.detailItem}>
                  <Star size={12} color="#000000" />
                  <Text style={detectionStyles.detailText}>{item.accuracy}</Text>
                </View>
                <TouchableOpacity 
                  style={detectionStyles.openButton}
                  onPress={() => handleDetectionPress(item)}
                >
                  <Text style={detectionStyles.openButtonText}>Open</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity 
              style={detectionStyles.heartButton}
              onPress={() => toggleFavorite(item)}
            >
              <Heart size={14} color="#FF5353" fill={item.isFavorite ? "#FF5353" : "transparent"} />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View style={detectionStyles.emptyStateContainer}>
            <View style={detectionStyles.emptyStateIconContainer}>
              <Camera size={30} color="#202026" />
            </View>
            <Text style={detectionStyles.emptyStateTitle}>No Detections Yet</Text>
            <Text style={detectionStyles.emptyStateDescription}>
              You haven't performed any detections. Start detecting meals now.
            </Text>
            <TouchableOpacity
              style={detectionStyles.emptyStateButton}
              onPress={handleNewDetection}
            >
              <Text style={detectionStyles.emptyStateButtonText}>Start Detection</Text>
            </TouchableOpacity>
          </View>
        )}
        ListFooterComponent={() => (
          <View style={detectionStyles.emptyStateContainer}>
            <TouchableOpacity
              style={detectionStyles.emptyStateButton}
              onPress={handleNewDetection}
            >
              <UtensilsCrossed size={20} color="#FFFFFF" />
              <Text style={detectionStyles.emptyStateButtonText}>Start New Detection</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
