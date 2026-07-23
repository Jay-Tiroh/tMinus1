import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { GeneralStyles } from "@/constants/themes";
import { Spacer } from "@/shared/components/Spacer";
import { ThemedText } from "@/shared/components/ThemedText";
import { formatAmount } from "@/shared/utils/formatCurrency";
import React from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { OtpInput } from "react-native-otp-entry";

interface TransferPinModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (pin: string) => void;
  isSubmitting: boolean;
  pinError: string | null;
  pinAttempt: number;
  amount: number;
  assetSymbol: string;
  recipient: string;
}

export const TransferPinModal = ({
  visible,
  onClose,
  onSubmit,
  isSubmitting,
  pinError,
  pinAttempt,
  amount,
  assetSymbol,
  recipient,
}: TransferPinModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[GeneralStyles.box, styles.card]}>
          <ThemedText weight="bold" size={16} color={Colors.snowGray}>
            Enter Transaction PIN
          </ThemedText>
          <ThemedText
            size={13}
            color={Colors.textMidGray}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            Confirm sending {formatAmount(amount)} {assetSymbol} to {recipient}.
          </ThemedText>
          <Spacer size={16} />

          <OtpInput
            key={pinAttempt}
            numberOfDigits={4}
            onFilled={onSubmit}
            secureTextEntry
            theme={{
              pinCodeTextStyle: {
                color: Colors.snowGray,
                fontFamily: Fonts.bold,
              },
              focusedPinCodeContainerStyle: {
                borderColor: Colors.primaryClean,
              },
              pinCodeContainerStyle: {
                minWidth: 80,
                borderColor: Colors.surface,
              },
            }}
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
          <TouchableOpacity onPress={onClose} disabled={isSubmitting}>
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
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  card: {
    padding: 24,
  },
});
