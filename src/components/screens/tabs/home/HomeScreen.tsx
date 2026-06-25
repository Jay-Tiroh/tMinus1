import { CoinList } from "@/components/home/Coins";
import KycLocked from "@/components/KycLocked";
import { Spacer } from "@/components/Spacer";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import Template from "@/components/trades/Template";
import Balance from "@/components/wallets/Balance";
import CryptoAssetItem from "@/components/wallets/CryptoAsset";
import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import useProfile from "@/hooks/useProfile";
import { useTrendingAssets } from "@/hooks/useTrendingAssets";
import { useWatchlist } from "@/hooks/useWatchlist";
import { Asset } from "@/types/assets";
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
  const router = useRouter();
  const { user, kycStatus } = useProfile();
  const firstName = user?.fullName?.split(" ")[0] || "User";
  const {
    trending,
    featured,
    isLoading: trendingLoading,
    isUninitialized: trendingUninitialized,
  } = useTrendingAssets(undefined, 10000);

  const { watchlist } = useWatchlist();
  const watchlistItems =
    watchlist?.map((asset) => asset.symbol).join(", ") || "BTC, ETH";
  const topGainer = trending.find((asset) => asset.symbol === featured?.symbol);
  // const isVerified = true;
  const isVerified = kycStatus === "approved";

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
      subtitle: "USDT deposit completed",
      statusText: "+$250",
      route: "/wallets/transaction-history" as Href,
    },
    {
      id: "kyc_status",
      title: "KYC status",
      subtitle: isVerified ? "Verified " : "Not verified",
      route: "/kyc" as Href,
    },
  ];

  return (
    <Template
      textBlockProps={{
        title: "Home",
        body: `Welcome back, ${firstName}`,
      }}
      ctaProps={undefined}
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
                router.push("/wallets/deposit/deposit-asset-selection" as Href)
              }
            />
            <Spacer size={32} />
            {/* Config-Driven Action List */}
            <View style={styles.actionList}>
              {DASHBOARD_ACTIONS_CONFIG.map((action) => (
                <TouchableOpacity
                  key={action.id}
                  activeOpacity={0.7}
                  onPress={() => router.push(action.route)}
                >
                  <CryptoAssetItem
                    iconComponent={<CircleIcon />}
                    leftTitle={action.title}
                    leftBody={action.subtitle}
                    rightTitle={action.statusText ?? ""}
                    rightBody=""
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
    padding: 24,
    width: "100%",
    borderRadius: 24, // Matches the larger radius seen in the design
  },
  circleIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryClean,
  },
  actionList: {
    gap: 12,
  },
});
