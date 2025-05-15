import { StyleSheet, Platform, Dimensions } from "react-native";

const { width } = Dimensions.get('window');

export const nutritionalStyles = StyleSheet.create({
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
  infoButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  foodCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(124, 124, 124, 0.1)',
  },
  foodImage: {
    width: '100%',
    height: 180,
  },
  foodInfo: {
    padding: 16,
  },
  foodName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202026',
    marginBottom: 8,
  },
  foodDescription: {
    fontSize: 14,
    color: '#6A6A6A',
    lineHeight: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#F0F0F0',
  },
  activeTabButton: {
    borderBottomColor: '#FF6A00',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6A6A6A',
  },
  activeTabText: {
    color: '#FF6A00',
  },
  nutritionContainer: {
    paddingBottom: 30,
  },
  calorieCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  calorieTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6A6A6A',
    marginBottom: 8,
  },
  calorieValue: {
    fontSize: 36,
    fontWeight: '700',
    color: '#202026',
  },
  calorieUnit: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6A6A6A',
    marginTop: 4,
  },
  macrosContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202026',
    marginBottom: 16,
  },
  macroItem: {
    marginBottom: 16,
  },
  macroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  macroIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  macroName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#202026',
    flex: 1,
  },
  macroValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202026',
  },
  macroPercentage: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6A6A6A',
    marginTop: 4,
    textAlign: 'right',
  },
  micronutrientsContainer: {
    marginBottom: 20,
  },
  microGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  microItem: {
    width: '48%',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  microName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6A6A6A',
    marginBottom: 4,
  },
  microValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202026',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  actionButton: {
    backgroundColor: '#202026',
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.48,
  },
  actionIcon: {
    marginRight: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  ingredientsContainer: {
    paddingBottom: 30,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ingredientDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6A00',
    marginRight: 12,
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#202026',
    flex: 1,
  },
  ingredientAmount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6A6A6A',
  },
});