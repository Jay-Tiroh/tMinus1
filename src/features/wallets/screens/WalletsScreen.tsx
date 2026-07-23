import { GeneralStyles } from "@/constants/themes";
import ActionTabs from "@/features/wallets/components/ActionTabs";
import Balance from "@/features/wallets/components/Balance";
import CryptoAssetItem from "@/features/wallets/components/CryptoAssetItem";
import KycLocked from "@/shared/components/KycLocked";
import { Spacer } from "@/shared/components/Spacer";
import Template from "@/shared/components/Template";
import { useBackToHome } from "@/shared/hooks/useBackToHome";
import { formatAmount } from "@/shared/utils/formatCurrency";
import React from "react";
import { View } from "react-native";
import { RecentTransactions } from "../components/RecentTransactions";
import { useWalletDashboard } from "../hooks/useWalletDashboard";

export const WalletsScreen = () => {
  useBackToHome();
  const { isVerified, dashboardAssets, fiatSymbol, handleRefresh } =
    useWalletDashboard();

  return (
    <Template
      textBlockProps={{
        title: "Wallet",
        body: "Aggregated in USD from active asset balances.",
      }}
      ctaProps={undefined}
      refetch={handleRefresh}
    >
      <View style={GeneralStyles.wrapper}>
        <Balance />
      </View>
      <Spacer size={32} />

      {isVerified && (
        <>
          <View style={GeneralStyles.wrapper}>
            <ActionTabs />
          </View>
          <Spacer size={32} />
        </>
      )}

      <View style={[GeneralStyles.wrapper, { gap: 10 }]}>
        {dashboardAssets.map((coin) => (
          <CryptoAssetItem
            key={coin.id}
            iconSymbol={coin.symbol}
            leftTitle={coin.name}
            leftBody={coin.symbol}
            rightTitle={`${fiatSymbol}${formatAmount(coin.fiatValue)}`}
            rightBody={`${formatAmount(coin.availableBalance)} ${coin.symbol}`}
          />
        ))}
      </View>

      <Spacer size={32} />

      <View style={GeneralStyles.wrapper}>
        <RecentTransactions />
      </View>

      <View style={GeneralStyles.wrapper}>
        <KycLocked />
      </View>
    </Template>
  );
};
