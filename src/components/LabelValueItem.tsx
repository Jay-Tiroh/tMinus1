import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import { View } from "react-native";

type ItemProps = {
  label: string;
  value: string;
  labelColor?: string;
  valueColor?: string;
  labelSize?: number;
  valueSize?: number;
  labelWeight?: "light" | "regular" | "medium" | "bold" | undefined;
  valueWeight?: "light" | "regular" | "medium" | "bold" | undefined;
};
export const LabelValueItem = ({
  label,
  value,
  labelColor = Colors.textMidGray,
  valueColor = Colors.snowGray,
  labelSize = 12,
  valueSize = 13,
  labelWeight = "regular",
  valueWeight = "bold",
}: ItemProps) => {
  return (
    <View
      style={[
        GeneralStyles.box,
        {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 20,
        },
      ]}
    >
      <ThemedText size={labelSize} color={labelColor} weight={labelWeight}>
        {label}
      </ThemedText>
      <ThemedText
        size={valueSize}
        color={valueColor}
        weight={valueWeight}
        numberOfLines={1}
        ellipsizeMode="middle"
        style={{ maxWidth: 200 }}
      >
        {value}
      </ThemedText>
    </View>
  );
};
