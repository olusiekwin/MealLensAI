import { Text, View, ScrollView, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { Search, Filter, Apple, AlertCircle, Pizza } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { plannerStyles } from "@/styles/planner.styles";
import { useState } from 'react';

export default function FoodPlannerScreen() {
  const router = useRouter();
  const [activeDay, setActiveDay] = useState(0);
  const [activeMealType, setActiveMealType] = useState('Breakfast');
  
  const handleRecipePress = () => {
    router.push('/recipe-details');
  };
  
  const handleFavoritesPress = () => {
    Alert.alert("Favorites", "Your favorite recipes are available here!");
  };
  
  const handleFavoriteCuisinesPress = () => {
    router.push('/recipes');
  };
  
  return (
    <View style={plannerStyles.container}>
      <View style={plannerStyles.header}>
        <Text style={plannerStyles.headerTitle}>Food Planner</Text>
        <TouchableOpacity onPress={handleFavoritesPress}>
          <Text style={plannerStyles.favoritesLink}>Favorites</Text>
        </TouchableOpacity>
      </View>
      
      {/* Search Bar */}
      <View style={plannerStyles.searchContainer}>
        <View style={plannerStyles.searchBar}>
          <Search size={20} color="#202026" style={plannerStyles.searchIcon} />
          <TextInput
            style={plannerStyles.searchInput}
            placeholder="Search recipes"
            placeholderTextColor="#B3B3B3"
          />
          <TouchableOpacity style={plannerStyles.filterButton}>
            <Filter size={24} color="#202026" />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Preference Cards */}
      <View style={plannerStyles.preferencesContainer}>
        <TouchableOpacity style={plannerStyles.preferenceCard}>
          <View style={[plannerStyles.iconCircle, plannerStyles.orangeCircle]}>
            <Apple size={20} color="#FFFFFF" />
          </View>
          <Text style={plannerStyles.preferenceText}>Food{"\n"}Preferences</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={plannerStyles.preferenceCard}>
          <View style={[plannerStyles.iconCircle, plannerStyles.orangeCircle]}>
            <AlertCircle size={20} color="#FFFFFF" />
          </View>
          <Text style={plannerStyles.preferenceText}>Food{"\n"}Restrictions</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={plannerStyles.preferenceCard}
          onPress={handleFavoriteCuisinesPress}
        >
          <View style={[plannerStyles.iconCircle, plannerStyles.orangeCircle]}>
            <Pizza size={20} color="#FFFFFF" />
          </View>
          <Text style={plannerStyles.preferenceText}>Favorite{"\n"}Cuisines</Text>
        </TouchableOpacity>
      </View>
      
      {/* Meal Plans Section */}
      <View style={plannerStyles.mealPlansSection}>
        <Text style={plannerStyles.sectionTitle}>Meal Plans</Text>
        
        {/* Date Navigation */}
        <View style={plannerStyles.dateNavigation}>
          <TouchableOpacity style={plannerStyles.dateNavButton}>
            <Text style={plannerStyles.chevronLeft}>‹</Text>
          </TouchableOpacity>
          
          <Text style={plannerStyles.dateRange}>March 24-30</Text>
          
          <TouchableOpacity style={plannerStyles.dateNavButton}>
            <Text style={plannerStyles.chevronRight}>›</Text>
          </TouchableOpacity>
        </View>
        
        {/* Days of Week */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={plannerStyles.daysContainer}
        >
          {days.map((day, index) => (
            <TouchableOpacity 
              key={index} 
              style={[
                plannerStyles.dayCard, 
                activeDay === index && plannerStyles.activeDayCard
              ]}
              onPress={() => setActiveDay(index)}
            >
              <Text 
                style={[
                  plannerStyles.dayName, 
                  activeDay === index && plannerStyles.activeDayText
                ]}
              >
                {day.name}
              </Text>
              <Text 
                style={[
                  activeDay === index ? plannerStyles.activeDayNumber : plannerStyles.dayNumber
                ]}
              >
                {day.number}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        {/* Meal Type Selector */}
        <View style={plannerStyles.mealTypeContainer}>
          {mealTypes.map((type, index) => (
            <TouchableOpacity 
              key={index}
              style={
                activeMealType === type 
                  ? plannerStyles.mealTypeButton 
                  : plannerStyles.mealTypeButtonInactive
              }
              onPress={() => setActiveMealType(type)}
            >
              <Text 
                style={
                  activeMealType === type 
                    ? plannerStyles.mealTypeText 
                    : plannerStyles.mealTypeTextInactive
                }
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Meal Card */}
        <View style={plannerStyles.mealCard}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }} 
            style={plannerStyles.mealImage} 
          />
          
          <Text style={plannerStyles.mealTitle}>Fruits & Caramel Syrup Pancakes</Text>
          
          <View style={plannerStyles.nutritionContainer}>
            <View style={plannerStyles.nutritionItem}>
              <View style={[plannerStyles.nutritionDot, { backgroundColor: '#FF5353' }]} />
              <Text style={plannerStyles.nutritionLabel}>Protein</Text>
              <Text style={plannerStyles.nutritionValue}>25</Text>
            </View>
            
            <View style={plannerStyles.nutritionItem}>
              <View style={[plannerStyles.nutritionDot, { backgroundColor: '#6C6799' }]} />
              <Text style={plannerStyles.nutritionLabel}>Fat</Text>
              <Text style={plannerStyles.nutritionValue}>25</Text>
            </View>
            
            <View style={plannerStyles.nutritionItem}>
              <View style={[plannerStyles.nutritionDot, { backgroundColor: '#FFE521' }]} />
              <Text style={plannerStyles.nutritionLabel}>Carbs</Text>
              <Text style={plannerStyles.nutritionValue}>25</Text>
            </View>
            
            <TouchableOpacity 
              style={plannerStyles.recipeButton}
              onPress={handleRecipePress}
            >
              <Text style={plannerStyles.recipeButtonText}>Recipe</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const days = [
  { name: 'Mon', number: '24' },
  { name: 'Tue', number: '25' },
  { name: 'Wed', number: '26' },
  { name: 'Thu', number: '27' },
  { name: 'Fri', number: '28' },
  { name: 'Sat', number: '29' },
  { name: 'Sun', number: '30' },
];

const mealTypes = ['Breakfast', 'Lunch', 'Snack', 'Dinner'];