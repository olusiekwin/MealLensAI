import { create } from "zustand"
import AsyncStorage from "@react-native-async-storage/async-storage"

interface Language {
  code: string
  name: string
  flag: string
}

interface LanguageState {
  currentLanguage: string
  languages: Language[]
  setLanguage: (languageCode: string) => Promise<void>
  loadLanguage: () => Promise<void>
}

export const useLanguageStore = create<LanguageState>((set, get) => ({
  currentLanguage: "en",
  languages: [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "it", name: "Italiano", flag: "🇮🇹" },
    { code: "pt", name: "Português", flag: "🇵🇹" },
    { code: "ru", name: "Русский", flag: "🇷🇺" },
    { code: "ja", name: "日本語", flag: "🇯🇵" },
    { code: "ko", name: "한국어", flag: "🇰🇷" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
  ],

  setLanguage: async (languageCode: string) => {
    set({ currentLanguage: languageCode })
    try {
      await AsyncStorage.setItem("language", languageCode)
      // Here you would implement actual language switching logic
      console.log("Language changed to:", languageCode)
    } catch (error) {
      console.error("Error saving language:", error)
    }
  },

  loadLanguage: async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem("language")
      if (savedLanguage) {
        set({ currentLanguage: savedLanguage })
      }
    } catch (error) {
      console.error("Error loading language:", error)
    }
  },
}))
