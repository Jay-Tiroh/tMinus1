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
import { logger } from "@/utils/logger";
import { ms, vs } from "@/utils/responsive";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { ActivityIndicator, View } from "react-native";

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

export default function Step2() {
  const [currentPhase, setCurrentPhase] = useState<1 | 2>(1);
  const [isUploading] = useState(false);

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

        dispatch(
          setKycFile({
            key: "selfie",
            file: {
              uri: asset.uri,
              name: asset.fileName ?? "selfie.jpg",
              mimeType: asset.mimeType ?? "image/jpeg",
              size: asset.fileSize ?? 0,
            },
          }),
        );
      }
    } catch (error) {
      logger.error("Camera acquisition failure:", error);
    }
  };

  const getCTATitle = () => {
    if (isUploading) return "Uploading...";
    if (currentPhase === 1) return "Upload and continue";
    if (currentPhase === 2 && !selfieFile) {
      return "Upload selfie";
    }
    return "Continue";
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
          fontSize: ms(14),
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
            gap: vs(20),
            paddingVertical: vs(8),
          },
        ]}
      >
        {currentPhase === 1 && <Phase1 />}
        {currentPhase === 2 && <Phase2 />}
      </View>
    </Template>
  );
}
