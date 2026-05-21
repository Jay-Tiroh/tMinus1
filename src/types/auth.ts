import { User } from "@/types/user";

// Expanded to match your new API response containing refresh tokens and expiration
export interface AuthResponseData {
  user: User;
  accessToken: string;
  token: string; // Often duplicates accessToken depending on backend setup
  refreshToken: string;
  tokenType: string;
  expiresAt: string;
  expiresInSeconds: number;
  refreshTokenExpiresAt: string;
}

export interface AuthResponse {
  data: AuthResponseData;
  meta?: {
    requestId: string;
  };
}

// Replaced LoginRequestEmail/Mobile with a unified LoginRequest
export interface LoginRequest {
  loginType: "email" | "phone";
  identifier: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export interface VerifyOTPRequest {
  code: string;
  email: string;
}

export interface RequestOTPResponseData {
  message: string;
  demoCode: string;
  expiresInSeconds: number;
}

export interface RequestOTPResponse {
  data: RequestOTPResponseData;
}

export interface VerifyOTPResponseData {
  verified: boolean;
}

export interface VerifyOTPResponse {
  data: VerifyOTPResponseData;
}

// Session — Can now just extend AuthResponseData or match its shape
export interface SessionResponseData extends AuthResponseData {
  authenticated: boolean;
}

export interface SessionResponse {
  data: SessionResponseData;
}

// Logout
export interface LogoutResponseData {
  loggedOut: boolean;
}
export interface LogoutResponse {
  data: LogoutResponseData;
}

// Refresh
export interface RefreshRequestBody {
  refreshToken: string;
}

export interface RefreshResponseData extends AuthResponseData {}

export interface RefreshResponse {
  data: RefreshResponseData;
}
