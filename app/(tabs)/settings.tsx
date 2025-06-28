"use client"

import { useState, useEffect } from "react"
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
  ActivityIndicator,
  Modal,
  Dimensions,
} from "react-native"
import { useRouter } from "expo-router"
import { getUserProfile, clearUserProfile } from "@/services/userLocalStorage"
import sessionService from "@/services/sessionService"
import profileService from "@/services/profileService"
import { useThemeStore } from "@/context/themeStore"
import { useLanguageStore } from "@/context/languageStore"
import {
  ArrowLeft,
  Bell,
  Lock,
  HelpCircle,
  Info,
  LogOut,
  ChevronRight,
  Moon,
  Sun,
  Globe,
  Crown,
  Check,
  X,
  CreditCard,
  Smartphone,
  Building,
} from "lucide-react-native"
import { settingsStyles } from "@/styles/settings.styles"
import PaymentService from "@/services/paymentService"
import ReceiptModal from "@/components/ReceiptModal"
import { StyleSheet } from "react-native"

const { height } = Dimensions.get("window")

export default function SettingsScreen() {
  const router = useRouter()
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showLanguageModal, setShowLanguageModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [receiptData, setReceiptData] = useState<any>()
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [subscription, setSubscription] = useState({ status: "free" })

  const { isDarkMode, toggleTheme } = useThemeStore()
  const { currentLanguage, setLanguage, languages } = useLanguageStore()

  // Fetch subscription status from profile
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        setSubscription({ status: "free" })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleThemeToggle = async (value: boolean) => {
    await toggleTheme()
  }

  const handleNotificationToggle = async (value: boolean) => {
    setNotificationsEnabled(value)
    console.log("Notifications:", value ? "enabled" : "disabled")
  }

  const handleLanguageSelect = async (language: any) => {
    await setLanguage(language.code)
    setShowLanguageModal(false)
  }

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: async () => {
          try {
            setIsLoggingOut(true)
            await clearUserProfile()
            await sessionService.clearSession()
            router.push("/auth")
          } catch (error) {
            console.error("Logout error:", error)
            Alert.alert("Logout Error", "An error occurred during logout. Please try again.")
          } finally {
            setIsLoggingOut(false)
          }
        },
      },
    ])
  }

  const handlePaymentPress = () => {
    setShowPaymentModal(true)
  }

  const handlePaymentMethod = async (method: string) => {
    setShowPaymentModal(false)
    setIsProcessingPayment(true)

    try {
      let paymentResult

      switch (method) {
        case "M-Pesa":
          paymentResult = await PaymentService.initiateMpesaPayment({
            amount: 999, // $9.99 in cents
            phone: "+254700000000", // User's phone number
            email: "user@example.com", // User's email
            plan: "premium_monthly",
          })
          break

        case "Bank Transfer":
          paymentResult = await PaymentService.initiateBankTransfer({
            amount: 999,
            email: "user@example.com",
            plan: "premium_monthly",
          })
          break

        case "Google Pay":
          paymentResult = await PaymentService.initiateGooglePay({
            amount: 999,
            email: "user@example.com",
            plan: "premium_monthly",
          })
          break

        case "Credit Card":
          paymentResult = await PaymentService.initiateCreditCard({
            amount: 999,
            email: "user@example.com",
            plan: "premium_monthly",
          })
          break

        default:
          throw new Error("Invalid payment method")
      }

      if (paymentResult.success) {
        // Generate receipt data
        const receipt = {
          transactionId: paymentResult.transactionId,
          amount: "$9.99",
          method: method,
          plan: "Premium Monthly",
          date: new Date().toISOString(),
          serialNumber: `ML${Date.now()}`,
          barcode: `${paymentResult.transactionId}`,
        }

        setReceiptData(receipt)
        setShowReceiptModal(true)
        Alert.alert("Payment Successful", "Your subscription has been activated!")
      } else {
        Alert.alert("Payment Failed", paymentResult.message || "Please try again.")
      }
    } catch (error) {
      console.error("Payment error:", error)
      Alert.alert("Payment Error", "An error occurred during payment. Please try again.")
    } finally {
      setIsProcessingPayment(false)
    }
  }

  const openPrivacyPolicy = () => {
    Linking.openURL("https://www.meallensai.com/privacy-policy")
  }

  const openTermsOfService = () => {
    Linking.openURL("https://www.meallensai.com/terms-of-service")
  }

  const openHelpCenter = () => {
    Linking.openURL("https://www.meallensai.com/help")
  }

  const currentLanguageName = languages.find((lang) => lang.code === currentLanguage)?.name || "English"

  return (
    <View style={[settingsStyles.container, isDarkMode && settingsStyles.containerDark]}>
      <View style={[settingsStyles.header, isDarkMode && settingsStyles.headerDark]}>
        <TouchableOpacity
          style={[settingsStyles.backButton, isDarkMode && settingsStyles.backButtonDark]}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={isDarkMode ? "#FFFFFF" : "#202026"} />
        </TouchableOpacity>
        <Text style={[settingsStyles.headerTitle, isDarkMode && settingsStyles.headerTitleDark]}>Settings</Text>
        <View style={settingsStyles.placeholder} />
      </View>

      <ScrollView style={settingsStyles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Account Section */}
        <View style={settingsStyles.section}>
          <Text style={[settingsStyles.sectionTitle, isDarkMode && settingsStyles.sectionTitleDark]}>Account</Text>

          <TouchableOpacity
            style={[settingsStyles.settingItem, isDarkMode && settingsStyles.settingItemDark]}
            onPress={handlePaymentPress}
          >
            <View style={settingsStyles.settingIconContainer}>
              <Crown size={20} color="#FF6A00" />
            </View>
            <View style={settingsStyles.settingTextContainer}>
              <Text style={[settingsStyles.settingText, isDarkMode && settingsStyles.settingTextDark]}>
                Subscription & Payment
              </Text>
              {!isLoading && (
                <View
                  style={[
                    settingsStyles.subscriptionBadge,
                    subscription.status === "premium" ? settingsStyles.premiumBadge : settingsStyles.freeBadge,
                  ]}
                >
                  <Text style={settingsStyles.subscriptionBadgeText}>
                    {subscription.status === "premium" ? "PREMIUM" : "FREE"}
                  </Text>
                </View>
              )}
            </View>
            <ChevronRight size={20} color="#B5B5B5" />
          </TouchableOpacity>

          <TouchableOpacity style={[settingsStyles.settingItem, isDarkMode && settingsStyles.settingItemDark]}>
            <View style={settingsStyles.settingIconContainer}>
              <Lock size={20} color="#FF6A00" />
            </View>
            <Text style={[settingsStyles.settingText, isDarkMode && settingsStyles.settingTextDark]}>
              Privacy & Security
            </Text>
            <ChevronRight size={20} color="#B5B5B5" />
          </TouchableOpacity>
        </View>

        {/* Preferences Section */}
        <View style={settingsStyles.section}>
          <Text style={[settingsStyles.sectionTitle, isDarkMode && settingsStyles.sectionTitleDark]}>Preferences</Text>

          <View style={[settingsStyles.settingItem, isDarkMode && settingsStyles.settingItemDark]}>
            <View style={settingsStyles.settingIconContainer}>
              <Bell size={20} color="#FF6A00" />
            </View>
            <Text style={[settingsStyles.settingText, isDarkMode && settingsStyles.settingTextDark]}>
              Notifications
            </Text>
            <Switch
              trackColor={{ false: "#E0E0E0", true: "#FF6A00" }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#E0E0E0"
              onValueChange={handleNotificationToggle}
              value={notificationsEnabled}
            />
          </View>

          <View style={[settingsStyles.settingItem, isDarkMode && settingsStyles.settingItemDark]}>
            <View style={settingsStyles.settingIconContainer}>
              {isDarkMode ? <Moon size={20} color="#FF6A00" /> : <Sun size={20} color="#FF6A00" />}
            </View>
            <Text style={[settingsStyles.settingText, isDarkMode && settingsStyles.settingTextDark]}>
              {isDarkMode ? "Dark Mode" : "Light Mode"}
            </Text>
            <Switch
              trackColor={{ false: "#E0E0E0", true: "#FF6A00" }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#E0E0E0"
              onValueChange={handleThemeToggle}
              value={isDarkMode}
            />
          </View>

          <TouchableOpacity
            style={[settingsStyles.settingItem, isDarkMode && settingsStyles.settingItemDark]}
            onPress={() => setShowLanguageModal(true)}
          >
            <View style={settingsStyles.settingIconContainer}>
              <Globe size={20} color="#FF6A00" />
            </View>
            <Text style={[settingsStyles.settingText, isDarkMode && settingsStyles.settingTextDark]}>Language</Text>
            <View style={settingsStyles.valueContainer}>
              <Text style={[settingsStyles.valueText, isDarkMode && settingsStyles.valueTextDark]}>
                {currentLanguageName}
              </Text>
              <ChevronRight size={20} color="#B5B5B5" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Support Section */}
        <View style={settingsStyles.section}>
          <Text style={[settingsStyles.sectionTitle, isDarkMode && settingsStyles.sectionTitleDark]}>Support</Text>

          <TouchableOpacity
            style={[settingsStyles.settingItem, isDarkMode && settingsStyles.settingItemDark]}
            onPress={openHelpCenter}
          >
            <View style={settingsStyles.settingIconContainer}>
              <HelpCircle size={20} color="#FF6A00" />
            </View>
            <Text style={[settingsStyles.settingText, isDarkMode && settingsStyles.settingTextDark]}>Help Center</Text>
            <ChevronRight size={20} color="#B5B5B5" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[settingsStyles.settingItem, isDarkMode && settingsStyles.settingItemDark]}
            onPress={openPrivacyPolicy}
          >
            <View style={settingsStyles.settingIconContainer}>
              <Lock size={20} color="#FF6A00" />
            </View>
            <Text style={[settingsStyles.settingText, isDarkMode && settingsStyles.settingTextDark]}>
              Privacy Policy
            </Text>
            <ChevronRight size={20} color="#B5B5B5" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[settingsStyles.settingItem, isDarkMode && settingsStyles.settingItemDark]}
            onPress={openTermsOfService}
          >
            <View style={settingsStyles.settingIconContainer}>
              <Info size={20} color="#FF6A00" />
            </View>
            <Text style={[settingsStyles.settingText, isDarkMode && settingsStyles.settingTextDark]}>
              Terms of Service
            </Text>
            <ChevronRight size={20} color="#B5B5B5" />
          </TouchableOpacity>
        </View>

        {/* Logout Section */}
        <View style={settingsStyles.section}>
          <TouchableOpacity style={settingsStyles.logoutButton} onPress={handleLogout} disabled={isLoggingOut}>
            {isLoggingOut ? <ActivityIndicator color="#FF3B30" size="small" /> : <LogOut size={20} color="#FF3B30" />}
            <Text style={settingsStyles.logoutText}>{isLoggingOut ? "Logging out..." : "Logout"}</Text>
          </TouchableOpacity>
        </View>

        <View style={settingsStyles.versionContainer}>
          <Text style={[settingsStyles.versionText, isDarkMode && settingsStyles.versionTextDark]}>
            MealLensAI v1.0.0
          </Text>
        </View>
      </ScrollView>

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              languageModalStyles.modalContainer,
              { height: height * 0.75 },
              isDarkMode && languageModalStyles.modalContainerDark,
            ]}
          >
            <View style={[languageModalStyles.header, isDarkMode && languageModalStyles.headerDark]}>
              <View style={languageModalStyles.headerContent}>
                <Text style={[languageModalStyles.title, isDarkMode && languageModalStyles.titleDark]}>
                  Select Language
                </Text>
                <Text style={[languageModalStyles.subtitle, isDarkMode && languageModalStyles.subtitleDark]}>
                  Choose your preferred language for the app
                </Text>
              </View>
              <TouchableOpacity
                style={[languageModalStyles.closeButton, isDarkMode && languageModalStyles.closeButtonDark]}
                onPress={() => setShowLanguageModal(false)}
              >
                <X size={20} color={isDarkMode ? "#FFFFFF" : "#202026"} />
              </TouchableOpacity>
            </View>

            <ScrollView style={languageModalStyles.languageList} showsVerticalScrollIndicator={false}>
              {languages.map((language, index) => (
                <TouchableOpacity
                  key={index}
                  style={[languageModalStyles.languageItem, isDarkMode && languageModalStyles.languageItemDark]}
                  onPress={() => handleLanguageSelect(language)}
                >
                  <Text style={languageModalStyles.languageFlag}>{language.flag}</Text>
                  <Text style={[languageModalStyles.languageName, isDarkMode && languageModalStyles.languageNameDark]}>
                    {language.name}
                  </Text>
                  {currentLanguage === language.code && (
                    <Check size={20} color="#FF6A00" style={languageModalStyles.checkIcon} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Payment Modal */}
      <Modal
        visible={showPaymentModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              paymentModalStyles.modalContainer,
              { height: height * 0.75 },
              isDarkMode && paymentModalStyles.modalContainerDark,
            ]}
          >
            <View style={[paymentModalStyles.header, isDarkMode && paymentModalStyles.headerDark]}>
              <View style={paymentModalStyles.headerContent}>
                <Text style={[paymentModalStyles.title, isDarkMode && paymentModalStyles.titleDark]}>
                  Choose Payment Method
                </Text>
                <Text style={[paymentModalStyles.subtitle, isDarkMode && paymentModalStyles.subtitleDark]}>
                  Select your preferred payment option for Premium Monthly ($9.99)
                </Text>
              </View>
              <TouchableOpacity
                style={[paymentModalStyles.closeButton, isDarkMode && paymentModalStyles.closeButtonDark]}
                onPress={() => setShowPaymentModal(false)}
              >
                <X size={20} color={isDarkMode ? "#FFFFFF" : "#202026"} />
              </TouchableOpacity>
            </View>

            <View style={paymentModalStyles.paymentList}>
              <TouchableOpacity
                style={[paymentModalStyles.paymentItem, isDarkMode && paymentModalStyles.paymentItemDark]}
                onPress={() => handlePaymentMethod("M-Pesa")}
                disabled={isProcessingPayment}
              >
                <View style={paymentModalStyles.paymentIcon}>
                  <Smartphone size={24} color="#FF6A00" />
                </View>
                <View style={paymentModalStyles.paymentContent}>
                  <Text style={[paymentModalStyles.paymentTitle, isDarkMode && paymentModalStyles.paymentTitleDark]}>
                    M-Pesa
                  </Text>
                  <Text
                    style={[
                      paymentModalStyles.paymentDescription,
                      isDarkMode && paymentModalStyles.paymentDescriptionDark,
                    ]}
                  >
                    Pay with your mobile money via Paystack
                  </Text>
                </View>
                <ChevronRight size={20} color="#B5B5B5" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[paymentModalStyles.paymentItem, isDarkMode && paymentModalStyles.paymentItemDark]}
                onPress={() => handlePaymentMethod("Bank Transfer")}
                disabled={isProcessingPayment}
              >
                <View style={paymentModalStyles.paymentIcon}>
                  <Building size={24} color="#FF6A00" />
                </View>
                <View style={paymentModalStyles.paymentContent}>
                  <Text style={[paymentModalStyles.paymentTitle, isDarkMode && paymentModalStyles.paymentTitleDark]}>
                    Bank Transfer
                  </Text>
                  <Text
                    style={[
                      paymentModalStyles.paymentDescription,
                      isDarkMode && paymentModalStyles.paymentDescriptionDark,
                    ]}
                  >
                    Direct bank account transfer
                  </Text>
                </View>
                <ChevronRight size={20} color="#B5B5B5" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[paymentModalStyles.paymentItem, isDarkMode && paymentModalStyles.paymentItemDark]}
                onPress={() => handlePaymentMethod("Google Pay")}
                disabled={isProcessingPayment}
              >
                <View style={paymentModalStyles.paymentIcon}>
                  <Text style={paymentModalStyles.paymentEmoji}>💳</Text>
                </View>
                <View style={paymentModalStyles.paymentContent}>
                  <Text style={[paymentModalStyles.paymentTitle, isDarkMode && paymentModalStyles.paymentTitleDark]}>
                    Google Pay
                  </Text>
                  <Text
                    style={[
                      paymentModalStyles.paymentDescription,
                      isDarkMode && paymentModalStyles.paymentDescriptionDark,
                    ]}
                  >
                    Quick and secure payments
                  </Text>
                </View>
                <ChevronRight size={20} color="#B5B5B5" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[paymentModalStyles.paymentItem, isDarkMode && paymentModalStyles.paymentItemDark]}
                onPress={() => handlePaymentMethod("Credit Card")}
                disabled={isProcessingPayment}
              >
                <View style={paymentModalStyles.paymentIcon}>
                  <CreditCard size={24} color="#FF6A00" />
                </View>
                <View style={paymentModalStyles.paymentContent}>
                  <Text style={[paymentModalStyles.paymentTitle, isDarkMode && paymentModalStyles.paymentTitleDark]}>
                    Credit/Debit Card
                  </Text>
                  <Text
                    style={[
                      paymentModalStyles.paymentDescription,
                      isDarkMode && paymentModalStyles.paymentDescriptionDark,
                    ]}
                  >
                    Visa, Mastercard, American Express
                  </Text>
                </View>
                <ChevronRight size={20} color="#B5B5B5" />
              </TouchableOpacity>
            </View>

            <View style={paymentModalStyles.footer}>
              <Text style={[paymentModalStyles.footerText, isDarkMode && paymentModalStyles.footerTextDark]}>
                🔒 All payments are secured with 256-bit SSL encryption
              </Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* Receipt Modal */}
      {receiptData && (
        <ReceiptModal
          visible={showReceiptModal}
          onClose={() => setShowReceiptModal(false)}
          receiptData={receiptData}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Processing Payment Overlay */}
      {isProcessingPayment && (
        <Modal visible={true} transparent={true} animationType="fade">
          <View style={styles.overlay}>
            <View style={[processingStyles.container, isDarkMode && processingStyles.containerDark]}>
              <ActivityIndicator size="large" color="#FF6A00" />
              <Text style={[processingStyles.text, isDarkMode && processingStyles.textDark]}>
                Processing Payment...
              </Text>
              <Text style={[processingStyles.subtext, isDarkMode && processingStyles.subtextDark]}>
                Please wait while we process your payment
              </Text>
            </View>
          </View>
        </Modal>
      )}
    </View>
  )
}

const processingStyles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    marginHorizontal: 40,
  },
  containerDark: {
    backgroundColor: "#1A1A1A",
  },
  text: {
    fontSize: 18,
    fontWeight: "600",
    color: "#202026",
    marginTop: 16,
    textAlign: "center",
  },
  textDark: {
    color: "#FFFFFF",
  },
  subtext: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },
  subtextDark: {
    color: "#CCCCCC",
  },
})

const languageModalStyles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: "100%",
  },
  modalContainerDark: {
    backgroundColor: "#1A1A1A",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerDark: {
    borderBottomColor: "#333333",
  },
  headerContent: {
    flex: 1,
    paddingRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#202026",
    marginBottom: 8,
  },
  titleDark: {
    color: "#FFFFFF",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    lineHeight: 22,
  },
  subtitleDark: {
    color: "#CCCCCC",
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  closeButtonDark: {
    backgroundColor: "#333333",
    borderColor: "#444444",
  },
  languageList: {
    flex: 1,
    padding: 20,
  },
  languageItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  languageItemDark: {
    backgroundColor: "#2A2A2A",
    borderColor: "#333333",
  },
  languageFlag: {
    fontSize: 24,
    marginRight: 16,
  },
  languageName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#202026",
  },
  languageNameDark: {
    color: "#FFFFFF",
  },
  checkIcon: {
    marginLeft: 8,
  },
})

const paymentModalStyles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: "100%",
  },
  modalContainerDark: {
    backgroundColor: "#1A1A1A",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerDark: {
    borderBottomColor: "#333333",
  },
  headerContent: {
    flex: 1,
    paddingRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#202026",
    marginBottom: 8,
  },
  titleDark: {
    color: "#FFFFFF",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    lineHeight: 22,
  },
  subtitleDark: {
    color: "#CCCCCC",
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  closeButtonDark: {
    backgroundColor: "#333333",
    borderColor: "#444444",
  },
  paymentList: {
    flex: 1,
    padding: 20,
  },
  paymentItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  paymentItemDark: {
    backgroundColor: "#2A2A2A",
    borderColor: "#333333",
  },
  paymentIcon: {
    width: 48,
    height: 48,
    backgroundColor: "rgba(255, 106, 0, 0.1)",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  paymentEmoji: {
    fontSize: 24,
  },
  paymentContent: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#202026",
    marginBottom: 4,
  },
  paymentTitleDark: {
    color: "#FFFFFF",
  },
  paymentDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  paymentDescriptionDark: {
    color: "#CCCCCC",
  },
  footer: {
    padding: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  footerTextDark: {
    color: "#CCCCCC",
  },
})

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  paymentIcon: {
    width: 48,
    height: 48,
    backgroundColor: "rgba(255, 106, 0, 0.1)",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  footer: {
    padding: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
})
