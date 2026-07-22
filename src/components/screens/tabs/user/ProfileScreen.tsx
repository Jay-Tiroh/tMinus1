import ErrorState from "@/components/ErrorComponent";
import LogOutBtn from "@/components/LogOutBtn";
import { ModalSelector } from "@/components/OptionPicker";
import { Spacer } from "@/shared/components/Spacer";
import { ThemedText } from "@/shared/components/ThemedText";
import Template from "@/shared/components/Template";
import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import { useNotificationsQuery } from "@/features/notifications/api/notificationsApi";
import { useBackToHome } from "@/hooks/useBackToHome";
import useOtherSettings from "@/hooks/useOtherSettings";
import useProfile from "@/hooks/useProfile";
import { useGetPriceAlertsQuery } from "@/store/services/priceAlertsApi";
import { FIAT_CURRENCIES, FiatCurrency } from "@/types/profile";
import { Href, useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, View } from "react-native";

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
  ];

  return (
    <Template
      textBlockProps={{ title: "Profile", body: "" }}
      ctaProps={undefined}
      topSpacerSize={32}
      refetch={handleRefetch}
    >
      <View style={GeneralStyles.wrapper}>
        {/* User Header */}
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
                backgroundColor: Colors.surfaceNavy, // Adjust to your dark green tint
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

        {/* Menu Items */}
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

// Reusable List Item Component for these screens
export const ListItem = ({
  title,
  subtitle,
  trailingText,
  trailingTextColor,
  iconColor,
  onPress,
  onLongPress,
}: {
  title: string;
  subtitle: string;
  trailingText?: string;
  trailingTextColor?: string;
  iconColor: string;
  onPress?: () => void;
  onLongPress?: () => void;
}) => (
  <Pressable
    onPress={onPress}
    onLongPress={onLongPress}
    style={[
      GeneralStyles.box,
      {
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flex: 1,
      },
    ]}
  >
    <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: iconColor,
        }}
      />
      <View style={{ gap: 4 }}>
        <ThemedText size={16} weight="bold" color={Colors.white}>
          {title}
        </ThemedText>
        <ThemedText size={12} color={Colors.textMidGray}>
          {subtitle}
        </ThemedText>
      </View>
    </View>
    {trailingText && (
      <ThemedText
        size={14}
        weight="bold"
        color={trailingTextColor ?? Colors.primaryClean}
      >
        {trailingText}
      </ThemedText>
    )}
  </Pressable>
);

export default ProfileScreen;
