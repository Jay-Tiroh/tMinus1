import { showErrorToast, showSuccessToast } from "@/shared/hooks/showToast";
import { useGoToRoute } from "@/shared/hooks/useGoToRoute";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getErrorMessage } from "@/utils/errors";
import { logger } from "@/utils/logger";
import {
  useGetKYCUploadInstructionsMutation,
  useSubmitKYCMutation,
} from "../api/kyc.api";
import {
  resetKycData,
  selectKycData,
  selectKycFiles,
  setUploadedUrls,
} from "../store/kycSlice";

export const useSubmitKyc = () => {
  const dispatch = useAppDispatch();
  const kycData = useAppSelector(selectKycData);
  const selectedFiles = useAppSelector(selectKycFiles);

  const [getUploadInstructions, { isLoading: isUploading }] =
    useGetKYCUploadInstructionsMutation();
  const [submitKYC, { isLoading: isSubmitting }] = useSubmitKYCMutation();

  const handlePushToStatus = useGoToRoute("/kyc/status");

  const submit = async () => {
    try {
      const uploadedFiles: Record<string, string> = {};
      const idempotencyKey = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}`;

      for (const [docKind, fileAsset] of Object.entries(selectedFiles)) {
        if (!fileAsset) continue;

        const formData = new FormData();
        formData.append("documentKind", docKind);
        formData.append("file", {
          uri: fileAsset.uri,
          name: fileAsset.name,
          type: fileAsset.mimeType || "image/jpeg",
        } as any);

        const uploadRes = await getUploadInstructions(formData).unwrap();

        if (!uploadRes.uploaded) {
          throw new Error(`API failed to upload ${docKind}`);
        }

        uploadedFiles[docKind] = uploadRes.publicUrl;
      }

      const documentImageUrl = uploadedFiles.document_front ?? "";
      const selfieImageUrl = uploadedFiles.selfie ?? "";

      dispatch(
        setUploadedUrls({
          documentImageUrl,
          selfieImageUrl,
        }),
      );

      await submitKYC({
        legalName: kycData.legalName,
        country: kycData.country,
        documentType: kycData.documentType,
        documentNumber: kycData.documentNumber,
        documentImageUrl,
        selfieImageUrl,
        idempotencyKey,
      }).unwrap();

      showSuccessToast({
        title: "Verification Submitted",
        message:
          "Your KYC documents have been submitted successfully and are now under review.",
      });

      dispatch(resetKycData());
      handlePushToStatus();
    } catch (error) {
      showErrorToast({
        title: "Upload Failed",
        message: getErrorMessage(
          error,
          "An error occurred while uploading your documents. Please try again.",
        ),
      });
      logger.error("KYC submit error:", error);
    }
  };

  return {
    submit,
    isLoading: isUploading || isSubmitting,
    isReady: Boolean(selectedFiles.document_front && selectedFiles.selfie),
  };
};
