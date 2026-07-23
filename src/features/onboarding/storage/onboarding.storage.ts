import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_KEY = "has_onboarded";

export const onboardingStorage = {
  async markAsComplete(): Promise<void> {
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
  },
  async hasCompleted(): Promise<boolean> {
    const value = await AsyncStorage.getItem(ONBOARDING_KEY);
    return value === "true";
  },
};
