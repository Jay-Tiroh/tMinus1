import { AssetPickerModal } from "@/components/AssetPicker";
import { Spacer } from "@/shared/components/Spacer";
import { ThemedText } from "@/shared/components/ThemedText";
import Template from "@/components/trades/Template";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { GeneralStyles } from "@/constants/themes";
import { formatAmount } from "@/helpers/functions";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Pressable, TextInput, View } from "react-native";
import { useWithdrawFormFlow } from "../hooks/useWithdrawFormFlow";

export const WithdrawFormScreen = () => {
  const { state, actions } = useWithdrawFormFlow();

  const formFields = [
    {
      id: "wf_1",
      label: "Asset",
      value: state.selectedAssetSymbol,
      showBalance: true,
      type: "asset" as const,
    },
    {
      id: "wf_2",
      label: "Amount",
      value: state.amount,
      type: "amount" as const,
    },
    {
      id: "wf_3",
      label: "Destination address",
      value: state.address || "Enter or select an address",
      type: "address" as const,
    },
    {
      id: "wf_4",
      label: "Network",
      value: state.network,
      type: "readonly" as const,
    },
  ];

  return (
    <Template
      textBlockProps={{
        title: "Withdraw",
        body: "Withdrawals require verification and transaction PIN.",
      }}
      ctaProps={{
        title: "Preview withdrawal",
        variant: "primary",
        onPress: actions.handleSubmit,
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
                value={state.amount}
                onChangeText={actions.setAmount}
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
                  value={state.address}
                  onChangeText={actions.setAddress}
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
              </View>
            ) : (
              <Pressable
                onPress={() => {
                  if (field.type === "asset") actions.setModalVisible(true);
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
                Available: {formatAmount(state.currentBalance)}{" "}
                {state.selectedAssetSymbol}
              </ThemedText>
            )}
          </View>
        ))}

        {state.error && (
          <ThemedText size={12} color={Colors.loss}>
            {state.error}
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
            {state.withdrawalLimit != null && state.dailyLimit != null
              ? `Up to $${formatAmount(state.withdrawalLimit)} per transaction, $${formatAmount(state.dailyLimit)} per day.`
              : "Limits will appear once your verification status loads."}
          </ThemedText>
        </View>
      </View>

      <AssetPickerModal
        visible={state.modalVisible}
        onClose={() => actions.setModalVisible(false)}
        onSelect={(asset) => {
          actions.setSelectedAssetSymbol(asset.symbol);
          actions.setModalVisible(false);
        }}
        assetsToShow={state.availableAssets}
      />
    </Template>
  );
};
