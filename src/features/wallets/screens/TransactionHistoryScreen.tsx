import CryptoAssetItem from "@/components/wallets/CryptoAssetItem";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { GeneralStyles } from "@/constants/themes";
import { useTransactions } from "@/features/wallets/hooks/useTransactions";
import Loader from "@/shared/components/Loader";
import { Spacer } from "@/shared/components/Spacer";
import TextBlock from "@/shared/components/TextBlock";
import { ThemedButton } from "@/shared/components/ThemedButton";
import { useSafeBottom } from "@/shared/hooks/useSafeBottom";
import { formatAmount } from "@/shared/utils/formatCurrency";
import { timeAgo } from "@/shared/utils/timeAgo";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  ImageBackground,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TransactionEmptyState } from "../components/TransactionEmptyState";
import {
  TRANSACTION_TAB_MAP,
  TRANSACTION_TABS,
} from "../constants/wallets.constants";

export const TransactionHistoryScreen = () => {
  const router = useRouter();
  const bottomPadding = useSafeBottom();
  const topInset = useSafeAreaInsets().top;

  const [activeTab, setActiveTab] = useState("All");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { transactions, isFetching, refetch } = useTransactions(
    { type: TRANSACTION_TAB_MAP[activeTab] },
    60000,
  );

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch]);

  const renderHeader = () => (
    <>
      <View style={GeneralStyles.wrapper}>
        <TextBlock
          title="Transactions"
          body="Deposits, withdrawals, buys, sells, and swaps."
        />
      </View>
      <Spacer size={24} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24 }}
        style={{ flexGrow: 0 }}
      >
        <View style={{ flexDirection: "row", gap: 12 }}>
          {TRANSACTION_TABS.map((tab) => (
            <ThemedButton
              key={tab}
              title={tab}
              variant={activeTab === tab ? "default" : "secondary"}
              onPress={() => setActiveTab(tab)}
              style={[
                {
                  height: 36,
                  paddingHorizontal: 16,
                  borderRadius: 18,
                  width: "auto",
                },
                activeTab === tab
                  ? { backgroundColor: Colors.surfaceGreenForest }
                  : { backgroundColor: Colors.surfaceNavy },
              ]}
              textStyle={{
                fontSize: 13,
                color:
                  activeTab === tab ? Colors.primaryClean : Colors.textMidGray,
                fontFamily: Fonts.medium,
              }}
            />
          ))}
        </View>
      </ScrollView>
      <Spacer size={24} />
    </>
  );

  return (
    <ImageBackground
      source={require("@/assets/images/new-bg.png")}
      style={[GeneralStyles.container, { width: "100%" }]}
    >
      <FlatList
        data={transactions}
        keyExtractor={(tx) => tx.id}
        ListHeaderComponent={renderHeader()}
        ListEmptyComponent={
          !isFetching ? <TransactionEmptyState /> : <Loader />
        }
        contentContainerStyle={{
          paddingBottom: bottomPadding + 50,
          paddingTop: topInset + 24,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
            progressBackgroundColor={Colors.backgroundDark}
          />
        }
        renderItem={({ item: tx }) => (
          <TouchableOpacity
            onPress={() =>
              router.replace(`/wallets/transaction-details?id=${tx.id}`)
            }
            style={[GeneralStyles.wrapper, { marginBottom: 10 }]}
          >
            <CryptoAssetItem
              iconSymbol={tx.toAsset}
              leftTitle={tx.toAsset + " " + tx.type.toUpperCase()}
              leftBody={tx.status}
              rightTitle={
                formatAmount(tx.toAmount + tx.rate) + " " + tx.toAsset
              }
              rightBody={timeAgo(tx.createdAt)}
            />
          </TouchableOpacity>
        )}
      />
    </ImageBackground>
  );
};
