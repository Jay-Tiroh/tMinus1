import AddCircle from "@/assets/icons/markets/add-circle.svg";
import Copy from "@/assets/icons/wallets/qr/copy.svg";
import SmallCamera from "@/assets/icons/wallets/qr/small-camera.svg";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { formatCurrency } from "@/helpers/functions";
import useWallet from "@/hooks/useWallet";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MyQRScreen = () => {
  const [currency, setCurrency] = React.useState("USDC");
  const handleCurrencyToggle = () => {
    setCurrency((prev) => (prev === "USDC" ? "BTC" : "USDC"));
  };
  const router = useRouter();
  const handleScan = () => {
    router.push("/wallets/scanQr");
  };

  // TODO: Replace with dynamic data from wallet store / API
  const { wallet, getDepositAddressBySymbol, portfolioValue } = useWallet();
  console.log(wallet?.data?.wallet);

  const { address, qrPayload } = getDepositAddressBySymbol(currency);
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
          <Pressable
            onPress={() => {
              setCurrency("USDC");
            }}
          >
            <ThemedText
              weight={currency === "USDC" ? "bold" : "regular"}
              size={14}
              letterSpacing={2.64}
              color={currency === "USDC" ? Colors.primary : Colors.textMuted}
            >
              USDC
            </ThemedText>
          </Pressable>
          <Pressable
            onPress={() => {
              setCurrency("BTC");
            }}
          >
            <ThemedText
              weight={currency === "BTC" ? "bold" : "regular"}
              size={14}
              letterSpacing={2.64}
              color={currency === "USDC" ? Colors.textMuted : Colors.primary}
            >
              BTC
            </ThemedText>
          </Pressable>
        </View>

        {/* Formatted BTC price display */}
        <ThemedText
          size={28}
          weight="bold"
          letterSpacing={2.64}
          color={Colors.white}
          style={styles.priceText}
        >
          {currency} {formatCurrency(portfolioValue)}
        </ThemedText>
      </LinearGradient>

      {address ? (
        <>
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
                value={qrPayload}
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
                ellipsizeMode="tail"
                numberOfLines={1}
                style={{ width: "80%" }}
              >
                {address}
              </ThemedText>

              {/* Copy-to-clipboard button flush to the right edge of the pill */}
              <TouchableOpacity style={styles.copyButton}>
                <Copy />
              </TouchableOpacity>
            </View>

            {/* Disclaimer / helper text beneath the address */}
            <ThemedText
              size={14}
              weight="regular"
              letterSpacing={2.64}
              color={Colors.textMuted}
              style={styles.disclaimerText}
            >
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore
            </ThemedText>
          </View>
        </>
      ) : (
        <NotFound currency={currency} />
      )}

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

export default MyQRScreen;
const NotFound = ({ currency }: { currency: string }) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ThemedText size={18} weight="bold" color={Colors.white}>
        No {currency} wallet found
      </ThemedText>
      <ThemedButton
        icon={AddCircle}
        title="Create one"
        style={{ width: 180, marginTop: 20 }}
        textStyle={{ fontFamily: Fonts.medium, color: Colors.white + "CC" }}
      />
    </View>
  );
};

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
    width: "100%",
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
    maxWidth: 39,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // marginLeft: "auto",
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
