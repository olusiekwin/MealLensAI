// Zustand user store is no longer needed. This file is now deprecated after refactor to AsyncStorage-based user profile management.
// You can safely remove all Zustand logic and references to useUserStore from the app.

// Optionally, export a dummy function to avoid import errors if any remain temporarily:
export const useUserStore = () => {
  throw new Error("useUserStore is deprecated. Please use AsyncStorage-based user profile management.");
};
