// import Selfie from "@/assets/icons/selfie.svg";
import { UploadCTA } from "@/components/kyc/step2/Phase1";
import { Spacer } from "@/components/Spacer";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectKycFiles, setKycFile } from "@/store/slices/kycSlice";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import { StyleSheet, View } from "react-native";
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
      // const { status } = await ImagePicker.requestCameraPermissionsAsync();

      // if (status !== "granted") {
      //   showErrorToast({
      //     title: "Permission Denied",
      //     message: "Camera access is required to take a verification selfie.",
      //   });
      //   return;
      // }

      // const result = await ImagePicker.launchCameraAsync({
      //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
      //   allowsEditing: true,
      //   aspect: [1, 1],
      //   quality: 0.75,
      // });

      // if (!result.canceled && result.assets && result.assets.length > 0) {
      //   const asset = result.assets[0];
      //   console.log("Captured selfie asset:", asset);
      const debugUri =
        "file:///data/user/0/com.anonymous.tMinus1/cache/DocumentPicker/9b710e00-1647-4e12-abaa-457a38567a43.jpg";

      dispatch(
        setKycFile({
          key: "selfie",
          file: {
            uri: debugUri,
            name: "test_document.jpg",
            mimeType: "image/jpeg",
            size: 5500000,
          },
        }),
      );
      // }
    } catch (error) {
      console.error("Camera acquisition failure:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/*<View
        style={{
          backgroundColor: Colors.surfaceGreenDeep,
          width: 150,
          height: 150,
          borderRadius: 75,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: Colors.surfaceNavy,
            width: 94,
            height: 94,
            borderRadius: 47,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Selfie width={48} height={48} color={Colors.textMidGray} />
        </View>
      </View>*/}

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
            minHeight: 46,
            marginVertical: 8,
            gap: 16,
            paddingHorizontal: 16,
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
          }}
        >
          <View
            style={{
              backgroundColor: Colors.primaryClean,
              width: 22,
              height: 22,
              borderRadius: 11,
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
