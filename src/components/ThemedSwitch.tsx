import { Colors } from "@/constants/Colors";
import React, { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet } from "react-native";

interface NoFeedbackSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  activeTrackColor?: string;
  inactiveTrackColor?: string;
  activeThumbColor?: string;
  inactiveThumbColor?: string;
  size?: number;
  disabled?: boolean;
}

const TrackWidth = 36;
const TrackHeight = 16;
const ThumbSize = 20;

const NoFeedbackSwitch = ({
  value,
  onValueChange,
  activeTrackColor = Colors.profit + "33",
  inactiveTrackColor = Colors.textMuted,
  activeThumbColor = Colors.profit,
  inactiveThumbColor = Colors.textSecondary,
  disabled = false,
}: NoFeedbackSwitchProps) => {
  // 1. Set up the animation value (0 for off, 20 for on)
  const translateX = useRef(new Animated.Value(value ? 20 : 0)).current;

  // 2. Animate the thumb when the value changes
  useEffect(() => {
    Animated.timing(translateX, {
      toValue: value ? TrackWidth - ThumbSize : 0, // 22 is track width (50) - thumb width (26) - padding (2)
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [value, translateX]);

  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      disabled={disabled}
      // 3. This is the magic prop that kills the Android ripple
      android_ripple={null}
      style={[
        styles.track,
        { backgroundColor: value ? activeTrackColor : inactiveTrackColor },
      ]}
    >
      <Animated.View
        style={[
          styles.thumb,
          {
            transform: [{ translateX }],
            backgroundColor: value ? activeThumbColor : inactiveThumbColor,
          },
        ]}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  track: {
    width: TrackWidth,
    height: TrackHeight,
    borderRadius: 15,
    justifyContent: "center",
  },
  thumb: {
    width: ThumbSize,
    height: ThumbSize,
    borderRadius: 13,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    elevation: 4, // Android shadow
  },
});

export default NoFeedbackSwitch;
