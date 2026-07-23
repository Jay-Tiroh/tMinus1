import React from "react";
import {
  KeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  Platform,
  View,
  ViewProps,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ThemedViewProps = ViewProps & {
  safe?: boolean;
  avoiding?: boolean;
  avoidingProps?: KeyboardAvoidingViewProps;
};

export const ThemedView: React.FC<ThemedViewProps> = ({
  safe,
  avoiding,
  avoidingProps,
  style,
  children,
  ...rest
}) => {
  // Priority: avoiding > safe > normal view
  if (avoiding) {
    return (
      <KeyboardAvoidingView
        style={style}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        {...avoidingProps}
        {...rest}
      >
        {children}
      </KeyboardAvoidingView>
    );
  }

  if (safe) {
    return (
      <SafeAreaView style={style} {...rest}>
        {children}
      </SafeAreaView>
    );
  }

  return (
    <View style={style} {...rest}>
      {children}
    </View>
  );
};
