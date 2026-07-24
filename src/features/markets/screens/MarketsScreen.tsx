import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import { useAllAssets } from "@/features/markets";
import { CoinList } from "@/features/markets/components/CoinList";
import { useBackToHome } from "@/shared/hooks/useBackToHome";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useSafeBottom } from "@/shared/hooks/useSafeBottom";
import { vs } from "@/shared/utils/responsive";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { ImageBackground, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MarketsHeader } from "../components/MarketsHeader";

export const MarketsScreen = () => {
  useBackToHome();
  const bottomPadding = useSafeBottom();
  const topInset = useSafeAreaInsets().top;
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const debouncedQuery = useDebounce(query, 400);
  const { coins, refetch } = useAllAssets(debouncedQuery);

  const handleTabChange = useCallback(
    (tab: string) => {
      setActiveTab(tab);
      if (tab === "Gainers") {
        router.navigate("/(tabs)/markets/trending");
      } else if (tab === "Watchlist") {
        router.navigate("/(tabs)/markets/watchlist");
      }
    },
    [router],
  );

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch]);

  return (
    <ImageBackground
      source={require("@/assets/images/new-bg.png")}
      style={[GeneralStyles.container]}
    >
      <CoinList
        data={coins}
        coinItemConfig={{ showChange: true, showChart: true }}
        ListHeaderComponent={
          <MarketsHeader
            query={query}
            onQueryChange={setQuery}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        }
        contentContainerStyle={{
          paddingBottom: bottomPadding * 2,
          paddingTop: topInset + vs(32),
        }}
        useHrefs
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
            progressBackgroundColor={Colors.backgroundDark}
          />
        }
      />
    </ImageBackground>
  );
};
