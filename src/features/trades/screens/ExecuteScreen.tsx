import { Fonts } from "@/constants/Fonts";
import { GeneralStyles } from "@/constants/themes";
import { ConfigType } from "@/features/trades/screens/QuoteScreen";
import { useAssetRoute } from "@/features/trades/hooks/useAssetRoute";
import useTrade from "@/hooks/useTrade";
import Template from "@/shared/components/Template";
import { ms } from "@/shared/utils/responsive";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Keyboard, View } from "react-native";

// Import new boundary dependencies
import {
  ExecuteCompleted,
  ExecuteConfirm,
  ExecuteFailed,
} from "../components/ExecuteBlocks";

type ScreenState = "confirm" | "completed" | "failed";

export const ExecuteScreen = () => {
  const { asset } = useLocalSearchParams();
  const { replace } = useAssetRoute();
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
    handleExecute(enteredPin);
    Keyboard.dismiss();
  };

  const Config: Record<ScreenState, ConfigType> = {
    confirm: {
      title: "Confirm trade",
      body: "Enter your transaction PIN to execute this quote.",
      cta: {
        title: isExecuting ? "Executing..." : "Execute trade",
        onPress: () => handleExecute(),
        variant: "primary",
      },
      content: (
        <ExecuteConfirm
          quote={activeQuote}
          onPinComplete={handleOnPinComplete}
        />
      ),
      topSpacerSize: 42,
    },
    completed: {
      title: "Trade completed",
      body: "Your trade has settled successfully.",
      cta: {
        title: "View transaction",
        onPress: () =>
          router.replace(
            `/(tabs)/wallets/transaction-details?id=${lastTransaction?.id}`,
          ),
        variant: "primary",
      },
      content: <ExecuteCompleted transaction={lastTransaction} />,
      topSpacerSize: 42,
    },
    failed: {
      title: "Trade failed",
      body: "The trade could not be completed.",
      cta: {
        title: "Edit amount",
        onPress: () =>
          replace("action", { action: "Buy", asset: asset as string }),
        variant: "red",
      },
      content: <ExecuteFailed transaction={lastTransaction} />,
      topSpacerSize: 42,
    },
  };

  const activeConfig = Config[screenState];

  return (
    <Template
      textBlockProps={{ title: activeConfig.title, body: activeConfig.body }}
      ctaProps={{
        title: activeConfig.cta.title,
        onPress: activeConfig.cta.onPress,
        variant: activeConfig.cta.variant as any,
        textStyle: { fontFamily: Fonts.bold, fontSize: ms(14) },
      }}
      topSpacerSize={activeConfig.topSpacerSize}
    >
      <View style={GeneralStyles.wrapper}>{activeConfig.content}</View>
    </Template>
  );
};
