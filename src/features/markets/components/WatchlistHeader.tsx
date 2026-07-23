import { GeneralStyles } from "@/constants/themes";
import { Spacer } from "@/shared/components/Spacer";
import TextBlock from "@/shared/components/TextBlock";
import React from "react";
import { View } from "react-native";

export const WatchlistHeader = () => {
  return (
    <>
      <View style={GeneralStyles.wrapper}>
        <TextBlock
          title="Watchlist"
          body="Assets you follow with row sparklines."
        />
      </View>
      <Spacer size={42} />
    </>
  );
};
