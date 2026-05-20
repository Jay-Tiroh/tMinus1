import Coin from "@/assets/icons/activity/coin.svg";
import Cart from "@/assets/icons/activity/shopping-cart.svg";
import Wallet from "@/assets/icons/activity/wallet.svg";
import Arrow from "@/assets/icons/back.svg";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SvgProps } from "react-native-svg";

type Item = {
  name: string;
  icon: React.FC<SvgProps>;
};

const Items = [
  {
    name: "Deposit",
    icon: Coin,
  },
  {
    name: "Withdrawals",
    icon: Wallet,
  },
  {
    name: "Buy Order",
    icon: Cart,
  },
];

const ActionsList = () => {
  return (
    <View style={styles.container}>
      {Items.map((item) => (
        <View
          key={item.name}
          style={[styles.item, { borderBottomColor: Colors.surface }]}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 20,
            }}
          >
            <item.icon width={24} height={24} />
            <ThemedText color={Colors.textFaint} size={14}>
              {item.name}
            </ThemedText>
          </View>
          <Arrow
            color={Colors.textMuted}
            style={{ transform: [{ rotate: "180deg" }] }}
            hitSlop={20}
          />
        </View>
      ))}
    </View>
  );
};

export default ActionsList;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.surfaceCard,
    width: "100%",
    borderRadius: 12,
  },
  item: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 0.5,
  },
});
