import { GeneralStyles } from "@/constants/themes";
import { Spacer } from "@/shared/components/Spacer";
import TextBlock from "@/shared/components/TextBlock";
import { ThemedButton } from "@/shared/components/ThemedButton";
import { ms, vs } from "@/shared/utils/responsive";
import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";

export const WatchlistFooter = () => {
  const router = useRouter();

  return (
    <>
      <Spacer size={50} />
      <View style={GeneralStyles.wrapper}>
        <View
          style={[
            GeneralStyles.box,
            {
              height: vs(128),
              justifyContent: "center",
              padding: ms(20),
            },
          ]}
        >
          <TextBlock
            title="Add more assets"
            body="Use the market list to add coins to your watchlist."
            titleStyle={{ fontSize: ms(20) }}
            bodyStyle={{ fontSize: ms(12) }}
          />
        </View>
      </View>
      <Spacer size={50} />
      <View style={GeneralStyles.wrapper}>
        <ThemedButton
          title="Explore markets"
          variant="primary"
          onPress={() => router.replace("/(tabs)/markets")}
        />
      </View>
    </>
  );
};
