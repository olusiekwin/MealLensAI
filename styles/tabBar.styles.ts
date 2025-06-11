import { StyleSheet, Dimensions, Platform } from "react-native";

const { width } = Dimensions.get('window');
const TAB_WIDTH = width / 4; // Divide screen width by 4 for perfect fit

export const tabBarStyles = StyleSheet.create({
  tabBar: {
    height: 65,
    backgroundColor: "#FFFFFF",
    ...(Platform.OS === 'web' ? { boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.08)' } : {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
    }),
    elevation: 8,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingBottom: 8,
    paddingTop: 12,
    borderTopWidth: 0,
  },
  tabBarItem: {
    width: TAB_WIDTH,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  tabBarLabel: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '600',
    textAlign: 'center',
    display: 'none', // Hidden as per current design
  },
  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    transform: [{ scale: 1.1 }], // Slightly larger icons
  }
});