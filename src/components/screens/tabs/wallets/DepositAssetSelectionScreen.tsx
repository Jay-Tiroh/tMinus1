import { Spacer } from "@/components/Spacer";
import TextBlock from "@/components/TextBlock";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import CryptoAssetItem from "@/components/wallets/CryptoAssetItem";
import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import { formatAmount } from "@/helpers/functions";
import { useSafeBottom } from "@/hooks/useSafeBottom";
import useWallet from "@/hooks/useWallet";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  ImageBackground,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DepositAssetSelectionScreen = () => {
  const [selectedAsset, setSelectedAsset] = useState("USDT");
  const { balances, depositAddresses } = useWallet();
  const router = useRouter();

  const insets = useSafeAreaInsets();
  const bottomPadding = useSafeBottom();

  // Combine and filter data once to prevent O(N*M) lookups during render
  const availableAssets = useMemo(() => {
    return balances.reduce(
      (acc, balance) => {
        const addressInfo = depositAddresses.find(
          (addr) =>
            addr.assetSymbol === balance.assetSymbol && addr.address !== null,
        );

        if (addressInfo) {
          acc.push({
            ...balance,
            network: addressInfo.network,
          });
        }
        return acc;
      },
      [] as ((typeof balances)[0] & { network: string })[],
    );
  }, [balances, depositAddresses]);

  const ListHeader = (
    <View style={GeneralStyles.wrapper}>
      <TextBlock
        title="Deposit"
        body="Choose the asset you want to fund in sandbox mode."
      />
      <Spacer size={24} />
    </View>
  );

  const ListFooter = (
    <View style={{ paddingTop: 24, paddingHorizontal: 24 }}>
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
  );

  return (
    <ImageBackground
      source={require("@/assets/images/new-bg.png")}
      style={[
        GeneralStyles.container,
        { paddingTop: insets.top + 24, paddingBottom: bottomPadding + 40 },
      ]}
    >
      {/* ── Header ── */}
      {ListHeader}

      {/* ── Scrollable List ── */}
      <FlatList
        data={availableAssets}
        keyExtractor={(item) => item.assetSymbol}
        showsVerticalScrollIndicator={false}
        style={{ width: "100%", flex: 1 }}
        contentContainerStyle={{
          paddingBottom: 24,
          gap: 12,
        }}
        ListFooterComponent={ListFooter}
        renderItem={({ item }) => {
          const isSelected = selectedAsset === item.assetSymbol;

          return (
            <Pressable
              onPress={() => setSelectedAsset(item.assetSymbol)}
              style={[
                styles.assetWrapper,
                isSelected && styles.assetWrapperSelected,
              ]}
            >
              <CryptoAssetItem
                iconSymbol={item.assetSymbol}
                leftTitle={item.assetSymbol}
                leftBody={item.network}
                rightTitle={
                  formatAmount(item.available) + " " + item.assetSymbol
                }
                rightBody={
                  item.assetSymbol === "USDT" ? "Recommended" : "Available"
                }
              />
            </Pressable>
          );
        }}
      />

      {/* ── Pinned CTA ── */}
      <View style={[GeneralStyles.wrapper, { paddingTop: 16 }]}>
        <ThemedButton
          title={`Continue with ${selectedAsset}`}
          variant="primary"
          onPress={() =>
            router.replace(
              `/wallets/deposit/deposit-address?asset=${selectedAsset}`,
            )
          }
        />
      </View>
    </ImageBackground>
  );
};

export default DepositAssetSelectionScreen;

const styles = StyleSheet.create({
  assetWrapper: {
    borderRadius: 18,
    padding: 4,
    borderWidth: 1,
    borderColor: "transparent",
    marginHorizontal: 24, // Keeps the border aligned with the wrapper boundaries
  },
  assetWrapperSelected: {
    borderColor: Colors.primaryClean,
  },
});
