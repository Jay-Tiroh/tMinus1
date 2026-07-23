import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import { LogOutBtn } from "@/features/auth";
import { useNotificationsQuery } from "@/features/notifications";
import ErrorState from "@/shared/components/ErrorComponent";
import { ModalSelector } from "@/shared/components/OptionPicker";
import { Spacer } from "@/shared/components/Spacer";
import Template from "@/shared/components/Template";
import { ThemedText } from "@/shared/components/ThemedText";
import { showInfoToast } from "@/shared/hooks/showToast";
import { useBackToHome } from "@/shared/hooks/useBackToHome";
import { applyUpdate, checkForUpdate } from "@/shared/hooks/useUpdates";
import { Href, useRouter } from "expo-router";
import * as Updates from "expo-updates";
import React from "react";
import { Alert, Image, View } from "react-native";
import { useGetPriceAlertsQuery } from "../api/priceAlertsApi";
import { ListItem } from "../components/ListItem";
import useOtherSettings from "../hooks/useOtherSettings";
import useProfile from "../hooks/useProfile";
import { FIAT_CURRENCIES, FiatCurrency } from "../types/profile";

const ProfileScreen = () => {
  useBackToHome();
  const route: Href[] = [
    "/user/edit-profile",
    "/user/security",
    "/user/price-alerts",
    "/(tabs)/home/notifications",
    "/(tabs)/markets/watchlist",
  ];
  const router = useRouter();

  const { user, kycStatus } = useProfile();
  const fullName = user?.fullName ?? "User123";
  const initials = fullName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase();

  const { data: notifications, refetch: refetchNotifs } =
    useNotificationsQuery();
  const unreadCount = notifications?.meta?.unread ?? 0;
  const {
    data: priceAlerts,
    isError,
    refetch: refetchAlerts,
  } = useGetPriceAlertsQuery();
  const activeAlerts = priceAlerts?.meta?.active ?? [];

  const {
    changeFiatCurrency,
    settings,
    refetch: refetchOtherSettings,
  } = useOtherSettings();
  const [isModalVisible, setModalVisible] = React.useState(false);
  const [selectedCurrency, setSelectedCurrency] = React.useState<FiatCurrency>(
    settings?.fiatCurrency ?? "USD",
  );
  const [isCheckingUpdate, setIsCheckingUpdate] = React.useState(false);

  const handleRefetch = () => {
    refetchNotifs();
    refetchAlerts();
    refetchOtherSettings();
  };

  const handleCurrencySelect = (currency: FiatCurrency) => {
    setSelectedCurrency(currency);
    changeFiatCurrency(currency);
    setModalVisible(false);
  };

  const currentFiat = FIAT_CURRENCIES.find(
    (currency) => currency.value === selectedCurrency,
  );

  const handleCheckForUpdate = async () => {
    setIsCheckingUpdate(true);
    try {
      const update = await checkForUpdate();

      if (!update) {
        showInfoToast({
          title: "You're up to date",
          message: "No new updates are available right now.",
        });
        return;
      }

      Alert.alert(
        "Update available",
        "A new version of tMinus1 is ready to install. Restart now to apply it?",
        [
          { text: "Later", style: "cancel" },
          { text: "Restart", onPress: applyUpdate },
        ],
      );
    } finally {
      setIsCheckingUpdate(false);
    }
  };

  const menuItems = [
    {
      title: "Fiat currency",
      subtitle: `${currentFiat?.label} (${currentFiat?.description})`,
      onPress: () => {
        setModalVisible(true);
      },
      trailing: "Change",
    },
    {
      title: "Edit profile",
      subtitle: "Name, email, phone",
      onPress: () => {
        router.replace(route[0]);
      },
    },
    {
      title: "Security",
      subtitle: "2FA, PIN, recovery codes",
      onPress: () => {
        router.replace(route[1]);
      },
    },
    {
      title: "Price alerts",
      subtitle: activeAlerts + " active alerts",
      trailing: `${activeAlerts}`,
      onPress: () => {
        router.replace(route[2]);
      },
    },
    {
      title: "Notifications",
      subtitle: unreadCount + " unread messages",
      trailing: `${unreadCount}`,
      onPress: () => {
        router.replace(route[3]);
      },
    },
    {
      title: "Watchlist",
      subtitle: "BTC, ETH, SOL",
      onPress: () => {
        router.replace(route[4]);
      },
    },
    {
      title: "Check for updates",
      subtitle: isCheckingUpdate
        ? "Checking..."
        : `Version ${Updates.runtimeVersion ?? "1.0.0"}`,
      trailing: isCheckingUpdate ? "..." : "Check",
      onPress: handleCheckForUpdate,
    },
  ];

  return (
    <Template
      textBlockProps={{ title: "Profile", body: "" }}
      ctaProps={undefined}
      topSpacerSize={32}
      refetch={handleRefetch}
    >
      <View style={GeneralStyles.wrapper}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              backgroundColor: Colors.primary,
              position: "relative",
            }}
          >
            <ThemedText size={32} weight="bold" color={Colors.backgroundInk}>
              {initials}
            </ThemedText>
            {user?.avatarUrl && (
              <Image
                source={{
                  uri: user?.avatarUrl,
                }}
                width={72}
                height={72}
                style={{ position: "absolute", top: 0, left: 0 }}
              />
            )}
          </View>

          <View style={{ gap: 4 }}>
            <ThemedText size={20} weight="bold" color={Colors.white}>
              {fullName}
            </ThemedText>
            <ThemedText size={14} color={Colors.textMidGray}>
              {user?.email || ""}
            </ThemedText>
            <View
              style={{
                backgroundColor: Colors.surfaceNavy,
                paddingVertical: 4,
                paddingHorizontal: 12,
                borderRadius: 12,
                alignSelf: "flex-start",
                marginTop: 4,
              }}
            >
              <ThemedText
                size={12}
                weight="bold"
                color={
                  kycStatus === "approved"
                    ? Colors.primaryClean
                    : kycStatus === "pending"
                      ? Colors.warningAmber
                      : Colors.loss
                }
              >
                {kycStatus === "approved"
                  ? "Verified"
                  : kycStatus === "pending"
                    ? "Pending"
                    : "Not Verified"}
              </ThemedText>
            </View>
          </View>
        </View>

        <Spacer size={40} />

        {isError ? (
          <ErrorState onRetry={handleRefetch} />
        ) : (
          <View style={{ gap: 12 }}>
            {menuItems.map((item, index) => (
              <ListItem
                key={index}
                title={item.title}
                subtitle={item.subtitle}
                trailingText={item.trailing}
                iconColor={Colors.primaryClean}
                onPress={item.onPress}
              />
            ))}
          </View>
        )}
      </View>
      <Spacer size={40} />
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <LogOutBtn />
      </View>

      <ModalSelector
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        title="Pick a fiat currency"
        data={FIAT_CURRENCIES}
        selected={selectedCurrency}
        handleSelect={handleCurrencySelect}
      />
    </Template>
  );
};

export default ProfileScreen;
