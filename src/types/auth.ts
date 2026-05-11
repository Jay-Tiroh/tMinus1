import { User } from "@/types/user";

export interface AuthResponseData {
  user: User;
  token: string;
}

export interface AuthResponse {
  data: AuthResponseData;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}
