// components/kyc/Step2/index.tsx
import Phase1 from "@/components/kyc/Step2/Phase1";
import Phase2 from "@/components/kyc/Step2/Phase2";
import Template from "@/components/kyc/Template";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { GeneralStyles } from "@/constants/themes";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  useGetKYCUploadInstructionsMutation,
  useSubmitKYCMutation,
} from "@/store/services/kycApi";
import {
  resetKycData,
  selectKycData,
  selectKycFiles,
  setKycFile,
  setUploadedUrls,
} from "@/store/slices/kycSlice";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";

const PhaseConfig = {
  1: {
    title: "Upload document",
    body: "Use a clear photo. All corners should be visible and text readable.",
  },
  2: {
    title: "Selfie check",
    body: "Take a clear selfie so compliance can compare your face with your document.",
  },
};

const Step2 = ({
  handlePress: proceedToNextStep,
}: {
  handlePress?: (step: number) => void;
}) => {
  const [currentPhase, setCurrentPhase] = useState<1 | 2>(1);
  const [isUploading, setIsUploading] = useState(false);

  const dispatch = useAppDispatch();
  const kycData = useAppSelector(selectKycData);
  const selectedFiles = useAppSelector(selectKycFiles);
  const selfieFile = selectedFiles.selfie;

  const [getUploadInstructions] = useGetKYCUploadInstructionsMutation();
  const [submitKYC] = useSubmitKYCMutation();

  const handlePhase1Transition = () => {
    if (!selectedFiles.document_front && !selectedFiles.passport) {
      Alert.alert(
        "Required",
        "Please upload a document (Front or Passport) to continue.",
      );
      return;
    }
    setCurrentPhase(2);
  };

  const handleTakeSelfie = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Camera access is required to take a verification selfie.",
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.75,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];

        dispatch(
          setKycFile({
            key: "selfie",
            file: {
              uri: asset.uri,
              name: asset.fileName || `selfie_${Date.now()}.jpg`,
              mimeType: asset.mimeType || "image/jpeg",
              size: asset.fileSize || 0,
              lastModified: Date.now(),
            },
          }),
        );
      }
    } catch (error) {
      console.error("Camera acquisition failure:", error);
    }
  };

  const handleFinalSubmit = async () => {
    setIsUploading(true);

    try {
      let documentImageUrl = "";
      let selfieImageUrl = "";

      for (const [docKind, fileAsset] of Object.entries(selectedFiles)) {
        if (!fileAsset) continue;

        const instructionRes = await getUploadInstructions({
          fileName: fileAsset.name,
          contentType: fileAsset.mimeType || "image/jpeg",
          documentKind: docKind,
        }).unwrap();

        const { uploadUrl, publicUrl, method, headers } = instructionRes;

        const localFileResponse = await fetch(fileAsset.uri);
        const fileBlob = await localFileResponse.blob();

        const uploadResponse = await fetch(uploadUrl, {
          method: method,
          headers: headers,
          body: fileBlob,
        });

        if (!uploadResponse.ok) {
          throw new Error(`Failed to upload ${docKind} to cloud storage.`);
        }

        if (docKind === "selfie") {
          selfieImageUrl = publicUrl;
        } else if (docKind === "passport" || docKind === "document_front") {
          documentImageUrl = publicUrl;
        }
      }

      dispatch(setUploadedUrls({ documentImageUrl, selfieImageUrl }));

      const finalPayload = {
        legalName: kycData.legalName,
        country: kycData.country,
        documentType: kycData.documentType,
        documentNumber: kycData.documentNumber,
        documentImageUrl,
        selfieImageUrl,
      };

      await submitKYC(finalPayload).unwrap();

      dispatch(resetKycData());
      if (proceedToNextStep) proceedToNextStep(3);
    } catch (error) {
      console.error("KYC Submission failed:", error);
      Alert.alert(
        "Upload Failed",
        "An error occurred while uploading your documents. Please try again.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const getCTATitle = () => {
    if (isUploading) return "Uploading...";
    if (currentPhase === 1) return "Upload and continue";
    if (currentPhase === 2 && !selfieFile) return "Upload selfie";
    return "Submit Verification";
  };

  const handlePress = () => {
    if (currentPhase === 1) {
      handlePhase1Transition();
    } else if (currentPhase === 2) {
      if (!selfieFile) {
        handleTakeSelfie();
      } else {
        handleFinalSubmit();
      }
    }
  };

  const activeConfig = PhaseConfig[currentPhase];

  return (
    <Template
      headerProps={{
        title: activeConfig.title,
        body: activeConfig.body,
        stage: 2,
        goBack: currentPhase === 1,
        onBackPress: currentPhase === 2 ? () => setCurrentPhase(1) : undefined,
      }}
      ctaProps={{
        variant: "primary",
        title: getCTATitle(),
        onPress: handlePress,
        disabled: isUploading,
        textStyle: {
          fontSize: 14,
          fontFamily: Fonts.bold,
        },
        iconComponent: isUploading ? (
          <ActivityIndicator color={Colors.backgroundInk} />
        ) : null,
      }}
    >
      <View
        style={[
          GeneralStyles.wrapper,
          {
            gap: 20,
            paddingVertical: 8,
          },
        ]}
      >
        {currentPhase === 1 && <Phase1 />}
        {currentPhase === 2 && <Phase2 />}
      </View>
    </Template>
  );
};

export default Step2;

const styles = StyleSheet.create({
  inputContainer: {
    borderRadius: 12,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.backgroundDark,
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontFamily: Fonts.regular,
    color: Colors.snowGray,
  },
});
