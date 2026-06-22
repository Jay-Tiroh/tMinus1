import { Asset, AssetPickerModal } from "@/components/AssetPicker";
import { Spacer } from "@/components/Spacer";
import { ThemedText } from "@/components/ThemedText";
import Template from "@/components/trades/Template";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { GeneralStyles } from "@/constants/themes";
import { formatAmount } from "@/helpers/functions";
import { useAllAssets } from "@/hooks/useAllAssets";
import { useGoToRoute } from "@/hooks/useGoToRoute";
import useWallet from "@/hooks/useWallet";
import { useAppDispatch } from "@/store/hooks";
import { setWithdrawalDraft } from "@/store/slices/walletsSlice";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Pressable, TextInput, View } from "react-native";

// Replace with a real saved-addresses source when available
// (e.g. a future `useSavedAddresses()` hook backed by its own endpoint).
const SAVED_ADDRESSES: {
  id: string;
  label: string;
  address: string;
  network: string;
}[] = [];

const WithdrawFormScreen = () => {
  const { balances, verification } = useWallet();
  const { coins } = useAllAssets();

  const [modalVisible, setModalVisible] = React.useState(false);
  const [addressPickerVisible, setAddressPickerVisible] = React.useState(false);
  const [selectedAsset, setSelectedAsset] = React.useState("USDT");
  const [amount, setAmount] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const assetsToShow = balances.map((balance) => balance.assetSymbol);

  const handleAssetSelect = (asset: Asset) => {
    setSelectedAsset(asset.symbol);
    setModalVisible(false);
  };

  const getAssetBySymbol = (symbol: string) => {
    return coins.find((asset) => asset.symbol === symbol);
  };

  const getBalanceForAsset = (symbol: string) => {
    const balance = balances.find((b) => b.assetSymbol === symbol);
    return balance ? balance.available : 0;
  };

  const network =
    getAssetBySymbol(selectedAsset)?.network || "Select asset first";

  const withdrawalLimit = verification?.limits?.withdrawalPerTransactionUsd;
  const dailyLimit = verification?.limits?.dailyWithdrawalUsd;

  const formFields = [
    {
      id: "wf_1",
      label: "Asset",
      value: selectedAsset,
      showBalance: true,
      type: "asset" as const,
    },
    {
      id: "wf_2",
      label: "Amount",
      value: amount,
      type: "amount" as const,
    },
    {
      id: "wf_3",
      label: "Destination address",
      value: address || "Enter or select an address",
      type: "address" as const,
    },
    {
      id: "wf_4",
      label: "Network",
      value: network,
      type: "readonly" as const,
    },
  ];

  const dispatch = useAppDispatch();
  const toConfirmation = useGoToRoute(
    "/wallets/withdraw/withdraw-confirmation",
  );

  const handlePress = () => {
    setError(null);

    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      setError("Enter a valid amount.");
      return;
    }
    if (numericAmount > getBalanceForAsset(selectedAsset)) {
      setError("Insufficient balance.");
      return;
    }
    if (!address) {
      setError("Enter or select a destination address.");
      return;
    }
    if (network === "Select asset first") {
      setError("Select an asset first.");
      return;
    }

    dispatch(
      setWithdrawalDraft({
        assetSymbol: selectedAsset,
        amount: numericAmount,
        address,
        network,
      }),
    );

    toConfirmation();
  };

  return (
    <Template
      textBlockProps={{
        title: "Withdraw",
        body: "Withdrawals require verification and transaction PIN.",
      }}
      ctaProps={{
        title: "Preview withdrawal",
        variant: "primary",
        onPress: handlePress,
      }}
    >
      <View style={[GeneralStyles.wrapper, { gap: 16 }]}>
        {formFields.map((field) => (
          <View
            key={field.id}
            style={[GeneralStyles.box, { padding: 16, gap: 4 }]}
          >
            <ThemedText size={12} color={Colors.textMidGray}>
              {field.label}
            </ThemedText>

            {field.type === "amount" ? (
              <TextInput
                value={amount}
                onChangeText={setAmount}
                placeholder="Enter amount"
                placeholderTextColor={Colors.textMidGray}
                keyboardType="decimal-pad"
                style={{
                  fontSize: 16,
                  fontFamily: Fonts.medium,
                  color: Colors.snowGray,
                  padding: 0,
                }}
              />
            ) : field.type === "address" ? (
              <View style={{ gap: 8 }}>
                <TextInput
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Paste or type address"
                  placeholderTextColor={Colors.textMidGray}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={{
                    fontSize: 16,
                    fontFamily: Fonts.medium,
                    color: Colors.snowGray,
                    padding: 0,
                  }}
                />
                {SAVED_ADDRESSES.length > 0 && (
                  <Pressable onPress={() => setAddressPickerVisible(true)}>
                    <ThemedText size={12} color={Colors.primary}>
                      Choose from saved addresses
                    </ThemedText>
                  </Pressable>
                )}
              </View>
            ) : (
              <Pressable
                onPress={() => {
                  if (field.type === "asset") setModalVisible(true);
                }}
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <ThemedText size={16} weight="bold" color={Colors.snowGray}>
                  {field.value}
                </ThemedText>
                {field.showBalance && (
                  <MaterialIcons
                    name="keyboard-arrow-down"
                    size={20}
                    color={Colors.snowGray}
                  />
                )}
              </Pressable>
            )}

            {field.showBalance && (
              <ThemedText size={10} color={Colors.textMidGray}>
                Available: {formatAmount(getBalanceForAsset(selectedAsset))}{" "}
                {selectedAsset}
              </ThemedText>
            )}
          </View>
        ))}

        {error && (
          <ThemedText size={12} color={Colors.loss}>
            {error}
          </ThemedText>
        )}
      </View>

      <Spacer size={24} />

      <View style={GeneralStyles.wrapper}>
        <View
          style={[
            GeneralStyles.box,
            { padding: 20, backgroundColor: Colors.surfaceGreenNight },
          ]}
        >
          <ThemedText
            weight="bold"
            size={14}
            color={Colors.snowGray}
            style={{ marginBottom: 4 }}
          >
            Withdrawal limits
          </ThemedText>
          <ThemedText size={13} color={Colors.textMidGray}>
            {withdrawalLimit != null && dailyLimit != null
              ? `Up to $${formatAmount(withdrawalLimit)} per transaction, $${formatAmount(dailyLimit)} per day.`
              : "Limits will appear once your verification status loads."}
          </ThemedText>
        </View>
      </View>

      <AssetPickerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelect={handleAssetSelect}
        assetsToShow={assetsToShow}
      />

      {/* Wire to a real address-picker modal once SAVED_ADDRESSES has a data source */}
    </Template>
  );
};

export default WithdrawFormScreen;
