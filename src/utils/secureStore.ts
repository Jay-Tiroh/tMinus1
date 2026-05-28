import * as SecureStore from "expo-secure-store";

const KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
} as const;

export async function saveToken(key: keyof typeof KEYS, value: string) {
  await SecureStore.setItemAsync(KEYS[key], value);
}

export async function getToken(key: keyof typeof KEYS) {
  return await SecureStore.getItemAsync(KEYS[key]);
}

export async function deleteToken(key: keyof typeof KEYS) {
  await SecureStore.deleteItemAsync(KEYS[key]);
}

export async function clearTokens() {
  await SecureStore.deleteItemAsync(KEYS.ACCESS_TOKEN);
  await SecureStore.deleteItemAsync(KEYS.REFRESH_TOKEN);
}
