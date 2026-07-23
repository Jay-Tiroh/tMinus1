import { SelectorOption } from "@/shared/components/OptionPicker";

export type FiatCurrency =
  "USD" | "NGN" | "EUR" | "GBP" | "CAD" | "AUD" | "JPY" | "CHF";

export const FIAT_CURRENCIES: SelectorOption<FiatCurrency>[] = [
  {
    label: "USD",
    value: "USD",
    description: "United States Dollar",
    symbol: "$",
  },
  {
    label: "NGN",
    value: "NGN",
    description: "Nigerian Naira",
    symbol: "₦",
  },
  {
    label: "EUR",
    value: "EUR",
    description: "Euro",
    symbol: "€",
  },
  {
    label: "GBP",
    value: "GBP",
    description: "British Pound Sterling",
    symbol: "£",
  },
  {
    label: "CAD",
    value: "CAD",
    description: "Canadian Dollar",
    symbol: "$",
  },
  {
    label: "AUD",
    value: "AUD",
    description: "Australian Dollar",
    symbol: "$",
  },
  {
    label: "JPY",
    value: "JPY",
    description: "Japanese Yen",
    symbol: "¥",
  },
  {
    label: "CHF",
    value: "CHF",
    description: "Swiss Franc",
    symbol: "Fr.",
  },
];

export interface UserSettings {
  language: string;
  fiatCurrency: FiatCurrency;
  theme: string;
  priceAlerts: boolean;
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
  emailVerified: boolean;
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
  meta?: {
    requestId: string;
  };
}

export interface ProfileUpdateRequestData {
  fullName: string;
  phone: string;
  avatarUrl: string;
}
export type UpdateProfileRequest = Partial<ProfileUpdateRequestData>;

export interface UpdateSettingsRequestData {
  theme: string;
  priceAlerts: boolean;
  pushNotifications: boolean;
  biometricEnabled: boolean;
  fiatCurrency: FiatCurrency;
  language: string;
}
export type UpdateSettingsRequest = Partial<UpdateSettingsRequestData>;

export interface SettingsMeta {
  requestId: string;
}

export interface SettingsResponse {
  data: UserSettings;
  meta: SettingsMeta;
}

export interface UpdatePinRequest {
  currentPin: string;
  newPin: string;
}

export interface UpdatePinResponse {
  data: {
    updated: boolean;
  };
  meta?: {
    requestId: string;
  };
}
