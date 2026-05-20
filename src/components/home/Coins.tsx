import { CoinCard } from "@/components/home/CoinCard";
import CoinCardsSkeleton from "@/components/home/CoinCardSkeleton";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import {
  useAllAssetsQuery,
  useTrendingQuery,
} from "@/store/services/marketsApi";
import { Asset } from "@/types/assets";
import { memo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const SKELETON_KEYS = [0, 1, 2, 3];

const SkeletonRow = memo(function SkeletonRow() {
  return (
    <>
      {SKELETON_KEYS.map((k) => (
        <CoinCardsSkeleton key={k} />
      ))}
    </>
  );
});

const CoinCards = memo(function CoinCards({
  data,
}: {
  data: Asset[] | undefined;
}) {
  if (!data) return null;
  return (
    <>
      {data.map((coin, index) => (
        <CoinCard key={coin.symbol ?? index} coin={coin} />
      ))}
    </>
  );
});

const Coins = () => {
  const { data: coins, isLoading: coinsLoading } = useAllAssetsQuery();
  const { data: trending, isLoading: trendingLoading } = useTrendingQuery();

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <ThemedText
          weight="bold"
          size={18}
          letterSpacing={2.64}
          style={{ color: Colors.surface }}
        >
          Recent Coins
        </ThemedText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          style={styles.scrollView}
        >
          {coinsLoading ? <SkeletonRow /> : <CoinCards data={coins} />}
        </ScrollView>

        <ThemedText
          weight="bold"
          size={18}
          letterSpacing={2.64}
          style={{ color: Colors.surface }}
        >
          Top Coins
        </ThemedText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          style={styles.scrollView}
        >
          {trendingLoading ? <SkeletonRow /> : <CoinCards data={trending} />}
        </ScrollView>
      </View>
    </View>
  );
};

export default Coins;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    padding: 20,
  },
  wrapper: {
    flex: 1,
    justifyContent: "flex-start",
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    paddingVertical: 20,
  },
});
