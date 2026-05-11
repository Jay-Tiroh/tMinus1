export type KycStatus = "approved" | "pending" | "rejected" | "not_started";

export type Theme = "light" | "dark" | "system";

export type UserRole = "customer" | "admin";

export interface UserSettings {
  language: string;
  fiatCurrency: string;
  theme: Theme;
  priceAlerts: boolean;
  pushNotifications: boolean;
  biometricEnabled: boolean;
}

export interface User {
  id: string;
  role: UserRole;
  fullName: string;
  email: string;
  phone: string;
  kycStatus: KycStatus;
  avatarUrl: string | null;
  watchlist: string[];
  settings: UserSettings;
  createdAt: string;
}
