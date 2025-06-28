import { StyleSheet, Platform } from "react-native"

export const profileStyles = StyleSheet.create({
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
  },
  headerDark: {
    backgroundColor: "#1A1A1A",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#202026",
  },
  headerTitleDark: {
    color: "#FFFFFF",
  },
  settingsButton: {
    padding: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  settingsButtonDark: {
    backgroundColor: "#333333",
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    ...(Platform.OS === "web"
      ? { boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }
      : {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
        }),
    elevation: 8,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  profileCardDark: {
    backgroundColor: "#2A2A2A",
    borderColor: "#333333",
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  uploadingContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(0,0,0,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FF6A00",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  profileInfo: {
    alignItems: "center",
    width: "100%",
  },
  profileName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#202026",
    marginBottom: 4,
    textAlign: "center",
  },
  profileNameDark: {
    color: "#FFFFFF",
  },
  profileEmail: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  profileEmailDark: {
    color: "#CCCCCC",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  statBox: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FF6A00",
    marginBottom: 4,
  },
  statNumberDark: {
    color: "#FF6A00",
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#666",
    textAlign: "center",
  },
  statLabelDark: {
    color: "#CCCCCC",
  },
  editButton: {
    backgroundColor: "#FF6A00",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
  },
  editIcon: {
    marginRight: 8,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionDark: {
    backgroundColor: "#1A1A1A",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#202026",
    marginBottom: 16,
  },
  sectionTitleDark: {
    color: "#FFFFFF",
  },
  infoGrid: {
    backgroundColor: "#FAFAFA",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  infoGridDark: {
    backgroundColor: "#2A2A2A",
    borderColor: "#333333",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  infoItemDark: {
    borderBottomColor: "#333333",
  },
  infoItemFull: {
    borderBottomWidth: 0,
  },
  infoIcon: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(255, 106, 0, 0.1)",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoLabelDark: {
    color: "#CCCCCC",
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#202026",
  },
  infoValueDark: {
    color: "#FFFFFF",
  },
  activityCard: {
    backgroundColor: "#FAFAFA",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  activityCardDark: {
    backgroundColor: "#2A2A2A",
    borderColor: "#333333",
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  activityItemDark: {
    borderBottomColor: "#333333",
  },
  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#202026",
    marginBottom: 2,
  },
  activityTitleDark: {
    color: "#FFFFFF",
  },
  activityValue: {
    fontSize: 13,
    fontWeight: "500",
    color: "#666",
  },
  activityValueDark: {
    color: "#CCCCCC",
  },
})
