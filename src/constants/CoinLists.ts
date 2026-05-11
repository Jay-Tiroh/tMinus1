import Btc from "@/assets/icons/home/coin/btc.svg";
import Mft from "@/assets/icons/home/coin/mft.svg";
import Ren from "@/assets/icons/home/coin/ren.svg";
import Sol from "@/assets/icons/home/coin/sol.svg";

import { SvgProps } from "react-native-svg";

export type Coin = {
  name: string;
  symbol: React.FC<SvgProps>;
  price: number;
  change: number;
};

export const RecentCoins: Coin[] = [
  {
    name: "BTC/BUSD",
    symbol: Btc,
    price: 40059.83,
    change: 0.81,
  },
  {
    name: "SOL/BUSD",
    symbol: Sol,
    price: 2059.83,
    change: -0.81,
  },
  {
    name: "MFT/BUSD",
    symbol: Mft,
    price: 40059.83,
    change: 0.81,
  },
  {
    name: "REN/BUSD",
    symbol: Ren,
    price: 2059.83,
    change: -0.81,
  },
];
