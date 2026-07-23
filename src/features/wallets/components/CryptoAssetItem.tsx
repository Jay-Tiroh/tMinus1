import { Fonts } from "@/constants/Fonts";
import { GeneralStyles } from "@/constants/themes";
import { CryptoIcon } from "@/shared/components/CryptoIcon";
import TextBlock from "@/shared/components/TextBlock";
import { ms, s, vs } from "@/shared/utils/responsive";
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

export default function CryptoAssetItem({
  leftTitle,
  leftBody,
  rightTitle,
  rightBody,
  iconSymbol,
  iconComponent,
  numberOfLines,
}: CryptoAssetItemProps) {
  return (
    <View style={styles.card}>
      <View style={styles.leftSection}>
        {iconSymbol && <CryptoIcon symbol={iconSymbol} size={ms(32)} />}
        {iconComponent && iconComponent}
        <TextBlock
          title={leftTitle}
          body={leftBody}
          titleStyle={styles.titleStyle}
          bodyStyle={styles.bodyStyle}
          numberOfLines={numberOfLines}
          numberOfLinesBody={numberOfLines}
        />
      </View>

      <View style={styles.rightSection}>
        <TextBlock
          title={rightTitle}
          body={rightBody}
          titleStyle={[styles.titleStyle, styles.rightAlign]}
          bodyStyle={[styles.bodyStyle, styles.rightAlign]}
          numberOfLines={numberOfLines}
          numberOfLinesBody={numberOfLines}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...GeneralStyles.box,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: vs(16),
    paddingHorizontal: s(20),
    borderRadius: ms(18),
    width: "100%",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: s(16),
    maxWidth: "50%",
  },
  rightSection: {
    alignItems: "flex-end",
  },
  titleStyle: {
    fontSize: ms(14),
    fontFamily: Fonts.medium,
  },
  bodyStyle: {
    textTransform: "uppercase",
    fontSize: ms(12),
  },
  rightAlign: {
    textAlign: "right",
  },
});
