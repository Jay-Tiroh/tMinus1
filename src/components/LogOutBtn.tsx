import { ThemedButton } from "@/shared/components/ThemedButton";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { useLogout } from "@/hooks/useLogout";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

const LogOutBtn = () => {
  const { performLogout, isLoading } = useLogout();

  return (
    <View style={styles.container}>
      <ThemedButton
        title="log out"
        variant="red"
        style={{
          backgroundColor: Colors.lossDark + "40",
          borderColor: Colors.lossDark,
          borderWidth: 1.5,
        }}
        textStyle={{ color: "white", fontFamily: Fonts.medium }}
        iconComponent={
          isLoading ? (
            <ActivityIndicator color={"white"} />
          ) : (
            <MaterialIcons name="logout" size={24} color="white" />
          )
        }
        disabled={isLoading}
        onPress={performLogout}
      />
    </View>
  );
};

export default LogOutBtn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    maxWidth: 280,
    justifyContent: "center",
    alignItems: "center",
  },
});
