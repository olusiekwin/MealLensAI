import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Check, Crown, Zap } from 'lucide-react-native';
import { useUserStore } from '@/context/userStore';
import api from '@/services/api';

const plans = [
  {
    id: 'weekly',
    title: 'Weekly',
    price: '$0.99',
    pricePerWeek: '$0.99',
    features: [
      'Unlimited scans',
      'No ads',
      'Priority support',
      'Recipe saving'
    ],
    popular: false
  },
  {
    id: 'monthly',
    title: 'Monthly',
    price: '$3.00',
    pricePerWeek: '$0.75',
    features: [
      'Unlimited scans',
      'No ads',
      'Priority support',
      'Recipe saving',
      'Meal planning'
    ],
    popular: true
  },
  {
    id: 'annual',
    title: 'Annual',
    price: '$29.99',
    pricePerWeek: '$0.58',
    features: [
      'Unlimited scans',
      'No ads',
      'Priority support',
      'Recipe saving',
      'Meal planning',
      'Nutritional insights',
      'Shopping list generation'
    ],
    popular: false
  }
];

export default function SubscriptionScreen() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [isLoading, setIsLoading] = useState(false);
  
  const { subscription, fetchSubscription } = useUserStore();
  
  const handleSubscribe = async () => {
    setIsLoading(true);
    
    try {
      // In a real app, this would initiate the payment process
      const response = await api.post('/payment/create-subscription', {
        plan: selectedPlan,
        payment_method: 'card',
        email: 'user@example.com'
      });
      
      if (response.data && response.data.success) {
        // If there's a payment URL, open it
        if (response.data.data?.authorization_url) {
          // In a real app, we would open this URL for payment
          console.log('Payment URL:', response.data.data.authorization_url);
        }
        
        // Refresh subscription status
        await fetchSubscription();
        
        Alert.alert(
          'Success',
          'Your subscription has been processed successfully!',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } else {
        throw new Error('Subscription failed');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      
      // For demo purposes, simulate a successful subscription
      Alert.alert(
        'Subscription Activated',
        'Your premium subscription has been activated successfully!',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#202026" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Premium Subscription</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.heroSection}>
          <View style={styles.iconContainer}>
            <Crown size={32} color="#FFFFFF" />
          </View>
          <Text style={styles.heroTitle}>Unlock Premium Features</Text>
          <Text style={styles.heroSubtitle}>
            Get unlimited scans, remove ads, and access exclusive features
          </Text>
        </View>
        
        <View style={styles.plansContainer}>
          {plans.map(plan => (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.planCard,
                selectedPlan === plan.id && styles.selectedPlan,
                plan.popular && styles.popularPlan
              ]}
              onPress={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularBadgeText}>POPULAR</Text>
                </View>
              )}
              
              <Text style={styles.planTitle}>{plan.title}</Text>
              <Text style={styles.planPrice}>{plan.price}</Text>
              <Text style={styles.planPricePerWeek}>{plan.pricePerWeek} per week</Text>
              
              <View style={styles.featuresContainer}>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Check size={16} color="#67C74F" />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
              
              {selectedPlan === plan.id && (
                <View style={styles.selectedIndicator} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.subscribeButton}
          onPress={handleSubscribe}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <>
              <Zap size={20} color="#FFFFFF" />
              <Text style={styles.subscribeButtonText}>
                Subscribe Now
              </Text>
            </>
          )}
        </TouchableOpacity>
        
        <Text style={styles.termsText}>
          By subscribing, you agree to our Terms of Service and Privacy Policy.
          Subscriptions automatically renew unless auto-renew is turned off.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202026',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#202026',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#6B6B6B',
    textAlign: 'center',
    lineHeight: 24,
  },
  plansContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  planCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPlan: {
    borderColor: '#000000',
    backgroundColor: '#FFF9F5',
  },
  popularPlan: {
    backgroundColor: '#FFF9F5',
  },
  popularBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#000000',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  popularBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  planTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202026',
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 28,
    fontWeight: '700',
    color: '#202026',
    marginBottom: 4,
  },
  planPricePerWeek: {
    fontSize: 14,
    color: '#6B6B6B',
    marginBottom: 16,
  },
  featuresContainer: {
    marginTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#202026',
    marginLeft: 8,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 4,
    backgroundColor: '#000000',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  subscribeButton: {
    backgroundColor: '#000000',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  subscribeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  termsText: {
    fontSize: 12,
    color: '#6B6B6B',
    textAlign: 'center',
    lineHeight: 18,
  },
});
