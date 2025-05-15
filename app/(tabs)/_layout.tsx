import React from "react";
import { Tabs } from "expo-router";
import { Home, Salad, Heart, User } from "lucide-react-native";
import { View } from "react-native";

import Colors from "@/constants/colors";
import { tabBarStyles } from "@/styles/tabBar.styles";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "#FF6A00",
        tabBarInactiveTintColor: "#B5B5B5",
        headerShown: false,
        tabBarStyle: tabBarStyles.tabBar,
        tabBarItemStyle: tabBarStyles.tabBarItem,
        tabBarLabelStyle: tabBarStyles.tabBarLabel,
        tabBarShowLabel: false, // Hide labels for icon-only navigation
        tabBarIcon: ({ color, focused }) => {
          let Icon;
          
          if (route.name === 'index') {
            Icon = Home;
          } else if (route.name === 'recipes') {
            Icon = Salad;
          } else if (route.name === 'health') {
            Icon = Heart;
          } else if (route.name === 'profile') {
            Icon = User;
          }
          
          return (
            <View style={tabBarStyles.iconContainer}>
              {Icon && <Icon size={24} color={focused ? "#FF6A00" : "#B5B5B5"} fill={focused ? "#FF6A00" : "none"} />}
            </View>
          );
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: "Recipes",
        }}
      />
      <Tabs.Screen
        name="health"
        options={{
          title: "Health",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: "Camera",
          tabBarItemStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="ai-chat"
        options={{
          title: "AI Chat",
          tabBarItemStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="recipe-details"
        options={{
          title: "Recipe Details",
          tabBarItemStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="recipe-options"
        options={{
          title: "Recipe Options",
          tabBarItemStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarItemStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="nutritional-breakdown"
        options={{
          title: "Nutritional Breakdown",
          tabBarItemStyle: { display: 'none' },
        }}
      />
    </Tabs>
  );
}