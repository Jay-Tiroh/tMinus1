import { User } from "@/types/user";

export interface AuthResponseData {
  user: User;
  token: string;
}

export interface AuthResponse {
  data: AuthResponseData;
}

export interface LoginRequestEmail {
  email: string;
  password: string;
}

export interface LoginRequestMobile {
  phone: string;
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

export interface RequestOTPResponse {
  data: RequestOTPResponseData;
}

export interface RequestOTPResponseData {
  message: string;
  demoCode: string;
  expiresInSeconds: number;
}

export interface VerifyOTPResponseData {
  verified: boolean;
}

export interface VerifyOTPResponse {
  data: VerifyOTPResponseData;
}
