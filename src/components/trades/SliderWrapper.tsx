import { Colors } from "@/constants/Colors";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import Slider from "@react-native-community/slider";
import React from "react";
import { StyleSheet } from "react-native";

interface TradeSliderProps {
  value: number; // 0–100
  onValueChange: (value: number) => void;
  maxValue?: number; // Optional max value for the slider, default is 100
}

export const SliderWrapper = ({ value, onValueChange }: TradeSliderProps) => {
  return (
    <BottomSheetView style={styles.container}>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={100}
        step={25}
        value={value}
        onValueChange={onValueChange}
        minimumTrackTintColor={Colors.white + "1D"}
        maximumTrackTintColor={Colors.borderLight + "80"}
        thumbTintColor={Colors.surfaceTeal}
        // tapToSeek
      />
    </BottomSheetView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 10,
  },
  slider: {
    width: "100%",
    height: 40,
  },
});
