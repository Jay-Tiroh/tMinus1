import { RequireAtLeastOne } from "@/types/utility";

export interface UserSettings {
  language: string;
  fiatCurrency: string;
  theme: string;
  priceAlerts: boolean;
  pushNotifications: boolean;
  biometricEnabled: boolean;
}

export interface User {
  id: string;
  role: string;
  fullName: string;
  email: string;
  phone: string;
  twoFactorEnabled: boolean;
  kycStatus: string;
  avatarUrl: string | null;
  watchlist: string[];
  settings: UserSettings;
  createdAt: string;
}

export interface ProfileResponse {
  data: User;
}
interface ProfileUpdateRequestData {
  fullName: string;
  phone: string;
  avatarUrl: string;
}
export type UpdateProfileRequest = RequireAtLeastOne<ProfileUpdateRequestData>;

export interface UpdateSettingsRequestData {
  theme: string;
  priceAlerts: boolean;
  pushNotifications: boolean;
  biometricEnabled: boolean;
  fiatCurrency: string;
  language: string;
}
export type UpdateSettingsRequest =
  RequireAtLeastOne<UpdateSettingsRequestData>;

export interface SettingsMeta {
  requestId: string;
}

export interface SettingsResponse {
  data: UserSettings;
  meta: SettingsMeta;
}
