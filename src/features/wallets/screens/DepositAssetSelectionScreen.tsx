import CryptoAssetItem from "@/components/wallets/CryptoAssetItem";
import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import { Spacer } from "@/shared/components/Spacer";
import TextBlock from "@/shared/components/TextBlock";
import { ThemedButton } from "@/shared/components/ThemedButton";
import { useSafeBottom } from "@/shared/hooks/useSafeBottom";
import { formatAmount } from "@/shared/utils/formatCurrency";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  ImageBackground,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WalletNoticeBox } from "../components/WalletNoticeBox";
import { useAvailableDepositAssets } from "../hooks/useAvailableDepositAssets";

export const DepositAssetSelectionScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const bottomPadding = useSafeBottom();

  const availableAssets = useAvailableDepositAssets();
  const [selectedAsset, setSelectedAsset] = useState("USDT");

  const renderHeader = () => (
    <View style={GeneralStyles.wrapper}>
      <TextBlock
        title="Deposit"
        body="Choose the asset you want to fund in sandbox mode."
      />
      <Spacer size={24} />
    </View>
  );

  const renderFooter = () => (
    <View style={{ paddingTop: 24, paddingHorizontal: 24 }}>
      <WalletNoticeBox
        type="info"
        title="Sandbox only"
        description="Deposits create demo ledger entries for class exercises. Do not send real funds."
      />
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
      {renderHeader()}

      <FlatList
        data={availableAssets}
        keyExtractor={(item) => item.assetSymbol}
        showsVerticalScrollIndicator={false}
        style={{ width: "100%", flex: 1 }}
        contentContainerStyle={{
          paddingBottom: 24,
          gap: 12,
        }}
        ListFooterComponent={renderFooter()}
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

      <View style={[GeneralStyles.wrapper, { paddingTop: 16 }]}>
        <ThemedButton
          title={`Continue with ${selectedAsset}`}
          variant="primary"
          onPress={() =>
            router.replace({
              pathname: "/wallets/deposit/deposit-address",
              params: { asset: selectedAsset },
            })
          }
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  assetWrapper: {
    borderRadius: 18,
    padding: 4,
    borderWidth: 1,
    borderColor: "transparent",
    marginHorizontal: 24,
  },
  assetWrapperSelected: {
    borderColor: Colors.primaryClean,
  },
});
