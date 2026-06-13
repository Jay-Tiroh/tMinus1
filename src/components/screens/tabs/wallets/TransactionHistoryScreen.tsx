import Loader from "@/components/Loader";
import { Spacer } from "@/components/Spacer";
import TextBlock from "@/components/TextBlock";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import CryptoAssetItem from "@/components/wallets/CryptoAsset";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { GeneralStyles } from "@/constants/themes";
import { formatAmount, timeAgo } from "@/helpers/functions";
import { useSafeBottom } from "@/hooks/useSafeBottom";
import { useTransactions } from "@/hooks/useTransactions";
import { TransactionType } from "@/types/wallets";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ─── Config ─────────────────────────────────────────────────────────────────

const TAB_TYPE_MAP: Record<string, TransactionType | undefined> = {
  All: undefined,
  Deposits: "deposit",
  Withdrawals: "withdrawal",
  Buys: "buy",
  Sells: "sell",
  Swaps: "swap",
};

const tabs = Object.keys(TAB_TYPE_MAP);

const EMPTY_STATE_CONFIG = {
  title: "No transactions found",
  body: "You don't have any transactions matching this category yet.",
};

// ─── Components ─────────────────────────────────────────────────────────────

const EmptyStateCard = () => (
  <View style={[GeneralStyles.wrapper, { marginTop: 12 }]}>
    <View style={[GeneralStyles.box, { padding: 24, gap: 12 }]}>
      <ThemedText weight="bold" size={16} color={Colors.white}>
        {EMPTY_STATE_CONFIG.title}
      </ThemedText>
      <ThemedText
        size={14}
        color={Colors.textMidGray}
        style={{ lineHeight: 20 }}
      >
        {EMPTY_STATE_CONFIG.body}
      </ThemedText>
    </View>
  </View>
);

// ─── Main Screen ────────────────────────────────────────────────────────────

const TransactionHistoryScreen = () => {
  const [activeTab, setActiveTab] = useState("All");
  const bottomPadding = useSafeBottom();
  const topInset = useSafeAreaInsets().top;

  const { transactions, isFetching, refetch, isLoading } = useTransactions(
    {
      type: TAB_TYPE_MAP[activeTab],
    },
    60000,
  );

  const ListHeader = (
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
          {tabs.map((tab) => (
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

  const router = useRouter();
  return (
    <ImageBackground
      source={require("@/assets/images/new-bg.png")}
      style={[
        GeneralStyles.container,
        { paddingTop: topInset + 24, width: "100%" },
      ]}
    >
      <FlatList
        data={transactions}
        keyExtractor={(tx) => tx.id}
        renderItem={({ item: tx }) => (
          <TouchableOpacity
            onPress={() => {
              router.push(`/wallets/transaction-details?id=${tx.id}`);
            }}
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
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={!isFetching ? <EmptyStateCard /> : <Loader />}
        contentContainerStyle={{ paddingBottom: bottomPadding + 50 }}
        showsVerticalScrollIndicator={false}
        refreshing={isLoading}
        onRefresh={refetch}
      />
    </ImageBackground>
  );
};

export default TransactionHistoryScreen;
