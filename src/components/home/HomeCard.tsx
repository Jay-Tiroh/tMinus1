import Forward from "@/assets/icons/home/forward.svg";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import React from "react";
import { Image, StyleSheet, View } from "react-native";

type Card = {
  title: SrcMapKey;
  subtitle: string;
  href?: string;
};

const Cards: Card[] = [
  {
    title: "P2P Trading",
    subtitle: "Bank Transfer, Paypal Revolut...",
    href: undefined,
  },
  {
    title: "Credit/Debit Card",
    subtitle: "Visa, Mastercard",
    href: undefined,
  },
];

const SrcMap = {
  "P2P Trading": require("@/assets/icons/home/rocket.png"),
  "Credit/Debit Card": require("@/assets/icons/home/cards.png"),
} as const;

type SrcMapKey = keyof typeof SrcMap;

const HomeCard = () => {
  return (
    <View style={styles.wrapper}>
      {Cards.map((card, index) => (
        <View key={index} style={styles.card}>
          <Image
            source={SrcMap[card.title]}
            style={index === 0 ? { alignSelf: "flex-end" } : undefined}
          />
          <View style={styles.textContainer}>
            <ThemedText size={16} letterSpacing={2.64} style={styles.title}>
              {card.title}
            </ThemedText>
            <ThemedText size={14} letterSpacing={2.64} style={styles.subtitle}>
              {card.subtitle}
            </ThemedText>
          </View>
          <View style={styles.button}>
            <Forward />
          </View>
        </View>
      ))}
    </View>
  );
};

export default HomeCard;

const styles = StyleSheet.create({
  wrapper: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    gap: 20,
  },
  card: {
    // width: "100%",
    flexDirection: "row",
    alignItems: "center",
    height: 76,
    borderRadius: 16,
    paddingHorizontal: 10,
    backgroundColor: Colors.lightGray + "80",
    gap: 10,
  },
  title: { color: Colors.surface },
  subtitle: { color: Colors.textSecondary },
  textContainer: {
    flex: 1,
    // padding: ,
  },
  button: {
    backgroundColor: Colors.lightGray,
    width: 40,
    height: 40,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
});
