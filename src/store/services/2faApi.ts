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
  Verify2FARequest,
  Verify2FAResponse,
} from "@/types/2fa";
import { AuthResponseData } from "@/types/auth";
import { baseApi } from "./baseApi";

export const twoFactorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    setup2FA: builder.mutation<Setup2FAResponseData, void>({
      query: () => ({ url: "/auth/2fa/setup", method: "POST" }),
      transformResponse: (response: Setup2FAResponse) => response.data,
    }),

    enable2FA: builder.mutation<Enable2FAResponseData, Enable2FARequest>({
      query: (body) => ({ url: "/auth/2fa/enable", method: "POST", body }),
      transformResponse: (response: Enable2FAResponse) => response.data,
    }),

    verify2FA: builder.mutation<AuthResponseData, Verify2FARequest>({
      query: (body) => ({ url: "/auth/2fa/verify", method: "POST", body }),
      transformResponse: (response: Verify2FAResponse) => response.data,
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
    }),

    disable2FA: builder.mutation<Disable2FAResponseData, Disable2FARequest>({
      query: (body) => ({ url: "/auth/2fa/disable", method: "POST", body }),
      transformResponse: (response: Disable2FAResponse) => response.data,
    }),
  }),
  overrideExisting: false,
});

export const {
  useSetup2FAMutation,
  useEnable2FAMutation,
  useVerify2FAMutation,
  useRegenerateRecoveryCodesMutation,
  useDisable2FAMutation,
} = twoFactorApi;
