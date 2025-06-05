import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from "react-native";
import { useRouter } from "expo-router";
import { favoritesStyles } from "@/styles/favorites.styles";
import api from "@/services/api";
import aiService from "@/services/aiService";
import { useUserStore } from "@/context/userStore";
import { Heart, Clock, ChevronRight } from "lucide-react-native";

interface Detection {
  id: string;
  title: string;
  imageUrl?: string;
  items: string[];
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  source: string;
  createdAt: string;
  isFavorite: boolean;
}

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<Detection[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [removing, setRemoving] = useState("");
  const router = useRouter();
  const { isAuthenticated } = useUserStore();

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Get user's detection history from AI service
      const history = await aiService.getUserHistory();
      
      // Filter to only show favorites
      const favoriteDetections = history.filter(item => item.isFavorite);
      
      // Map to our Detection interface format
      const formattedFavorites = favoriteDetections.map(item => ({
        id: item.id,
        title: item.title || (item.items && item.items.length > 0 ? item.items[0] : 'Unknown Food'),
        imageUrl: item.imageUrl,
        items: item.items || [],
        nutritionalInfo: item.nutritionalInfo,
        source: item.source || 'image',
        createdAt: item.createdAt || new Date().toISOString(),
        isFavorite: true
      }));
      
      setFavorites(formattedFavorites);
    } catch (err: any) {
      console.error("Error fetching favorites:", err);
      setError(err.message || "An error occurred while fetching favorites");
      setFavorites([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchFavorites().catch(err => {
      console.error('Error during refresh:', err);
      setRefreshing(false);
    });
  };

  const handleRetry = () => {
    fetchFavorites().catch(err => {
      console.error('Error during retry:', err);
    });
  };

  const handleRetryPress = () => {
    handleRetry();
  };

  const viewDetectionDetails = (detectionId: string) => {
    if (!detectionId) return;
    router.push({
      pathname: '/detection-details',
      params: { detectionId }
    });
  };

  const removeFromFavorites = async (detectionId: string) => {
    try {
      setRemoving(detectionId);
      
      // Toggle favorite status through AI service
      await aiService.toggleFavorite(detectionId, false);
      
      // Remove the detection from the favorites list
      setFavorites(prev => prev.filter(detection => detection.id !== detectionId));
      Alert.alert("Success", "Item removed from favorites");
    } catch (err: any) {
      console.error("Error removing favorite:", err);
      Alert.alert("Error", err.message || "An error occurred while removing favorite");
    } finally {
      setRemoving("");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites().catch(err => {
        console.error('Error fetching favorites on mount:', err);
      });
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <View style={favoritesStyles.pageContainer}>
        <View style={favoritesStyles.header}>
          <Text style={favoritesStyles.title}>Favorites</Text>
        </View>
        <View style={favoritesStyles.authContainer}>
          <Text style={favoritesStyles.authTitle}>Please log in to view your favorites</Text>
          <Text style={favoritesStyles.authSubtitle}>Create an account to save and access your favorite foods.</Text>
          <TouchableOpacity 
            style={favoritesStyles.authButton}
            onPress={() => router.push('/auth')}
          >
            <Text style={favoritesStyles.authButtonText}>Sign In / Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (loading && !refreshing) {
    return (
      <View style={favoritesStyles.pageContainer}>
        <View style={favoritesStyles.header}>
          <Text style={favoritesStyles.title}>Favorites</Text>
        </View>
        <View style={favoritesStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#000000" />
          <Text style={favoritesStyles.loadingText}>Loading your favorites...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={favoritesStyles.pageContainer}>
        <View style={favoritesStyles.header}>
          <Text style={favoritesStyles.title}>Favorites</Text>
        </View>
        <View style={favoritesStyles.errorContainer}>
          <Text style={favoritesStyles.errorTitle}>Oops!</Text>
          <Text style={favoritesStyles.errorMessage}>{error}</Text>
          <TouchableOpacity style={favoritesStyles.retryButton} onPress={handleRetryPress}>
            <Text style={favoritesStyles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (favorites.length === 0 && !loading) {
    return (
      <View style={favoritesStyles.pageContainer}>
        <View style={favoritesStyles.header}>
          <Text style={favoritesStyles.title}>Favorites</Text>
        </View>
        <View style={favoritesStyles.emptyContainer}>
          <Heart size={50} color="#B5B5B5" />
          <Text style={favoritesStyles.emptyTitle}>You have no favorites yet</Text>
          <Text style={favoritesStyles.emptySubtitle}>
            Save your favorite food detections to see them here!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={favoritesStyles.pageContainer}>
      <View style={favoritesStyles.header}>
        <Text style={favoritesStyles.title}>Favorites</Text>
        {loading && !refreshing && (
          <ActivityIndicator size="small" color="#000000" style={favoritesStyles.loadingIndicator} />
        )}
      </View>
      
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={favoritesStyles.recipeCard}
            onPress={() => viewDetectionDetails(item.id)}
          >
            {item.imageUrl ? (
              <Image
                source={{ uri: item.imageUrl }}
                style={favoritesStyles.recipeImage}
                resizeMode="cover"
              />
            ) : (
              <View style={[favoritesStyles.recipeImage, favoritesStyles.placeholderImage]}>
                <Text style={favoritesStyles.placeholderText}>{item.source === 'text' ? 'T' : 'I'}</Text>
              </View>
            )}
            <View style={favoritesStyles.recipeInfo}>
              <Text style={favoritesStyles.recipeTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={favoritesStyles.recipeDescription} numberOfLines={2}>
                {item.items.join(', ')}
              </Text>
              <View style={favoritesStyles.recipeMetrics}>
                <View style={favoritesStyles.metricItem}>
                  <Clock size={12} color="#202026" />
                  <Text style={favoritesStyles.recipeMetric}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                {item.nutritionalInfo?.calories && (
                  <Text style={favoritesStyles.recipeMetric}>
                    {item.nutritionalInfo.calories} cal
                  </Text>
                )}
              </View>
            </View>
            <View style={favoritesStyles.actionButtons}>
              <TouchableOpacity
                style={favoritesStyles.favoriteButton}
                onPress={(e) => {
                  e.stopPropagation();
                  removeFromFavorites(item.id);
                }}
              >
                <Heart size={20} color="#FF5353" fill="#FF5353" />
              </TouchableOpacity>
              <TouchableOpacity
                style={favoritesStyles.detailsButton}
                onPress={() => viewDetectionDetails(item.id)}
              >
                <ChevronRight size={20} color="#202026" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#FF5353"]}
            tintColor="#FF5353"
          />
        }
        contentContainerStyle={favoritesStyles.listContent}
      />
    </View>
  );
}
