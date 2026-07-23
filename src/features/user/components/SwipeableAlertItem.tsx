import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import { formatAmount } from "@/shared/utils/formatCurrency";
import { timeAgo } from "@/shared/utils/timeAgo";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect } from "react";
import { TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { ListItem } from "./ListItem";

const ACTION_WIDTH = 100;

export type SwipeableAlertItemProps = {
  item: any;
  index: number;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onPressDelete: (id: string) => void;
  onPressEdit: (id: string, symbol: string) => void;
  onLongPress?: () => void;
};

export const SwipeableAlertItem: React.FC<SwipeableAlertItemProps> = ({
  item,
  index,
  isOpen,
  onOpen,
  onClose,
  onPressDelete,
  onPressEdit,
  onLongPress,
}) => {
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withSpring(isOpen ? ACTION_WIDTH : 0, {
      damping: 100,
      stiffness: 2000,
    });
  }, [isOpen, translateX]);

  const toggle = () => {
    if (isOpen) {
      onClose();
    } else {
      onOpen();
    }
  };

  const pan = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((e) => {
      const base = isOpen ? ACTION_WIDTH : 0;
      const next = base + e.translationX;
      translateX.value = Math.max(0, Math.min(ACTION_WIDTH, next));
    })
    .onEnd((e) => {
      const threshold = ACTION_WIDTH / 2;
      if (
        e.translationX > threshold ||
        (isOpen && e.translationX > -threshold)
      ) {
        runOnJS(onOpen)();
      } else {
        runOnJS(onClose)();
      }
    });

  const tap = Gesture.Tap().onEnd(() => {
    runOnJS(toggle)();
  });

  const longPress = Gesture.LongPress().onStart(() => {
    if (onLongPress) {
      runOnJS(onLongPress)();
    }
  });

  const gesture = Gesture.Race(pan, Gesture.Exclusive(tap, longPress));

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View
      style={{
        ...GeneralStyles.box,
        width: "100%",
        overflow: "hidden",
        backgroundColor: Colors.surfaceNavy + "50",
        position: "relative",
      }}
    >
      <View
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: ACTION_WIDTH,
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          paddingHorizontal: 8,
        }}
      >
        <TouchableOpacity onPress={() => onPressDelete(item.id)}>
          <Ionicons name="trash-outline" size={24} color={Colors.loss} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onPressEdit(item.id, item.assetSymbol)}
        >
          <Feather name="edit-3" size={24} color={Colors.info} />
        </TouchableOpacity>
      </View>

      <GestureDetector gesture={gesture}>
        <Animated.View style={[{ width: "100%" }, animatedStyle]}>
          <ListItem
            key={index}
            title={
              item.assetSymbol +
              " " +
              item.direction +
              " $" +
              formatAmount(item.targetPriceUsd)
            }
            subtitle={
              item.isActive
                ? "Active • push notification on"
                : "Triggered " + timeAgo(item.triggeredAt as string)
            }
            trailingText={item.isActive ? "On" : "Off"}
            trailingTextColor={!item.isActive ? Colors.loss : undefined}
            iconColor={item.isActive ? Colors.primaryClean : Colors.loss}
          />
        </Animated.View>
      </GestureDetector>
    </View>
  );
};
