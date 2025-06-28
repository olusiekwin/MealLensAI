"use client"

import type React from "react"
import { View, ActivityIndicator } from "react-native"
import { loadingStyles } from "@/styles/loading.styles"

export const LoadingScreen: React.FC = () => {
  return (
    <View style={loadingStyles.container}>
      <ActivityIndicator size="large" color="#FF6A00" />
    </View>
  )
}
