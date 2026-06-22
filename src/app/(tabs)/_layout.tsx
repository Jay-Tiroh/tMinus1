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
            tabBarIcon: ({ color, focused }) => renderIcon(tab.icon, focused),
            headerShown: false,
          }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              navigation.navigate(tab.name, {
                screen: tab.initialRoute,
                ...(tab.initialParams ? { params: tab.initialParams } : {}),
              });
            },
          })}
        />
      ))}
    </Tabs>
  );
}
