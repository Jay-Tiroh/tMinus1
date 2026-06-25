import { ThemedButton } from "@/components/ThemedButton";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { showSuccessToast } from "@/hooks/showToast";
import { useAppDispatch } from "@/store/hooks";
import { lockSession } from "@/store/slices/authSlice";
import { saveToken } from "@/utils/secureStore";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

const LockAppBtn = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLockAccount = async () => {
    dispatch(lockSession());
    await saveToken("SESSION_LOCKED", "true");
    showSuccessToast({ title: "App locked" });
    router.replace("/welcome-back");
  };

  return (
    <View style={styles.container}>
      <ThemedButton
        title="Lock App"
        variant="red"
        style={{
          backgroundColor: Colors.lossDark + "40",
          borderColor: Colors.lossDark,
          borderWidth: 1.5,
        }}
        textStyle={{ color: "white", fontFamily: Fonts.medium }}
        iconComponent={
          <MaterialIcons name="lock-outline" size={24} color="white" />
        }
        onPress={handleLockAccount}
      />
    </View>
  );
};

export default LockAppBtn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    maxWidth: 280,
    justifyContent: "center",
    alignItems: "center",
  },
});
