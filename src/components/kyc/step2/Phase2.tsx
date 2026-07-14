import { UploadCTA } from "@/components/kyc/step2/Phase1";
import { Spacer } from "@/components/Spacer";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectKycFiles, setKycFile } from "@/store/slices/kycSlice";
import { logger } from "@/utils/logger";
import { ms, s, vs } from "@/utils/responsive";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import { Alert, StyleSheet, View } from "react-native";

const CheckList = [
  "Good lighting",
  "No sunglasses or masks",
  "Face fully visible, neutral expression, no filters or edits",
  "Use your own document",
];
const Phase2 = () => {
  const dispatch = useAppDispatch();
  const selectedFiles = useAppSelector(selectKycFiles);
  const selfieFile = selectedFiles.selfie;

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

  return (
    <View style={styles.container}>
      <UploadCTA
        title="Upload Selfie"
        onPress={handleTakeSelfie}
        file={selfieFile}
      />

      <Spacer size={103} />
      {CheckList.map((item) => (
        <View
          key={item}
          style={{
            ...GeneralStyles.box,
            minHeight: vs(46),
            marginVertical: vs(8),
            gap: s(16),
            paddingHorizontal: s(16),
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
          }}
        >
          <View
            style={{
              backgroundColor: Colors.primaryClean,
              width: s(22),
              height: vs(22),
              borderRadius: ms(11),
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FontAwesome name="check" size={12} color={Colors.backgroundInk} />
          </View>
          <ThemedText size={12} color={Colors.snowGray}>
            {item}
          </ThemedText>
        </View>
      ))}
      <Spacer size={78} />
    </View>
  );
};

export default Phase2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
});
