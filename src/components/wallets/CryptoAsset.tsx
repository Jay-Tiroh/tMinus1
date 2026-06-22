import { CryptoIcon } from "@/components/CryptoIcon";
import TextBlock from "@/components/TextBlock"; // Adjust import paths as needed
import { Fonts } from "@/constants/Fonts";
import { GeneralStyles } from "@/constants/themes";
import React from "react";
import { StyleSheet, View } from "react-native";

export interface CryptoAssetItemProps {
  leftTitle: string;
  leftBody: string;
  rightTitle: string;
  rightBody: string;
  iconSymbol?: string;
  iconComponent?: React.ReactNode;
  numberOfLines?: number;
}

export const CryptoAssetItem = ({
  leftTitle,
  leftBody,
  rightTitle,
  rightBody,
  iconSymbol,
  iconComponent,
  numberOfLines,
}: CryptoAssetItemProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.leftSection}>
        {/* Only render the icon if iconSymbol is provided */}
        {iconSymbol && <CryptoIcon symbol={iconSymbol} size={32} />}
        {iconComponent && iconComponent}
        <TextBlock
          title={leftTitle}
          body={leftBody}
          titleStyle={styles.titleStyle}
          bodyStyle={styles.bodyStyle}
          numberOfLines={numberOfLines}
        />
      </View>

      <View style={styles.rightSection}>
        <TextBlock
          title={rightTitle}
          body={rightBody}
          titleStyle={[styles.titleStyle, styles.rightAlign]}
          bodyStyle={[styles.bodyStyle, styles.rightAlign]}
          numberOfLines={numberOfLines}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    ...GeneralStyles.box,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 18,
    width: "100%",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,

    maxWidth: "50%",
  },
  rightSection: {
    alignItems: "flex-end",
  },
  titleStyle: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    // lineHeight: 22,
  },
  bodyStyle: {
    textTransform: "uppercase",
    fontSize: 12,
  },
  rightAlign: {
    textAlign: "right",
  },
});

export default CryptoAssetItem;
