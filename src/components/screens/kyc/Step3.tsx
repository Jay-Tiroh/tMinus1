import Template from "@/components/kyc/Template";
import { LabelValueItem } from "@/components/LabelValueItem";
import { Spacer } from "@/shared/components/Spacer";
import TextBlock from "@/shared/components/TextBlock";
import { Colors } from "@/constants/Colors";
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
import { getErrorMessage } from "@/utils/errors";
import { logger } from "@/utils/logger";
import { ms, s, vs } from "@/utils/responsive";
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

  const [getUploadInstructions, { isLoading }] =
    useGetKYCUploadInstructionsMutation();
  const [submitKYC] = useSubmitKYCMutation();

  const handleFinalSubmit = async () => {
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

        uploadedFiles[docKind] = uploadRes.storageKey;
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

      logger.error(
        kycData.legalName,'\n',
        kycData.country,'\n',
         kycData.documentType,'\n',
         kycData.documentNumber,'\n',
         documentImageUrl,'\n',
         selfieImageUrl,'\n',
         idempotencyKey,'\n',);

      showSuccessToast({
        title: "Verification Submitted",
        message:
          "Your KYC documents have been submitted successfully and are now under review.",
      });

      dispatch(resetKycData());
      handlePushTo();
    } catch (error) {
      showErrorToast({
        title: "Upload Failed",
        message:
          getErrorMessage(error,"An error occurred while uploading your documents. Please try again."),
      });
      logger.error(error);


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
        title: "Review submission",
        body: "Check the details and files before sending them for admin review.",
        stage: 3,
      }}
      ctaProps={{
        variant: "primary",
        title: "Submit for review",
        disabled: !selectedFiles.document_front || !selfieFile || isLoading,
        iconComponent: isLoading ? <ActivityIndicator color={Colors.backgroundInk} /> : null,
        textStyle: {
          fontSize: ms(14),
          fontFamily: Fonts.bold,
        },
        onPress: () => handlePress(),
      }}
    >
      <View style={styles.container}>
        <Spacer size={12} />
        <View style={[GeneralStyles.wrapper, { gap: vs(14) }]}>
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
                padding: ms(16),
                justifyContent: "center",
                alignItems: "center",
                borderRadius: ms(16),
                minHeight: vs(86),
              },
            ]}
          >
            <TextBlock
              body="After submission your status changes to pending and trade/withdraw remain locked until approved."
              bodyStyle={{
                fontSize: ms(13),
                maxWidth: s(300),
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
