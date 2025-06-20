<<<<<<< HEAD
import { StyleSheet, Dimensions } from "react-native";
=======
import { StyleSheet, Dimensions, Platform } from "react-native";
>>>>>>> the-moredern-features

const { width } = Dimensions.get('window');

export const plannerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
<<<<<<< HEAD
    paddingBottom: 80, // Add padding to account for tab bar
=======
  },
  scrollContent: {
    paddingBottom: 100, // Add padding to account for tab bar
>>>>>>> the-moredern-features
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 17,
    paddingTop: 42,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#202026',
  },
  favoritesLink: {
    fontSize: 16,
    fontWeight: '500',
<<<<<<< HEAD
    color: '#FF6A00',
=======
    color: '#000000',
>>>>>>> the-moredern-features
  },
  searchContainer: {
    paddingHorizontal: 17,
    marginBottom: 20,
  },
  searchBar: {
    height: 51,
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: 'rgba(124, 124, 124, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#202026',
  },
  filterButton: {
    padding: 5,
  },
  preferencesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 17,
    marginBottom: 30,
  },
  preferenceCard: {
    width: 98,
    height: 83,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(108, 108, 108, 0.15)',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  orangeCircle: {
<<<<<<< HEAD
    backgroundColor: '#FF6A00',
=======
    backgroundColor: '#000000',
>>>>>>> the-moredern-features
  },
  preferenceText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#202026',
    marginTop: 5,
  },
  mealPlansSection: {
    paddingHorizontal: 16,
<<<<<<< HEAD
=======
    paddingBottom: 30,
>>>>>>> the-moredern-features
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202026',
    marginBottom: 10,
  },
  dateNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  dateNavButton: {
    width: 25,
    height: 25,
    backgroundColor: '#202026',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  chevronLeft: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  chevronRight: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dateRange: {
    fontSize: 13,
    fontWeight: '600',
    color: '#202026',
    marginRight: 10,
  },
  daysContainer: {
    paddingVertical: 10,
  },
  dayCard: {
    width: 45,
    height: 49,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(124, 124, 124, 0.15)',
<<<<<<< HEAD
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
=======
    ...(Platform.OS === 'web' ? { boxShadow: '0 4px 6px rgba(0, 0, 0, 0.08)' } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
    }),
>>>>>>> the-moredern-features
    elevation: 2,
  },
  activeDayCard: {
    backgroundColor: '#202026',
  },
  dayName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#202026',
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: '500',
<<<<<<< HEAD
    color: '#FF6A00',
=======
    color: '#000000',
>>>>>>> the-moredern-features
    marginTop: 2,
  },
  activeDayText: {
    color: '#FFFFFF',
  },
  activeDayNumber: {
    fontSize: 18,
    fontWeight: '500',
<<<<<<< HEAD
    color: '#FF6A00',
=======
    color: '#000000',
>>>>>>> the-moredern-features
    marginTop: 2,
  },
  mealTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  mealTypeButton: {
    backgroundColor: '#202026',
    borderRadius: 30,
    paddingVertical: 7,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mealTypeButtonInactive: {
    paddingVertical: 7,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mealTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  mealTypeTextInactive: {
    fontSize: 14,
    fontWeight: '600',
    color: '#B3B3B3',
  },
  mealCard: {
<<<<<<< HEAD
    width: 342,
    height: 241,
=======
    width: '100%',
>>>>>>> the-moredern-features
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(124, 124, 124, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 20,
<<<<<<< HEAD
    alignSelf: 'center',
=======
>>>>>>> the-moredern-features
  },
  mealImage: {
    width: '100%',
    height: 146,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#202026',
    padding: 15,
<<<<<<< HEAD
    borderWidth: 1,
    borderColor: 'rgba(124, 124, 124, 0.1)',
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
=======
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(124, 124, 124, 0.1)',
>>>>>>> the-moredern-features
  },
  nutritionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    position: 'relative',
  },
  nutritionItem: {
    marginRight: 20,
    alignItems: 'center',
  },
  nutritionDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginBottom: 4,
  },
  nutritionLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6A6A6A',
  },
  nutritionValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#6A6A6A',
  },
  recipeButton: {
    backgroundColor: '#202026',
    borderRadius: 30,
    paddingVertical: 7,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 15,
    bottom: 10,
    width: 100,
    height: 35,
  },
  recipeButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});