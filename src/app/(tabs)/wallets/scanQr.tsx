import QrCode from "@/assets/icons/wallets/qr/qr-code1.svg";
import SmallCamera from "@/assets/icons/wallets/qr/small-camera.svg";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import Scanner from "@/components/wallets/Scanner";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ScanQR = () => {
  const router = useRouter();
  const handleShow = () => {
    router.push("/wallets/myQr");
  };
  const insets = useSafeAreaInsets();
  const TabsBottomPadding = insets.bottom + 86;
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.container,
        { paddingBottom: TabsBottomPadding },
      ]}
    >
      <View style={styles.textContent}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
          }}
        >
          <SmallCamera />
          <ThemedText
            weight="bold"
            size={18}
            letterSpacing={2.64}
            color={Colors.white}
          >
            Scan QR code
          </ThemedText>
        </View>
        <ThemedText
          size={14}
          letterSpacing={2.64}
          color={Colors.textMuted}
          style={{ maxWidth: 272, textAlign: "center" }}
        >
          Scan the QR code and it automatically recognize it.
        </ThemedText>
      </View>
      <Scanner />
      <View style={styles.buttonContainer}>
        <ThemedButton
          title="Show QR code"
          icon={QrCode}
          variant="primary"
          onPress={handleShow}
        />
        <ThemedButton
          title="Cancel"
          variant="secondary"
          onPress={() => router.push("/home")}
        />
      </View>
    </ScrollView>
  );
};

export default ScanQR;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.surfaceDark,
    gap: 20,
    padding: 24,
  },
  textContent: {
    alignItems: "center",
    gap: 8,
  },
  buttonContainer: {
    width: "100%",
    gap: 20,
  },
});
