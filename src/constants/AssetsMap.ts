import { FC } from "react";
import { SvgProps } from "react-native-svg";

// Import all SVG assets (assuming lowercase filenames)
import ADA from "@/assets/icons/coin/ada.svg";
import AVAX from "@/assets/icons/coin/avax.svg";
import BNB from "@/assets/icons/coin/bnb.svg";
import BTC from "@/assets/icons/coin/btc.svg";
import DOGE from "@/assets/icons/coin/doge.svg";
import DOT from "@/assets/icons/coin/dot.svg";
import ETH from "@/assets/icons/coin/eth.svg";
import LINK from "@/assets/icons/coin/link.svg";
import LTC from "@/assets/icons/coin/ltc.svg";
import MATIC from "@/assets/icons/coin/matic.svg";
import SOL from "@/assets/icons/coin/sol.svg";
import TRX from "@/assets/icons/coin/trx.svg";
import USDC from "@/assets/icons/coin/usdc.svg";
import USDT from "@/assets/icons/coin/usdt.svg";
import XRP from "@/assets/icons/coin/xrp.svg";

// Export as a mapping object using ES6 shorthand property names
export const CoinIcons: Record<string, FC<SvgProps>> = {
  ADA,
  AVAX,
  BNB,
  BTC,
  DOGE,
  DOT,
  ETH,
  LINK,
  LTC,
  MATIC,
  SOL,
  TRX,
  USDC,
  USDT,
  XRP,
};
