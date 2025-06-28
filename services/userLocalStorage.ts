import AsyncStorage from '@react-native-async-storage/async-storage';

export const USER_PROFILE_KEY = 'user_profile';

export async function saveUserProfile(profile) {
  try {
    await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    throw new Error('Failed to save user profile');
  }
}

export async function getUserProfile() {
  try {
    const json = await AsyncStorage.getItem(USER_PROFILE_KEY);
    return json ? JSON.parse(json) : null;
  } catch (e) {
    throw new Error('Failed to load user profile');
  }
}

export async function clearUserProfile() {
  try {
    await AsyncStorage.removeItem(USER_PROFILE_KEY);
  } catch (e) {
    // ignore
  }
}
