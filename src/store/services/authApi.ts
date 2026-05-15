import {
  AuthResponse,
  AuthResponseData,
  LoginRequestEmail,
  LoginRequestMobile,
  RegisterRequest,
  RequestOTPResponse,
  VerifyOTPRequest,
  VerifyOTPResponse,
} from "@/types/auth";
import { baseApi } from "./baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    loginEmail: builder.mutation<
      AuthResponseData,
      LoginRequestEmail | LoginRequestMobile
    >({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
      transformResponse: (response: AuthResponse) => response.data,
    }),
    loginMobile: builder.mutation<
      AuthResponseData,
      LoginRequestEmail | LoginRequestMobile
    >({
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
  }),
  overrideExisting: false,
});

export const {
  useLoginEmailMutation,
  useLoginMobileMutation,
  useRegisterMutation,
  useRequestOTPMutation,
  useVerifyOTPMutation,
} = authApi;
