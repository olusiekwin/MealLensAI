import { StyleSheet, Platform } from "react-native"

export const settingsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  containerDark: {
    backgroundColor: "#1A1A1A",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 20,
    backgroundColor: "#FFFFFF",
  },
  headerDark: {
    backgroundColor: "#1A1A1A",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonDark: {
    backgroundColor: "#333333",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#202026",
  },
  headerTitleDark: {
    color: "#FFFFFF",
  },
  placeholder: {
    width: 40,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginBottom: 16,
    marginLeft: 4,
  },
  sectionTitleDark: {
    color: "#CCCCCC",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  settingItemDark: {
    backgroundColor: "#2A2A2A",
    borderColor: "#333333",
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 106, 0, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#202026",
  },
  settingTextDark: {
    color: "#FFFFFF",
  },
  settingTextContainer: {
    flex: 1,
  },
  subscriptionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
    alignSelf: "flex-start",
  },
  premiumBadge: {
    backgroundColor: "#FF6A00",
  },
  freeBadge: {
    backgroundColor: "#B5B5B5",
  },
  subscriptionBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  valueText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    marginRight: 8,
  },
  valueTextDark: {
    color: "#CCCCCC",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 59, 48, 0.1)",
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF3B30",
    marginLeft: 8,
  },
  versionContainer: {
    alignItems: "center",
    marginVertical: 32,
  },
  versionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#B5B5B5",
  },
  versionTextDark: {
    color: "#666666",
  },
})
