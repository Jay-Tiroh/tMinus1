import { CryptoIcon } from "@/components/CryptoIcon";
import TextBlock from "@/components/TextBlock"; // Adjust import paths as needed
import { formatAmount } from "@/helpers/functions";
import React from "react";
import { StyleSheet, View } from "react-native";

export interface CryptoAsset {
  id: string;
  name: string;
  symbol: string;
  fiatBalance: number;
  cryptoBalance: number;
}

export interface CryptoAssetItemProps {
  asset: CryptoAsset;
}

export const CryptoAssetItem = ({ asset }: CryptoAssetItemProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.leftSection}>
        <CryptoIcon symbol={asset.symbol} size={48} />
        <TextBlock
          title={asset.name}
          body={asset.symbol}
          titleStyle={styles.titleStyle}
          bodyStyle={styles.bodyStyle}
        />
      </View>

      <View style={styles.rightSection}>
        <TextBlock
          title={`$${formatAmount(asset.fiatBalance)}`}
          body={`${formatAmount(asset.cryptoBalance)} ${asset.symbol}`}
          titleStyle={[styles.titleStyle, styles.rightAlign]}
          bodyStyle={[styles.bodyStyle, styles.rightAlign]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#161619", // Dark background matching the image UI
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 24,
    width: "100%",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  rightSection: {
    alignItems: "flex-end",
  },
  titleStyle: {
    fontSize: 16,
    lineHeight: 22,
  },
  bodyStyle: {
    textTransform: "uppercase",
  },
  rightAlign: {
    textAlign: "right",
  },
});

export default CryptoAssetItem;
