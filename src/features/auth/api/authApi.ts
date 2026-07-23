import { baseApi } from "@/store/services/baseApi";
import {
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
  ValidateSignupRequest,
  ValidateSignupResponse,
  ValidateSignupResponseData,
  VerifyOTPRequest,
  VerifyOTPResponse,
  VerifyOTPResponseData,
} from "../types/auth";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── Pre-registration ───────────────────────────────────────────────────

    validateSignup: builder.mutation<
      ValidateSignupResponseData,
      ValidateSignupRequest
    >({
      query: (body) => ({ url: "/auth/validate-signup", method: "POST", body }),
      transformResponse: (response: ValidateSignupResponse) => response.data,
    }),

    // ── Authentication ─────────────────────────────────────────────────────

    login: builder.mutation<LoginResponseData, LoginRequest>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
      transformResponse: (response: LoginResponse) => response.data,
    }),

    register: builder.mutation<RegisterResponseData, RegisterRequest>({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
      transformResponse: (response: RegisterResponse) => response.data,
    }),

    // ── OTP ────────────────────────────────────────────────────────────────

    requestOTP: builder.mutation<RequestOTPResponseData, string>({
      query: (email) => ({
        url: "/auth/otp/request",
        method: "POST",
        body: { email },
      }),
      transformResponse: (response: RequestOTPResponse) => response.data,
    }),

    verifyOTP: builder.mutation<VerifyOTPResponseData, VerifyOTPRequest>({
      query: (body) => ({ url: "/auth/otp/verify", method: "POST", body }),
      transformResponse: (response: VerifyOTPResponse) => response.data,
    }),

    // ── Session & Tokens ───────────────────────────────────────────────────

    getSession: builder.query<SessionResponseData, void>({
      query: () => ({ url: "/auth/session", method: "GET" }),
      transformResponse: (response: SessionResponse) => response.data,
      providesTags: ["User"],
    }),

    logout: builder.mutation<LogoutResponseData, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      transformResponse: (response: LogoutResponse) => response.data,
    }),

    refreshToken: builder.mutation<RefreshResponseData, RefreshRequestBody>({
      query: (body) => ({ url: "/auth/refresh", method: "POST", body }),
      transformResponse: (response: RefreshResponse) => response.data,
    }),
  }),
  overrideExisting: true,
});

export const {
  useValidateSignupMutation,
  useLoginMutation,
  useRegisterMutation,
  useRequestOTPMutation,
  useVerifyOTPMutation,
  useGetSessionQuery,
  useLazyGetSessionQuery,
  useLogoutMutation,
  useRefreshTokenMutation,
} = authApi;
