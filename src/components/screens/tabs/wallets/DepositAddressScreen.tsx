import { Spacer } from "@/components/Spacer";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import Template from "@/components/trades/Template";
import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import { showInfoToast } from "@/hooks/showToast";
import useWallet from "@/hooks/useWallet";
import Octicons from "@expo/vector-icons/Octicons";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import QRCode from "react-native-qrcode-svg";

const DepositAddressScreen = () => {
  const { asset } = useLocalSearchParams();
  const { getDepositAddressBySymbol, wallet } = useWallet();
  const depositAddress = getDepositAddressBySymbol(asset as string);
  // console.log(wallet);

  // When API is ready:
  // const { data: depositInfo } = useGetDepositNetworkQuery(assetId);

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

  const router = useRouter();
  const isUsdt = asset === "USDT";
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
            value={depositAddress?.address}
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
              router.replace(`/wallets/deposit/simulate-deposit?asset=${asset}`)
            }
          />
        )}
      </View>

      <Spacer size={32} />

      <View style={GeneralStyles.wrapper}>
        <View
          style={[
            GeneralStyles.box,
            {
              padding: 20,
              backgroundColor: Colors.warningBrown + "30",
              borderColor: Colors.warningBrown,
              borderWidth: 1,
            },
          ]}
        >
          <ThemedText
            weight="bold"
            size={14}
            color={Colors.snowGray}
            style={{ marginBottom: 8 }}
          >
            Important
          </ThemedText>
          <ThemedText size={13} color={Colors.warningGold}>
            Only use the sandbox simulator in class. This address is not real
            custody.
          </ThemedText>
        </View>
      </View>
    </Template>
  );
};

export default DepositAddressScreen;
