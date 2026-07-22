import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Add from "@/assets/icons/markets/add-circle.svg";

import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import { useWatchlist } from "@/features/markets";
import CandlestickComponent from "@/features/trades/components/CandlestickComponent";
import { useAssetRoute } from "@/features/trades/hooks/useAssetRoute";
import useProfile from "@/features/user/hooks/useProfile";
import { formatCompactNumber, formatCurrency } from "@/helpers/functions";
import { useAssetChart } from "@/hooks/useAssetChart";
import { useSafeBottom } from "@/hooks/useSafeBottom";
import { Spacer } from "@/shared/components/Spacer";
import TextBlock from "@/shared/components/TextBlock";
import { ThemedButton } from "@/shared/components/ThemedButton";
import { ThemedText } from "@/shared/components/ThemedText";
import { showErrorToast, showSuccessToast } from "@/shared/hooks/showToast";
import { useBackToHome } from "@/shared/hooks/useBackToHome";
import useFiat from "@/shared/hooks/useFiat";
import { getErrorMessage } from "@/utils/errors";
import { ms, s, vs } from "@/utils/responsive";

import ChangeText from "@/shared/components/ChangeText";
import { CryptoIcon } from "@/shared/components/CryptoIcon";
import KycLocked from "@/shared/components/KycLocked";
import { AssetActionButtons } from "../components/AssetActionButtons";
import { AssetStatsGrid } from "../components/AssetStatsGrid";

export const AssetScreen = () => {
  useBackToHome();
  const params = useLocalSearchParams<{ asset?: string }>();
  const asset = params.asset ?? "BTC";
  const { coinInfo: coinDetails, refetch: refetchAsset } = useAssetChart(
    asset as string,
    false,
    15000,
  );

  const insets = useSafeAreaInsets();
  const bottomPadding = useSafeBottom();
  const { push } = useAssetRoute();
  const { symbol, convertFromUSD } = useFiat();

  const actionConfig = [
    {
      title: "Sell",
      onPress: () => {
        push("action", { action: "Sell", asset });
      },
    },
    {
      title: "Swap",
      onPress: () => {
        push("action", { action: "Swap", asset });
      },
    },
    {
      title: "Alert",
      onPress: () => {
        push("alert", { asset });
      },
    },
  ];

  const stats = [
    {
      name: "Market cap",
      value:
        symbol +
        formatCompactNumber(
          convertFromUSD(coinDetails?.stats?.marketCapUsd ?? NaN),
        ),
    },
    {
      name: "24h volume",
      value:
        symbol +
        formatCompactNumber(
          convertFromUSD(coinDetails?.stats?.volume24hUsd ?? NaN),
        ),
    },
    {
      name: "24h high",
      value:
        symbol +
        formatCompactNumber(
          convertFromUSD(coinDetails?.stats?.high24hUsd ?? NaN),
        ),
    },
    {
      name: "Circulating",
      value:
        formatCompactNumber(coinDetails?.stats?.circulatingSupply ?? NaN) +
        ` ${(coinDetails?.symbol ?? "").toUpperCase()}`,
    },
  ];

  const {
    addToWatchlist,
    isAdding,
    isInWatchlist,
    refetch: refetchWatchlist,
  } = useWatchlist();
  const inWatchlist = isInWatchlist(coinDetails?.symbol as string);

  const onAdd = async () => {
    try {
      await addToWatchlist(coinDetails?.symbol as string).unwrap();
      showSuccessToast({
        title: "Added to Watchlist",
        message: `${coinDetails?.name} added.`,
      });
    } catch (error) {
      showErrorToast({
        title: "Action Failed",
        message: getErrorMessage(error, `Couldn't add ${coinDetails?.name}.`),
      });
    }
  };

  const { kycStatus } = useProfile();
  const isVerified = kycStatus === "approved";
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([refetchAsset(), refetchWatchlist()]);
    setIsRefreshing(false);
  }, [refetchAsset, refetchWatchlist]);

  return (
    <ImageBackground
      source={require("@/assets/images/new-bg.png")}
      style={[GeneralStyles.container, { width: "100%" }]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: bottomPadding + vs(50),
          width: "100%",
          gap: vs(16),
          paddingTop: insets.top + vs(24),
        }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
            progressBackgroundColor={Colors.backgroundDark}
          />
        }
      >
        <View style={[GeneralStyles.wrapper, styles.headerRow]}>
          <View style={{ gap: vs(8) }}>
            <TextBlock
              title={coinDetails?.name}
              body={`${coinDetails?.symbol} · ${coinDetails?.network} network`}
            />
            <CryptoIcon symbol={coinDetails?.symbol ?? "btc"} size={ms(42)} />
          </View>
          <View style={styles.actionRow}>
            <Pressable
              hitSlop={10}
              onPress={() => push("order-book", { asset })}
            >
              <MaterialCommunityIcons
                name="notebook-outline"
                size={ms(24)}
                color={Colors.primaryClean}
              />
            </Pressable>
            <Pressable
              hitSlop={10}
              onPress={() => push("recent-trades", { asset })}
            >
              <MaterialCommunityIcons
                name="handshake-outline"
                size={ms(24)}
                color={Colors.primaryClean}
              />
            </Pressable>
          </View>
        </View>

        <View style={[GeneralStyles.wrapper, styles.priceContainer]}>
          <ThemedText size={32} weight="bold" color={"#fff"}>
            {symbol +
              formatCurrency(convertFromUSD(coinDetails?.priceUsd as number))}
          </ThemedText>
          <ChangeText change={coinDetails?.change24h ?? 0} />
        </View>

        <View style={GeneralStyles.wrapper}>
          <CandlestickComponent
            change24h={coinDetails?.change24h ?? 0}
            priceUsd={coinDetails?.priceUsd as number}
            symbol={coinDetails?.symbol ?? "btc"}
          />
        </View>

        {isVerified && (
          <>
            <View style={GeneralStyles.wrapper}>
              <ThemedButton
                title="Buy"
                variant="primary"
                onPress={() => push("action", { action: "Buy", asset })}
              />
            </View>

            <AssetActionButtons actions={actionConfig} />

            <AssetStatsGrid stats={stats} />
          </>
        )}

        {!inWatchlist && (
          <View style={GeneralStyles.wrapper}>
            <ThemedButton
              title="Add to watchlist"
              style={styles.dashedButton}
              textStyle={{ color: Colors.textMidGray }}
              iconComponent={isAdding ? <ActivityIndicator /> : <Add />}
              onPress={onAdd}
            />
          </View>
        )}
        <KycLocked />
        <Spacer size={24} />
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: s(20),
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dashedButton: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: Colors.textCool,
    backgroundColor: Colors.backgroundDark,
  },
});
