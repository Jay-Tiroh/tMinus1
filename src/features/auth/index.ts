import "./bootstrapAuthBridge"; // side-effect: registers the auth bridge on module load

// ==========================================
// SCREENS
// ==========================================
export { default as AuthIndexScreen } from "./screens/AuthIndexScreen";
export { default as SignUpScreen } from "./screens/SignUpScreen";
export { default as SuccessScreen } from "./screens/SuccessScreen";
export { default as Verify2FAScreen } from "./screens/TwoFactorVerificationScreen";
export { default as VerifyScreen } from "./screens/VerifyScreen";
export { default as WelcomeBackScreen } from "./screens/WelcomeBackScreen";

// ==========================================
// API & HOOKS
// ==========================================
export {
  authApi,
  useGetSessionQuery,
  useLazyGetSessionQuery,
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useRegisterMutation,
  useRequestOTPMutation,
  useValidateSignupMutation,
  useVerifyOTPMutation,
} from "./api/authApi";
export { useLogout } from "./hooks/useLogout";
// ==========================================
// STORAGE & AUTH STATE
// ==========================================
export {
  default as authReducer,
  clearCredentials,
  lockSession,
  setCredentials,
  unlockSession,
  updateUserSettings,
} from "./store/authSlice";

// ==========================================
// TYPES
// ==========================================
export type {
  AuthResponseData,
  LoginRequest,
  LoginResponse,
  LoginResponseData,
  LogoutResponse,
  LogoutResponseData,
  RefreshRequestBody,
  RefreshResponse,
  RefreshResponseData,
  RegisterRequest,
  RegisterResponse,
  RegisterResponseData,
  RequestOTPResponse,
  RequestOTPResponseData,
  SessionResponse,
  SessionResponseData,
  TwoFactorChallengeData,
  ValidateSignupRequest,
  ValidateSignupResponse,
  ValidateSignupResponseData,
  VerifyOTPRequest,
  VerifyOTPResponse,
  VerifyOTPResponseData,
} from "./types/auth";

// ==========================================
// COMPONENTS
// ==========================================
export { InactivityLockProvider } from "./components/InactivityLockProvider";
export { ThemedInput } from "./components/ThemedTextInput";

export { default as LogOutBtn } from "./components/LogOutBtn";
// ==========================================
