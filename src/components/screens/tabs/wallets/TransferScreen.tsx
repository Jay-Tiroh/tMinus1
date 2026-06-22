import { Asset, AssetPickerModal } from "@/components/AssetPicker";
import { CryptoIcon } from "@/components/CryptoIcon";
import { LabelValueItem } from "@/components/LabelValueItem";
import { Spacer } from "@/components/Spacer";
import { ThemedText } from "@/components/ThemedText";

import Template from "@/components/trades/Template";
import TransactionPinInput from "@/components/trades/TransactionPinInput";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { GeneralStyles } from "@/constants/themes";
import { formatAmount } from "@/helpers/functions";
import { showErrorToast, showInfoToast } from "@/hooks/showToast";
import { useAllAssets } from "@/hooks/useAllAssets";
import { useGoToRoute } from "@/hooks/useGoToRoute";
import useWallet from "@/hooks/useWallet";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useInternalTransferMutation } from "@/store/services/walletsApi";
import { addRecentContact, setLastTransfer } from "@/store/slices/walletsSlice";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useMemo, useState } from "react";
import {
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// ─── Configuration ────────────────────────────────────────────────

const TRANSFER_STEPS = [
  {
    step: 1,
    title: "Send to",
    body: "Enter a recipient email, phone number, user id, or wallet deposit address.",
    ctaLabel: "Continue",
  },
  {
    step: 2,
    title: "Amount",
    body: "Select an asset and enter the transfer amount.",
    ctaLabel: "Review Transfer",
  },
  {
    step: 3,
    title: "Review Transfer",
    body: "Please verify the details before sending. Transfers are irreversible.",
    ctaLabel: "Confirm & Send",
  },
] as const;

const QUICK_AMOUNTS = [25, 50, 75, 100];
const NETWORK_FEE_RATE = 0.001;

// ─── Screen Component ─────────────────────────────────────────────────────────

const TransferScreen = () => {
  const dispatch = useAppDispatch();
  const toSuccess = useGoToRoute("/wallets/success?type=transfer"); // adjust route + param passing to match useGoToRoute's actual signature

  const { balances } = useWallet();
  const { coins } = useAllAssets();
  const recentContacts = useAppSelector((s) => s.wallets.recentContacts);
  const [internalTransfer, { isLoading: isSubmitting }] =
    useInternalTransferMutation();

  // ─── State ───
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [recipient, setRecipient] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [selectedAssetSymbol, setSelectedAssetSymbol] =
    useState<string>("USDT");
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [isPinModalVisible, setPinModalVisible] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);
  const [pinAttempt, setPinAttempt] = useState(0); // bump to force PIN input remount on failure

  // ─── Derived Data ───
  const activeStepConfig =
    TRANSFER_STEPS.find((s) => s.step === currentStep) || TRANSFER_STEPS[0];
  const parsedAmount = parseFloat(amount) || 0;

  const assetBalance = useMemo(() => {
    return (
      balances.find((b) => b.assetSymbol === selectedAssetSymbol)?.available ||
      0
    );
  }, [balances, selectedAssetSymbol]);

  const assetDetails = useMemo(() => {
    return coins?.find((c) => c.symbol === selectedAssetSymbol);
  }, [coins, selectedAssetSymbol]);

  const fiatValue = parsedAmount * (assetDetails?.priceUsd || 0);
  const networkFee = parsedAmount * NETWORK_FEE_RATE;
  const totalDeduction = parsedAmount + networkFee;
  const isInsufficient = totalDeduction > assetBalance;

  const availableAssets = useMemo(
    () => balances.map((b) => b.assetSymbol),
    [balances],
  );

  // Replace pin state and the PIN modal section in TransferScreen with this:

  const handleNext = () => {
    if (currentStep === 1) {
      if (!recipient.trim())
        return showInfoToast({ title: "Recipient required" });
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (parsedAmount <= 0)
        return showInfoToast({ title: "Enter a valid amount" });
      if (isInsufficient)
        return showErrorToast({ title: "Insufficient balance" });
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setPinError(null);
      setPinModalVisible(true);
    }
  };

  const executeTransfer = async (pin: string) => {
    setPinError(null);
    try {
      const result = await internalTransfer({
        assetSymbol: selectedAssetSymbol,
        amount: parsedAmount,
        recipient,
        pin,
      }).unwrap();

      dispatch(setLastTransfer(result));
      dispatch(addRecentContact({ address: recipient }));
      setPinModalVisible(false);
      toSuccess();
    } catch (error) {
      if (error?.data?.error?.code === "INVALID_PIN") {
        setPinError("Invalid pin. Check your PIN and try again. ");
        setPinAttempt((n) => n + 1);
      } else {
        showErrorToast({
          title: "Transfer Error",
          message: error?.data?.error?.message,
        });
        setPinModalVisible(false);
      }
      // remounts TransactionPinInput, clearing dots
      console.log(error);
    }
  };
  const handleAssetSelect = (asset: Asset) => {
    setSelectedAssetSymbol(asset.symbol);
    setPickerVisible(false);
  };

  const handleQuickAmount = (percentage: number) => {
    if (assetBalance <= 0) return;
    const calculatedAmount = (assetBalance * (percentage / 100)).toFixed(4);
    setAmount(calculatedAmount);
  };

  // ─── Render Helpers ───
  const isCtaDisabled = useMemo(() => {
    if (currentStep === 1) return recipient.trim().length < 3;
    if (currentStep === 2) return parsedAmount <= 0 || isInsufficient;
    return false;
  }, [currentStep, recipient, parsedAmount, isInsufficient]);

  const reviewConfig = [
    { label: "Recipient", value: recipient, valueColor: Colors.snowGray },
    { label: "Asset", value: selectedAssetSymbol, valueColor: Colors.snowGray },
    {
      label: "Amount",
      value: `${formatAmount(parsedAmount)} ${selectedAssetSymbol}`,
      valueColor: Colors.snowGray,
    },
    {
      label: "Network Fee",
      value: `${formatAmount(networkFee)} ${selectedAssetSymbol}`,
      valueColor: Colors.warningAlt,
    },
    {
      label: "Total Deduction",
      value: `${formatAmount(totalDeduction)} ${selectedAssetSymbol}`,
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
          onPress: handleNext,
          disabled: isCtaDisabled,
        }}
        ctaFooter={
          currentStep > 1 ? (
            <TouchableOpacity
              onPress={() => setCurrentStep((prev) => prev - 1)}
            >
              <ThemedText
                color={Colors.textMidGray}
                size={14}
                style={{ textAlign: "center", paddingVertical: 8 }}
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
              STEP {currentStep} OF 3
            </ThemedText>
          </View>

          <Spacer size={20} />

          {/* ─── Step 1: Recipient ─── */}
          {currentStep === 1 && (
            <View style={{ gap: 24 }}>
              <View style={[GeneralStyles.box, styles.inputContainer]}>
                <ThemedText color={Colors.textMidGray} size={12}>
                  Recipient Details
                </ThemedText>
                <TextInput
                  value={recipient}
                  onChangeText={setRecipient}
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
                      onPress={() => setRecipient(contact.address)}
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
          {currentStep === 2 && (
            <View style={{ gap: 24 }}>
              <View style={{ gap: 8 }}>
                <View style={[GeneralStyles.box, styles.amountContainer]}>
                  <View style={{ gap: 8, justifyContent: "center", flex: 1 }}>
                    <ThemedText color={Colors.textMidGray} size={12}>
                      Send Amount
                    </ThemedText>
                    <TextInput
                      value={amount}
                      onChangeText={(text) =>
                        setAmount(text.replace(/[^0-9.]/g, ""))
                      }
                      keyboardType="decimal-pad"
                      placeholder="0.00"
                      placeholderTextColor={Colors.textMidGray}
                      style={styles.amountInput}
                      maxLength={12}
                    />
                    <ThemedText color={Colors.textSubtle} size={12}>
                      ≈ ${formatAmount(fiatValue, false)}
                    </ThemedText>
                  </View>

                  <TouchableOpacity
                    onPress={() => setPickerVisible(true)}
                    style={styles.assetPickerTrigger}
                  >
                    <CryptoIcon symbol={selectedAssetSymbol} size={24} />
                    <ThemedText weight="bold">{selectedAssetSymbol}</ThemedText>
                    <MaterialCommunityIcons
                      name="chevron-down"
                      size={16}
                      color={Colors.textMidGray}
                    />
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingHorizontal: 4,
                  }}
                >
                  <ThemedText color={Colors.textMidGray} size={12}>
                    Available Balance
                  </ThemedText>
                  <ThemedText
                    color={isInsufficient ? Colors.loss : Colors.primaryClean}
                    size={12}
                    weight="bold"
                  >
                    {formatAmount(assetBalance, true)} {selectedAssetSymbol}
                  </ThemedText>
                </View>
              </View>

              <View style={styles.quickAmountsRow}>
                {QUICK_AMOUNTS.map((pct) => (
                  <TouchableOpacity
                    key={pct}
                    style={styles.quickAmountButton}
                    onPress={() => handleQuickAmount(pct)}
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
          {currentStep === 3 && (
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
        visible={isPickerVisible}
        onClose={() => setPickerVisible(false)}
        onSelect={handleAssetSelect}
        assetsToShow={availableAssets}
      />
      <Modal
        visible={isPinModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPinModalVisible(false)}
      >
        <View style={styles.pinModalOverlay}>
          <View style={[GeneralStyles.box, styles.pinModalCard]}>
            <ThemedText weight="bold" size={16} color={Colors.snowGray}>
              Enter Transaction PIN
            </ThemedText>
            <ThemedText
              size={13}
              color={Colors.textMidGray}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              Confirm sending {formatAmount(parsedAmount)} {selectedAssetSymbol}{" "}
              to {recipient}.
            </ThemedText>
            <Spacer size={16} />
            <TransactionPinInput
              key={pinAttempt}
              onComplete={executeTransfer}
            />
            {pinError && (
              <ThemedText
                size={12}
                color={Colors.loss}
                style={{ marginTop: 12, textAlign: "center" }}
              >
                {pinError}
              </ThemedText>
            )}
            {isSubmitting && (
              <ThemedText
                size={12}
                color={Colors.textMidGray}
                style={{ marginTop: 12, textAlign: "center" }}
              >
                Sending...
              </ThemedText>
            )}
            <Spacer size={20} />
            <TouchableOpacity
              onPress={() => setPinModalVisible(false)}
              disabled={isSubmitting}
            >
              <ThemedText
                size={13}
                color={Colors.textMidGray}
                style={{ textAlign: "center", paddingVertical: 12 }}
              >
                Cancel
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default TransferScreen;

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
  pinModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  pinModalCard: {
    padding: 24,
  },
  pinSubmitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
});
