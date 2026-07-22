import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import React from "react";
import { View } from "react-native";
import { OtpInput } from "react-native-otp-entry";

import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { GeneralStyles } from "@/constants/themes";
import BadgeStuff from "@/shared/components/BadgeStuff";
import { LabelValueItem } from "@/shared/components/LabelValueItem";
import { Spacer } from "@/shared/components/Spacer";
import { ThemedText } from "@/shared/components/ThemedText";
import { ms, s, vs } from "@/utils/responsive";

export const ExecuteConfirm = ({
  quote,
  onPinComplete,
}: {
  quote: any;
  onPinComplete: (pin: string) => void;
}) => {
  if (!quote) return null;
  const action = quote.type.charAt(0).toUpperCase() + quote.type.slice(1);

  return (
    <>
      <View
        style={[
          GeneralStyles.box,
          {
            borderRadius: ms(20),
            height: vs(150),
            justifyContent: "center",
            paddingHorizontal: s(24),
            gap: vs(12),
          },
        ]}
      >
        <ThemedText color={Colors.snowGray} size={17} weight="bold">
          {action} {quote.toAsset}
        </ThemedText>
        <ThemedText color={Colors.textMidGray} size={14}>
          {quote.fromAmount} {quote.fromAsset} → {quote.toAmount}{" "}
          {quote.toAsset}
        </ThemedText>
        <ThemedText color={Colors.textMidGray} size={12}>
          Fee {quote.feeAmount} {quote.fromAsset}
        </ThemedText>
      </View>
      <Spacer size={52} />
      <View style={{ alignItems: "center" }}>
        <ThemedText color={Colors.snowGray} size={15} weight="bold">
          Transaction PIN
        </ThemedText>
      </View>
      <Spacer size={28} />
      <OtpInput
        numberOfDigits={4}
        onFilled={onPinComplete}
        secureTextEntry
        theme={{
          pinCodeTextStyle: { color: Colors.snowGray, fontFamily: Fonts.bold },
          focusedPinCodeContainerStyle: { borderColor: Colors.primaryClean },
          pinCodeContainerStyle: {
            minWidth: s(80),
            borderColor: Colors.surface,
          },
        }}
      />
      <Spacer size={50} />
      <View
        style={[
          GeneralStyles.box,
          {
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: s(20),
            maxWidth: s(300),
            height: vs(70),
            alignSelf: "center",
          },
        ]}
      >
        <ThemedText
          color={Colors.textMidGray}
          size={12}
          style={{ textAlign: "center" }}
        >
          The API executes only after POST /trade/execute with quoteId and PIN.
        </ThemedText>
      </View>
      <Spacer size={54} />
    </>
  );
};

export const ExecuteCompleted = ({ transaction }: { transaction: any }) => {
  const config = transaction
    ? [
        { label: "Reference", value: transaction.reference },
        {
          label: "Paid",
          value: `${transaction.fromAmount} ${transaction.fromAsset}`,
        },
        {
          label: "Received",
          value: `${transaction.toAmount} ${transaction.toAsset}`,
        },
        {
          label: "Fee",
          value: `${transaction.feeAmount} ${transaction.fromAsset}`,
        },
        {
          label: "Status",
          value: "Completed",
          valueColor: Colors.primaryClean,
        },
      ]
    : [];

  return (
    <>
      <BadgeStuff
        title={
          transaction
            ? `${transaction.toAmount} ${transaction.toAsset} received`
            : "Trade complete"
        }
        outerColor={Colors.primaryClean}
        innerColor={Colors.primaryClean}
        IconComponent={
          <FontAwesome5 name="check" size={42} color={Colors.backgroundInk} />
        }
      />
      <Spacer size={32} />
      <View style={{ gap: vs(10) }}>
        {config.map((item) => (
          <LabelValueItem
            key={item.label}
            label={item.label}
            value={item.value}
            valueColor={item.valueColor}
          />
        ))}
      </View>
    </>
  );
};

export const ExecuteFailed = ({ transaction }: { transaction: any }) => {
  const config = transaction
    ? [
        {
          label: "Attempted",
          value: `${transaction.fromAmount} ${transaction.fromAsset}`,
        },
        { label: "Status", value: "Failed", valueColor: Colors.lossBright },
      ]
    : [];

  return (
    <>
      <BadgeStuff
        title="Trade failed"
        desc="Your trade could not be completed. Please try again."
        outerColor={Colors.lossBright}
        IconComponent={
          <FontAwesome6 name="xmark" size={42} color={Colors.lossBright} />
        }
      />
      <Spacer size={56} />
      <View style={{ gap: vs(10) }}>
        {config.map((item) => (
          <LabelValueItem
            key={item.label}
            label={item.label}
            value={item.value}
            valueColor={item.valueColor}
          />
        ))}
      </View>
    </>
  );
};
