import {
  KYCSubmissionData,
  KYCUploadInstructionData,
  KYCUploadInstructionRequest,
  KYCUploadInstructionResponse,
  SubmitKYCRequest,
  SubmitKYCResponse,
} from "@/types/kyc";
import { baseApi } from "./baseApi";

export const kycApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitKYC: builder.mutation<KYCSubmissionData, SubmitKYCRequest>({
      query: ({ idempotencyKey, ...body }) => ({
        url: "/auth/kyc",
        method: "POST",
        body,
        headers: idempotencyKey
          ? { "Idempotency-Key": idempotencyKey }
          : undefined,
      }),
      transformResponse: (response: SubmitKYCResponse) => response.data,
      invalidatesTags: ["Kyc"],
    }),

    getKYCUploadInstructions: builder.mutation<
      KYCUploadInstructionData,
      KYCUploadInstructionRequest
    >({
      query: (body) => ({
        url: "/auth/kyc/uploads",
        method: "POST",
        body,
      }),
      transformResponse: (response: KYCUploadInstructionResponse) =>
        response.data,
      invalidatesTags: ["Kyc"],
    }),
  }),
  overrideExisting: true,
});

export const { useSubmitKYCMutation, useGetKYCUploadInstructionsMutation } =
  kycApi;
