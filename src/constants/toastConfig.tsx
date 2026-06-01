import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { StyleSheet, View } from "react-native";
import { BaseToast, ErrorToast, ToastConfig } from "react-native-toast-message";

export const toastConfig: ToastConfig = {
  // 1. Tweak the default 'success' UI
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: Colors.surfaceGreenForest,
        backgroundColor: Colors.surfaceGreenForest,
        borderRadius: 8,
      }}
      contentContainerStyle={{ paddingHorizontal: Spacing.md }}
      text1Style={{
        color: Colors.snowGray,
        fontSize: 14,
        fontWeight: "bold",
      }}
      text2Style={{
        color: Colors.primary,
        fontSize: 12,
        fontWeight: "medium",
      }}
    />
  ),

  // 2. Tweak the default 'error' UI
  error: (props) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftWidth: 0,
        backgroundColor: "#240C0C",
        borderRadius: 8,
      }}
      text1Style={{
        color: Colors.snowGray,
        fontSize: 14,
        fontWeight: "bold",
      }}
      text2Style={{
        color: Colors.loss,
        fontSize: 12,
        fontWeight: "medium",
      }}
    />
  ),

  // 3. Create a 100% custom toast type from scratch
  customAction: ({ text1, text2 }) => (
    <View style={styles.customContainer}>
      <ThemedText weight="bold">{text1}</ThemedText>
      {text2 && <ThemedText size={12}>{text2}</ThemedText>}
    </View>
  ),
};

const styles = StyleSheet.create({
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
