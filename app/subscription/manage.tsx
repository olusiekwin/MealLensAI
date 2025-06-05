import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Crown, Calendar, AlertCircle, Zap } from 'lucide-react-native';
import { useUserStore } from '@/context/userStore';
import { cancelSubscription } from '@/services/paymentService';

export default function ManageSubscriptionScreen() {
  const router = useRouter();
  const { subscription, fetchSubscription, isLoading } = useUserStore();
  const [cancelingSubscription, setCancelingSubscription] = useState(false);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const handleCancelSubscription = async () => {
    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel your subscription? You will still have access until the end of your current billing period.',
      [
        {
          text: 'No, Keep It',
          style: 'cancel',
        },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            setCancelingSubscription(true);
            try {
              await cancelSubscription();
              await fetchSubscription();
              Alert.alert(
                'Subscription Cancelled',
                'Your subscription has been cancelled. You will still have access until the end of your current billing period.'
              );
            } catch (error) {
              console.error('Error cancelling subscription:', error);
              Alert.alert(
                'Error',
                'There was an error cancelling your subscription. Please try again later.'
              );
            } finally {
              setCancelingSubscription(false);
            }
          }
        }
      ]
    );
  };
  
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: () => <Text style={styles.headerTitle}>Manage Subscription</Text>,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color="#202026" />
            </TouchableOpacity>
          ),
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#F8F8F8',
          },
        }}
      />
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#000000" />
            <Text style={styles.loadingText}>Loading subscription details...</Text>
          </View>
        ) : (
          <>
            <View style={styles.subscriptionCard}>
              <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                  <Crown size={24} color="#FFFFFF" />
                </View>
                <View style={styles.headerTextContainer}>
                  <Text style={styles.cardTitle}>
                    {subscription.status === 'premium' ? 'Premium Subscription' : 'Free Plan'}
                  </Text>
                  {subscription.status === 'premium' && (
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusText}>ACTIVE</Text>
                    </View>
                  )}
                </View>
              </View>
              
              {subscription.status === 'premium' ? (
                <View style={styles.detailsContainer}>
                  <View style={styles.detailItem}>
                    <Calendar size={20} color="#6B6B6B" />
                    <View style={styles.detailTextContainer}>
                      <Text style={styles.detailLabel}>Current Period</Text>
                      <Text style={styles.detailValue}>
                        {formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.detailItem}>
                    <Zap size={20} color="#6B6B6B" />
                    <View style={styles.detailTextContainer}>
                      <Text style={styles.detailLabel}>Plan</Text>
                      <Text style={styles.detailValue}>
                        {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)} (${subscription.amount}/
                        {subscription.plan === 'weekly' ? 'week' : 
                         subscription.plan === 'monthly' ? 'month' : 'year'})
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.detailItem}>
                    <AlertCircle size={20} color="#6B6B6B" />
                    <View style={styles.detailTextContainer}>
                      <Text style={styles.detailLabel}>Renewal</Text>
                      <Text style={styles.detailValue}>
                        {subscription.cancelAtPeriodEnd 
                          ? 'Your subscription will end on ' + formatDate(subscription.currentPeriodEnd)
                          : 'Automatically renews on ' + formatDate(subscription.currentPeriodEnd)
                        }
                      </Text>
                    </View>
                  </View>
                </View>
              ) : (
                <View style={styles.freeContainer}>
                  <Text style={styles.freeText}>
                    You are currently on the free plan with limited features. Upgrade to premium to unlock all features.
                  </Text>
                </View>
              )}
            </View>
            
            {subscription.status === 'premium' ? (
              <>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => router.push('/payment/history')}
                >
                  <Text style={styles.actionButtonText}>View Payment History</Text>
                </TouchableOpacity>
                
                {!subscription.cancelAtPeriodEnd && (
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.cancelButton]}
                    onPress={handleCancelSubscription}
                    disabled={cancelingSubscription}
                  >
                    {cancelingSubscription ? (
                      <ActivityIndicator size="small" color="#FF3B30" />
                    ) : (
                      <Text style={[styles.actionButtonText, styles.cancelButtonText]}>
                        Cancel Subscription
                      </Text>
                    )}
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <TouchableOpacity 
                style={[styles.actionButton, styles.upgradeButton]}
                onPress={() => router.push('/subscription/index')}
              >
                <Text style={[styles.actionButtonText, styles.upgradeButtonText]}>
                  Upgrade to Premium
                </Text>
              </TouchableOpacity>
            )}
            
            <View style={styles.infoContainer}>
              <Text style={styles.infoTitle}>About Your Subscription</Text>
              <Text style={styles.infoText}>
                {subscription.status === 'premium' 
                  ? 'Your premium subscription gives you access to all features including unlimited scans, no ads, priority support, and more.'
                  : 'Upgrade to premium to unlock all features including unlimited scans, no ads, priority support, and more.'
                }
              </Text>
              
              {subscription.status === 'premium' && !subscription.cancelAtPeriodEnd && (
                <Text style={styles.infoText}>
                  You can cancel your subscription at any time. If you cancel, you will still have access to premium features until the end of your current billing period.
                </Text>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202026',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B6B6B',
    marginTop: 16,
  },
  subscriptionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202026',
  },
  statusBadge: {
    backgroundColor: '#67C74F',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  detailsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  detailTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B6B6B',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: '#202026',
    fontWeight: '500',
  },
  freeContainer: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 16,
  },
  freeText: {
    fontSize: 16,
    color: '#6B6B6B',
    lineHeight: 24,
  },
  actionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202026',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#FF3B30',
    backgroundColor: '#FFFFFF',
  },
  cancelButtonText: {
    color: '#FF3B30',
  },
  upgradeButton: {
    backgroundColor: '#000000',
  },
  upgradeButtonText: {
    color: '#FFFFFF',
  },
  infoContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202026',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#6B6B6B',
    lineHeight: 20,
    marginBottom: 12,
  },
});
