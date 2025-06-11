import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useUserStore } from '@/context/userStore';
import { CreditCard, CheckCircle, AlertCircle } from 'lucide-react-native';

export const PaymentHistory = () => {
  const { paymentHistory } = useUserStore();
  
  if (paymentHistory.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <CreditCard size={32} color="#B5B5B5" />
        <Text style={styles.emptyText}>No payment history yet</Text>
      </View>
    );
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.paymentItem}>
      <View style={styles.iconContainer}>
        {item.status === 'completed' ? (
          <CheckCircle size={20} color="#67C74F" />
        ) : item.status === 'pending' ? (
          <AlertCircle size={20} color="#F5A623" />
        ) : (
          <AlertCircle size={20} color="#FF3B30" />
        )}
      </View>
      <View style={styles.paymentDetails}>
        <Text style={styles.paymentTitle}>{item.plan.charAt(0).toUpperCase() + item.plan.slice(1)} Plan</Text>
        <Text style={styles.paymentDate}>{formatDate(item.date)}</Text>
      </View>
      <Text style={styles.paymentAmount}>${item.amount.toFixed(2)}</Text>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment History</Text>
      <FlatList
        data={paymentHistory}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202026',
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 8,
  },
  paymentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentDetails: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#202026',
    marginBottom: 2,
  },
  paymentDate: {
    fontSize: 12,
    color: '#6B6B6B',
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202026',
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    marginHorizontal: 16,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B6B6B',
    marginTop: 12,
  },
});

export default PaymentHistory;
