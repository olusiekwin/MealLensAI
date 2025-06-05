import { StyleSheet } from "react-native";

export const recipeOptionsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    alignItems: "center",
    paddingVertical: 12,
  },
  handle: {
    width: 57,
    height: 7,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 30,
  },
  headerImage: {
    width: "100%",
    height: 200,
  },
  sectionContainer: {
    padding: 16,
    paddingTop: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 16,
  },
  instructionsContainer: {
    flexDirection: "column",
  },
  instructionItem: {
    flexDirection: "row",
    marginBottom: 12,
  },
  bulletPoint: {
    fontSize: 16,
    color: "#6A6A6A",
    marginRight: 8,
    width: 10,
  },
  instructionText: {
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
  recipeContainer: {
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
  linksContainer: {
    flexDirection: "column",
    padding: 16,
    gap: 12,
    marginBottom: 20,
  },
  linkButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#ECECEC',
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
    width: 26,
    height: 26,
    backgroundColor: "#4285F4",
    borderRadius: 13,
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