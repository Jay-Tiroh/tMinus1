import { ThemedButton } from "@/components/ThemedButton";
import { Fonts } from "@/constants/Fonts";
import { useLogoutMutation } from "@/store/services/authApi";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
const LogOutBtn = () => {
  const [logout, { isLoading, isError, isSuccess }] = useLogoutMutation();
  const router = useRouter();
  const handleLogout = async () => {
    const result = await logout();
    if (isSuccess) {
      router.replace("/(auth)");
      // console.log("Logged out successfully", result);
    }
    if (isError) {
      // NOTE: Add toast notification for error
      console.error("Logout failed:", result);
    }
  };

  return (
    <View style={styles.container}>
      <ThemedButton
        title="log out"
        variant="red"
        textStyle={{ color: "white", fontFamily: Fonts.medium }}
        iconComponent={
          isLoading ? (
            <ActivityIndicator color={"white"} />
          ) : (
            <MaterialIcons name="logout" size={24} color="white" />
          )
        }
        disabled={isLoading}
        onPress={handleLogout}
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
