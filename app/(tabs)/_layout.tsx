"use client"
import React from "react";
import { Tabs } from "expo-router"
import { Home, Heart, User, CookingPot } from "lucide-react-native"
import { View } from "react-native"
import { tabBarStyles } from "@/styles/tabBar.styles"

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "#000000",
        tabBarInactiveTintColor: "#B5B5B5",
        headerShown: false,
        tabBarStyle: tabBarStyles.tabBar,
        tabBarItemStyle: tabBarStyles.tabBarItem,
        tabBarLabelStyle: tabBarStyles.tabBarLabel,
        tabBarShowLabel: false,
        tabBarIcon: ({ color, focused }) => {
          let Icon

          if (route.name === "index") {
            Icon = Home
          } else if (route.name === "detection") {
            Icon = CookingPot
          } else if (route.name === "favorites") {
            Icon = Heart
          } else if (route.name === "profile") {
            Icon = User
          }

          return (
            <View style={[
              tabBarStyles.iconContainer,
              { backgroundColor: focused ? 'rgba(0, 0, 0, 0.05)' : 'transparent' }
            ]}>
              {Icon && (
                <Icon 
                  size={24} 
                  color={focused ? "#000000" : "#B5B5B5"} 
                  fill={focused ? "#000000" : "none"}
                  strokeWidth={focused ? 2.5 : 2}
                />
              )}
            </View>
          )
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="detection" options={{ title: "Detection History" }} />
      <Tabs.Screen name="favorites" options={{ title: "Favorites" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      
      {/* Hide all non-tab screens from the tab bar */}
      <Tabs.Screen name="ai-chat" options={{ href: null }} />
      <Tabs.Screen name="camera" options={{ href: null }} />
      <Tabs.Screen name="nutritional-breakdown" options={{ href: null }} />
      <Tabs.Screen name="recipe-details" options={{ href: null }} />
      <Tabs.Screen name="recipe-options" options={{ href: null }} />
      <Tabs.Screen name="recipes" options={{ href: null }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
    </Tabs>
  )
}
