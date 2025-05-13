import { Stack } from "expo-router";
import { useEffect, useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";
import { View } from "react-native";

export const unstable_settings = {
  initialRouteName: "index",
};

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const onLayoutRootView = useCallback(async () => {
    // Add any initialization logic here
    await new Promise(resolve => setTimeout(resolve, 2000)); // Show splash for 2 seconds
    await SplashScreen.hideAsync();
  }, []);

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <RootLayoutNav />
    </View>
  );
}

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
    </Stack>
  );
}