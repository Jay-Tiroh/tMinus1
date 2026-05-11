import GreenChart from "@/assets/icons/home/green-chart.svg";
import RedChart from "@/assets/icons/home/red-chart.svg";
import { ThemedText } from "@/components/ThemedText";
import { RecentCoins } from "@/constants/CoinLists";
import { Colors } from "@/constants/Colors";
import { formatCurrency } from "@/helpers/functions";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const Coins = () => {
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
          {RecentCoins.map((coin, index) => (
            <View style={styles.card} key={index}>
              <View style={styles.top}>
                <ThemedText
                  weight="bold"
                  size={16}
                  letterSpacing={2.64}
                  style={{
                    color: coin.change > 0 ? Colors.primary : Colors.loss,
                  }}
                >
                  {formatCurrency(coin.price)}
                </ThemedText>
                <coin.symbol />
              </View>
              <View style={styles.middle}>
                <ThemedText
                  size={14}
                  letterSpacing={2.64}
                  style={{ color: Colors.surface }}
                >
                  {coin.name}
                </ThemedText>
                <ThemedText
                  size={12}
                  letterSpacing={2.64}
                  style={{
                    color: coin.change > 0 ? Colors.primary : Colors.loss,
                  }}
                >
                  {coin.change}
                </ThemedText>
              </View>
              <View style={styles.bottom}>
                {coin.change > 0 ? <GreenChart /> : <RedChart />}
              </View>
            </View>
          ))}
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
          {RecentCoins.map((coin, index) => (
            <View style={styles.card} key={index}>
              <View style={styles.top}>
                <ThemedText
                  weight="bold"
                  size={16}
                  letterSpacing={2.64}
                  style={{
                    color: coin.change > 0 ? Colors.primary : Colors.loss,
                  }}
                >
                  {formatCurrency(coin.price)}
                </ThemedText>
                <coin.symbol />
              </View>
              <View style={styles.middle}>
                <ThemedText
                  size={14}
                  letterSpacing={2.64}
                  style={{ color: Colors.surface }}
                >
                  {coin.name}
                </ThemedText>
                <ThemedText
                  size={12}
                  letterSpacing={2.64}
                  style={{
                    color: coin.change > 0 ? Colors.primary : Colors.loss,
                  }}
                >
                  {coin.change}
                </ThemedText>
              </View>
              <View style={styles.bottom}>
                {coin.change > 0 ? <GreenChart /> : <RedChart />}
              </View>
            </View>
          ))}
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
  card: {
    width: 163,
    height: 118,
    boxShadow: "0px 16px 50px rgba(22, 28, 34, 0.08)",
    borderRadius: 16,
    padding: 8,
    justifyContent: "space-between",
  },
  top: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  middle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  bottom: {},
});
