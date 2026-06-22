import Template from "@/components/kyc/Template";
import { LabelValueItem } from "@/components/LabelValueItem";
import { Spacer } from "@/components/Spacer";
import TextBlock from "@/components/TextBlock";
import { Fonts } from "@/constants/Fonts";
import { GeneralStyles } from "@/constants/themes";
import { showErrorToast, showSuccessToast } from "@/hooks/showToast";
import { useGoToRoute } from "@/hooks/useGoToRoute";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  useGetKYCUploadInstructionsMutation,
  useSubmitKYCMutation,
} from "@/store/services/kycApi";
import {
  resetKycData,
  selectKycData,
  selectKycFiles,
  setUploadedUrls,
} from "@/store/slices/kycSlice";
import { getDocumentByType } from "@/types/kyc";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

const Step3 = () => {
  const kyc = useAppSelector((state) => state.kyc);
  const dispatch = useAppDispatch();
  const kycData = useAppSelector(selectKycData);
  const selectedFiles = useAppSelector(selectKycFiles);
  const selfieFile = selectedFiles.selfie;
  const Config = [
    {
      title: "Legal Name",
      value: kyc.legalName,
    },
    {
      title: "Country",
      value: kyc.country,
    },
    {
      title: "Document",
      value: getDocumentByType(kyc.documentType)?.label,
    },
    {
      title: "Document image",
      value: selectedFiles.document_front ? "Uploaded" : "Not uploaded",
    },
    {
      title: "Selfie image",
      value: selfieFile ? "Uploaded" : "Not uploaded",
    },
  ];
  const handlePushTo = useGoToRoute("/kyc/status");

  const [getUploadInstructions, { isLoading, isError, isSuccess }] =
    useGetKYCUploadInstructionsMutation();
  const [submitKYC] = useSubmitKYCMutation();
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? "";

  const handleFinalSubmit = async () => {
    try {
      const uploadedUrls: Record<string, string> = {};

      const idempotencyKey = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}`;

      for (const [docKind, fileAsset] of Object.entries(selectedFiles)) {
        if (!fileAsset) continue;

        const localFileResponse = await fetch(fileAsset.uri);
        const rawBlob = await localFileResponse.blob();

        const fileBlob = rawBlob.type
          ? rawBlob
          : new Blob([rawBlob], {
              type: fileAsset.mimeType || "image/jpeg",
            });

        const instructionRes = await getUploadInstructions({
          fileName: fileAsset.name,
          contentType: fileAsset.mimeType || "image/jpeg",
          documentKind: docKind,
        }).unwrap();

        const { uploadUrl, publicUrl, method, formFields } = instructionRes;

        const uploadEndpoint = uploadUrl.startsWith("http")
          ? uploadUrl
          : `${API_BASE_URL}${uploadUrl}`;

        const resolvedPublicUrl = publicUrl.startsWith("http")
          ? publicUrl
          : `${API_BASE_URL}${publicUrl}`;

        console.log(`[KYC] Uploading ${docKind}`);
        console.log(`[KYC] Upload URL: ${uploadEndpoint}`);
        console.log(`[KYC] Public URL: ${resolvedPublicUrl}`);

        const formData = new FormData();

        // Append Cloudinary required fields first
        if (formFields) {
          for (const [key, value] of Object.entries(formFields)) {
            formData.append(key, String(value));
          }
        }

        // React Native FormData expects this shape for files, NOT a Blob
        formData.append("file", {
          uri: fileAsset.uri,
          name: fileAsset.name,
          type: fileAsset.mimeType || "image/jpeg",
        } as any);

        const uploadResponse = await fetch(uploadEndpoint, {
          method: (method ?? "POST").toUpperCase(),
          body: formData,
          // Do NOT set Content-Type — fetch sets it with the correct multipart boundary
        });

        if (!uploadResponse.ok) {
          const errorBody = await uploadResponse.text();
          showErrorToast({
            title: "Upload Failed",
            message: `Failed to upload ${docKind}. Please try again.`,
          });
          console.error(
            `[KYC] Upload failed for ${docKind}: ${uploadResponse.status} ${uploadResponse.statusText}`,
            errorBody,
          );
          throw new Error(`Failed to upload ${docKind} to cloud storage.`);
        }

        uploadedUrls[docKind] = resolvedPublicUrl;
      }

      const documentImageUrl = uploadedUrls.document_front ?? "";

      const selfieImageUrl = uploadedUrls.selfie ?? "";

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
      handlePushTo();
    } catch (error) {
      console.error("[KYC] Submission failed:", error);

      showErrorToast({
        title: "Upload Failed",
        message:
          "An error occurred while uploading your documents. Please try again.",
      });
    }
  };
  const handlePress = () => {
    if (selectedFiles.document_front && selfieFile) {
      handleFinalSubmit();
    }
  };
  return (
    <Template
      headerProps={{
        goBack: true,
        title: "Review submission for yahoo",
        body: "Check the details and files before sending them for admin review.",
        stage: 3,
      }}
      ctaProps={{
        variant: "primary",
        title: "Submit for review",
        disabled: !selectedFiles.document_front || !selfieFile || isLoading,
        iconComponent: isLoading ? <ActivityIndicator /> : null,
        textStyle: {
          fontSize: 14,
          fontFamily: Fonts.bold,
        },
        onPress: () => handlePress(),
      }}
    >
      <View style={styles.container}>
        <Spacer size={12} />
        <View style={[GeneralStyles.wrapper, { gap: 14 }]}>
          {Config.map((item) => (
            <LabelValueItem
              key={item.title}
              label={item.title}
              value={item.value ?? "Nil"}
            />
          ))}
        </View>

        <Spacer size={38} />

        <View style={[GeneralStyles.wrapper]}>
          <View
            style={[
              GeneralStyles.box,
              {
                padding: 16,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 16,
                minHeight: 86,
              },
            ]}
          >
            <TextBlock
              body="After submission your status changes to pending and trade/withdraw remain locked until approved."
              bodyStyle={{
                // color: Colors.snowGray,
                fontSize: 13,
                maxWidth: 300,
              }}
            />
          </View>
        </View>
      </View>
    </Template>
  );
};

export default Step3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
