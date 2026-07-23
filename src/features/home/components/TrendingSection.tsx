import { Colors } from "@/constants/Colors";
import { CoinList } from "@/features/home/components/CoinList";
import { Asset } from "@/features/markets";
import { ThemedText } from "@/shared/components/ThemedText";
import React from "react";

type TrendingSectionProps = {
  trending: Asset[] | undefined;
  trendingLoading: boolean;
  trendingUninitialized: boolean;
};

export const TrendingSection = ({
  trending,
  trendingLoading,
  trendingUninitialized,
}: TrendingSectionProps) => {
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
