import {
  AuthResponse,
  AuthResponseData,
  LoginRequest,
  LogoutResponse,
  LogoutResponseData,
  RefreshRequestBody,
  RefreshResponse,
  RefreshResponseData,
  RegisterRequest,
  RequestOTPResponse,
  SessionResponse,
  SessionResponseData,
  VerifyOTPRequest,
  VerifyOTPResponse,
} from "@/types/auth";
import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Unified login endpoint using the new LoginRequest structure
    login: builder.mutation<AuthResponseData, LoginRequest>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
      transformResponse: (response: AuthResponse) => response.data,
    }),

    register: builder.mutation<AuthResponseData, RegisterRequest>({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
      transformResponse: (response: AuthResponse) => response.data,
    }),

    requestOTP: builder.mutation<RequestOTPResponse, string>({
      query: (email) => ({
        url: "/auth/otp/request",
        method: "POST",
        body: { email },
      }),
    }),

    verifyOTP: builder.mutation<VerifyOTPResponse, VerifyOTPRequest>({
      query: (body) => ({ url: "/auth/otp/verify", method: "POST", body }),
    }),

    // ── Session & Token endpoints ──────────────────────────────────────────────

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
  overrideExisting: false,
});

export const {
  useLoginMutation, // Replaces useLoginEmailMutation and useLoginMobileMutation
  useRegisterMutation,
  useRequestOTPMutation,
  useVerifyOTPMutation,
  useGetSessionQuery,
  useLazyGetSessionQuery,
  useLogoutMutation,
  useRefreshTokenMutation,
} = authApi;
