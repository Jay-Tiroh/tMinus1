import Btc from "@/assets/icons/home/coin/btc.svg";
import Cardano from "@/assets/icons/home/coin/cardano.svg";
import Chainlink from "@/assets/icons/home/coin/chainlink.svg";
import Mft from "@/assets/icons/home/coin/mft.svg";
import Ren from "@/assets/icons/home/coin/ren.svg";
import ShibaInu from "@/assets/icons/home/coin/shiba-inu.svg";

import { SvgProps } from "react-native-svg";

export type Coin = {
  name: string;
  alias: string;
  amount: number;
  amountInUsd?: number;
  change?: number;
  icon: React.FC<SvgProps>;
};

export const Coins: Coin[] = [
  {
    name: "Bitcoin",
    alias: "BTC",
    amount: 32697.05,
    amountInUsd: 468554.23,
    change: 0.81,
    icon: Btc,
  },
  {
    name: "Chainlink",
    alias: "LINK",
    amount: 32697.05,
    amountInUsd: 468554.23,
    change: -0.81,
    icon: Chainlink,
  },
  {
    name: "Cardano",
    alias: "ADA",
    amount: 32697.05,
    amountInUsd: 468554.23,
    change: 0.81,
    icon: Cardano,
  },
  {
    name: "SHIBA INU",
    alias: "SHIB",
    amount: 32697.05,
    amountInUsd: 468554.23,
    change: -0.81,
    icon: ShibaInu,
  },
  {
    name: "HIFI",
    alias: "MFT",
    amount: 32697.05,
    amountInUsd: 468554.23,
    change: -0.81,
    icon: Mft,
  },
  {
    name: "REN",
    alias: "REN",
    amount: 32697.05,
    amountInUsd: 468554.23,
    change: 0.81,
    icon: Ren,
  },
];
