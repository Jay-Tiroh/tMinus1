import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import { ThemedText } from "@/shared/components/ThemedText";
import React from "react";
import { Pressable, View } from "react-native";

export type ListItemProps = {
  title: string;
  subtitle: string;
  trailingText?: string;
  trailingTextColor?: string;
  iconColor: string;
  onPress?: () => void;
  onLongPress?: () => void;
};

export const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  trailingText,
  trailingTextColor,
  iconColor,
  onPress,
  onLongPress,
}) => (
  <Pressable
    onPress={onPress}
    onLongPress={onLongPress}
    style={[
      GeneralStyles.box,
      {
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flex: 1,
      },
    ]}
  >
    <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: iconColor,
        }}
      />
      <View style={{ gap: 4 }}>
        <ThemedText size={16} weight="bold" color={Colors.white}>
          {title}
        </ThemedText>
        <ThemedText size={12} color={Colors.textMidGray}>
          {subtitle}
        </ThemedText>
      </View>
    </View>
    {trailingText && (
      <ThemedText
        size={14}
        weight="bold"
        color={trailingTextColor ?? Colors.primaryClean}
      >
        {trailingText}
      </ThemedText>
    )}
  </Pressable>
);
