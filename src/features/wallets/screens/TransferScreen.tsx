import { AssetPickerModal } from "@/components/AssetPicker";
import { CryptoIcon } from "@/components/CryptoIcon";
import { LabelValueItem } from "@/components/LabelValueItem";
import { Spacer } from "@/components/Spacer";
import { ThemedText } from "@/components/ThemedText";
import Template from "@/components/trades/Template";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { GeneralStyles } from "@/constants/themes";
import { formatAmount } from "@/helpers/functions";
import { useGoToRoute } from "@/hooks/useGoToRoute";
import { useAppSelector } from "@/store/hooks";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { TransferPinModal } from "../components/TransferPinModal";
import {
  TRANSFER_QUICK_AMOUNTS,
  TRANSFER_STEPS,
} from "../constants/wallets.constants";
import { useTransferFlow } from "../hooks/useTransferFlow";

export const TransferScreen = () => {
  const toSuccess = useGoToRoute("/wallets/success?type=transfer");
  const recentContacts = useAppSelector((s) => s.wallets.recentContacts);

  const { state, actions } = useTransferFlow(toSuccess);
  const activeStepConfig =
    TRANSFER_STEPS.find((s) => s.step === state.currentStep) ||
    TRANSFER_STEPS[0];

  const reviewConfig = [
    { label: "Recipient", value: state.recipient, valueColor: Colors.snowGray },
    {
      label: "Asset",
      value: state.selectedAssetSymbol,
      valueColor: Colors.snowGray,
    },
    {
      label: "Amount",
      value: `${formatAmount(state.parsedAmount)} ${state.selectedAssetSymbol}`,
      valueColor: Colors.snowGray,
    },
    {
      label: "Network Fee",
      value: `${formatAmount(state.networkFee)} ${state.selectedAssetSymbol}`,
      valueColor: Colors.warningAlt,
    },
    {
      label: "Total Deduction",
      value: `${formatAmount(state.totalDeduction)} ${state.selectedAssetSymbol}`,
      valueColor: Colors.lossAlt,
    },
  ];

  return (
    <>
      <Template
        textBlockProps={{
          title: activeStepConfig.title,
          body: activeStepConfig.body,
        }}
        topSpacerSize={16}
        ctaProps={{
          title: activeStepConfig.ctaLabel,
          variant: "primary",
          onPress: actions.handleNext,
          disabled: state.isCtaDisabled,
        }}
        ctaFooter={
          state.currentStep > 1 ? (
            <TouchableOpacity onPress={actions.handlePrev}>
              <ThemedText
                color={Colors.textMidGray}
                size={14}
                style={styles.backButtonText}
              >
                Go Back
              </ThemedText>
            </TouchableOpacity>
          ) : undefined
        }
      >
        <View style={[GeneralStyles.wrapper, { flex: 3 }]}>
          <View style={styles.stepIndicator}>
            <ThemedText color={Colors.primaryClean} size={12} weight="bold">
              STEP {state.currentStep} OF 3
            </ThemedText>
          </View>
          <Spacer size={20} />

          {/* ─── Step 1: Recipient ─── */}
          {state.currentStep === 1 && (
            <View style={{ gap: 24 }}>
              <View style={[GeneralStyles.box, styles.inputContainer]}>
                <ThemedText color={Colors.textMidGray} size={12}>
                  Recipient Details
                </ThemedText>
                <TextInput
                  value={state.recipient}
                  onChangeText={actions.setRecipient}
                  placeholder="@username or 0x..."
                  placeholderTextColor={Colors.textMidGray}
                  style={styles.textInput}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {recentContacts.length > 0 && (
                <View style={{ gap: 12 }}>
                  <ThemedText
                    color={Colors.textMidGray}
                    size={14}
                    weight="medium"
                  >
                    Recent Contacts
                  </ThemedText>
                  {recentContacts.map((contact) => (
                    <TouchableOpacity
                      key={contact.id}
                      style={styles.contactCard}
                      onPress={() => actions.setRecipient(contact.address)}
                    >
                      <View style={styles.avatar}>
                        <ThemedText
                          color={Colors.surfaceNavy}
                          size={14}
                          weight="bold"
                        >
                          {contact.initials}
                        </ThemedText>
                      </View>
                      <View style={{ flex: 1 }}>
                        <ThemedText
                          color={Colors.snowGray}
                          size={15}
                          weight="medium"
                        >
                          {contact.name}
                        </ThemedText>
                        <ThemedText color={Colors.textMidGray} size={13}>
                          {contact.address}
                        </ThemedText>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* ─── Step 2: Amount ─── */}
          {state.currentStep === 2 && (
            <View style={{ gap: 24 }}>
              <View style={{ gap: 8 }}>
                <View style={[GeneralStyles.box, styles.amountContainer]}>
                  <View style={{ gap: 8, justifyContent: "center", flex: 1 }}>
                    <ThemedText color={Colors.textMidGray} size={12}>
                      Send Amount
                    </ThemedText>
                    <TextInput
                      value={state.amount}
                      onChangeText={(text) =>
                        actions.setAmount(text.replace(/[^0-9.]/g, ""))
                      }
                      keyboardType="decimal-pad"
                      placeholder="0.00"
                      placeholderTextColor={Colors.textMidGray}
                      style={styles.amountInput}
                      maxLength={12}
                    />
                    <ThemedText color={Colors.textSubtle} size={12}>
                      ≈ ${formatAmount(state.fiatValue, false)}
                    </ThemedText>
                  </View>

                  <TouchableOpacity
                    onPress={() => actions.setPickerVisible(true)}
                    style={styles.assetPickerTrigger}
                  >
                    <CryptoIcon symbol={state.selectedAssetSymbol} size={24} />
                    <ThemedText weight="bold">
                      {state.selectedAssetSymbol}
                    </ThemedText>
                    <MaterialCommunityIcons
                      name="chevron-down"
                      size={16}
                      color={Colors.textMidGray}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.balanceRow}>
                  <ThemedText color={Colors.textMidGray} size={12}>
                    Available Balance
                  </ThemedText>
                  <ThemedText
                    color={
                      state.isInsufficient ? Colors.loss : Colors.primaryClean
                    }
                    size={12}
                    weight="bold"
                  >
                    {formatAmount(state.assetBalance, true)}{" "}
                    {state.selectedAssetSymbol}
                  </ThemedText>
                </View>
              </View>

              <View style={styles.quickAmountsRow}>
                {TRANSFER_QUICK_AMOUNTS.map((pct) => (
                  <TouchableOpacity
                    key={pct}
                    style={styles.quickAmountButton}
                    onPress={() => actions.handleQuickAmount(pct)}
                  >
                    <ThemedText
                      color={Colors.snowGray}
                      size={13}
                      weight="medium"
                    >
                      {pct === 100 ? "Max" : `${pct}%`}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* ─── Step 3: Review ─── */}
          {state.currentStep === 3 && (
            <View style={{ gap: 16 }}>
              <View style={{ gap: 10 }}>
                {reviewConfig.map((item) => (
                  <LabelValueItem
                    key={item.label}
                    label={item.label}
                    value={item.value}
                    valueColor={item.valueColor}
                  />
                ))}
              </View>

              <View style={styles.securityBanner}>
                <MaterialCommunityIcons
                  name="shield-lock-outline"
                  size={24}
                  color={Colors.primaryClean}
                />
                <ThemedText
                  color={Colors.textMidGray}
                  size={13}
                  style={{ flex: 1, lineHeight: 20 }}
                >
                  Blockchain transactions are final and cannot be reversed.
                  Verify the recipient address carefully.
                </ThemedText>
              </View>
            </View>
          )}
        </View>
      </Template>

      <AssetPickerModal
        visible={state.isPickerVisible}
        onClose={() => actions.setPickerVisible(false)}
        onSelect={(asset) => {
          actions.setSelectedAssetSymbol(asset.symbol);
          actions.setPickerVisible(false);
        }}
        assetsToShow={state.availableAssets}
      />

      <TransferPinModal
        visible={state.isPinModalVisible}
        onClose={() => actions.setPinModalVisible(false)}
        onSubmit={actions.executeTransfer}
        isSubmitting={state.isSubmitting}
        pinError={state.pinError}
        pinAttempt={state.pinAttempt}
        amount={state.parsedAmount}
        assetSymbol={state.selectedAssetSymbol}
        recipient={state.recipient}
      />
    </>
  );
};

const styles = StyleSheet.create({
  stepIndicator: {
    backgroundColor: Colors.surfaceNavy,
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 8,
  },
  textInput: {
    color: Colors.snowGray,
    fontSize: 16,
    fontFamily: Fonts.medium,
    height: 44,
  },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundDark,
    padding: 16,
    borderRadius: 16,
    gap: 14,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.primaryFaint,
    alignItems: "center",
    justifyContent: "center",
  },
  amountContainer: {
    width: "100%",
    height: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  amountInput: {
    color: Colors.snowGray,
    fontSize: 28,
    fontFamily: Fonts.bold,
    padding: 0,
    margin: 0,
  },
  assetPickerTrigger: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surfaceNavy,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 8,
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  quickAmountsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  quickAmountButton: {
    flex: 1,
    height: 40,
    backgroundColor: Colors.surfaceNavy,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  securityBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surfaceGreenTeal,
    padding: 16,
    borderRadius: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.surfaceGreenDark,
  },
  backButtonText: {
    textAlign: "center",
    paddingVertical: 8,
  },
});
