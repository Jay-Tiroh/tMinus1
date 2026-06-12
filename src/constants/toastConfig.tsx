import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StyleSheet, Text, View } from "react-native";
import { ToastConfig } from "react-native-toast-message";

const TOAST_STATE = {
  success: {
    background: "hsl(150, 100%, 6%)", // #001F0A
    border: "hsl(147, 100%, 12%)", // #003D14
    text: "hsl(150, 86%, 65%)", // #57F287
  },
  error: {
    background: "hsl(358, 76%, 10%)", // #2D0B0C
    border: "hsl(357, 89%, 16%)", // #4E080A
    text: "hsl(358, 100%, 81%)", // #FFA1A3
  },
  warning: {
    background: "hsl(64, 100%, 6%)", // #1F1F00
    border: "hsl(60, 100%, 12%)", // #3D3D00
    text: "hsl(46, 100%, 68%)", // #FFDC5C
  },
  info: {
    background: "hsl(215, 100%, 6%)", // #001433
    border: "hsl(223, 100%, 12%)", // #002966
    text: "hsl(210, 100%, 66%)", // #52A3FF
  },
};

type SonnerToastProps = {
  text1?: string;
  text2?: string;
};

function SonnerToast({
  text1,
  text2,
  icon,
  state,
}: SonnerToastProps & {
  icon: React.ReactNode;
  state: keyof typeof TOAST_STATE;
}) {
  const { background, border, text } = TOAST_STATE[state];
  return (
    <View
      style={[
        styles.sonnerContainer,
        { backgroundColor: background, borderColor: border },
      ]}
    >
      <View style={styles.iconWrap}>{icon}</View>
      <View style={styles.textWrap}>
        {text1 && (
          <Text style={[styles.text1, { color: Colors.snowGray }]}>
            {text1}
          </Text>
        )}
        {text2 && <Text style={[styles.text2, { color: text }]}>{text2}</Text>}
      </View>
    </View>
  );
}

export const toastConfig: ToastConfig = {
  success: ({ text1, text2 }) => (
    <SonnerToast
      text1={text1}
      text2={text2}
      state="success"
      icon={
        <FontAwesome5
          name="check-circle"
          size={18}
          color={TOAST_STATE.success.text}
        />
      }
    />
  ),

  error: ({ text1, text2 }) => (
    <SonnerToast
      text1={text1}
      text2={text2}
      state="error"
      icon={
        <MaterialIcons
          name="error-outline"
          size={20}
          color={TOAST_STATE.error.text}
        />
      }
    />
  ),

  warning: ({ text1, text2 }) => (
    <SonnerToast
      text1={text1}
      text2={text2}
      state="warning"
      icon={
        <Ionicons
          name="warning-outline"
          size={20}
          color={TOAST_STATE.warning.text}
        />
      }
    />
  ),

  info: ({ text1, text2 }) => (
    <SonnerToast
      text1={text1}
      text2={text2}
      state="info"
      icon={
        <AntDesign name="info-circle" size={18} color={TOAST_STATE.info.text} />
      }
    />
  ),

  customAction: ({ text1, text2 }) => (
    <View style={styles.customContainer}>
      <ThemedText weight="bold">{text1}</ThemedText>
      {text2 && <ThemedText size={12}>{text2}</ThemedText>}
    </View>
  ),
};

const styles = StyleSheet.create({
  sonnerContainer: {
    width: "90%",
    minHeight: 56,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    gap: 10,
  },
  iconWrap: {
    width: 24,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  textWrap: {
    flex: 1,
    gap: 2,
  },
  text1: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },
  text2: {
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 18,
    opacity: 0.9,
  },
  customContainer: {
    height: 60,
    width: "90%",
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.md,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
});
