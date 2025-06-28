import { useState, useEffect } from 'react';
import { Text, View, ScrollView, Image, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { Search, Filter, Clock, Star, Heart } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { favoritesStyles } from '../../styles/favorites.styles';
import aiService from '@/services/aiService';
import { useUserStore } from '@/context/userStore';

const categories = ["All", "Recipe", "Foods"];

const favorites = [
  {
    title: "Egg & Avocado Sandwich",
    description: "Simple and nutritious breakfast with creamy avocado",
    time: "15 min",
    rating: "4.2",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    title: "Vegetable Stir Fry",
    description: "Healthy and colorful vegetable stir fry with crispy tofu",
    time: "20 min",
    rating: "4.5",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    title: "Honey Sweet Korean Fried Chicken",
    description: "Crispy fried chicken glazed with sweet and spicy sauce",
    time: "45 min",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    title: "Berry Smoothie Bowl",
    description: "Refreshing smoothie bowl topped with fresh fruits and granola",
    time: "10 min",
    rating: "4.7",
    image: "https://images.unsplash.com/photo-1546039907-7fa05f864c02?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
];

export default function FavoritesScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [favoriteItems, setFavoriteItems] = useState(favorites);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const history = await aiService.getUserHistory();
    } catch (error) {
      // Suppress analytics/CORS errors in dev
      if (error?.message && error.message.includes('analytics')) return;
      console.error(error);
    }
  };

  const handleFavoritePress = (item: any) => {
    router.push({
      pathname: '/detection-details',
      params: { detectionId: item.id, from: 'favorites' },
    });
  };

  const toggleFavorite = (index: number) => {
    const updatedFavorites = [...favoriteItems];
    // Assuming we want to toggle a favorite status, though it's not in the data structure yet
    // This is a placeholder for future implementation
    setFavoriteItems(updatedFavorites);
  };

  const handleRecipePress = () => {
    router.push('/recipe-details');
  };

  const filteredFavorites = searchQuery.trim() 
    ? favoriteItems.filter(favorite => 
        favorite.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        favorite.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : favoriteItems;

  return (
    <View style={favoritesStyles.container}>
      <View style={favoritesStyles.header}>
        <Text style={favoritesStyles.title}>Favorites</Text>
        <View style={favoritesStyles.headerIcons}>
          <TouchableOpacity style={favoritesStyles.iconButton}>
            <Search size={20} color="#202026" />
          </TouchableOpacity>
          <TouchableOpacity style={favoritesStyles.iconButton}>
            <Filter size={20} color="#202026" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={favoritesStyles.searchContainer}>
        <View style={favoritesStyles.searchBar}>
          <Search size={20} color="#B5B5B5" style={favoritesStyles.searchIcon} />
          <TextInput
            style={favoritesStyles.searchInput}
            placeholder="Search favorites"
            placeholderTextColor="#B5B5B5"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      
      <View style={favoritesStyles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category, index) => (
            <TouchableOpacity 
              key={index} 
              style={[
                favoritesStyles.categoryButton, 
                activeCategory === category && favoritesStyles.activeCategoryButton
              ]}
              onPress={() => setActiveCategory(category)}
            >
              <Text 
                style={[
                  favoritesStyles.categoryText, 
                  activeCategory === category && favoritesStyles.activeCategoryText
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <FlatList
        data={filteredFavorites}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={favoritesStyles.recipesList}
        renderItem={({ item, index }) => (
          <TouchableOpacity 
            style={favoritesStyles.recipeCard}
            onPress={handleRecipePress}
          >
            <Image source={{ uri: item.image }} style={favoritesStyles.recipeImage} />
            <View style={favoritesStyles.recipeContent}>
              <Text style={favoritesStyles.recipeTitle}>{item.title}</Text>
              <Text style={favoritesStyles.recipeDescription}>{item.description}</Text>
              <View style={favoritesStyles.recipeDetails}>
                <View style={favoritesStyles.detailItem}>
                  <Clock size={12} color="#202026" />
                  <Text style={favoritesStyles.detailText}>{item.time}</Text>
                </View>
                <View style={favoritesStyles.detailItem}>
                  <Star size={12} color="#000000" />
                  <Text style={favoritesStyles.detailText}>{item.rating}</Text>
                </View>
                <TouchableOpacity 
                  style={favoritesStyles.openButton}
                  onPress={handleRecipePress}
                >
                  <Text style={favoritesStyles.openButtonText}>Open</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity 
              style={favoritesStyles.heartButton}
              onPress={() => toggleFavorite(index)}
            >
              <Heart size={14} color="#FF5353" fill="#FF5353" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View style={favoritesStyles.emptyStateContainer}>
            <View style={favoritesStyles.emptyStateIconContainer}>
              <Heart size={30} color="#202026" />
            </View>
            <Text style={favoritesStyles.emptyStateTitle}>No Favorites Yet</Text>
            <Text style={favoritesStyles.emptyStateDescription}>
              You haven't added any favorites. Your saved detections will appear here.
            </Text>
            <TouchableOpacity
              style={favoritesStyles.emptyStateButton}
              onPress={() => router.push('/detection')}
            >
              <Text style={favoritesStyles.emptyStateButtonText}>View Detection History</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
