// components/kyc/Step2/Phase1.tsx
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import { formatExtensionsForDisplay } from "@/helpers/functions";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { KycFilesState, setKycFile } from "@/store/slices/kycSlice";
import { getDocumentByType, KycFileAsset } from "@/types/kyc";
import Feather from "@expo/vector-icons/Feather";
import Fontisto from "@expo/vector-icons/Fontisto";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as DocumentPicker from "expo-document-picker";
import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
export type UploadOption = {
  label: keyof KycFilesState;
  title: string;
  icon: {
    type: React.ComponentType<any>;
    name: keyof typeof Ionicons.glyphMap | keyof typeof Fontisto.glyphMap;
    size: number;
    color: string;
  };
  cta: string;
};

const UploadOptionsConfig: UploadOption[] = [
  {
    label: "document_front",
    title: "Front required",
    icon: {
      type: Ionicons,
      name: "document-text-outline",
      size: 20,
      color: Colors.textMidGray,
    },
    cta: "Upload document front",
  },
  {
    label: "document_back",
    title: "Back optional",
    icon: {
      type: Ionicons,
      name: "document-text-outline",
      size: 20,
      color: Colors.textMidGray,
    },
    cta: "Upload document back",
  },
];

const UploadOptions = ({
  selectedOption,
  onSelectOption,
}: {
  selectedOption: keyof KycFilesState;
  onSelectOption: (option: keyof KycFilesState) => void;
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
      }}
    >
      {UploadOptionsConfig.map((item) => (
        <Pressable
          onPress={() => onSelectOption(item.label)}
          key={item.title}
          style={{
            ...GeneralStyles.box,
            width: 104,
            minHeight: 112,
            justifyContent: "center",
            alignItems: "center",
            gap: 17,
            backgroundColor:
              selectedOption === item.label
                ? Colors.surfaceGreenDeep
                : Colors.backgroundDark,
          }}
        >
          <View
            style={{
              width: 34,
              height: 34,
              borderRadius: 17,
              backgroundColor:
                selectedOption === item.label
                  ? Colors.primaryClean
                  : Colors.surfaceNavy,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {
              <item.icon.type
                name={item.icon.name}
                color={
                  selectedOption === item.label
                    ? Colors.backgroundInk
                    : item.icon.color
                }
                size={item.icon.size}
              />
            }
          </View>
          <ThemedText
            color={
              selectedOption === item.label
                ? Colors.snowGray
                : Colors.textMidGray
            }
            size={11}
          >
            {item.title}
          </ThemedText>
        </Pressable>
      ))}
    </View>
  );
};

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
          minHeight: 142,
          width: "100%",
          maxWidth: 342,
          gap: 16,
          borderColor: file ? Colors.primaryClean : "transparent",
          borderWidth: file ? 1 : 0,
        },
      ]}
    >
      <View
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
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
        style={{ textAlign: "center", paddingHorizontal: 16 }}
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

const Phase1 = () => {
  const dispatch = useAppDispatch();
  const [selectedOption, setSelectedOption] =
    useState<keyof KycFilesState>("document_front");

  // Read data directly from Redux
  const docType = useAppSelector((state) => state.kyc.documentType);
  const selectedFiles = useAppSelector((state) => state.kyc.selectedFiles);

  const documentType = getDocumentByType(docType);
  const currentConfig = UploadOptionsConfig.find(
    (o) => o.label === selectedOption,
  );
  const activeFile = selectedFiles[selectedOption];

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: documentType?.acceptedMimeTypes ?? ["*/*"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Small delay to let the app fully resume before dispatching
        await new Promise((resolve) => setTimeout(resolve, 300));

        const asset = result.assets[0];
        console.log("Picked document asset:", asset);
        const debugUri =
          "file:///data/user/0/com.anonymous.tMinus1/cache/DocumentPicker/9b710e00-1647-4e12-abaa-457a38567a43.jpg";
        dispatch(
          setKycFile({
            key: "document_front",
            file: {
              uri: asset.uri,
              name: "test_documents.jpg",
              mimeType: "image/jpeg",
              size: 5500000,
            },
          }),
        );
        console.warn("[KYC] File URI:", asset.uri);
      }
    } catch (error) {
      console.warn("Document picking failed:", error);
    }
  };
  return (
    <View style={styles.container}>
      <UploadOptions
        selectedOption={selectedOption}
        onSelectOption={setSelectedOption}
      />

      <UploadCTA
        title={currentConfig?.cta || "Upload documents"}
        onPress={handlePickDocument}
        file={activeFile}
      />

      <View
        style={[
          GeneralStyles.box,
          {
            flexDirection: "row",
            gap: 8,
            alignItems: "center",
            width: "100%",
            maxWidth: 342,
            padding: 12,
            paddingHorizontal: 16,
            minHeight: 54,
          },
        ]}
      >
        <ThemedText color={Colors.textMidGray} size={11}>
          Accepted files:
        </ThemedText>
        <ThemedText
          color={Colors.snowGray}
          weight="bold"
          size={13}
          style={{ flex: 1, textAlign: "right" }}
        >
          {formatExtensionsForDisplay(documentType?.acceptedExtensions || [])}
        </ThemedText>
      </View>
    </View>
  );
};

export default Phase1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 32,
  },
});
