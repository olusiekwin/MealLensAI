import { useState } from 'react';
import { 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Image,
  Alert,
  Platform,
  Dimensions
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { 
  ArrowLeft, 
  CreditCard, 
  Calendar, 
  Lock,
  CheckCircle,
  User,
  Phone,
  Shield
} from 'lucide-react-native';
import { paymentStyles } from '@/styles/payment.styles';
import { setPremiumStatus } from '@/services/api';

const { width } = Dimensions.get('window');

export default function PaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const initialPlan = params.plan as string || 'monthly';
  
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(initialPlan);
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card', 'mpesa', 'apple', 'google'
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

  const formatPhoneNumber = (text: string): string => {
    // Remove all non-digit characters
    const cleaned = text.replace(/\D/g, '');
    // Limit to 10 digits
    return cleaned.slice(0, 10);
  };
  
  const handleSubmit = async () => {
    if (paymentMethod === 'card' && (!cardNumber || !cardName || !expiryDate || !cvv)) {
      Alert.alert('Error', 'Please fill in all card details');
      return;
    }

    if (paymentMethod === 'mpesa' && !phoneNumber) {
      Alert.alert('Error', 'Please enter your M-Pesa phone number');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate payment processing
    setTimeout(async () => {
      try {
        // Set user as premium
        await setPremiumStatus(true);
        
        setIsLoading(false);
        Alert.alert(
          'Payment Successful',
          `You have successfully subscribed to the ${
            selectedPlan === 'weekly' ? 'Weekly' : 
            selectedPlan === 'monthly' ? 'Monthly' : 'Annual'
          } plan.`,
          [
            { 
              text: 'OK', 
              onPress: () => router.push('/(tabs)') 
            }
          ]
        );
      } catch (error) {
        setIsLoading(false);
        Alert.alert('Error', 'Failed to process payment. Please try again.');
      }
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
        contentContainerStyle={paymentStyles.scrollContent}
      >
        <View style={paymentStyles.planSection}>
          <Text style={paymentStyles.sectionTitle}>Choose a Plan</Text>
          
          <View style={paymentStyles.planOptions}>
            <TouchableOpacity 
              style={[
                paymentStyles.planCard,
                selectedPlan === 'weekly' && paymentStyles.selectedPlanCard
              ]}
              onPress={() => setSelectedPlan('weekly')}
            >
              <View style={paymentStyles.planHeader}>
                <Text style={paymentStyles.planName}>Weekly</Text>
                {selectedPlan === 'weekly' && (
                  <CheckCircle size={20} color="#FF6A00" />
                )}
              </View>
              <Text style={paymentStyles.planPrice}>$0.99</Text>
              <Text style={paymentStyles.planPeriod}>per week</Text>
              <Text style={paymentStyles.planFeature}>• Unlimited detections</Text>
              <Text style={paymentStyles.planFeature}>• No ads</Text>
              <Text style={paymentStyles.planFeature}>• Try before committing</Text>
            </TouchableOpacity>
            
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
              <Text style={paymentStyles.planPrice}>$3.00</Text>
              <Text style={paymentStyles.planPeriod}>per month</Text>
              <Text style={paymentStyles.planFeature}>• Unlimited detections</Text>
              <Text style={paymentStyles.planFeature}>• No ads</Text>
              <Text style={paymentStyles.planFeature}>• Premium recipes</Text>
              <View style={paymentStyles.saveBadge}>
                <Text style={paymentStyles.saveBadgeText}>Popular</Text>
              </View>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={[
              paymentStyles.annualPlanCard,
              selectedPlan === 'annual' && paymentStyles.selectedPlanCard
            ]}
            onPress={() => setSelectedPlan('annual')}
          >
            <View style={paymentStyles.annualPlanHeader}>
              <Text style={paymentStyles.planName}>Annual</Text>
              {selectedPlan === 'annual' && (
                <CheckCircle size={20} color="#FF6A00" />
              )}
            </View>
            <View style={paymentStyles.annualPlanContent}>
              <View style={paymentStyles.annualPriceContainer}>
                <Text style={paymentStyles.planPrice}>$29.99</Text>
                <Text style={paymentStyles.planPeriod}>per year</Text>
              </View>
              <View style={paymentStyles.annualFeaturesContainer}>
                <Text style={paymentStyles.planFeature}>• Unlimited detections</Text>
                <Text style={paymentStyles.planFeature}>• No ads</Text>
                <Text style={paymentStyles.planFeature}>• Premium recipes</Text>
                <Text style={paymentStyles.planFeature}>• Save 17%</Text>
              </View>
            </View>
            <View style={paymentStyles.bestValueBadge}>
              <Text style={paymentStyles.saveBadgeText}>Best Value</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={paymentStyles.paymentMethodSection}>
          <Text style={paymentStyles.sectionTitle}>Payment Method</Text>
          
          <View style={paymentStyles.paymentOptions}>
            <TouchableOpacity 
              style={[
                paymentStyles.paymentOptionButton,
                paymentMethod === 'card' && paymentStyles.selectedPaymentOption
              ]}
              onPress={() => setPaymentMethod('card')}
            >
              <CreditCard size={24} color={paymentMethod === 'card' ? "#FF6A00" : "#202026"} />
              <Text style={[
                paymentStyles.paymentOptionText,
                paymentMethod === 'card' && paymentStyles.selectedPaymentOptionText
              ]}>Card</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                paymentStyles.paymentOptionButton,
                paymentMethod === 'mpesa' && paymentStyles.selectedPaymentOption
              ]}
              onPress={() => setPaymentMethod('mpesa')}
            >
              <Image 
                source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/M-PESA_LOGO-01.svg/1200px-M-PESA_LOGO-01.svg.png' }} 
                style={paymentStyles.mpesaIcon} 
                resizeMode="contain"
              />
              <Text style={[
                paymentStyles.paymentOptionText,
                paymentMethod === 'mpesa' && paymentStyles.selectedPaymentOptionText
              ]}>M-Pesa</Text>
            </TouchableOpacity>

            {Platform.OS === 'ios' && (
              <TouchableOpacity 
                style={[
                  paymentStyles.paymentOptionButton,
                  paymentMethod === 'apple' && paymentStyles.selectedPaymentOption
                ]}
                onPress={() => setPaymentMethod('apple')}
              >
                <Image 
                  source={{ uri: 'https://developer.apple.com/apple-pay/marketing/guides/images/apple-pay-mark.svg' }} 
                  style={paymentStyles.applePayIcon} 
                  resizeMode="contain"
                />
                <Text style={[
                  paymentStyles.paymentOptionText,
                  paymentMethod === 'apple' && paymentStyles.selectedPaymentOptionText
                ]}>Apple Pay</Text>
              </TouchableOpacity>
            )}
            
            {Platform.OS === 'android' && (
              <TouchableOpacity 
                style={[
                  paymentStyles.paymentOptionButton,
                  paymentMethod === 'google' && paymentStyles.selectedPaymentOption
                ]}
                onPress={() => setPaymentMethod('google')}
              >
                <Image 
                  source={{ uri: 'https://developers.google.com/static/pay/api/images/brand-guidelines/google-pay-mark.png' }} 
                  style={paymentStyles.googlePayIcon} 
                  resizeMode="contain"
                />
                <Text style={[
                  paymentStyles.paymentOptionText,
                  paymentMethod === 'google' && paymentStyles.selectedPaymentOptionText
                ]}>Google Pay</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        {paymentMethod === 'card' && (
          <View style={paymentStyles.cardSection}>
            <Text style={paymentStyles.sectionTitle}>Card Details</Text>
            
            <View style={paymentStyles.cardContainer}>
              <View style={paymentStyles.cardHeader}>
                <CreditCard size={24} color="#202026" />
                <View style={paymentStyles.cardTypes}>
                  <Image 
                    source={{ uri: 'https://brand.mastercard.com/content/dam/mccom/brandcenter/thumbnails/mastercard_vrt_pos_92px_2x.png' }} 
                    style={paymentStyles.cardTypeIcon} 
                  />
                  <Image 
                    source={{ uri: 'https://usa.visa.com/dam/VCOM/regional/ve/romania/blogs/hero-image/visa-logo-800x450.jpg' }} 
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
        )}

        {paymentMethod === 'mpesa' && (
          <View style={paymentStyles.mpesaSection}>
            <Text style={paymentStyles.sectionTitle}>M-Pesa Details</Text>
            
            <View style={paymentStyles.mpesaContainer}>
              <View style={paymentStyles.mpesaHeader}>
                <Image 
                  source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/M-PESA_LOGO-01.svg/1200px-M-PESA_LOGO-01.svg.png' }} 
                  style={paymentStyles.mpesaLogo} 
                  resizeMode="contain"
                />
              </View>
              
              <View style={paymentStyles.inputContainer}>
                <Text style={paymentStyles.inputLabel}>Phone Number</Text>
                <View style={paymentStyles.inputWrapper}>
                  <Phone size={20} color="#B5B5B5" style={paymentStyles.inputIcon} />
                  <TextInput
                    style={paymentStyles.input}
                    placeholder="07XX XXX XXX"
                    placeholderTextColor="#B5B5B5"
                    keyboardType="phone-pad"
                    value={phoneNumber}
                    onChangeText={(text) => setPhoneNumber(formatPhoneNumber(text))}
                    maxLength={10}
                  />
                </View>
              </View>
              
              <Text style={paymentStyles.mpesaInstructions}>
                You will receive a prompt on your phone to complete the payment. Please enter your M-Pesa PIN to authorize the transaction.
              </Text>
            </View>
          </View>
        )}
        
        {paymentMethod === 'apple' && (
          <View style={paymentStyles.applePaySection}>
            <View style={paymentStyles.applePayContainer}>
              <Image 
                source={{ uri: 'https://developer.apple.com/apple-pay/marketing/guides/images/apple-pay-mark.svg' }} 
                style={paymentStyles.applePayLogo} 
                resizeMode="contain"
              />
              <Text style={paymentStyles.applePayText}>
                Apple Pay is a simple and secure way to pay. You'll be redirected to Apple Pay to complete your purchase.
              </Text>
            </View>
          </View>
        )}
        
        {paymentMethod === 'google' && (
          <View style={paymentStyles.googlePaySection}>
            <View style={paymentStyles.googlePayContainer}>
              <Image 
                source={{ uri: 'https://developers.google.com/static/pay/api/images/brand-guidelines/google-pay-mark.png' }} 
                style={paymentStyles.googlePayLogo} 
                resizeMode="contain"
              />
              <Text style={paymentStyles.googlePayText}>
                Google Pay is a fast, simple way to pay. You'll be redirected to Google Pay to complete your purchase.
              </Text>
            </View>
          </View>
        )}
        
        <View style={paymentStyles.summarySection}>
          <Text style={paymentStyles.sectionTitle}>Order Summary</Text>
          
          <View style={paymentStyles.summaryContainer}>
            <View style={paymentStyles.summaryRow}>
              <Text style={paymentStyles.summaryLabel}>
                {selectedPlan === 'weekly' ? 'Weekly Plan' : 
                 selectedPlan === 'monthly' ? 'Monthly Plan' : 'Annual Plan'}
              </Text>
              <Text style={paymentStyles.summaryValue}>
                ${selectedPlan === 'weekly' ? '0.99' : 
                  selectedPlan === 'monthly' ? '3.00' : '29.99'}
              </Text>
            </View>
            
            <View style={paymentStyles.summaryRow}>
              <Text style={paymentStyles.summaryLabel}>Tax</Text>
              <Text style={paymentStyles.summaryValue}>
                ${selectedPlan === 'weekly' ? '0.05' : 
                  selectedPlan === 'monthly' ? '0.15' : '1.50'}
              </Text>
            </View>
            
            <View style={paymentStyles.divider} />
            
            <View style={paymentStyles.summaryRow}>
              <Text style={paymentStyles.totalLabel}>Total</Text>
              <Text style={paymentStyles.totalValue}>
                ${selectedPlan === 'weekly' ? '1.04' : 
                  selectedPlan === 'monthly' ? '3.15' : '31.49'}
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
            {isLoading ? 'Processing...' : `Pay $${
              selectedPlan === 'weekly' ? '1.04' : 
              selectedPlan === 'monthly' ? '3.15' : '31.49'
            }`}
          </Text>
        </TouchableOpacity>
        
        <View style={paymentStyles.secureNoteContainer}>
          <Shield size={16} color="#6A6A6A" />
          <Text style={paymentStyles.secureNoteText}>
            Your payment information is secure and encrypted
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}