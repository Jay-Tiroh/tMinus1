import BadgeStuff from "@/components/BadgeStuff";
import { LabelValueItem } from "@/components/LabelValueItem";
import { ConfigType } from "@/components/screens/tabs/trades/QuoteScreen";
import { Spacer } from "@/components/Spacer";
import { ThemedText } from "@/components/ThemedText";
import Template from "@/components/trades/Template";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { GeneralStyles } from "@/constants/themes";
import { useAssetRoute } from "@/hooks/useAssetRoute";
import useTrade from "@/hooks/useTrade";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { ActivityIndicator, Keyboard, View } from "react-native";
import { OtpInput } from "react-native-otp-entry";

type ScreenState = "confirm" | "completed" | "failed";

const ExecuteScreen = () => {
  const { asset } = useLocalSearchParams();
  const { push } = useAssetRoute();
  const router = useRouter();
  const { activeQuote, executeQuote, isExecuting, lastTransaction } =
    useTrade();
  const [screenState, setScreenState] = useState<ScreenState>("confirm");
  const [pin, setPin] = useState("");
  const idempotencyKey = useRef(Date.now().toString());

  const handleExecute = async (submittedPin?: string) => {
    const activePin = submittedPin ?? pin;
    if (activePin.length < 4) return;
    try {
      await executeQuote(activePin, idempotencyKey.current);
      setScreenState("completed");
    } catch {
      setScreenState("failed");
    }
  };

  const handleOnPinComplete = (enteredPin: string) => {
    setPin(enteredPin);
    handleExecute(enteredPin); // pass directly, no stale closure
    Keyboard.dismiss();
  };

  const Config: Record<ScreenState, ConfigType> = {
    confirm: {
      title: "Confirm trade",
      body: "Enter your transaction PIN to execute this quote.",
      cta: {
        title: isExecuting ? "Executing..." : "Execute trade",
        onPress: handleExecute,
        variant: "primary",
        style: undefined,
        textStyle: undefined,
      },
      content: (
        <Confirm quote={activeQuote} onPinComplete={handleOnPinComplete} />
      ),
      topSpacerSize: 42,
    },
    completed: {
      title: "Trade completed",
      body: "Your trade has settled successfully.",
      cta: {
        title: "View transaction",
        onPress: () =>
          router.push(
            `/(tabs)/wallets/transaction-details?id=${lastTransaction?.id}`,
          ), // swap for your transaction detail route
        variant: "primary",
        style: undefined,
        textStyle: undefined,
      },
      content: <Completed transaction={lastTransaction} />,
      topSpacerSize: 42,
    },
    failed: {
      title: "Trade failed",
      body: "The trade could not be completed.",
      cta: {
        title: "Edit amount",
        onPress: () =>
          push("action", { action: "buy", asset: asset as string }), // swap for your trade edit route
        variant: "red",
        style: undefined,
        textStyle: undefined,
      },
      content: <Failed transaction={lastTransaction} />,
      topSpacerSize: 42,
    },
  };

  const activeConfig = Config[screenState];

  return (
    <Template
      textBlockProps={{
        title: activeConfig.title,
        body: activeConfig.body,
      }}
      ctaProps={{
        title: activeConfig.cta.title,
        onPress: activeConfig.cta.onPress,
        variant: activeConfig.cta.variant,
        style: activeConfig.cta.style,
        textStyle: {
          ...activeConfig.cta.textStyle,
          fontFamily: Fonts.bold,
          fontSize: 14,
        },
      }}
      topSpacerSize={activeConfig.topSpacerSize}
    >
      <View style={GeneralStyles.wrapper}>{activeConfig.content}</View>
    </Template>
  );
};

const Confirm = ({
  quote,
  onPinComplete,
}: {
  quote: ReturnType<typeof useTrade>["activeQuote"];
  onPinComplete: (pin: string) => void;
}) => {
  if (!quote) {
    return <ActivityIndicator color={Colors.primaryClean} />;
  }

  const action = quote.type.charAt(0).toUpperCase() + quote.type.slice(1);

  return (
    <>
      <View
        style={{
          ...GeneralStyles.box,
          borderRadius: 20,
          height: 150,
          justifyContent: "center",
          paddingHorizontal: 24,
          gap: 12,
        }}
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

      <Spacer size={50} />
      <View
        style={{
          ...GeneralStyles.box,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 20,
          maxWidth: 300,
          height: 70,
          marginInline: "auto",
        }}
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

const Completed = ({
  transaction,
}: {
  transaction: ReturnType<typeof useTrade>["lastTransaction"];
}) => {
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
      <View style={{ gap: 10 }}>
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

const Failed = ({
  transaction,
}: {
  transaction: ReturnType<typeof useTrade>["lastTransaction"];
}) => {
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
      <View style={{ gap: 10 }}>
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

export default ExecuteScreen;
