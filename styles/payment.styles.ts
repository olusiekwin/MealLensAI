import { StyleSheet, Platform } from "react-native";

export const paymentStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#202026',
  },
  placeholder: {
    width: 40,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  planSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202026',
    marginBottom: 16,
  },
  planOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  planCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(124, 124, 124, 0.1)',
    position: 'relative',
  },
  selectedPlanCard: {
    borderColor: '#FF6A00',
    borderWidth: 2,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  planName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202026',
  },
  planPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#202026',
    marginBottom: 4,
  },
  planPeriod: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6A6A6A',
    marginBottom: 16,
  },
  planFeature: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6A6A6A',
    marginBottom: 8,
  },
  saveBadge: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#FF6A00',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  saveBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  paymentMethodSection: {
    marginBottom: 24,
  },
  paymentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  paymentOptionButton: {
    width: '48%',
    height: 60,
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(124, 124, 124, 0.1)',
  },
  paymentOptionIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  paymentOptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#202026',
  },
  cardSection: {
    marginBottom: 24,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(124, 124, 124, 0.1)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTypes: {
    flexDirection: 'row',
  },
  cardTypeIcon: {
    width: 40,
    height: 24,
    marginLeft: 8,
    resizeMode: 'contain',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6A6A6A',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    height: 50,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#202026',
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summarySection: {
    marginBottom: 24,
  },
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(124, 124, 124, 0.1)',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6A6A6A',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#202026',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202026',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF6A00',
  },
  payButton: {
    height: 60,
    backgroundColor: '#FF6A00',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  payButtonDisabled: {
    backgroundColor: 'rgba(255, 106, 0, 0.7)',
  },
  payButtonText: {
    fontWeight: '600',
    fontSize: 18,
    color: '#FFFFFF',
  },
  secureNoteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  secureNoteText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6A6A6A',
    marginLeft: 8,
  },
});