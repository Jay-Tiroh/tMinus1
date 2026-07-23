import { GeneralStyles } from "@/constants/themes";
import { KycLocked } from "@/features/kyc";
import { BalanceComponent } from "@/features/wallets";
import { Spacer } from "@/shared/components/Spacer";
import Template from "@/shared/components/Template";
import { ThemedButton } from "@/shared/components/ThemedButton";
import { useExitOnDoubleBack } from "@/shared/hooks/useExitOnDoubleBack";
import { Href, useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";

import { DashboardActionList } from "../components/DashboardActionList";
import { TrendingSection } from "../components/TrendingSection";
import { useHomeDashboard } from "../hooks/useHomeDashboard";

export const HomeScreen = () => {
  useExitOnDoubleBack();
  const router = useRouter();

  const {
    firstName,
    isVerified,
    trending,
    trendingLoading,
    trendingUninitialized,
    dashboardActions,
    handleRefetch,
  } = useHomeDashboard();

  return (
    <Template
      textBlockProps={{
        title: "Home",
        body: `Welcome back, ${firstName}`,
      }}
      ctaProps={undefined}
      refetch={handleRefetch}
    >
      <View style={GeneralStyles.wrapper}>
        {/* Balance Section */}
        <BalanceComponent />
        <Spacer size={24} />

        <KycLocked />

        {/* Primary Actions */}
        {isVerified && (
          <>
            <ThemedButton
              title="Deposit"
              variant="primary"
              onPress={() =>
                router.replace(
                  "/wallets/deposit/deposit-asset-selection" as Href,
                )
              }
            />
            <Spacer size={32} />

            {/* Config-Driven Action List */}
            <DashboardActionList actions={dashboardActions} />
            <Spacer size={24} />

            {/* Trending Section */}
            <TrendingSection
              trending={trending}
              trendingLoading={trendingLoading}
              trendingUninitialized={trendingUninitialized}
            />
          </>
        )}
      </View>
    </Template>
  );
};
