import { StyleSheet } from "react-native"

export const loadingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 32,
  },
  logoBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 106, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 106, 0, 0.2)",
  },
  appName: {
    fontSize: 28,
    fontWeight: "700",
    color: "#202026",
    marginBottom: 8,
    textAlign: "center",
  },
  tagline: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
    marginBottom: 48,
    textAlign: "center",
  },
  loadingContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    marginTop: 16,
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 60,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#999",
    marginBottom: 4,
  },
  versionText: {
    fontSize: 11,
    fontWeight: "400",
    color: "#BBB",
  },
})
