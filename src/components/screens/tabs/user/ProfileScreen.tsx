import { Spacer } from "@/components/Spacer";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import Template from "@/components/trades/Template";
import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import { Href, useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";

const ProfileScreen = () => {
  const route: Href[] = [
    "/user/edit-profile",
    "/user/security",
    "/user/price-alerts",
    "/(tabs)/home/notifications",
    "/(tabs)/markets/watchlist",
  ];
  const router = useRouter();
  const menuItems = [
    {
      title: "Edit profile",
      subtitle: "Name, email, phone",
      onPress: () => {
        router.push(route[0]);
      },
    },
    {
      title: "Security",
      subtitle: "2FA, PIN, recovery codes",
      onPress: () => {
        router.push(route[1]);
      },
    },
    {
      title: "Price alerts",
      subtitle: "3 active alerts",
      trailing: "3",
      onPress: () => {
        router.push(route[2]);
      },
    },
    {
      title: "Notifications",
      subtitle: "2 unread messages",
      trailing: "2",
      onPress: () => {
        router.push(route[3]);
      },
    },
    {
      title: "Watchlist",
      subtitle: "BTC, ETH, SOL",
      onPress: () => {
        router.push(route[4]);
      },
    },
  ];

  return (
    <Template
      textBlockProps={{ title: "Profile", body: "" }}
      ctaProps={undefined}
      topSpacerSize={32}
    >
      <View style={GeneralStyles.wrapper}>
        {/* User Header */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: Colors.primary,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ThemedText size={32} weight="bold" color={Colors.backgroundInk}>
              A
            </ThemedText>
          </View>
          <View style={{ gap: 4 }}>
            <ThemedText size={20} weight="bold" color={Colors.white}>
              Ada Student
            </ThemedText>
            <ThemedText size={14} color={Colors.textMidGray}>
              student@cryptoclass.test
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
              <ThemedText size={12} weight="bold" color={Colors.primaryClean}>
                Verified
              </ThemedText>
            </View>
          </View>
        </View>

        <Spacer size={40} />

        {/* Menu Items */}
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

        <Spacer size={40} />

        {/* Logout Button */}
        <ThemedButton title="Logout" variant="secondary" />
      </View>
    </Template>
  );
};

// Reusable List Item Component for these screens
export const ListItem = ({
  title,
  subtitle,
  trailingText,
  iconColor,
  onPress,
}: {
  title: string;
  subtitle: string;
  trailingText?: string;
  iconColor: string;
  onPress?: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      GeneralStyles.box,
      {
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
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
      <ThemedText size={14} weight="bold" color={Colors.primaryClean}>
        {trailingText}
      </ThemedText>
    )}
  </TouchableOpacity>
);

export default ProfileScreen;
