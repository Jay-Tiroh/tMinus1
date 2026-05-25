import Plus from "@/assets/icons/markets/add-circle.svg";
import Switcher from "@/components/markets/Switcher";
import { Spacer } from "@/components/Spacer";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

const TradeSheetContent = () => {
  const tabs = ["Limit", "Market", "Stop-limit"];
  const [activeTab, setActiveTab] = React.useState(tabs[0]);
  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
  };
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.row}>
          <ThemedText size={12} color={Colors.textMuted}>
            Available:
          </ThemedText>
          <ThemedText size={12} color={Colors.white}>
            15.234164400
          </ThemedText>
        </View>
        <View style={styles.row}>
          <ThemedText size={12} color={Colors.textSecondary}>
            USDC
          </ThemedText>
          <Plus width={24} height={24} />
        </View>
      </View>
      <Spacer size={30} />
      <Switcher tabs={tabs} activeTab={activeTab} onTabPress={handleTabPress} />
      <Spacer size={8} />
      {/*Content*/}
      <View>
        <View style={[styles.row, styles.priceRow]}>
          <ThemedText size={14} color={Colors.textSecondary}>
            Price:
          </ThemedText>
          <ThemedText size={14} color={Colors.white}>
            38418.49
          </ThemedText>
        </View>
        <Spacer size={8} />

        <View style={[styles.quantityBlock]}>
          <View style={[styles.row, styles.quantityRow]}>
            <ThemedText size={14} color={Colors.textSecondary}>
              Quantity:
            </ThemedText>
            <TextInput style={styles.input} placeholder="Enter Amount" />
          </View>
        </View>
      </View>
    </View>
  );
};

export default TradeSheetContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    // backgroundColor: Colors.surface,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 12,
    width: "100%",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  priceRow: {
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 24,
    backgroundColor: Colors.surfaceCard,
    borderRadius: 12,
    height: 54,
    alignItems: "center",
  },
  quantityBlock: {
    width: "100%",
    paddingHorizontal: 24,
    backgroundColor: Colors.surfaceCard,
    borderRadius: 12,
  },
  quantityRow: {
    justifyContent: "space-between",
    width: "100%",
    height: 54,
    alignItems: "center",
    gap: 14,
  },
  input: {
    flex: 1,
  },
});
