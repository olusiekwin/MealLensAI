import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/config/constants';

export interface SubscriptionStatus {
  status: 'free' | 'premium';
  plan?: 'weekly' | 'monthly' | 'annual';
  expiry_date?: string;
  auto_renew?: boolean;
}

export interface PaymentHistoryItem {
  id: string;
  date: string;
  amount: number;
  plan: string;
  status: 'completed' | 'pending' | 'failed';
}

class PaymentService {
  async getSubscriptionStatus(): Promise<SubscriptionStatus> {
    try {
      const response = await api.get('/payment/subscription-status');
      
      if (response.data && response.data.success) {
        return response.data.data;
      }
      
      throw new Error('Failed to get subscription status');
    } catch (error) {
      console.error('Subscription status error:', error);
      
      // Return mock data if API fails
      return {
        status: 'free'
      };
    }
  }
  
  async getPaymentHistory(): Promise<PaymentHistoryItem[]> {
    try {
      const response = await api.get('/payment/history');
      
      if (response.data && response.data.success) {
        return response.data.data;
      }
      
      throw new Error('Failed to get payment history');
    } catch (error) {
      console.error('Payment history error:', error);
      
      // Return mock data if API fails
      return [
        {
          id: 'mock-payment-1',
          date: '2025-05-01T12:00:00Z',
          amount: 3.99,
          plan: 'monthly',
          status: 'completed'
        }
      ];
    }
  }
  
  async createSubscription(plan: string, paymentMethod: string): Promise<any> {
    try {
      const email = await AsyncStorage.getItem(STORAGE_KEYS.USER_EMAIL);
      
      // Only call backend endpoint for payment. Never call Paystack or remote APIs directly.
      const response = await api.post('/payment/create-subscription', {
        plan,
        payment_method: paymentMethod,
        email
      });
      
      return response.data;
    } catch (error) {
      console.error('Create subscription error:', error);
      throw error;
    }
  }
  
  async cancelSubscription(): Promise<any> {
    try {
      const response = await api.post('/payment/cancel-subscription');
      return response.data;
    } catch (error) {
      console.error('Cancel subscription error:', error);
      throw error;
    }
  }
}

export default new PaymentService();
