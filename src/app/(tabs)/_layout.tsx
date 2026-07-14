import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { TABS, TabBarColors, TabBarStyle } from "@/constants/TabsConfig";
import { usePushRegistration } from "@/hooks/usePushRegistration";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SvgProps } from "react-native-svg";

function renderIcon(Icon: React.FC<SvgProps>, focused: boolean) {
  return (
    <Icon
      color={focused ? Colors.primary : Colors.textMuted}
      style={{
        width: 24,
        height: 24,
        // boxShadow: focused ? "0 5px 16px rgba(94, 213, 168, .25)" : undefined,
      }}
      width={24}
      height={24}
    />
  );
}
// ──────────────────────────────────────────────────────────────────────────

export default function TabsLayout() {
  usePushRegistration();
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          ...TabBarStyle,
          bottom: insets.bottom + 10,
        },
        tabBarActiveTintColor: TabBarColors.active,
        tabBarInactiveTintColor: TabBarColors.inactive,
        tabBarLabelStyle: {
          fontSize: TabBarColors.labelSize,
          fontFamily: Fonts.regular,
        },
        tabBarBackground: () => null,
      }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.label,
            tabBarIcon: ({  focused }) => renderIcon(tab.icon, focused),
            headerShown: false,
          }}
          // TabsLayout.tsx

          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();

              if (tab.name === "trades") {
                navigation.navigate("trades", {
                  screen: "[asset]",
                  params: { asset: "BTC", screen: "asset" },
                });
              } else {
                navigation.navigate(tab.name, {
                  screen: tab.initialRoute ?? "index",
                });
              }
            },
          })}
        />
      ))}
    </Tabs>
  );
}
