import Template from "@/components/trades/Template";
import { GeneralStyles } from "@/constants/themes";
import React from "react";
import { StyleSheet, View } from "react-native";

const OrderBookScreen = () => {
  
  return (
    <Template
      textBlockProps={{
        title: "BTC order book",
        body: "Bid and ask levels for the trade screen.",
      }}
      ctaProps={{
        title: "Trade BTC",
        variant: "primary",
      }}
    >
      <View style={GeneralStyles.wrapper}></View>
    </Template>
  );
};

export default OrderBookScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
