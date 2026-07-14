// ── Validation ─────────────────────────────────────────────────────────────

import { User } from "@/types/profile";

export interface ValidateSignupRequest {
  email?: string;
  phone?: string;
}

export interface ValidationFieldInfo {
  value: string;
  normalized: string;
  valid: boolean;
  available: boolean;
  code: string;
  message: string;
}

export interface ValidateSignupResponseData {
  email?: ValidationFieldInfo;
  phone?: ValidationFieldInfo;
  canRegister: boolean;
}

export interface ValidateSignupResponse {
  data: ValidateSignupResponseData;
  meta?: {
    requestId: string;
  };
}

// ── Authentication ─────────────────────────────────────────────────────────

export interface AuthResponseData {
  user: User;
  accessToken: string;
  token: string;
  refreshToken: string;
  tokenType: string;
  expiresAt: string;
  expiresInSeconds: number;
  refreshTokenExpiresAt: string;
}

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

export interface RegisterResponseData {
  user: User;
  emailVerificationRequired: boolean;
  nextStep: string;
  otp: {
    requestPath: string;
    verifyPath: string;
    expiresInSeconds: number;
  };
}

export interface RegisterResponse {
  data: RegisterResponseData;
  meta?: {
    requestId: string;
  };
}

// ── OTP ────────────────────────────────────────────────────────────────────

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

// ── Session & Token ────────────────────────────────────────────────────────

export interface SessionResponseData extends AuthResponseData {
  authenticated: boolean;
}

export interface SessionResponse {
  data: SessionResponseData;
  meta?: {
    requestId: string;
  };
}

export interface LogoutResponseData {
  loggedOut: boolean;
}

export interface LogoutResponse {
  data: LogoutResponseData;
}

export interface RefreshRequestBody {
  refreshToken: string;
}



export interface RefreshResponse {
  data: AuthResponseData;
}

export interface TwoFactorChallengeData {
  requiresTwoFactor: true;
  challengeId: string;
  expiresAt: string;
  attemptsRemaining: number;
}

export type LoginResponseData = AuthResponseData | TwoFactorChallengeData;

export interface LoginResponse {
  data: LoginResponseData;
  meta?: {
    requestId: string;
  };
}

export interface AuthResponse {
  data: LoginResponseData;
}
