import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

import { Spacer } from "@/shared/components/Spacer";
import TextBlock from "@/shared/components/TextBlock";
import { ThemedButton } from "@/shared/components/ThemedButton";
import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";

export type ErrorStateProps = {
  title?: string;
  message?: string;
  buttonText?: string;
  onRetry: () => void;
  isLoading?: boolean;
  style?: StyleProp<ViewStyle>;
  iconName?: keyof typeof MaterialCommunityIcons.glyphMap;
};

const ErrorState = ({
  title = "Something went wrong",
  message = "Error fetching data. Please check your connection and try again.",
  buttonText = "Try Again",
  onRetry,
  isLoading = false,
  style,
  iconName = "alert-circle-outline",
}: ErrorStateProps) => {
  return (
    <View
      style={[GeneralStyles.container, styles.container, style]}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name={iconName}
              size={42}
              color={Colors.lossAlt}
            />
          </View>

          <Spacer size={20} />

          <TextBlock
            title={title}
            body={message}
            titleStyle={styles.title}
            bodyStyle={styles.body}
          />

          <Spacer size={32} />

          <ThemedButton
            title={isLoading ? "Retrying..." : buttonText}
            variant="outline"
            onPress={onRetry}
            disabled={isLoading}
            iconComponent={
              isLoading ? (
                <ActivityIndicator color={Colors.primary} size="small" />
              ) : undefined
            }
            style={styles.button}
          />
        </View>
      </View>
    </View>
  );
};

export default ErrorState;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  overlay: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  card: {
    width: "100%",
    backgroundColor: Colors.backgroundInk,
    borderRadius: 24,
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border + '80',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    backgroundColor: Colors.backgroundDark,
    padding: 16,
    borderRadius: 50,
  },
  title: {
    textAlign: "center",
    fontSize: 18,
  },
  body: {
    textAlign: "center",
    maxWidth: 280,
  },
  button: {
    maxWidth: 160,
    height: 44,
  },
});
