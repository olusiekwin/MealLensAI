<<<<<<< HEAD
import { useState } from 'react';
=======
import { useState, useEffect } from 'react';
>>>>>>> the-moredern-features
import { 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Switch, 
  Alert,
<<<<<<< HEAD
  Linking
} from 'react-native';
import { useRouter } from 'expo-router';
=======
  Linking,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/context/userStore';
>>>>>>> the-moredern-features
import { 
  ArrowLeft, 
  User, 
  Bell, 
  Lock, 
  HelpCircle, 
  Info, 
  LogOut, 
  ChevronRight,
  Moon,
  Globe,
<<<<<<< HEAD
  CreditCard
=======
  CreditCard,
  Crown
>>>>>>> the-moredern-features
} from 'lucide-react-native';
import { settingsStyles } from '@/styles/settings.styles';

export default function SettingsScreen() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
<<<<<<< HEAD
=======
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const { logout, subscription, fetchSubscription } = useUserStore();
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await fetchSubscription();
      } catch (error) {
        console.error('Error loading subscription data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
>>>>>>> the-moredern-features
  
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Logout", 
<<<<<<< HEAD
          onPress: () => router.push('/auth')
=======
          onPress: async () => {
            try {
              setIsLoggingOut(true);
              await logout();
              router.push('/auth');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Logout Error', 'An error occurred during logout. Please try again.');
            } finally {
              setIsLoggingOut(false);
            }
          }
>>>>>>> the-moredern-features
        }
      ]
    );
  };
  
  const handlePaymentPress = () => {
    router.push('/payment');
  };
  
  const openPrivacyPolicy = () => {
    Linking.openURL('https://www.meallensai.com/privacy-policy');
  };
  
  const openTermsOfService = () => {
    Linking.openURL('https://www.meallensai.com/terms-of-service');
  };
  
  return (
    <View style={settingsStyles.container}>
      <View style={settingsStyles.header}>
        <TouchableOpacity 
          style={settingsStyles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#202026" />
        </TouchableOpacity>
        <Text style={settingsStyles.headerTitle}>Settings</Text>
        <View style={settingsStyles.placeholder} />
      </View>
      
      <ScrollView 
        style={settingsStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={settingsStyles.section}>
          <Text style={settingsStyles.sectionTitle}>Account</Text>
          
          <TouchableOpacity 
            style={settingsStyles.settingItem}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <View style={settingsStyles.settingIconContainer}>
<<<<<<< HEAD
              <User size={20} color="#FF6A00" />
=======
              <User size={20} color="#000000" />
>>>>>>> the-moredern-features
            </View>
            <Text style={settingsStyles.settingText}>Profile</Text>
            <ChevronRight size={20} color="#B5B5B5" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={settingsStyles.settingItem}
            onPress={handlePaymentPress}
          >
            <View style={settingsStyles.settingIconContainer}>
<<<<<<< HEAD
              <CreditCard size={20} color="#FF6A00" />
=======
              <CreditCard size={20} color="#000000" />
>>>>>>> the-moredern-features
            </View>
            <Text style={settingsStyles.settingText}>Payment Methods</Text>
            <ChevronRight size={20} color="#B5B5B5" />
          </TouchableOpacity>
          
<<<<<<< HEAD
          <TouchableOpacity style={settingsStyles.settingItem}>
            <View style={settingsStyles.settingIconContainer}>
              <Lock size={20} color="#FF6A00" />
=======
          <TouchableOpacity 
            style={settingsStyles.settingItem}
            onPress={() => router.push('/subscription/manage' as any)}
          >
            <View style={settingsStyles.settingIconContainer}>
              <Crown size={20} color="#000000" />
            </View>
            <View style={settingsStyles.settingTextContainer}>
              <Text style={settingsStyles.settingText}>Subscription</Text>
              {!isLoading && (
                <View style={[
                  settingsStyles.subscriptionBadge,
                  subscription.status === 'premium' ? 
                    settingsStyles.premiumBadge : 
                    settingsStyles.freeBadge
                ]}>
                  <Text style={settingsStyles.subscriptionBadgeText}>
                    {subscription.status === 'premium' ? 'PREMIUM' : 'FREE'}
                  </Text>
                </View>
              )}
            </View>
            <ChevronRight size={20} color="#B5B5B5" />
          </TouchableOpacity>
          
          <TouchableOpacity style={settingsStyles.settingItem}>
            <View style={settingsStyles.settingIconContainer}>
              <Lock size={20} color="#000000" />
>>>>>>> the-moredern-features
            </View>
            <Text style={settingsStyles.settingText}>Security</Text>
            <ChevronRight size={20} color="#B5B5B5" />
          </TouchableOpacity>
        </View>
        
        <View style={settingsStyles.section}>
          <Text style={settingsStyles.sectionTitle}>Preferences</Text>
          
          <View style={settingsStyles.settingItem}>
            <View style={settingsStyles.settingIconContainer}>
<<<<<<< HEAD
              <Bell size={20} color="#FF6A00" />
            </View>
            <Text style={settingsStyles.settingText}>Notifications</Text>
            <Switch
              trackColor={{ false: "#E0E0E0", true: "#FF6A00" }}
=======
              <Bell size={20} color="#000000" />
            </View>
            <Text style={settingsStyles.settingText}>Notifications</Text>
            <Switch
              trackColor={{ false: "#E0E0E0", true: "#000000" }}
>>>>>>> the-moredern-features
              thumbColor="#FFFFFF"
              ios_backgroundColor="#E0E0E0"
              onValueChange={setNotificationsEnabled}
              value={notificationsEnabled}
            />
          </View>
          
          <View style={settingsStyles.settingItem}>
            <View style={settingsStyles.settingIconContainer}>
<<<<<<< HEAD
              <Moon size={20} color="#FF6A00" />
            </View>
            <Text style={settingsStyles.settingText}>Dark Mode</Text>
            <Switch
              trackColor={{ false: "#E0E0E0", true: "#FF6A00" }}
=======
              <Moon size={20} color="#000000" />
            </View>
            <Text style={settingsStyles.settingText}>Dark Mode</Text>
            <Switch
              trackColor={{ false: "#E0E0E0", true: "#000000" }}
>>>>>>> the-moredern-features
              thumbColor="#FFFFFF"
              ios_backgroundColor="#E0E0E0"
              onValueChange={setDarkModeEnabled}
              value={darkModeEnabled}
            />
          </View>
          
          <TouchableOpacity style={settingsStyles.settingItem}>
            <View style={settingsStyles.settingIconContainer}>
<<<<<<< HEAD
              <Globe size={20} color="#FF6A00" />
=======
              <Globe size={20} color="#000000" />
>>>>>>> the-moredern-features
            </View>
            <Text style={settingsStyles.settingText}>Language</Text>
            <View style={settingsStyles.valueContainer}>
              <Text style={settingsStyles.valueText}>English</Text>
              <ChevronRight size={20} color="#B5B5B5" />
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={settingsStyles.section}>
          <Text style={settingsStyles.sectionTitle}>Support</Text>
          
          <TouchableOpacity style={settingsStyles.settingItem}>
            <View style={settingsStyles.settingIconContainer}>
<<<<<<< HEAD
              <HelpCircle size={20} color="#FF6A00" />
=======
              <HelpCircle size={20} color="#000000" />
>>>>>>> the-moredern-features
            </View>
            <Text style={settingsStyles.settingText}>Help Center</Text>
            <ChevronRight size={20} color="#B5B5B5" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={settingsStyles.settingItem}
            onPress={openPrivacyPolicy}
          >
            <View style={settingsStyles.settingIconContainer}>
<<<<<<< HEAD
              <Lock size={20} color="#FF6A00" />
=======
              <Lock size={20} color="#000000" />
>>>>>>> the-moredern-features
            </View>
            <Text style={settingsStyles.settingText}>Privacy Policy</Text>
            <ChevronRight size={20} color="#B5B5B5" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={settingsStyles.settingItem}
            onPress={openTermsOfService}
          >
            <View style={settingsStyles.settingIconContainer}>
<<<<<<< HEAD
              <Info size={20} color="#FF6A00" />
=======
              <Info size={20} color="#000000" />
>>>>>>> the-moredern-features
            </View>
            <Text style={settingsStyles.settingText}>Terms of Service</Text>
            <ChevronRight size={20} color="#B5B5B5" />
          </TouchableOpacity>
        </View>
        
        <View style={settingsStyles.section}>
          <TouchableOpacity 
            style={settingsStyles.logoutButton}
            onPress={handleLogout}
          >
            <LogOut size={20} color="#FF3B30" />
            <Text style={settingsStyles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
        
        <View style={settingsStyles.versionContainer}>
          <Text style={settingsStyles.versionText}>MealLensAI v1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}