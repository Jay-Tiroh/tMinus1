import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import { KycFileAsset } from "@/features/kyc/types/kyc.types";
import { ThemedText } from "@/shared/components/ThemedText";
import { ms, s, vs } from "@/utils/responsive";
import Feather from "@expo/vector-icons/Feather";
import React from "react";
import { Pressable, View } from "react-native";

export const UploadCTA = ({
  title,
  onPress,
  file,
}: {
  title: string;
  onPress: () => void;
  file?: KycFileAsset;
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        GeneralStyles.box,
        {
          justifyContent: "center",
          alignItems: "center",
          minHeight: vs(142),
          width: "100%",
          maxWidth: s(342),
          gap: vs(16),
          borderColor: file ? Colors.primaryClean : "transparent",
          borderWidth: file ? 1 : 0,
        },
      ]}
    >
      <View
        style={{
          width: s(50),
          height: vs(50),
          borderRadius: ms(25),
          backgroundColor: file ? Colors.surfaceGreenDeep : Colors.surfaceNavy,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Feather
          name={file ? "file-text" : "upload"}
          size={24}
          color={file ? Colors.primaryClean : Colors.softGray}
        />
      </View>
      <ThemedText
        color={Colors.snowGray}
        weight="bold"
        size={13}
        style={{ textAlign: "center", paddingHorizontal: s(16) }}
        numberOfLines={1}
      >
        {file ? file.name : title}
      </ThemedText>
      {file && (
        <ThemedText color={Colors.textMidGray} size={11}>
          Tap to replace
        </ThemedText>
      )}
    </Pressable>
  );
};

export default UploadCTA;
