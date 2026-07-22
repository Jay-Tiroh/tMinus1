import {
  KYCSubmissionData,
  KYCUploadInstructionData,
  KYCUploadInstructionResponse,
  SubmitKYCRequest,
  SubmitKYCResponse,
} from "@/features/kyc/types/kyc.types";
import { baseApi } from "@/store/services/baseApi";

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

    // Note: When calling this mutation, construct and pass a FormData object.
    // Example:
    // const formData = new FormData();
    // formData.append("file", fileAsset);
    // formData.append("documentKind", "document_front");
    getKYCUploadInstructions: builder.mutation<
      KYCUploadInstructionData,
      FormData
    >({
      query: (body) => ({
        url: "/auth/kyc/uploads",
        method: "POST",
        body, // Passing FormData automatically sets the multipart/form-data headers
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
