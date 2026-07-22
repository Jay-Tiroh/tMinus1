import { Spacer } from "@/shared/components/Spacer";
import { ThemedButton } from "@/shared/components/ThemedButton";
import { ThemedText } from "@/shared/components/ThemedText";
import Template from "@/shared/components/Template";
import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import useWallet from "@/features/wallets/hooks/useWallet";
import { showInfoToast } from "@/shared/hooks/showToast";
import Octicons from "@expo/vector-icons/Octicons";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { WalletNoticeBox } from "../components/WalletNoticeBox";

export const DepositAddressScreen = () => {
  const { asset } = useLocalSearchParams<{ asset: string }>();
  const router = useRouter();

  const { getDepositAddressBySymbol } = useWallet();
  const depositAddress = getDepositAddressBySymbol(asset as string);
  const isUsdt = asset === "USDT";

  const contextFields = [
    { id: "da_1", label: "Network", value: depositAddress?.network },
    { id: "da_2", label: "Deposit address", value: depositAddress?.address },
  ];

  const handleCopyAddress = async () => {
    if (depositAddress?.address) {
      await Clipboard.setStringAsync(depositAddress.address);
      showInfoToast({ title: "Address copied to clipboard!" });
    }
  };

  return (
    <Template
      textBlockProps={{
        title: `${asset} deposit`,
        body: "Copy the demo address or scan the QR code.",
      }}
      ctaProps={undefined}
    >
      <View style={GeneralStyles.wrapper}>
        <View
          style={{
            backgroundColor: Colors.snowGray,
            padding: 24,
            borderRadius: 16,
            alignSelf: "center",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <QRCode
            value={depositAddress?.address || ""}
            size={180}
            color="black"
            backgroundColor="white"
          />
        </View>
      </View>

      <Spacer size={32} />

      <View style={[GeneralStyles.wrapper, { gap: 16 }]}>
        {contextFields.map((field) => (
          <View
            key={field.id}
            style={[GeneralStyles.box, { padding: 16, gap: 4 }]}
          >
            <ThemedText size={12} color={Colors.textMidGray}>
              {field.label}
            </ThemedText>
            <ThemedText
              size={14}
              weight="bold"
              color={Colors.snowGray}
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              {field.value}
            </ThemedText>
          </View>
        ))}
      </View>

      <Spacer size={24} />

      <View style={[GeneralStyles.wrapper, { flexDirection: "row", gap: 16 }]}>
        <ThemedButton
          onPress={handleCopyAddress}
          title="Copy address"
          variant="primary"
          style={{ flex: 1 }}
          iconComponent={
            <Octicons name="copy" size={16} color={Colors.backgroundInk} />
          }
        />
        {isUsdt && (
          <ThemedButton
            title="Simulate deposit"
            variant="secondary"
            style={{ flex: 1 }}
            onPress={() =>
              router.replace({
                pathname: "/wallets/deposit/simulate-deposit",
                params: { asset },
              })
            }
          />
        )}
      </View>

      <Spacer size={32} />

      <View style={GeneralStyles.wrapper}>
        <WalletNoticeBox
          type="warning"
          title="Important"
          description="Only use the sandbox simulator in class. This address is not real custody."
        />
      </View>
    </Template>
  );
};
