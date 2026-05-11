import DepositIcon from "@/assets/icons/home/deposit.svg";
import GridTradingIcon from "@/assets/icons/home/grid-trading.svg";
import LaunchpadIcon from "@/assets/icons/home/launchpad.svg";
import LiquidSwapIcon from "@/assets/icons/home/liquid-swap.svg";
import MarginIcon from "@/assets/icons/home/margin.svg";
import ReferralIcon from "@/assets/icons/home/referral.svg";
import SavingsIcon from "@/assets/icons/home/savings.svg";
import { SvgProps } from "react-native-svg";

type GridItem = {
  name: string;
  icon: React.FC<SvgProps>;
};

export const GridItems: GridItem[] = [
  { name: "Deposit", icon: DepositIcon },
  { name: "Referral", icon: ReferralIcon },
  { name: "Grid Trading", icon: GridTradingIcon },
  { name: "Margin", icon: MarginIcon },
  { name: "Launchpad", icon: LaunchpadIcon },
  { name: "Savings", icon: SavingsIcon },
  { name: "Liquid Swap", icon: LiquidSwapIcon },
];
