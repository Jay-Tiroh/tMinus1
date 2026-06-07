import { RequireAtLeastOne } from "@/types/utility";

export interface UserSettings {
  language: string;
  fiatCurrency: string;
  theme: string;
  pushNotifications: boolean;
  biometricEnabled: boolean;
}

export interface VerificationLimits {
  depositPerTransactionUsd: number;
  tradePerTransactionUsd: number;
  withdrawalPerTransactionUsd: number;
  dailyWithdrawalUsd: number;
}

export interface UserVerification {
  status: string;
  tier: string;
  level: number;
  label: string;
  limits: VerificationLimits;
  canTrade: boolean;
  canWithdraw: boolean;
  canUseSandboxDeposits: boolean;
}

export interface User {
  id: string;
  role: string;
  fullName: string;
  email: string;
  phone: string;
  twoFactorEnabled: boolean;
  kycStatus: string;
  verification: UserVerification;
  avatarUrl: string | null;
  watchlist: string[];
  settings: UserSettings;
  createdAt: string;
}

export interface ProfileResponse {
  data: User;
}
export interface ProfileUpdateRequestData {
  fullName: string;
  phone: string;
  email: string;
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
