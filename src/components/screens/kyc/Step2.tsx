import Phase1 from "@/components/kyc/step2/Phase1";
import Phase2 from "@/components/kyc/step2/Phase2";
import Template from "@/components/kyc/Template";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { GeneralStyles } from "@/constants/themes";
import { showErrorToast } from "@/hooks/showToast";
import { useGoToRoute } from "@/hooks/useGoToRoute";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectKycFiles, setKycFile } from "@/store/slices/kycSlice";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

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

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? "";

if (!API_BASE_URL) {
  console.warn("EXPO_PUBLIC_API_BASE_URL is not configured.");
}

export default function Step2({
  handlePress: proceedToNextStep,
}: {
  handlePress?: (step: number) => void;
}) {
  const [currentPhase, setCurrentPhase] = useState<1 | 2>(1);
  const [isUploading, setIsUploading] = useState(false);

  const dispatch = useAppDispatch();
  const selectedFiles = useAppSelector(selectKycFiles);
  const selfieFile = selectedFiles.selfie;

  const handlePhase1Transition = () => {
    if (!selectedFiles.document_front) {
      showErrorToast({
        title: "Required",
        message: "Please upload a document to continue.",
      });
      return;
    }
    setCurrentPhase(2);
  };

  const handleTakeSelfie = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== "granted") {
        showErrorToast({
          title: "Permission Denied",
          message: "Camera access is required to take a verification selfie.",
        });
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
        console.log("Captured selfie asset:", asset);
        const debugUri =
          "file:///data/user/0/com.anonymous.tMinus1/cache/DocumentPicker/4a0b073e-ef6b-495a-9e55-533dc114cc25.jpg";

        dispatch(
          setKycFile({
            key: "selfie",
            file: {
              uri: asset.uri,
              name: "test_document.jpg",
              mimeType: "image/jpeg",
              size: 500000,
            },
          }),
        );
      }
    } catch (error) {
      console.error("Camera acquisition failure:", error);
    }
  };

  const getCTATitle = () => {
    if (isUploading) return "Uploading...";
    if (currentPhase === 1) return "Upload and continue";
    if (currentPhase === 2 && !selfieFile) {
      return "Upload selfie";
    }
    if (currentPhase === 2 && selfieFile) {
      return "Continue";
    }
    return "Submit Verification";
  };
  const handlePushTo = useGoToRoute("/kyc/step3");
  const handlePhase2Transition = () => {
    if (!selfieFile) {
      showErrorToast({
        title: "Required",
        message: "Please upload a selfie to continue.",
      });
      return;
    }
    handlePushTo();
  };

  const handlePress = () => {
    if (currentPhase === 1) {
      handlePhase1Transition();
    } else if (currentPhase === 2) {
      if (!selfieFile) {
        handleTakeSelfie();
      } else {
        // handleFinalSubmit();
        handlePhase2Transition();
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
}

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
