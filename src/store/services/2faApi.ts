import {
  Disable2FARequest,
  Disable2FAResponse,
  Disable2FAResponseData,
  Enable2FARequest,
  Enable2FAResponse,
  Enable2FAResponseData,
  RegenerateRecoveryCodesRequest,
  RegenerateRecoveryCodesResponse,
  RegenerateRecoveryCodesResponseData,
  Setup2FAResponse,
  Setup2FAResponseData,
  TwoFactorStatusResponse,
  TwoFactorStatusResponseData,
  Verify2FARequest,
  Verify2FAResponse,
} from "@/types/2fa";
import { AuthResponseData } from "@/types/auth";
import { baseApi } from "./baseApi";

export const twoFactorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    status: builder.query<TwoFactorStatusResponseData, void>({
      query: () => ({ url: "/auth/2fa/status", method: "GET" }),
      transformResponse: (response: TwoFactorStatusResponse) => response.data,
    }),
    setup2FA: builder.mutation<Setup2FAResponseData, void>({
      query: () => ({ url: "/auth/2fa/setup", method: "POST" }),
      transformResponse: (response: Setup2FAResponse) => response.data,
      invalidatesTags: ["User"],
    }),

    enable2FA: builder.mutation<Enable2FAResponseData, Enable2FARequest>({
      query: (body) => ({ url: "/auth/2fa/enable", method: "POST", body }),
      transformResponse: (response: Enable2FAResponse) => response.data,
      invalidatesTags: ["User"],
    }),

    verify2FA: builder.mutation<AuthResponseData, Verify2FARequest>({
      query: (body) => ({ url: "/auth/2fa/verify", method: "POST", body }),
      transformResponse: (response: Verify2FAResponse) => response.data,
      invalidatesTags: ["User"],
    }),

    regenerateRecoveryCodes: builder.mutation<
      RegenerateRecoveryCodesResponseData,
      RegenerateRecoveryCodesRequest
    >({
      query: (body) => ({
        url: "/auth/2fa/recovery-codes/regenerate",
        method: "POST",
        body,
      }),
      transformResponse: (response: RegenerateRecoveryCodesResponse) =>
        response.data,
      invalidatesTags: ["User"],
    }),

    disable2FA: builder.mutation<Disable2FAResponseData, Disable2FARequest>({
      query: (body) => ({ url: "/auth/2fa/disable", method: "POST", body }),
      transformResponse: (response: Disable2FAResponse) => response.data,
      invalidatesTags: ["User"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useSetup2FAMutation,
  useEnable2FAMutation,
  useVerify2FAMutation,
  useRegenerateRecoveryCodesMutation,
  useDisable2FAMutation,
  useStatusQuery,
} = twoFactorApi;
