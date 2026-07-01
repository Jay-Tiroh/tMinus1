import { ButtonVariant } from "@/components/ThemedButton";
import { Colors } from "@/constants/Colors";
import { formatAmount } from "@/helpers/functions";
import useFiat from "@/hooks/useFiat";

// ─── Utility Types ─────────────────────────────────────────────────────────────
type Action = "Buy" | "Sell" | "Swap";
type PickerTarget = "buyOutput" | "sellInput" | "swapInput" | "swapOutput";

// Replace with your actual KycLimits type if you have one exported elsewhere
export interface KycLimits {
  tradePerTransactionUsd: number;
  [key: string]: any;
}

// ─── Parameter Interface ───────────────────────────────────────────────────────
export interface ActionConfigParams {
  // General Data
  portfolioValue: number;
  limits: KycLimits | null | undefined;
  openAssetPicker: (target: PickerTarget) => void;
  pushQuote: () => void;
  assetAvailable: number;

  // Buy State
  buyAmount: string;
  setBuyAmount: (val: string) => void;
  parsedBuyAmount: number;
  isBuyInsufficient: boolean;
  buyOutputSymbol: string;
  buyPriceUsd: number;
  buyReceiveFormatted: string;

  // Sell State
  sellAmount: string;
  setSellAmount: (val: string) => void;
  sellInputSymbol: string;
  sellPriceUsd: number;
  sellReturns: number;
  sellFee: number;
  isSellInsufficient: boolean; // <-- Added

  // Swap State
  swapAmount: string;
  setSwapAmount: (val: string) => void;
  swapInputSymbol: string;
  swapOutputSymbol: string;
  swapReturnsFormatted: string;
  isSwapInsufficient: boolean; // <-- Added
}

// ─── Return Type Interface ─────────────────────────────────────────────────────
export interface ActionPageConfig {
  label: Action;
  title: string;
  desc: string;
  inputAmount: string;
  onInputChange: (val: string) => void;
  inputDetail: {
    title: string;
    currency: string;
    onPress?: () => void;
  };
  staticDetail: {
    title: string;
    body: string;
    currency: string;
    onPress?: () => void;
  };
  meta: Array<{
    label: string;
    value: string;
    valueColor?: string;
  }>;
  cta: {
    label: string;
    variant: ButtonVariant;
    onPress?: () => void;
  };
}

// ─── Config Builder Function ───────────────────────────────────────────────────
export const BuildActionConfig = (
  params: ActionConfigParams,
): ActionPageConfig[] => {
  const { symbol, convertFromUSD } = useFiat();
  return [
    {
      label: "Buy",
      title: `Buy ${params.buyOutputSymbol}`,
      desc: "Create a quote before confirming with PIN.",
      inputAmount: params.buyAmount,
      onInputChange: params.setBuyAmount,
      inputDetail: {
        title: "You pay",
        currency: "USDT",
        onPress: undefined,
      },
      staticDetail: {
        title: "You receive",
        body: params.buyReceiveFormatted,
        currency: params.buyOutputSymbol,
        onPress: undefined,
      },
      meta: [
        {
          label: "Available",
          value: `${formatAmount(params.portfolioValue)} USDT`,
        },
        {
          label: "Estimated rate",
          value: `1 ${params.buyOutputSymbol} = ${formatAmount(params.buyPriceUsd)} USDT`,
        },
        {
          label: "Verification limit",
          value: `${symbol} ${formatAmount(convertFromUSD(params.limits?.tradePerTransactionUsd || 0))}`,
          valueColor: Colors.primaryClean,
        },
      ],
      cta: {
        label: params.isBuyInsufficient ? "Insufficient Balance" : "Get quote",
        variant: "primary",
        onPress: params.isBuyInsufficient ? undefined : params.pushQuote,
      },
    },
    {
      label: "Sell",
      title: `Sell ${params.sellInputSymbol}`,
      desc: "Preview rate and fees before execution.",
      inputAmount: params.sellAmount,
      onInputChange: params.setSellAmount,
      inputDetail: {
        title: "You sell",
        currency: params.sellInputSymbol,
        onPress: undefined,
      },
      staticDetail: {
        title: "You receive",
        body: params.sellReturns.toFixed(2),
        currency: "USDT",
        onPress: undefined,
      },
      meta: [
        {
          label: "Available",
          value: `${formatAmount(params.assetAvailable)} ${params.sellInputSymbol}`, // Update with real wallet balance hook later
        },
        {
          label: "Fee estimate",
          value: `${formatAmount(params.sellFee)} USDT`,
        },
        {
          label: "Receive after fees",
          value: `${formatAmount(params.sellReturns - params.sellFee)} USDT`,
        },
      ],
      cta: {
        label: params.isSellInsufficient ? "Insufficient Balance" : "Get quote",
        variant: "red",
        // Wired to pushQuote, but disabled if funds are low
        onPress: params.isSellInsufficient ? undefined : params.pushQuote,
      },
    },
    {
      label: "Swap",
      title: "Swap assets",
      desc: "Convert one supported coin into another.",
      inputAmount: params.swapAmount,
      onInputChange: params.setSwapAmount,
      inputDetail: {
        title: "From",
        currency: params.swapInputSymbol,
        onPress: () => params.openAssetPicker("swapInput"),
      },
      staticDetail: {
        title: "To",
        body: params.swapReturnsFormatted,
        currency: params.swapOutputSymbol,
        onPress: () => params.openAssetPicker("swapOutput"),
      },
      meta: [
        {
          label: "Route",
          value: `${params.swapInputSymbol} → USDT → ${params.swapOutputSymbol}`,
        },
        {
          label: "Fee estimate",
          value: `${symbol} ${formatAmount(convertFromUSD(4.84))}`, // Update to dynamic fees later
        },
        {
          label: "Quote expires",
          value: "30 seconds",
        },
      ],
      cta: {
        label: params.isSwapInsufficient
          ? "Insufficient Balance"
          : "Preview swap",
        variant: "primary",
        // Wired to pushQuote, but disabled if funds are low
        onPress: params.isSwapInsufficient ? undefined : params.pushQuote,
      },
    },
  ];
};
