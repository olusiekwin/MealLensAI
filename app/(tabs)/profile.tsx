"use client"

import { useState, useEffect } from "react"
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Platform,
  ActivityIndicator,
  Modal,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native"
import {
  Settings,
  Camera,
  Edit,
  Trophy,
  Star,
  CheckCircle,
  X,
  Phone,
  Calendar,
  MapPin,
  Users,
} from "lucide-react-native"
import * as ImagePicker from "expo-image-picker"
import { useRouter } from "expo-router"
import { profileStyles } from "@/styles/profile.styles"
import { getUserProfile, saveUserProfile } from "@/services/userLocalStorage"
import aiService from "@/services/aiService"
import profileService from "@/services/profileService"
import { useThemeStore } from "@/context/themeStore"

const { height } = Dimensions.get("window")

export default function ProfileScreen() {
  const router = useRouter()
  // Use global theme store instead of useColorScheme
  const isDarkMode = useThemeStore((state) => state.isDarkMode)
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [usageStats, setUsageStats] = useState({ remaining: 0, limit: 3 })
  const [isPremium, setIsPremium] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [profile, setProfile] = useState<any>(null)

  const [userData, setUserData] = useState({
    name: "",
    phone: "",
    email: "",
    dob: "",
    gender: "",
    address: "",
  })

  const [profileImage, setProfileImage] = useState(
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  )

  useEffect(() => {
    loadProfile()
  }, [])

  // Fix: Use only safe properties for profile fields
  const loadProfile = async () => {
    setIsLoading(true)
    try {
      // Get from AsyncStorage
      const cached = await getUserProfile()
      if (cached) {
        setProfile(cached)
        setUserData({
          name: cached.username || "",
          phone: cached.phone || "",
          email: cached.email || "",
          dob: cached.dateOfBirth || "",
          gender: cached.gender || "",
          address: cached.address || "",
        })
        if (cached.profileImage) setProfileImage(cached.profileImage)
        setIsPremium(!!cached.isPremium)
      }
      // Always try to fetch fresh from API
      const fresh = await profileService.getProfile()
      if (fresh) {
        setProfile(fresh)
        setUserData({
          name: fresh.username || "",
          phone: "", // Ensure shape matches initial state
          email: fresh.email || "",
          dob: fresh.dateOfBirth || "",
          gender: fresh.gender || "",
          address: fresh.address || "",
        })
        // Remove profileImage and isPremium from here
        await saveUserProfile(fresh)
      }
      // Get usage limits
      const limits = await aiService.checkDailyLimit()
      setUsageStats(limits)
    } catch (error) {
      console.error("Error loading profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const pickImage = async () => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Sorry, we need camera roll permissions to change your profile picture.")
        return
      }
    }
    setIsUploading(true)
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    })
    setIsUploading(false)
    if (!result.canceled) {
      setProfileImage(result.assets[0].uri)
    }
  }

  const handleSettingsPress = () => {
    router.push("/settings")
  }

  const handleSaveProfile = async () => {
    setIsUpdating(true)
    try {
      // Save to API and AsyncStorage
      await profileService.updateProfile(userData)
      await saveUserProfile({ ...profile, ...userData, profileImage })
      setShowEditModal(false)
      Alert.alert("Success", "Profile updated successfully!")
      loadProfile()
    } catch (error) {
      console.error("Error updating profile:", error)
      Alert.alert("Error", "Failed to update profile. Please try again.")
    } finally {
      setIsUpdating(false)
    }
  }

  const updateField = (field: string, value: string) => {
    setUserData({
      ...userData,
      [field]: value,
    })
  }

  if (isLoading) {
    return (
      <View style={[profileStyles.container, isDarkMode && profileStyles.containerDark]}>
        <View style={[profileStyles.header, isDarkMode && profileStyles.headerDark]}>
          <Text style={[profileStyles.headerTitle, isDarkMode && profileStyles.headerTitleDark]}>Profile</Text>
          <TouchableOpacity
            style={[profileStyles.settingsButton, isDarkMode && profileStyles.settingsButtonDark]}
            onPress={handleSettingsPress}
          >
            <Settings size={20} color={isDarkMode ? "#FFFFFF" : "#202026"} />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#FF6A00" />
          <Text style={{ marginTop: 16, fontSize: 16, color: isDarkMode ? "#CCCCCC" : "#666" }}>
            Loading profile...
          </Text>
        </View>
      </View>
    )
  }

  return (
    <View style={[profileStyles.container, isDarkMode && profileStyles.containerDark]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View style={[profileStyles.header, isDarkMode && profileStyles.headerDark]}>
          <Text style={[profileStyles.headerTitle, isDarkMode && profileStyles.headerTitleDark]}>Profile</Text>
          <TouchableOpacity
            style={[profileStyles.settingsButton, isDarkMode && profileStyles.settingsButtonDark]}
            onPress={handleSettingsPress}
          >
            <Settings size={20} color={isDarkMode ? "#FFFFFF" : "#202026"} />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={[profileStyles.profileCard, isDarkMode && profileStyles.profileCardDark]}>
          <TouchableOpacity style={profileStyles.profileImageContainer} onPress={pickImage}>
            {isUploading ? (
              <View style={profileStyles.uploadingContainer}>
                <ActivityIndicator size="small" color="#FF6A00" />
              </View>
            ) : (
              <>
                <Image source={{ uri: profileImage }} style={profileStyles.profileImage} />
                <View style={profileStyles.cameraButton}>
                  <Camera size={16} color="#FFFFFF" />
                </View>
              </>
            )}
          </TouchableOpacity>

          <View style={profileStyles.profileInfo}>
            <Text style={[profileStyles.profileName, isDarkMode && profileStyles.profileNameDark]}>
              {userData.name || "Your Name"}
            </Text>
            <Text style={[profileStyles.profileEmail, isDarkMode && profileStyles.profileEmailDark]}>
              {userData.email || "Add your email address"}
            </Text>

            <View style={profileStyles.statsRow}>
              <View style={profileStyles.statBox}>
                <Text style={[profileStyles.statNumber, isDarkMode && profileStyles.statNumberDark]}>
                  {usageStats.remaining}
                </Text>
                <Text style={[profileStyles.statLabel, isDarkMode && profileStyles.statLabelDark]}>Scans Left</Text>
              </View>
              <View style={profileStyles.statBox}>
                <Text style={[profileStyles.statNumber, isDarkMode && profileStyles.statNumberDark]}>
                  {isPremium ? "∞" : usageStats.limit}
                </Text>
                <Text style={[profileStyles.statLabel, isDarkMode && profileStyles.statLabelDark]}>Daily Limit</Text>
              </View>
              <View style={profileStyles.statBox}>
                <Text style={[profileStyles.statNumber, { color: isPremium ? "#67C74F" : "#FF6A00" }]}>
                  {isPremium ? "PRO" : "FREE"}
                </Text>
                <Text style={[profileStyles.statLabel, isDarkMode && profileStyles.statLabelDark]}>Plan</Text>
              </View>
            </View>

            <TouchableOpacity style={profileStyles.editButton} onPress={() => setShowEditModal(true)}>
              <Edit size={16} color="#FFFFFF" style={profileStyles.editIcon} />
              <Text style={profileStyles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Personal Information */}
        <View style={[profileStyles.section, isDarkMode && profileStyles.sectionDark]}>
          <Text style={[profileStyles.sectionTitle, isDarkMode && profileStyles.sectionTitleDark]}>
            Personal Information
          </Text>

          <View style={[profileStyles.infoGrid, isDarkMode && profileStyles.infoGridDark]}>
            <View style={[profileStyles.infoItem, isDarkMode && profileStyles.infoItemDark]}>
              <View style={profileStyles.infoIcon}>
                <Phone size={18} color="#FF6A00" />
              </View>
              <View style={profileStyles.infoContent}>
                <Text style={[profileStyles.infoLabel, isDarkMode && profileStyles.infoLabelDark]}>Phone</Text>
                <Text style={[profileStyles.infoValue, isDarkMode && profileStyles.infoValueDark]}>
                  {userData.phone || "Not provided"}
                </Text>
              </View>
            </View>

            <View style={[profileStyles.infoItem, isDarkMode && profileStyles.infoItemDark]}>
              <View style={profileStyles.infoIcon}>
                <Calendar size={18} color="#FF6A00" />
              </View>
              <View style={profileStyles.infoContent}>
                <Text style={[profileStyles.infoLabel, isDarkMode && profileStyles.infoLabelDark]}>Birthday</Text>
                <Text style={[profileStyles.infoValue, isDarkMode && profileStyles.infoValueDark]}>
                  {userData.dob || "Not provided"}
                </Text>
              </View>
            </View>

            <View style={[profileStyles.infoItem, isDarkMode && profileStyles.infoItemDark]}>
              <View style={profileStyles.infoIcon}>
                <Users size={18} color="#FF6A00" />
              </View>
              <View style={profileStyles.infoContent}>
                <Text style={[profileStyles.infoLabel, isDarkMode && profileStyles.infoLabelDark]}>Gender</Text>
                <Text style={[profileStyles.infoValue, isDarkMode && profileStyles.infoValueDark]}>
                  {userData.gender || "Not specified"}
                </Text>
              </View>
            </View>

            <View
              style={[profileStyles.infoItem, profileStyles.infoItemFull, isDarkMode && profileStyles.infoItemDark]}
            >
              <View style={profileStyles.infoIcon}>
                <MapPin size={18} color="#FF6A00" />
              </View>
              <View style={profileStyles.infoContent}>
                <Text style={[profileStyles.infoLabel, isDarkMode && profileStyles.infoLabelDark]}>Address</Text>
                <Text style={[profileStyles.infoValue, isDarkMode && profileStyles.infoValueDark]}>
                  {userData.address || "Not provided"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={editModalStyles.modalOverlay}>
          <View
            style={[
              editModalStyles.modalContainer,
              { height: height * 0.85 },
              isDarkMode && editModalStyles.modalContainerDark,
            ]}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={editModalStyles.container}
            >
              <View style={[editModalStyles.header, isDarkMode && editModalStyles.headerDark]}>
                <View style={editModalStyles.headerContent}>
                  <Text style={[editModalStyles.title, isDarkMode && editModalStyles.titleDark]}>Edit Profile</Text>
                  <Text style={[editModalStyles.subtitle, isDarkMode && editModalStyles.subtitleDark]}>
                    Update your personal information
                  </Text>
                </View>
                <TouchableOpacity
                  style={[editModalStyles.closeButton, isDarkMode && editModalStyles.closeButtonDark]}
                  onPress={() => setShowEditModal(false)}
                >
                  <X size={20} color={isDarkMode ? "#FFFFFF" : "#202026"} />
                </TouchableOpacity>
              </View>

              <ScrollView style={editModalStyles.form} showsVerticalScrollIndicator={false}>
                <View style={editModalStyles.formGroup}>
                  <Text style={[editModalStyles.formLabel, isDarkMode && editModalStyles.formLabelDark]}>
                    Full Name
                  </Text>
                  <TextInput
                    style={[editModalStyles.input, isDarkMode && editModalStyles.inputDark]}
                    value={userData.name}
                    onChangeText={(text) => updateField("name", text)}
                    placeholder="Enter your full name"
                    placeholderTextColor={isDarkMode ? "#666666" : "#B5B5B5"}
                  />
                </View>

                <View style={editModalStyles.formGroup}>
                  <Text style={[editModalStyles.formLabel, isDarkMode && editModalStyles.formLabelDark]}>
                    Phone Number
                  </Text>
                  <TextInput
                    style={[editModalStyles.input, isDarkMode && editModalStyles.inputDark]}
                    value={userData.phone}
                    onChangeText={(text) => updateField("phone", text)}
                    placeholder="Enter your phone number"
                    placeholderTextColor={isDarkMode ? "#666666" : "#B5B5B5"}
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={editModalStyles.formGroup}>
                  <Text style={[editModalStyles.formLabel, isDarkMode && editModalStyles.formLabelDark]}>
                    Email Address
                  </Text>
                  <TextInput
                    style={[editModalStyles.input, isDarkMode && editModalStyles.inputDark]}
                    value={userData.email}
                    onChangeText={(text) => updateField("email", text)}
                    placeholder="Enter your email address"
                    placeholderTextColor={isDarkMode ? "#666666" : "#B5B5B5"}
                    keyboardType="email-address"
                  />
                </View>

                <View style={editModalStyles.formGroup}>
                  <Text style={[editModalStyles.formLabel, isDarkMode && editModalStyles.formLabelDark]}>
                    Date of Birth
                  </Text>
                  <TextInput
                    style={[editModalStyles.input, isDarkMode && editModalStyles.inputDark]}
                    value={userData.dob}
                    onChangeText={(text) => updateField("dob", text)}
                    placeholder="DD/MM/YYYY"
                    placeholderTextColor={isDarkMode ? "#666666" : "#B5B5B5"}
                  />
                </View>

                <View style={editModalStyles.formGroup}>
                  <Text style={[editModalStyles.formLabel, isDarkMode && editModalStyles.formLabelDark]}>Gender</Text>
                  <View style={editModalStyles.genderContainer}>
                    <TouchableOpacity
                      style={[
                        editModalStyles.genderOption,
                        userData.gender === "Male" && editModalStyles.genderOptionSelected,
                        isDarkMode && editModalStyles.genderOptionDark,
                      ]}
                      onPress={() => updateField("gender", "Male")}
                    >
                      <View
                        style={
                          userData.gender === "Male" ? editModalStyles.radioSelected : editModalStyles.radioUnselected
                        }
                      >
                        {userData.gender === "Male" && <View style={editModalStyles.radioInner} />}
                      </View>
                      <Text
                        style={[
                          editModalStyles.genderText,
                          userData.gender === "Male" && editModalStyles.genderTextSelected,
                          isDarkMode && editModalStyles.genderTextDark,
                        ]}
                      >
                        Male
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        editModalStyles.genderOption,
                        userData.gender === "Female" && editModalStyles.genderOptionSelected,
                        isDarkMode && editModalStyles.genderOptionDark,
                      ]}
                      onPress={() => updateField("gender", "Female")}
                    >
                      <View
                        style={
                          userData.gender === "Female" ? editModalStyles.radioSelected : editModalStyles.radioUnselected
                        }
                      >
                        {userData.gender === "Female" && <View style={editModalStyles.radioInner} />}
                      </View>
                      <Text
                        style={[
                          editModalStyles.genderText,
                          userData.gender === "Female" && editModalStyles.genderTextSelected,
                          isDarkMode && editModalStyles.genderTextDark,
                        ]}
                      >
                        Female
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={editModalStyles.formGroup}>
                  <Text style={[editModalStyles.formLabel, isDarkMode && editModalStyles.formLabelDark]}>Address</Text>
                  <TextInput
                    style={[editModalStyles.input, editModalStyles.textArea, isDarkMode && editModalStyles.inputDark]}
                    value={userData.address}
                    onChangeText={(text) => updateField("address", text)}
                    placeholder="Enter your address"
                    placeholderTextColor={isDarkMode ? "#666666" : "#B5B5B5"}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                </View>
              </ScrollView>

              <View style={[editModalStyles.footer, isDarkMode && editModalStyles.footerDark]}>
                <TouchableOpacity
                  style={[editModalStyles.cancelButton, isDarkMode && editModalStyles.cancelButtonDark]}
                  onPress={() => setShowEditModal(false)}
                  disabled={isUpdating}
                >
                  <Text style={[editModalStyles.cancelButtonText, isDarkMode && editModalStyles.cancelButtonTextDark]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={editModalStyles.saveButton} onPress={handleSaveProfile} disabled={isUpdating}>
                  {isUpdating ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <>
                      <CheckCircle size={16} color="#FFFFFF" style={editModalStyles.saveIcon} />
                      <Text style={editModalStyles.saveButtonText}>Save Changes</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const editModalStyles = {
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end" as const,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: "100%",
  },
  modalContainerDark: {
    backgroundColor: "#1A1A1A",
  },
  container: {
    flex: 1,
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
    fontWeight: "600" as "600",
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
  form: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#202026",
    marginBottom: 8,
  },
  formLabelDark: {
    color: "#FFFFFF",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#202026",
  },
  inputDark: {
    backgroundColor: "#2A2A2A",
    borderColor: "#333333",
    color: "#FFFFFF",
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top" as const,
  },
  genderContainer: {
    flexDirection: "row" as "row",
    justifyContent: "space-between" as "space-between",
    gap: 12,
  },
  genderOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#FAFAFA",
  },
  genderOptionDark: {
    backgroundColor: "#2A2A2A",
    borderColor: "#333333",
  },
  genderOptionSelected: {
    borderColor: "#FF6A00",
    backgroundColor: "rgba(255, 106, 0, 0.05)",
  },
  radioSelected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FF6A00",
    alignItems: "center" as "center",
    justifyContent: "center" as "center",
    marginRight: 12,
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
  },
  radioUnselected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    marginRight: 12,
  },
  genderText: {
    fontSize: 14,
    fontWeight: "500" as "500",
    color: "#B5B5B5",
  },
  genderTextDark: {
    color: "#CCCCCC",
  },
  genderTextSelected: {
    color: "#202026",
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    padding: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  footerDark: {
    borderTopColor: "#333333",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  cancelButtonDark: {
    backgroundColor: "#333333",
    borderColor: "#444444",
  },
  cancelButtonText: {
    color: "#202026",
    fontSize: 16,
    fontWeight: "500" as "500",
  },
  cancelButtonTextDark: {
    color: "#FFFFFF",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#FF6A00",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center" as "center",
    justifyContent: "center" as "center",
    flexDirection: "row" as "row",
  },
  saveIcon: {
    marginRight: 8,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600" as "600",
  },
}
