import { CoinList } from "@/components/home/Coins";
import KycLocked from "@/components/KycLocked";
import Balance from "@/components/wallets/Balance";
import CryptoAssetItem from "@/components/wallets/CryptoAssetItem";
import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import { useWatchlist } from "@/features/markets";
import { Asset } from "@/features/markets/types/assets";
import useProfile from "@/features/user/hooks/useProfile";
import { formatAmount } from "@/helpers/functions";
import { useTransactions } from "@/hooks/useTransactions";
import { useTrendingAssets } from "@/hooks/useTrendingAssets";
import { Spacer } from "@/shared/components/Spacer";
import Template from "@/shared/components/Template";
import { ThemedButton } from "@/shared/components/ThemedButton";
import { ThemedText } from "@/shared/components/ThemedText";
import { useExitOnDoubleBack } from "@/shared/hooks/useExitOnDoubleBack";
import { ms, s, vs } from "@/utils/responsive";
import { Href, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const CircleIcon = () => <View style={styles.circleIcon} />;

const TrendingCoins = ({
  trending,
  trendingLoading,
  trendingUninitialized,
}: {
  trending: Asset[] | undefined;
  trendingLoading: boolean;
  trendingUninitialized: boolean;
}) => {
  return (
    <>
      <ThemedText
        weight="bold"
        size={18}
        letterSpacing={2.64}
        style={{ color: Colors.snowGray }}
      >
        Trending
      </ThemedText>
      <CoinList
        data={trending}
        isLoading={trendingLoading}
        isUninitialized={trendingUninitialized}
      />
    </>
  );
};

// ─── MAIN SCREEN ────────────────────────────────────────────────────────────
export default function HomeScreen() {
  useExitOnDoubleBack();
  const router = useRouter();
  const { user, kycStatus, refetch: refetchKyc } = useProfile();
  const firstName = user?.fullName?.split(" ")[0] || "User";
  const {
    trending,
    featured,
    isLoading: trendingLoading,
    isUninitialized: trendingUninitialized,
    refetch: refetchTrending,
  } = useTrendingAssets(undefined, 10000);

  const { watchlist, refetch: refetchWatchlist } = useWatchlist();
  const watchlistItems =
    watchlist?.map((asset) => asset.symbol).join(", ") || "BTC, ETH";
  const topGainer = trending.find((asset) => asset.symbol === featured?.symbol);
  // const isVerified = true;
  const isVerified = kycStatus === "approved";
  const { transactions, refetch: refetchTransactions } = useTransactions();
  const tx = transactions?.[0];
  const DASHBOARD_ACTIONS_CONFIG = [
    {
      id: "trending",
      title: "Trending",
      subtitle: topGainer?.name + " is top gainer",
      statusText: "+" + topGainer?.change24h + "%",
      route: "/(tabs)/markets/trending" as Href,
    },
    {
      id: "watchlist",
      title: "Watchlist",
      subtitle: watchlistItems ?? "BTC, ETH",
      statusText: "Live",
      route: "/(tabs)/markets/watchlist" as Href,
    },
    {
      id: "recent_tx",
      title: "Recent transaction",
      subtitle: tx?.note,
      statusText:
        "+" + formatAmount(tx?.toAmount + tx?.feeAmount) + " " + tx?.toAsset,
      route: "/wallets/transaction-history" as Href,
    },
    {
      id: "kyc_status",
      title: "KYC status",
      subtitle: isVerified ? "Verified " : "Not verified",
      route: "/kyc" as Href,
    },
  ];

  const handleRefetch = () => {
    refetchKyc();
    refetchTrending();
    refetchWatchlist();
    refetchTransactions();
  };

  return (
    <Template
      textBlockProps={{
        title: "Home",
        body: `Welcome back, ${firstName}`,
      }}
      ctaProps={undefined}
      refetch={handleRefetch}
    >
      <View style={GeneralStyles.wrapper}>
        {/* Balance Section */}

        <Balance />
        <Spacer size={24} />
        <KycLocked />
        {/* Primary Action */}
        {isVerified && (
          <>
            <ThemedButton
              title="Deposit"
              variant="primary"
              onPress={() =>
                router.replace(
                  "/wallets/deposit/deposit-asset-selection" as Href,
                )
              }
            />
            <Spacer size={32} />
            {/* Config-Driven Action List */}
            <View style={styles.actionList}>
              {DASHBOARD_ACTIONS_CONFIG.map((action) => (
                <TouchableOpacity
                  key={action.id}
                  activeOpacity={0.7}
                  onPress={() => router.replace(action.route)}
                >
                  <CryptoAssetItem
                    iconComponent={<CircleIcon />}
                    leftTitle={action.title}
                    leftBody={action.subtitle}
                    rightTitle={action.statusText ?? ""}
                    rightBody=""
                    numberOfLines={1}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <Spacer size={24} />
            <TrendingCoins
              trending={trending}
              trendingLoading={trendingLoading}
              trendingUninitialized={trendingUninitialized}
            />
          </>
        )}
      </View>
    </Template>
  );
}

// ─── STYLES ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  balanceCard: {
    ...GeneralStyles.box,
    backgroundColor: Colors.surfaceGreenDark,
    padding: s(24),
    width: "100%",
    borderRadius: ms(24), // Matches the larger radius seen in the design
  },
  circleIcon: {
    width: s(32),
    height: vs(32),
    borderRadius: ms(16),
    backgroundColor: Colors.primaryClean,
  },
  actionList: {
    gap: vs(12),
  },
});
