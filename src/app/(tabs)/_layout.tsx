import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { TABS, TabBarColors, TabBarStyle } from "@/constants/TabsConfig";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SvgProps } from "react-native-svg";

/**
 * All tab appearance is driven by TabsConfig.ts.
 * The only thing you change here is how icons are rendered —
 * swap the renderIcon() call to match your icon library.
 */

// ── Swap this function for your actual icon component ──────────────────────
// Example shown uses a placeholder. Replace with Phosphor, Lucide, custom SVG etc.
function renderIcon(Icon: React.FC<SvgProps>, focused: boolean) {
  return (
    <Icon
      color={focused ? Colors.primary : Colors.textMuted}
      style={{
        width: 24,
        height: 24,
        boxShadow: focused ? "0 5px 16px rgba(94, 213, 168, .25)" : undefined,
      }}
    />
  );
}
// ──────────────────────────────────────────────────────────────────────────

export default function TabsLayout() {
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
        />
      ))}
    </Tabs>
  );
}
