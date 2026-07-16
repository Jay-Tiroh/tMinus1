import { GeneralStyles } from "@/constants/themes";
import SearchBar from "@/features/markets/components/SearchBar";
import { Spacer } from "@/shared/components/Spacer";
import TextBlock from "@/shared/components/TextBlock";
import React from "react";
import { View } from "react-native";
import { MarketsTabs, TABS } from "./MarketsTabs";

type MarketsHeaderProps = {
  query: string;
  onQueryChange: (query: string) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
};

export const MarketsHeader = ({
  query,
  onQueryChange,
  activeTab,
  onTabChange,
}: MarketsHeaderProps) => {
  return (
    <View style={GeneralStyles.wrapper}>
      <TextBlock
        title="Markets"
        body="Search assets, view live prices, and open a coin detail screen."
      />
      <Spacer size={16} />
      <SearchBar value={query} onChangeText={onQueryChange} />
      <Spacer size={22} />
      <MarketsTabs
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />
      <Spacer size={26} />
    </View>
  );
};
