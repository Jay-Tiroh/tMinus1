import { ThemedButton } from "@/components/ThemedButton";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { showErrorToast, showSuccessToast } from "@/hooks/showToast";
import { useLogoutMutation } from "@/store/services/authApi";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
const LogOutBtn = () => {
  const [logout, { isLoading, isError, isSuccess }] = useLogoutMutation();
  const router = useRouter();
  const handleLogout = async () => {
    try {
      const result = await logout().unwrap();

      showSuccessToast({
        title: "Logged out successfully",
      });
      router.replace("/(auth)");
    } catch (error) {
      showErrorToast({
        title: "Logout failed",
        message:
          error?.data?.error?.message || "An error occurred while logging out",
      });
    }
  };

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
