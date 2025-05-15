import { useState } from 'react';
import { 
  Text, 
  View, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  TextInput,
  Alert,
  Linking
} from 'react-native';
import { ArrowLeft, Search, ShoppingCart, Plus, Minus, ExternalLink } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { shopStyles } from '@/styles/shop.styles';

export default function ShopRecommenderScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<{[key: string]: number}>({});
  
  const addToCart = (productId: string) => {
    setCart(prevCart => ({
      ...prevCart,
      [productId]: (prevCart[productId] || 0) + 1
    }));
  };
  
  const removeFromCart = (productId: string) => {
    setCart(prevCart => {
      const newCart = { ...prevCart };
      if (newCart[productId] > 1) {
        newCart[productId] -= 1;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };
  
  const getCartCount = (productId: string) => {
    return cart[productId] || 0;
  };
  
  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0);
  };
  
  const handleCheckout = () => {
    if (getTotalItems() === 0) {
      Alert.alert("Empty Cart", "Please add items to your cart before checking out.");
      return;
    }
    
    Alert.alert(
      "Checkout",
      "Would you like to proceed to checkout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Proceed", 
          onPress: () => {
            Alert.alert("Success", "Your order has been placed successfully!");
            setCart({});
          }
        }
      ]
    );
  };
  
  const handleDeliveryOption = (url: string) => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert("Error", "Cannot open this URL");
      }
    });
  };
  
  const filteredProducts = searchQuery.trim() 
    ? products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;
  
  return (
    <View style={shopStyles.container}>
      <View style={shopStyles.header}>
        <TouchableOpacity 
          style={shopStyles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#202026" />
        </TouchableOpacity>
        <Text style={shopStyles.headerTitle}>Shop Ingredients</Text>
        <TouchableOpacity 
          style={shopStyles.cartButton}
          onPress={handleCheckout}
        >
          <ShoppingCart size={24} color="#202026" />
          {getTotalItems() > 0 && (
            <View style={shopStyles.cartBadge}>
              <Text style={shopStyles.cartBadgeText}>{getTotalItems()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      
      <View style={shopStyles.searchContainer}>
        <View style={shopStyles.searchBar}>
          <Search size={20} color="#B5B5B5" style={shopStyles.searchIcon} />
          <TextInput
            style={shopStyles.searchInput}
            placeholder="Search ingredients"
            placeholderTextColor="#B5B5B5"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      
      <ScrollView 
        style={shopStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={shopStyles.categorySection}>
          <Text style={shopStyles.categoryTitle}>Recipe Ingredients</Text>
          <Text style={shopStyles.categorySubtitle}>Pancakes with Fruits & Syrup</Text>
          
          {filteredProducts.map((product, index) => (
            <View key={index} style={shopStyles.productCard}>
              <Image 
                source={{ uri: product.image }} 
                style={shopStyles.productImage} 
              />
              
              <View style={shopStyles.productInfo}>
                <Text style={shopStyles.productName}>{product.name}</Text>
                <Text style={shopStyles.productPrice}>${product.price}</Text>
                <Text style={shopStyles.productQuantity}>{product.quantity}</Text>
              </View>
              
              <View style={shopStyles.productActions}>
                {getCartCount(product.id) > 0 ? (
                  <View style={shopStyles.quantityControl}>
                    <TouchableOpacity 
                      style={shopStyles.quantityButton}
                      onPress={() => removeFromCart(product.id)}
                    >
                      <Minus size={16} color="#202026" />
                    </TouchableOpacity>
                    
                    <Text style={shopStyles.quantityText}>
                      {getCartCount(product.id)}
                    </Text>
                    
                    <TouchableOpacity 
                      style={shopStyles.quantityButton}
                      onPress={() => addToCart(product.id)}
                    >
                      <Plus size={16} color="#202026" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity 
                    style={shopStyles.addButton}
                    onPress={() => addToCart(product.id)}
                  >
                    <Text style={shopStyles.addButtonText}>Add</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>
        
        <View style={shopStyles.deliverySection}>
          <Text style={shopStyles.sectionTitle}>Delivery Options</Text>
          
          {deliveryOptions.map((option, index) => (
            <TouchableOpacity 
              key={index} 
              style={shopStyles.deliveryOption}
              onPress={() => handleDeliveryOption(option.url)}
            >
              <Image 
                source={{ uri: option.logo }} 
                style={shopStyles.deliveryLogo} 
              />
              <View style={shopStyles.deliveryInfo}>
                <Text style={shopStyles.deliveryName}>{option.name}</Text>
                <Text style={shopStyles.deliveryTime}>{option.time}</Text>
              </View>
              <ExternalLink size={20} color="#6A6A6A" />
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={shopStyles.alternativesSection}>
          <Text style={shopStyles.sectionTitle}>Alternative Products</Text>
          
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={shopStyles.alternativesContainer}
          >
            {alternativeProducts.map((product, index) => (
              <TouchableOpacity 
                key={index}
                style={shopStyles.alternativeCard}
              >
                <Image 
                  source={{ uri: product.image }} 
                  style={shopStyles.alternativeImage} 
                />
                <Text style={shopStyles.alternativeName}>{product.name}</Text>
                <Text style={shopStyles.alternativePrice}>${product.price}</Text>
                <TouchableOpacity style={shopStyles.alternativeAddButton}>
                  <Plus size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
      
      <View style={shopStyles.checkoutBar}>
        <View style={shopStyles.totalContainer}>
          <Text style={shopStyles.totalLabel}>Total</Text>
          <Text style={shopStyles.totalAmount}>
            ${calculateTotal(cart).toFixed(2)}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={shopStyles.checkoutButton}
          onPress={handleCheckout}
        >
          <Text style={shopStyles.checkoutButtonText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const calculateTotal = (cart: {[key: string]: number}) => {
  return Object.entries(cart).reduce((total, [productId, quantity]) => {
    const product = products.find(p => p.id === productId);
    return total + (product ? product.price * quantity : 0);
  }, 0);
};

const products = [
  {
    id: 'flour',
    name: 'All-purpose Flour',
    price: 3.99,
    quantity: '2 lb bag',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1c5a1ec21?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'milk',
    name: 'Organic Milk',
    price: 4.49,
    quantity: '1 gallon',
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'eggs',
    name: 'Large Eggs',
    price: 3.29,
    quantity: 'dozen',
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sugar',
    name: 'Granulated Sugar',
    price: 2.99,
    quantity: '4 lb bag',
    image: 'https://images.unsplash.com/photo-1581441363689-1422a3f4a18d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'baking-powder',
    name: 'Baking Powder',
    price: 1.99,
    quantity: '8 oz can',
    image: 'https://images.unsplash.com/photo-1614088685112-0a760b71a3c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'salt',
    name: 'Sea Salt',
    price: 2.49,
    quantity: '26 oz container',
    image: 'https://images.unsplash.com/photo-1518110925495-b37653f402f0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'butter',
    name: 'Unsalted Butter',
    price: 4.99,
    quantity: '1 lb (4 sticks)',
    image: 'https://images.unsplash.com/photo-1589985270958-bf087b2d8ed7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'vanilla',
    name: 'Pure Vanilla Extract',
    price: 7.99,
    quantity: '2 fl oz bottle',
    image: 'https://images.unsplash.com/photo-1631206753348-db44968fd440?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'berries',
    name: 'Mixed Berries',
    price: 5.99,
    quantity: '12 oz package',
    image: 'https://images.unsplash.com/photo-1563746924237-f4471479790f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'syrup',
    name: 'Maple Syrup',
    price: 8.99,
    quantity: '8.5 fl oz bottle',
    image: 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
];

const alternativeProducts = [
  {
    id: 'almond-flour',
    name: 'Almond Flour',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1622597467836-f3e6047cc116?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'coconut-sugar',
    name: 'Coconut Sugar',
    price: 5.49,
    image: 'https://images.unsplash.com/photo-1558642891-54be180ea339?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'oat-milk',
    name: 'Oat Milk',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'honey',
    name: 'Raw Honey',
    price: 7.49,
    image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
];

const deliveryOptions = [
  {
    name: 'Instacart',
    time: 'Delivery in 1-2 hours',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Instacart_logo_and_wordmark.svg/2560px-Instacart_logo_and_wordmark.svg.png',
    url: 'https://www.instacart.com'
  },
  {
    name: 'Amazon Fresh',
    time: 'Delivery tomorrow',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png',
    url: 'https://www.amazon.com/alm/storefront?almBrandId=QW1hem9uIEZyZXNo'
  },
  {
    name: 'Walmart',
    time: 'Pickup in 3 hours',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Walmart_logo.svg/1920px-Walmart_logo.svg.png',
    url: 'https://www.walmart.com/grocery'
  },
];