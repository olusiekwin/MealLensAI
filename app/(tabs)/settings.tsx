import { useState } from 'react';
import { 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Switch, 
  Alert,
  Linking
} from 'react-native';
import { useRouter } from 'expo-router';
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
  CreditCard
} from 'lucide-react-native';
import { settingsStyles } from '@/styles/settings.styles';

export default function SettingsScreen() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  
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
          onPress: () => router.push('/auth')
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
              <User size={20} color="#FF6A00" />
            </View>
            <Text style={settingsStyles.settingText}>Profile</Text>
            <ChevronRight size={20} color="#B5B5B5" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={settingsStyles.settingItem}
            onPress={handlePaymentPress}
          >
            <View style={settingsStyles.settingIconContainer}>
              <CreditCard size={20} color="#FF6A00" />
            </View>
            <Text style={settingsStyles.settingText}>Payment Methods</Text>
            <ChevronRight size={20} color="#B5B5B5" />
          </TouchableOpacity>
          
          <TouchableOpacity style={settingsStyles.settingItem}>
            <View style={settingsStyles.settingIconContainer}>
              <Lock size={20} color="#FF6A00" />
            </View>
            <Text style={settingsStyles.settingText}>Security</Text>
            <ChevronRight size={20} color="#B5B5B5" />
          </TouchableOpacity>
        </View>
        
        <View style={settingsStyles.section}>
          <Text style={settingsStyles.sectionTitle}>Preferences</Text>
          
          <View style={settingsStyles.settingItem}>
            <View style={settingsStyles.settingIconContainer}>
              <Bell size={20} color="#FF6A00" />
            </View>
            <Text style={settingsStyles.settingText}>Notifications</Text>
            <Switch
              trackColor={{ false: "#E0E0E0", true: "#FF6A00" }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#E0E0E0"
              onValueChange={setNotificationsEnabled}
              value={notificationsEnabled}
            />
          </View>
          
          <View style={settingsStyles.settingItem}>
            <View style={settingsStyles.settingIconContainer}>
              <Moon size={20} color="#FF6A00" />
            </View>
            <Text style={settingsStyles.settingText}>Dark Mode</Text>
            <Switch
              trackColor={{ false: "#E0E0E0", true: "#FF6A00" }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#E0E0E0"
              onValueChange={setDarkModeEnabled}
              value={darkModeEnabled}
            />
          </View>
          
          <TouchableOpacity style={settingsStyles.settingItem}>
            <View style={settingsStyles.settingIconContainer}>
              <Globe size={20} color="#FF6A00" />
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
              <HelpCircle size={20} color="#FF6A00" />
            </View>
            <Text style={settingsStyles.settingText}>Help Center</Text>
            <ChevronRight size={20} color="#B5B5B5" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={settingsStyles.settingItem}
            onPress={openPrivacyPolicy}
          >
            <View style={settingsStyles.settingIconContainer}>
              <Lock size={20} color="#FF6A00" />
            </View>
            <Text style={settingsStyles.settingText}>Privacy Policy</Text>
            <ChevronRight size={20} color="#B5B5B5" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={settingsStyles.settingItem}
            onPress={openTermsOfService}
          >
            <View style={settingsStyles.settingIconContainer}>
              <Info size={20} color="#FF6A00" />
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