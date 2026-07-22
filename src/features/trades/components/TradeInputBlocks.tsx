import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { GeneralStyles } from "@/constants/themes";
import { CryptoIcon } from "@/shared/components/CryptoIcon";
import TextBlock from "@/shared/components/TextBlock";
import { ThemedText } from "@/shared/components/ThemedText";
import { ms, s, vs } from "@/utils/responsive";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

export interface TextInputBlockProps {
  label: string;
  value: string;
  symbol: string;
  onChangeText: (value: string) => void;
  onPressAsset?: () => void;
}

export const TextInputBlock = ({
  label,
  value,
  symbol,
  onChangeText,
  onPressAsset,
}: TextInputBlockProps) => {
  const handleChange = (text: string) => {
    const sanitized = text.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
    onChangeText(sanitized);
  };

  return (
    <View
      style={[
        GeneralStyles.box,
        {
          width: "100%",
          height: vs(86),
          borderRadius: ms(18),
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: s(16),
        },
      ]}
    >
      <View style={{ gap: vs(8), justifyContent: "center", flex: 1 }}>
        <ThemedText color={Colors.textMidGray} size={12}>
          {label}
        </ThemedText>
        <TextInput
          value={value}
          onChangeText={handleChange}
          keyboardType="decimal-pad"
          placeholder="0.00"
          placeholderTextColor={Colors.textMidGray}
          style={{
            color: Colors.snowGray,
            fontSize: ms(24),
            fontFamily: Fonts.bold,
            paddingBottom: 0,
            paddingTop: 0,
          }}
          maxLength={10}
        />
      </View>

      <TouchableOpacity
        onPress={onPressAsset}
        disabled={!onPressAsset}
        style={{ flexDirection: "row", alignItems: "center", gap: s(8) }}
      >
        <CryptoIcon symbol={symbol} size={ms(24)} />
        <ThemedText>{symbol}</ThemedText>
        {onPressAsset && (
          <MaterialCommunityIcons
            name="chevron-down"
            size={16}
            color={Colors.textMidGray}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

export interface StaticAmountBlockProps {
  label: string;
  body: string;
  symbol: string;
  onPressAsset?: () => void;
}

export const StaticAmountBlock = ({
  label,
  body,
  symbol,
  onPressAsset,
}: StaticAmountBlockProps) => (
  <View
    style={[
      GeneralStyles.box,
      {
        width: "100%",
        height: vs(86),
        borderRadius: ms(18),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: s(16),
      },
    ]}
  >
    <TextBlock
      title={label}
      titleStyle={{
        color: Colors.textMidGray,
        fontSize: ms(12),
        fontFamily: Fonts.regular,
      }}
      body={body}
      bodyStyle={{
        color: Colors.snowGray,
        fontSize: ms(24),
        fontFamily: Fonts.bold,
        maxWidth: s(200),
      }}
    />
    <TouchableOpacity
      onPress={onPressAsset}
      disabled={!onPressAsset}
      style={{ flexDirection: "row", alignItems: "center", gap: s(8) }}
    >
      <CryptoIcon symbol={symbol} size={ms(24)} />
      <ThemedText>{symbol}</ThemedText>
      {onPressAsset && (
        <MaterialCommunityIcons
          name="chevron-down"
          size={16}
          color={Colors.textMidGray}
        />
      )}
    </TouchableOpacity>
  </View>
);
