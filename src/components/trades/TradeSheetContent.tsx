import Plus from "@/assets/icons/markets/add-circle.svg";
import Switcher from "@/components/markets/Switcher";
import { Spacer } from "@/components/Spacer";
import { ThemedText } from "@/components/ThemedText";
import { SliderWrapper } from "@/components/trades/SliderWrapper";
import { Colors } from "@/constants/Colors";
import AntDesign from "@expo/vector-icons/AntDesign";
import { BottomSheetTextInput, useBottomSheet } from "@gorhom/bottom-sheet";
import React, { useEffect, useState } from "react";
import { Keyboard, Pressable, StyleSheet, View } from "react-native";

const TradeSheetContent = () => {
  const tabs = ["Limit", "Market", "Stop-limit"];
  const [activeTab, setActiveTab] = React.useState(tabs[0]);
  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
  };

  const availableBtcBalance = 15.254;

  // 2. The states to track
  const [sliderPercentage, setSliderPercentage] = useState<number>(0);
  const [cryptoQuantity, setCryptoQuantity] = useState<string>("");

  const handleSliderChange = (percentage: number) => {
    setSliderPercentage(percentage);

    if (percentage === 0) {
      setCryptoQuantity("");
    } else {
      const calculatedAmount = (percentage / 100) * availableBtcBalance;
      setCryptoQuantity(calculatedAmount.toFixed(4));
    }
  };

  const STEP = 0.001; // increment/decrement step for the +/− buttons

  const handleManualInputChange = (text: string) => {
    setCryptoQuantity(text);
    const numericValue = parseFloat(text);

    if (!isNaN(numericValue) && availableBtcBalance > 0) {
      const calculatedPercentage = (numericValue / availableBtcBalance) * 100;
      setSliderPercentage(Math.min(Math.max(calculatedPercentage, 0), 100));
    } else if (text === "") {
      setSliderPercentage(0);
    }
  };

  const handleIncrement = () => {
    const current = parseFloat(cryptoQuantity) || 0;
    const next = Math.min(current + STEP, availableBtcBalance);
    handleManualInputChange(next.toFixed(4));
  };

  const handleDecrement = () => {
    const current = parseFloat(cryptoQuantity) || 0;
    const next = Math.max(current - STEP, 0);
    handleManualInputChange(next.toFixed(4));
  };
  const { snapToIndex } = useBottomSheet();

  useEffect(() => {
    const sub = Keyboard.addListener("keyboardDidHide", () => {
      snapToIndex(2); // snaps to your 50% point
    });

    return () => sub.remove();
  }, [snapToIndex]);
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
            <BottomSheetTextInput
              style={styles.input}
              placeholder="Enter Amount"
              value={cryptoQuantity}
              onChangeText={handleManualInputChange}
              keyboardType="decimal-pad"
            />
            <View style={[styles.row, styles.btnContainer]}>
              <Pressable
                onPress={handleIncrement}
                style={({ pressed }) => [
                  styles.btn,
                  pressed && { backgroundColor: Colors.surface },
                ]}
              >
                <AntDesign name="plus" size={24} color={Colors.textMuted} />
              </Pressable>
              <Pressable
                onPress={handleDecrement}
                style={({ pressed }) => [
                  styles.btn,
                  pressed && { backgroundColor: Colors.surface },
                ]}
              >
                <AntDesign name="minus" size={24} color={Colors.textMuted} />
              </Pressable>
            </View>
          </View>
          <View onStartShouldSetResponder={() => true}>
            <SliderWrapper
              value={sliderPercentage}
              onValueChange={handleSliderChange}
              maxValue={availableBtcBalance}
            />
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
  },
  priceRow: {
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 24,
    backgroundColor: Colors.surfaceCard,
    borderRadius: 12,
    height: 54,
    alignItems: "center",
    gap: 8,
  },
  quantityBlock: {
    width: "100%",
    backgroundColor: Colors.surfaceCard,
    borderRadius: 12,
    paddingLeft: 24,
  },
  quantityRow: {
    justifyContent: "space-between",
    width: "100%",
    height: 54,
    alignItems: "center",
    gap: 14,

    // marginLeft: 24,
  },
  input: {
    flex: 1,
    textAlign: "center",
    color: Colors.textFaint,
  },
  btn: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  btnContainer: {
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 4,
  },
});
