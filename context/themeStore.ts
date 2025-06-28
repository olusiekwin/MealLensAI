import { create } from "zustand"
import AsyncStorage from "@react-native-async-storage/async-storage"

interface ThemeState {
  isDarkMode: boolean
  toggleTheme: () => Promise<void>
  loadTheme: () => Promise<void>
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  isDarkMode: false,

  toggleTheme: async () => {
    const newTheme = !get().isDarkMode
    set({ isDarkMode: newTheme })
    try {
      await AsyncStorage.setItem("theme", newTheme ? "dark" : "light")
    } catch (error) {
      console.error("Error saving theme:", error)
    }
  },

  loadTheme: async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("theme")
      if (savedTheme) {
        set({ isDarkMode: savedTheme === "dark" })
      }
    } catch (error) {
      console.error("Error loading theme:", error)
    }
  },
}))
