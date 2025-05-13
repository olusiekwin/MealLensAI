import { useState } from 'react';
import { 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Image,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  CreditCard, 
  Calendar, 
  Lock,
  CheckCircle,
  User
} from 'lucide-react-native';
import { paymentStyles } from '@/styles/payment.styles';

export default function PaymentScreen() {
  const router = useRouter();
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [isLoading, setIsLoading] = useState(false);
  
  const formatCardNumber = (text: string): string => {
    // Remove all non-digit characters
    const cleaned = text.replace(/\D/g, '');
    // Add space after every 4 digits
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    // Limit to 19 characters (16 digits + 3 spaces)
    return formatted.slice(0, 19);
  };
  
  const formatExpiryDate = (text: string): string => {
    // Remove all non-digit characters
    const cleaned = text.replace(/\D/g, '');
    // Add slash after first 2 digits
    if (cleaned.length > 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };
  
  const handleSubmit = () => {
    if (!cardNumber || !cardName || !expiryDate || !cvv) {
      Alert.alert('Error', 'Please fill in all card details');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Payment Successful',
        `You have successfully subscribed to the ${selectedPlan === 'monthly' ? 'Monthly' : 'Annual'} plan.`,
        [
          { 
            text: 'OK', 
            onPress: () => router.push('/(tabs)') 
          }
        ]
      );
    }, 2000);
  };
  
  return (
    <View style={paymentStyles.container}>
      <View style={paymentStyles.header}>
        <TouchableOpacity 
          style={paymentStyles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#202026" />
        </TouchableOpacity>
        <Text style={paymentStyles.headerTitle}>Payment</Text>
        <View style={paymentStyles.placeholder} />
      </View>
      
      <ScrollView 
        style={paymentStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={paymentStyles.planSection}>
          <Text style={paymentStyles.sectionTitle}>Choose a Plan</Text>
          
          <View style={paymentStyles.planOptions}>
            <TouchableOpacity 
              style={[
                paymentStyles.planCard,
                selectedPlan === 'monthly' && paymentStyles.selectedPlanCard
              ]}
              onPress={() => setSelectedPlan('monthly')}
            >
              <View style={paymentStyles.planHeader}>
                <Text style={paymentStyles.planName}>Monthly</Text>
                {selectedPlan === 'monthly' && (
                  <CheckCircle size={20} color="#FF6A00" />
                )}
              </View>
              <Text style={paymentStyles.planPrice}>$9.99</Text>
              <Text style={paymentStyles.planPeriod}>per month</Text>
              <Text style={paymentStyles.planFeature}>• All premium recipes</Text>
              <Text style={paymentStyles.planFeature}>• Unlimited AI food detection</Text>
              <Text style={paymentStyles.planFeature}>• Personalized meal plans</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                paymentStyles.planCard,
                selectedPlan === 'annual' && paymentStyles.selectedPlanCard
              ]}
              onPress={() => setSelectedPlan('annual')}
            >
              <View style={paymentStyles.planHeader}>
                <Text style={paymentStyles.planName}>Annual</Text>
                {selectedPlan === 'annual' && (
                  <CheckCircle size={20} color="#FF6A00" />
                )}
              </View>
              <Text style={paymentStyles.planPrice}>$89.99</Text>
              <Text style={paymentStyles.planPeriod}>per year</Text>
              <Text style={paymentStyles.planFeature}>• All premium recipes</Text>
              <Text style={paymentStyles.planFeature}>• Unlimited AI food detection</Text>
              <Text style={paymentStyles.planFeature}>• Personalized meal plans</Text>
              <Text style={paymentStyles.planFeature}>• Save 25%</Text>
              <View style={paymentStyles.saveBadge}>
                <Text style={paymentStyles.saveBadgeText}>Best Value</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={paymentStyles.paymentMethodSection}>
          <Text style={paymentStyles.sectionTitle}>Payment Method</Text>
          
          <View style={paymentStyles.paymentOptions}>
            <TouchableOpacity style={paymentStyles.paymentOptionButton}>
              <Image 
                source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Apple-logo.png' }} 
                style={paymentStyles.paymentOptionIcon} 
              />
              <Text style={paymentStyles.paymentOptionText}>Apple Pay</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={paymentStyles.paymentOptionButton}>
              <Image 
                source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }} 
                style={paymentStyles.paymentOptionIcon} 
              />
              <Text style={paymentStyles.paymentOptionText}>Google Pay</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={paymentStyles.cardSection}>
          <Text style={paymentStyles.sectionTitle}>Card Details</Text>
          
          <View style={paymentStyles.cardContainer}>
            <View style={paymentStyles.cardHeader}>
              <CreditCard size={24} color="#202026" />
              <View style={paymentStyles.cardTypes}>
                <Image 
                  source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png' }} 
                  style={paymentStyles.cardTypeIcon} 
                />
                <Image 
                  source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/1280px-Visa_Inc._logo.svg.png' }} 
                  style={paymentStyles.cardTypeIcon} 
                />
              </View>
            </View>
            
            <View style={paymentStyles.inputContainer}>
              <Text style={paymentStyles.inputLabel}>Card Number</Text>
              <View style={paymentStyles.inputWrapper}>
                <CreditCard size={20} color="#B5B5B5" style={paymentStyles.inputIcon} />
                <TextInput
                  style={paymentStyles.input}
                  placeholder="1234 5678 9012 3456"
                  placeholderTextColor="#B5B5B5"
                  keyboardType="number-pad"
                  value={cardNumber}
                  onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                  maxLength={19}
                />
              </View>
            </View>
            
            <View style={paymentStyles.inputContainer}>
              <Text style={paymentStyles.inputLabel}>Cardholder Name</Text>
              <View style={paymentStyles.inputWrapper}>
                <User size={20} color="#B5B5B5" style={paymentStyles.inputIcon} />
                <TextInput
                  style={paymentStyles.input}
                  placeholder="John Doe"
                  placeholderTextColor="#B5B5B5"
                  value={cardName}
                  onChangeText={setCardName}
                />
              </View>
            </View>
            
            <View style={paymentStyles.rowInputs}>
              <View style={[paymentStyles.inputContainer, { flex: 1, marginRight: 10 }]}>
                <Text style={paymentStyles.inputLabel}>Expiry Date</Text>
                <View style={paymentStyles.inputWrapper}>
                  <Calendar size={20} color="#B5B5B5" style={paymentStyles.inputIcon} />
                  <TextInput
                    style={paymentStyles.input}
                    placeholder="MM/YY"
                    placeholderTextColor="#B5B5B5"
                    keyboardType="number-pad"
                    value={expiryDate}
                    onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                    maxLength={5}
                  />
                </View>
              </View>
              
              <View style={[paymentStyles.inputContainer, { flex: 1 }]}>
                <Text style={paymentStyles.inputLabel}>CVV</Text>
                <View style={paymentStyles.inputWrapper}>
                  <Lock size={20} color="#B5B5B5" style={paymentStyles.inputIcon} />
                  <TextInput
                    style={paymentStyles.input}
                    placeholder="123"
                    placeholderTextColor="#B5B5B5"
                    keyboardType="number-pad"
                    value={cvv}
                    onChangeText={setCvv}
                    maxLength={3}
                    secureTextEntry
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
        
        <View style={paymentStyles.summarySection}>
          <Text style={paymentStyles.sectionTitle}>Order Summary</Text>
          
          <View style={paymentStyles.summaryContainer}>
            <View style={paymentStyles.summaryRow}>
              <Text style={paymentStyles.summaryLabel}>
                {selectedPlan === 'monthly' ? 'Monthly Plan' : 'Annual Plan'}
              </Text>
              <Text style={paymentStyles.summaryValue}>
                ${selectedPlan === 'monthly' ? '9.99' : '89.99'}
              </Text>
            </View>
            
            <View style={paymentStyles.summaryRow}>
              <Text style={paymentStyles.summaryLabel}>Tax</Text>
              <Text style={paymentStyles.summaryValue}>
                ${selectedPlan === 'monthly' ? '0.50' : '4.50'}
              </Text>
            </View>
            
            <View style={paymentStyles.divider} />
            
            <View style={paymentStyles.summaryRow}>
              <Text style={paymentStyles.totalLabel}>Total</Text>
              <Text style={paymentStyles.totalValue}>
                ${selectedPlan === 'monthly' ? '10.49' : '94.49'}
              </Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity 
          style={[
            paymentStyles.payButton,
            isLoading && paymentStyles.payButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={paymentStyles.payButtonText}>
            {isLoading ? 'Processing...' : `Pay $${selectedPlan === 'monthly' ? '10.49' : '94.49'}`}
          </Text>
        </TouchableOpacity>
        
        <View style={paymentStyles.secureNoteContainer}>
          <Lock size={16} color="#6A6A6A" />
          <Text style={paymentStyles.secureNoteText}>
            Your payment information is secure and encrypted
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}