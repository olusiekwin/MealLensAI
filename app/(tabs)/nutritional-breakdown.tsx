import { useState } from 'react';
import { 
  Text, 
  View, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { ArrowLeft, Info, ShoppingBag, Play } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { nutritionalStyles } from '@/styles/nutritional.styles';
import { ProgressBar } from '@/components/ProgressBar';

const { width } = Dimensions.get('window');

export default function NutritionalBreakdownScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('nutrition');
  
  const handleShopPress = () => {
    router.push('/shop-recommender');
  };
  
  const handleVideoPress = () => {
    router.push('/video-tutorials');
  };
  
  return (
    <View style={nutritionalStyles.container}>
      <View style={nutritionalStyles.header}>
        <TouchableOpacity 
          style={nutritionalStyles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#202026" />
        </TouchableOpacity>
        <Text style={nutritionalStyles.headerTitle}>Nutritional Info</Text>
        <TouchableOpacity 
          style={nutritionalStyles.infoButton}
          onPress={() => {}}
        >
          <Info size={24} color="#202026" />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={nutritionalStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={nutritionalStyles.foodCard}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }} 
            style={nutritionalStyles.foodImage} 
          />
          <View style={nutritionalStyles.foodInfo}>
            <Text style={nutritionalStyles.foodName}>Pancakes with Fruits & Syrup</Text>
            <Text style={nutritionalStyles.foodDescription}>
              Homemade pancakes topped with fresh berries and maple syrup
            </Text>
          </View>
        </View>
        
        <View style={nutritionalStyles.tabContainer}>
          <TouchableOpacity 
            style={[
              nutritionalStyles.tabButton,
              activeTab === 'nutrition' && nutritionalStyles.activeTabButton
            ]}
            onPress={() => setActiveTab('nutrition')}
          >
            <Text 
              style={[
                nutritionalStyles.tabText,
                activeTab === 'nutrition' && nutritionalStyles.activeTabText
              ]}
            >
              Nutrition
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              nutritionalStyles.tabButton,
              activeTab === 'ingredients' && nutritionalStyles.activeTabButton
            ]}
            onPress={() => setActiveTab('ingredients')}
          >
            <Text 
              style={[
                nutritionalStyles.tabText,
                activeTab === 'ingredients' && nutritionalStyles.activeTabText
              ]}
            >
              Ingredients
            </Text>
          </TouchableOpacity>
        </View>
        
        {activeTab === 'nutrition' ? (
          <View style={nutritionalStyles.nutritionContainer}>
            <View style={nutritionalStyles.calorieCard}>
              <Text style={nutritionalStyles.calorieTitle}>Total Calories</Text>
              <Text style={nutritionalStyles.calorieValue}>520</Text>
              <Text style={nutritionalStyles.calorieUnit}>kcal</Text>
            </View>
            
            <View style={nutritionalStyles.macrosContainer}>
              <Text style={nutritionalStyles.sectionTitle}>Macronutrients</Text>
              
              <View style={nutritionalStyles.macroItem}>
                <View style={nutritionalStyles.macroHeader}>
                  <View style={[nutritionalStyles.macroIndicator, { backgroundColor: '#FF5353' }]} />
                  <Text style={nutritionalStyles.macroName}>Protein</Text>
                  <Text style={nutritionalStyles.macroValue}>12g</Text>
                </View>
                <ProgressBar 
                  progress={0.15} 
                  width={width - 64} 
                  color="#FF5353" 
                  unfilledColor="rgba(255, 83, 83, 0.2)"
                />
                <Text style={nutritionalStyles.macroPercentage}>15%</Text>
              </View>
              
              <View style={nutritionalStyles.macroItem}>
                <View style={nutritionalStyles.macroHeader}>
                  <View style={[nutritionalStyles.macroIndicator, { backgroundColor: '#FFE521' }]} />
                  <Text style={nutritionalStyles.macroName}>Carbs</Text>
                  <Text style={nutritionalStyles.macroValue}>68g</Text>
                </View>
                <ProgressBar 
                  progress={0.55} 
                  width={width - 64} 
                  color="#FFE521" 
                  unfilledColor="rgba(255, 229, 33, 0.2)"
                />
                <Text style={nutritionalStyles.macroPercentage}>55%</Text>
              </View>
              
              <View style={nutritionalStyles.macroItem}>
                <View style={nutritionalStyles.macroHeader}>
                  <View style={[nutritionalStyles.macroIndicator, { backgroundColor: '#6C6799' }]} />
                  <Text style={nutritionalStyles.macroName}>Fat</Text>
                  <Text style={nutritionalStyles.macroValue}>25g</Text>
                </View>
                <ProgressBar 
                  progress={0.30} 
                  width={width - 64} 
                  color="#6C6799" 
                  unfilledColor="rgba(108, 103, 153, 0.2)"
                />
                <Text style={nutritionalStyles.macroPercentage}>30%</Text>
              </View>
            </View>
            
            <View style={nutritionalStyles.micronutrientsContainer}>
              <Text style={nutritionalStyles.sectionTitle}>Micronutrients</Text>
              
              <View style={nutritionalStyles.microGrid}>
                {micronutrients.map((nutrient, index) => (
                  <View key={index} style={nutritionalStyles.microItem}>
                    <Text style={nutritionalStyles.microName}>{nutrient.name}</Text>
                    <Text style={nutritionalStyles.microValue}>{nutrient.value}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            <View style={nutritionalStyles.actionButtonsContainer}>
              <TouchableOpacity 
                style={nutritionalStyles.actionButton}
                onPress={handleVideoPress}
              >
                <Play size={20} color="#FFFFFF" style={nutritionalStyles.actionIcon} />
                <Text style={nutritionalStyles.actionButtonText}>Watch Tutorial</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={nutritionalStyles.actionButton}
                onPress={handleShopPress}
              >
                <ShoppingBag size={20} color="#FFFFFF" style={nutritionalStyles.actionIcon} />
                <Text style={nutritionalStyles.actionButtonText}>Shop Ingredients</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={nutritionalStyles.ingredientsContainer}>
            <Text style={nutritionalStyles.sectionTitle}>Main Ingredients</Text>
            
            {ingredients.map((ingredient, index) => (
              <View key={index} style={nutritionalStyles.ingredientItem}>
                <View style={nutritionalStyles.ingredientDot} />
                <Text style={nutritionalStyles.ingredientName}>{ingredient.name}</Text>
                <Text style={nutritionalStyles.ingredientAmount}>{ingredient.amount}</Text>
              </View>
            ))}
            
            <Text style={[nutritionalStyles.sectionTitle, { marginTop: 20 }]}>Optional Toppings</Text>
            
            {toppings.map((topping, index) => (
              <View key={index} style={nutritionalStyles.ingredientItem}>
                <View style={nutritionalStyles.ingredientDot} />
                <Text style={nutritionalStyles.ingredientName}>{topping.name}</Text>
                <Text style={nutritionalStyles.ingredientAmount}>{topping.amount}</Text>
              </View>
            ))}
            
            <View style={nutritionalStyles.actionButtonsContainer}>
              <TouchableOpacity 
                style={nutritionalStyles.actionButton}
                onPress={handleVideoPress}
              >
                <Play size={20} color="#FFFFFF" style={nutritionalStyles.actionIcon} />
                <Text style={nutritionalStyles.actionButtonText}>Watch Tutorial</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={nutritionalStyles.actionButton}
                onPress={handleShopPress}
              >
                <ShoppingBag size={20} color="#FFFFFF" style={nutritionalStyles.actionIcon} />
                <Text style={nutritionalStyles.actionButtonText}>Shop Ingredients</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const micronutrients = [
  { name: 'Fiber', value: '3g' },
  { name: 'Sugar', value: '28g' },
  { name: 'Sodium', value: '390mg' },
  { name: 'Potassium', value: '420mg' },
  { name: 'Vitamin A', value: '15%' },
  { name: 'Vitamin C', value: '25%' },
  { name: 'Calcium', value: '20%' },
  { name: 'Iron', value: '10%' },
];

const ingredients = [
  { name: 'All-purpose flour', amount: '1 cup' },
  { name: 'Milk', amount: '3/4 cup' },
  { name: 'Eggs', amount: '2 large' },
  { name: 'Sugar', amount: '2 tbsp' },
  { name: 'Baking powder', amount: '2 tsp' },
  { name: 'Salt', amount: '1/4 tsp' },
  { name: 'Butter (melted)', amount: '2 tbsp' },
  { name: 'Vanilla extract', amount: '1 tsp' },
];

const toppings = [
  { name: 'Fresh berries', amount: '1 cup' },
  { name: 'Maple syrup', amount: '1/4 cup' },
  { name: 'Whipped cream', amount: '2 tbsp' },
  { name: 'Powdered sugar', amount: '1 tbsp' },
];