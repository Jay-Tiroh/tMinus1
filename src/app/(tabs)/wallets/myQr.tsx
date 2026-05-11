import Copy from "@/assets/icons/wallets/qr/copy.svg";
import SmallCamera from "@/assets/icons/wallets/qr/small-camera.svg";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { formatCurrency } from "@/helpers/functions";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MyQR = () => {
  const [currency, setCurrency] = React.useState("USD");
  const router = useRouter();
  const handleScan = () => {
    router.push("/wallets/scanQr");
  };

  // TODO: Replace with dynamic data from wallet store / API
  const address = "n2e5dirgMNYdQskfiP5zj39VYemXareK4C";
  const price = 40059.83;

  // Account for the tab bar height + device bottom inset so content isn't clipped
  const insets = useSafeAreaInsets();
  const tabsBottomPadding = insets.bottom + 86;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.container,
        { paddingBottom: tabsBottomPadding },
      ]}
    >
      {/* ── Price Banner ─────────────────────────────────────────────── */}
      <LinearGradient
        colors={[Colors.surface + "80", Colors.primary + "1A"]}
        style={styles.gradient}
      >
        {/* Currency toggle label row */}
        <View style={styles.currencyRow}>
          <ThemedText
            weight="regular"
            size={14}
            letterSpacing={2.64}
            color={Colors.textMuted}
          >
            USD
          </ThemedText>
          <ThemedText
            weight="bold"
            size={14}
            letterSpacing={2.64}
            color={Colors.primary}
          >
            BTC
          </ThemedText>
        </View>

        {/* Formatted BTC price display */}
        <ThemedText
          size={28}
          weight="bold"
          letterSpacing={2.64}
          color={Colors.white}
          style={styles.priceText}
        >
          BTC {formatCurrency(price)}
        </ThemedText>
      </LinearGradient>

      {/* ── QR Code Card ─────────────────────────────────────────────── */}
      <View>
        <ThemedText
          size={18}
          weight="bold"
          letterSpacing={2.64}
          color={Colors.white}
          style={styles.qrTitle}
        >
          My QR code
        </ThemedText>

        {/* White card wrapping the QR so it renders clearly on dark backgrounds */}
        <View style={styles.qrCard}>
          <QRCode
            value={address}
            size={234}
            color="black"
            backgroundColor="white"
          />
        </View>
      </View>

      {/* ── Wallet Address Details ────────────────────────────────────── */}
      <View style={styles.details}>
        <ThemedText
          size={14}
          weight="regular"
          letterSpacing={2.64}
          color={Colors.textMuted}
          style={styles.addressLabel}
        >
          ADDRESS
        </ThemedText>

        {/* Address pill with inline copy action */}
        <View style={styles.addressRow}>
          <ThemedText
            size={14}
            weight="medium"
            letterSpacing={2.64}
            color={Colors.textMuted}
          >
            {address}
          </ThemedText>

          {/* Copy-to-clipboard button flush to the right edge of the pill */}
          <View style={styles.copyButton}>
            <Copy />
          </View>
        </View>

        {/* Disclaimer / helper text beneath the address */}
        <ThemedText
          size={14}
          weight="regular"
          letterSpacing={2.64}
          color={Colors.textMuted}
          style={styles.disclaimerText}
        >
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
          dolore
        </ThemedText>
      </View>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <View style={styles.buttonContainer}>
        <ThemedButton
          title="Scan QR code"
          icon={SmallCamera}
          variant="outline"
          onPress={handleScan}
        />
      </View>
    </ScrollView>
  );
};

export default MyQR;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.surfaceDark,
    gap: 20,
  },

  gradient: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 24,
    maxHeight: 146,
  },
  currencyRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  priceText: {
    maxWidth: 272,
    textAlign: "center",
  },

  qrTitle: {
    maxWidth: 272,
    textAlign: "center",
    marginBottom: 20,
  },
  qrCard: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 16,
  },

  details: {
    paddingHorizontal: 24,
    gap: 10,
  },
  addressLabel: {
    textAlign: "center",
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    maxWidth: 350,
    gap: 8,
    borderRadius: 12,
    overflow: "hidden",
    height: 35,
    paddingLeft: 8,
    backgroundColor: Colors.surfaceNight,
    marginBottom: 10,
  },
  copyButton: {
    backgroundColor: Colors.white,
    height: "100%",
    width: 39,
    justifyContent: "center",
    alignItems: "center",
  },
  disclaimerText: {
    maxWidth: 310,
    textAlign: "center",
  },

  buttonContainer: {
    width: "100%",
    gap: 20,
    paddingHorizontal: 24,
  },
});
