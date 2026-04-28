import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Pressable, StyleProp, TextStyle, ViewStyle } from "react-native";

type ButtonVariant = "default" | "primary" | "secondary" | "outline" | "red";

type ThemedButtonProps = {
  title: string;
  variant?: ButtonVariant;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
};

export const ThemedButton: React.FC<ThemedButtonProps> = ({
  title,
  variant = "default",
  onPress,
  style,
  textStyle,
  disabled = false,
}) => {
  const styles = getStyles(variant, disabled);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.container,
        pressed && !disabled && { opacity: 0.7 },
        style,
      ]}
    >
      <ThemedText style={[styles.text, textStyle]}>{title}</ThemedText>
    </Pressable>
  );
};

function getStyles(
  variant: ButtonVariant,
  disabled: boolean,
): { container: ViewStyle; text: TextStyle } {
  const baseContainer: ViewStyle = {
    height: 54,
    width: "100%",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  };

  const baseText: TextStyle = {
    fontSize: 18,
    letterSpacing: 0.0264 * 18,
    color: Colors.surfaceDark,
  };

  switch (variant) {
    case "primary":
      return {
        container: {
          ...baseContainer,
          backgroundColor: disabled ? Colors.primaryFaint : Colors.primary,
        },
        text: {
          ...baseText,
        },
      };

    case "secondary":
      return {
        container: {
          ...baseContainer,
          backgroundColor: disabled ? Colors.textFaint : Colors.textMuted,
        },
        text: {
          ...baseText,
          color: Colors.white,
        },
      };

    case "outline":
      return {
        container: {
          ...baseContainer,
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: disabled ? Colors.primaryFaint : Colors.primary,
        },
        text: {
          ...baseText,
          color: disabled ? Colors.primaryFaint : Colors.primary,
        },
      };

    case "red":
      return {
        container: {
          ...baseContainer,
          backgroundColor: disabled ? Colors.lossAlt : Colors.loss,
        },
        text: {
          ...baseText,
        },
      };

    default:
      return {
        container: {
          ...baseContainer,
          backgroundColor: disabled ? Colors.borderLight : Colors.border,
        },
        text: {
          ...baseText,
          color: Colors.white,
        },
      };
  }
}
