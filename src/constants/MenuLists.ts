import ConvertIcon from "@/assets/icons/home/convert.svg";
import CryptoLoansIcon from "@/assets/icons/home/crypto-loans.svg";
import DepositIcon from "@/assets/icons/home/deposit.svg";
import ETH2Icon from "@/assets/icons/home/eth.svg";
import GridTradingIcon from "@/assets/icons/home/grid-trading.svg";
import LaunchpadIcon from "@/assets/icons/home/launchpad.svg";
import LiquidSwapIcon from "@/assets/icons/home/liquid-swap.svg";
import MarginIcon from "@/assets/icons/home/margin.svg";
import OrdersIcon from "@/assets/icons/home/orders.svg";
import PayIcon from "@/assets/icons/home/pay.svg";
import PoolIcon from "@/assets/icons/home/pool.svg";
import ReferralIcon from "@/assets/icons/home/referral.svg";
import SavingsIcon from "@/assets/icons/home/savings.svg";
import SpotIcon from "@/assets/icons/home/spot.svg";
import StakingIcon from "@/assets/icons/home/staking.svg";
import TransferIcon from "@/assets/icons/home/transfer.svg";
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

export const CommonList: GridItem[] = [
  { name: "Transfer", icon: TransferIcon },
  { name: "Deposit", icon: DepositIcon },
  { name: "Orders", icon: OrdersIcon },
  { name: "Referral", icon: ReferralIcon },
];

export const TradeList: GridItem[] = [
  { name: "Convert", icon: ConvertIcon },
  { name: "Spot", icon: SpotIcon },
  { name: "Margin", icon: MarginIcon },
  { name: "Grid Trading", icon: GridTradingIcon },
  { name: "Liquid Swap", icon: LiquidSwapIcon },
];

export const FinanceList: GridItem[] = [
  { name: "Savings", icon: SavingsIcon },
  { name: "Staking", icon: StakingIcon },
  { name: "Pay", icon: PayIcon },
  { name: "Crypto Loans", icon: CryptoLoansIcon },
  { name: "Pool", icon: PoolIcon },
  { name: "ETH 2.0", icon: ETH2Icon },
  { name: "Launchpad", icon: LaunchpadIcon },
];
