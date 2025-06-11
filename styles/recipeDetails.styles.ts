import { StyleSheet, Dimensions, Platform } from "react-native";

const { width } = Dimensions.get('window');

export const recipeDetailsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerContainer: {
    position: "relative",
    height: 300,
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    ...(Platform.OS === 'web' ? { boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    }),
    elevation: 2,
  },
  headerActions: {
    position: "absolute",
    top: 50,
    right: 16,
    flexDirection: "row",
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
    ...(Platform.OS === 'web' ? { boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    }),
    elevation: 2,
  },
  recipeInfoContainer: {
    padding: 16,
    paddingTop: 24,
    paddingBottom: 20,
  },
  recipeTitle: {
    fontSize: 28,
    fontWeight: "600",
    color: "#202026",
    marginBottom: 16,
  },
  recipeMetaContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  ratingIcon: {
    fontSize: 24,
    color: "#000000",
  },
  ratingText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#202026",
    marginLeft: 8,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeIconContainer: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  timeIcon: {
    fontSize: 20,
    color: "#202026",
  },
  timeText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#202026",
    marginLeft: 8,
  },
  sectionContainer: {
    padding: 16,
    paddingTop: 20,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 16,
  },
  ingredientsContainer: {
    flexDirection: "column",
  },
  ingredientItem: {
    flexDirection: "row",
    marginBottom: 12,
  },
  ingredientDash: {
    fontSize: 16,
    color: "#6A6A6A",
    marginRight: 8,
  },
  ingredientText: {
    fontSize: 12,
    color: "#6A6A6A",
    flex: 1,
    lineHeight: 18,
  },
  optionalTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6A6A6A",
    marginTop: 16,
    marginBottom: 12,
  },
  instructionsContainer: {
    flexDirection: "column",
  },
  linksContainer: {
    flexDirection: "column",
    gap: 12,
  },
  linkButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 12,
    ...(Platform.OS === 'web' ? { boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    }),
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(124, 124, 124, 0.1)',
    height: 44,
  },
  youtubeIcon: {
    width: 36,
    height: 36,
    backgroundColor: "#FF0000",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  youtubeIconText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  googleIcon: {
    width: 36,
    height: 36,
    backgroundColor: "#4285F4",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  googleIconText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  linkText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6A6A6A",
  },
});