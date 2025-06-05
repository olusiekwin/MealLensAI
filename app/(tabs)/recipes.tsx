import { useState } from 'react';
import { Text, View, ScrollView, Image, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { Search, Filter, Clock, Star, Heart } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { recipesStyles } from '@/styles/recipes.styles';

export default function RecipesScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleRecipePress = () => {
    router.push('/recipe-details');
  };
  
  const filteredRecipes = searchQuery.trim() 
    ? recipes.filter(recipe => 
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : recipes;
  
  return (
    <View style={recipesStyles.container}>
      <View style={recipesStyles.header}>
        <Text style={recipesStyles.title}>Recipes</Text>
        <View style={recipesStyles.headerIcons}>
          <TouchableOpacity style={recipesStyles.iconButton}>
            <Search size={20} color="#202026" />
          </TouchableOpacity>
          <TouchableOpacity style={recipesStyles.iconButton}>
            <Filter size={20} color="#202026" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={recipesStyles.searchContainer}>
        <View style={recipesStyles.searchBar}>
          <Search size={20} color="#B5B5B5" style={recipesStyles.searchIcon} />
          <TextInput
            style={recipesStyles.searchInput}
            placeholder="Search recipes"
            placeholderTextColor="#B5B5B5"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      
      <View style={recipesStyles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category, index) => (
            <TouchableOpacity 
              key={index} 
              style={[
                recipesStyles.categoryButton, 
                activeCategory === category && recipesStyles.activeCategoryButton
              ]}
              onPress={() => setActiveCategory(category)}
            >
              <Text 
                style={[
                  recipesStyles.categoryText, 
                  activeCategory === category && recipesStyles.activeCategoryText
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <FlatList
        data={filteredRecipes}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={recipesStyles.recipesList}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={recipesStyles.recipeCard}
            onPress={handleRecipePress}
          >
            <Image source={{ uri: item.image }} style={recipesStyles.recipeImage} />
            <View style={recipesStyles.recipeContent}>
              <Text style={recipesStyles.recipeTitle}>{item.title}</Text>
              <Text style={recipesStyles.recipeDescription}>{item.description}</Text>
              <View style={recipesStyles.recipeDetails}>
                <View style={recipesStyles.detailItem}>
                  <Clock size={12} color="#202026" />
                  <Text style={recipesStyles.detailText}>{item.time}</Text>
                </View>
                <View style={recipesStyles.detailItem}>
                  <Star size={12} color="#000000" />
                  <Text style={recipesStyles.detailText}>{item.rating}</Text>
                </View>
                <TouchableOpacity 
                  style={recipesStyles.openButton}
                  onPress={handleRecipePress}
                >
                  <Text style={recipesStyles.openButtonText}>Open</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={recipesStyles.heartButton}>
              <Heart size={14} color="#FF5353" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        ListFooterComponent={() => (
          <View style={recipesStyles.favoritesSection}>
            <View style={recipesStyles.sectionHeader}>
              <Text style={recipesStyles.sectionTitle}>Favorite Recipes</Text>
            </View>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={recipesStyles.favoritesContainer}
            >
              {favorites.map((recipe, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={recipesStyles.favoriteCard}
                  onPress={handleRecipePress}
                >
                  <Image source={{ uri: recipe.image }} style={recipesStyles.favoriteImage} />
                  <View style={recipesStyles.favoriteContent}>
                    <Text style={recipesStyles.favoriteTitle}>{recipe.title}</Text>
                    <View style={recipesStyles.favoriteDetails}>
                      <View style={recipesStyles.detailItem}>
                        <Clock size={12} color="#202026" />
                        <Text style={recipesStyles.detailText}>{recipe.time}</Text>
                      </View>
                      <View style={recipesStyles.detailItem}>
                        <Star size={12} color="#000000" />
                        <Text style={recipesStyles.detailText}>{recipe.rating}</Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity style={recipesStyles.favoriteHeartButton}>
                    <Heart size={14} color="#FF5353" fill="#FF5353" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      />
    </View>
  );
}

const categories = [
  "All", "Breakfast", "Lunch", "Dinner", "Desserts", "Snacks", "Drinks"
];

const recipes = [
  {
    title: "Honey Sweet Korean Fried Chicken",
    description: "Crispy fried chicken glazed with sweet and spicy sauce",
    time: "45 min",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    title: "Avocado & Egg Toast",
    description: "Simple and nutritious breakfast with creamy avocado",
    time: "15 min",
    rating: "4.5",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    title: "Vegetable Stir Fry with Tofu",
    description: "Healthy and colorful vegetable stir fry with crispy tofu",
    time: "25 min",
    rating: "4.2",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    title: "Berry Smoothie Bowl",
    description: "Refreshing smoothie bowl topped with fresh fruits and granola",
    time: "10 min",
    rating: "4.7",
    image: "https://images.unsplash.com/photo-1546039907-7fa05f864c02?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
];

const favorites = [
  {
    title: "Egg & Avocado Sandwich",
    time: "15 min",
    rating: "4.2",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    title: "Vegetable Stir Fry",
    time: "20 min",
    rating: "4.5",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    title: "Berry Smoothie Bowl",
    time: "10 min",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1546039907-7fa05f864c02?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
];