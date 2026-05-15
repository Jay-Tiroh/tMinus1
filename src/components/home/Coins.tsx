import { CoinCard } from "@/components/home/CoinCard";
import CoinCardsSkeleton from "@/components/home/CoinCardSkeleton";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import {
  useAllAssetsQuery,
  useTrendingQuery,
} from "@/store/services/marketsApi";
import { Asset } from "@/types/assets";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const CoinCards = ({ data }: { data: Asset[] | undefined }) => {
  return (
    <>
      {data?.map((coin, index) => (
        
        <CoinCard key={coin.symbol ?? index} coin={coin} /> // ✅ each card calls its own hook
      ))}
    </>
  );
};

const Coins = () => {
  const dummyArr = [1, 2, 3, 4];
  const { data: trending, isLoading: trendingLoading } = useTrendingQuery();
  const { data: coins, isLoading: coinsLoading } = useAllAssetsQuery();

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
          {coinsLoading && (
            <>
              {dummyArr.map((_) => (
                <CoinCardsSkeleton key={_} />
              ))}
            </>
          )}
          <CoinCards data={coins} />
        </ScrollView>
{/**/}
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
          {trendingLoading && (
            <>
              {dummyArr.map((_) => (
                <CoinCardsSkeleton key={_} />
              ))}
            </>
          )}
          <CoinCards data={trending} />
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
    // gap: 20,
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

  bottom: {},
});
