import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import PaymentHistory from '@/components/PaymentHistory';
import { useUserStore } from '@/context/userStore';

export default function PaymentHistoryScreen() {
  const router = useRouter();
  const { isLoading } = useUserStore();

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: () => <Text style={styles.headerTitle}>Payment History</Text>,
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
            <Text style={styles.loadingText}>Loading payment history...</Text>
          </View>
        ) : (
          <PaymentHistory />
        )}
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>About Your Payments</Text>
          <Text style={styles.infoText}>
            All payments are processed securely through our payment provider. If you have any questions about your 
            payment history or subscription, please contact our support team.
          </Text>
        </View>
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
    paddingBottom: 32,
  },
  loadingContainer: {
    padding: 24,
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B6B6B',
  },
  infoContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
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
  },
});
