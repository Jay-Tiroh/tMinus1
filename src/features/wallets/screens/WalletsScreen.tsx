import KycLocked from "@/components/KycLocked";
import { Spacer } from "@/shared/components/Spacer";
import Template from "@/shared/components/Template";
import ActionTabs from "@/components/wallets/ActionTabs";
import Balance from "@/components/wallets/Balance";
import CryptoAssetItem from "@/components/wallets/CryptoAssetItem";
import { GeneralStyles } from "@/constants/themes";
import { formatAmount } from "@/helpers/functions";
import { useBackToHome } from "@/hooks/useBackToHome";
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
