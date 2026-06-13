import { Spacer } from "@/components/Spacer";
import { ThemedText } from "@/components/ThemedText";
import Template from "@/components/trades/Template";
import CryptoAssetItem from "@/components/wallets/CryptoAsset";
import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import { formatAmount } from "@/helpers/functions";
import useWallet from "@/hooks/useWallet";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

const DepositAssetSelectionScreen = () => {
  const [selectedAsset, setSelectedAsset] = useState("USDT");

  // When API is ready, replace DEPOSIT_ASSETS_DATA with:
  // const { data: assets = [] } = useGetDepositAssetsQuery();

  const { getDepositAddressBySymbol, balances } = useWallet();
  const router = useRouter();

  return (
    <Template
      textBlockProps={{
        title: "Deposit",
        body: "Choose the asset you want to fund in sandbox mode.",
      }}
      ctaProps={{
        title: `Continue with ${selectedAsset}`,
        variant: "primary",
        onPress: () =>
          router.push(
            `/wallets/deposit/deposit-address?asset=${selectedAsset}`,
          ),
      }}
    >
      <View style={[GeneralStyles.wrapper, { gap: 12 }]}>
        {balances.map((balance) => {
          const asset = getDepositAddressBySymbol(balance.assetSymbol);
          // console.log("Asset info for", balance.assetSymbol, ":", asset);
          if (!asset.address) return null; // Skip if asset info is not found
          return (
            <Pressable
              key={balance.assetSymbol}
              onPress={() => setSelectedAsset(balance.assetSymbol)}
              style={[
                { borderRadius: 18, padding: 4 },
                selectedAsset === balance.assetSymbol && {
                  borderColor: Colors.primaryClean,
                  borderWidth: 1,
                },
              ]}
            >
              <CryptoAssetItem
                iconSymbol={balance.assetSymbol}
                leftTitle={balance.assetSymbol}
                leftBody={asset?.network ?? ""}
                rightTitle={
                  formatAmount(balance.available) + " " + balance.assetSymbol
                }
                rightBody={
                  balance.assetSymbol === "USDT" ? "Recommended" : "Available"
                }
              />
            </Pressable>
          );
        })}
      </View>

      <Spacer size={24} />

      <View style={GeneralStyles.wrapper}>
        <View style={[GeneralStyles.box, { padding: 20 }]}>
          <ThemedText
            weight="bold"
            size={14}
            color={Colors.snowGray}
            style={{ marginBottom: 8 }}
          >
            Sandbox only
          </ThemedText>
          <ThemedText size={13} color={Colors.textMidGray}>
            Deposits create demo ledger entries for class exercises. Do not send
            real funds.
          </ThemedText>
        </View>
      </View>
    </Template>
  );
};

export default DepositAssetSelectionScreen;

const styles = StyleSheet.create({
  assetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  left: { flexDirection: "row", alignItems: "center", gap: 12 },
  right: { alignItems: "flex-end", gap: 4 },
});
