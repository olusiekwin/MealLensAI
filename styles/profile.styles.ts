<<<<<<< HEAD
import { StyleSheet } from "react-native";
=======
import { StyleSheet, Platform } from "react-native";
>>>>>>> the-moredern-features

export const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 33,
    paddingTop: 44,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '500',
    color: '#202026',
  },
  settingsButton: {
    padding: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
  },
  uploadingContainer: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#464645',
    marginTop: 10,
  },
  profilePhone: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6A6A6A',
    marginTop: 5,
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    width: '80%',
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    padding: 15,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
<<<<<<< HEAD
    backgroundColor: '#FF6A00',
=======
    backgroundColor: '#000000',
>>>>>>> the-moredern-features
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202026',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6A6A6A',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#DDDDDD',
    marginHorizontal: 15,
  },
  editButton: {
    width: 140,
    height: 39,
    backgroundColor: '#202026',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    flexDirection: 'row',
  },
  editButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editIcon: {
    marginRight: 8,
  },
  saveButton: {
<<<<<<< HEAD
    backgroundColor: '#FF6A00',
=======
    backgroundColor: '#000000',
>>>>>>> the-moredern-features
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F5F5F5',
  },
  formSection: {
    paddingHorizontal: 33,
    paddingTop: 20,
    paddingBottom: 100, // Add padding to account for tab bar
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#202026',
    marginBottom: 8,
  },
  inputContainer: {
    height: 55,
    borderWidth: 1,
    borderColor: '#ECECEC',
    borderRadius: 10,
    justifyContent: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#FFFFFF',
<<<<<<< HEAD
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
=======
    ...(Platform.OS === 'web' ? { boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
    }),
>>>>>>> the-moredern-features
    elevation: 2,
  },
  input: {
    fontSize: 14,
    fontWeight: '500',
    color: '#B5B5B5',
  },
  inputEditable: {
    color: '#202026',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderOption: {
    width: 150,
    height: 46,
    borderWidth: 1,
    borderColor: 'rgba(181, 181, 181, 0.25)',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#FFFFFF',
<<<<<<< HEAD
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
=======
    ...(Platform.OS === 'web' ? { boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
    }),
>>>>>>> the-moredern-features
    elevation: 2,
  },
  radioSelected: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#67C74F',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  radioUnselected: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#B5B5B5',
    marginRight: 10,
  },
  genderText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#B5B5B5',
  },
});