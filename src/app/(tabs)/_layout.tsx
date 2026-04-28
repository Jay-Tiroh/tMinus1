import { TABS, TabBarColors, TabBarStyle } from "@/constants/TabsConfig";
import { Tabs } from "expo-router";

/**
 * All tab appearance is driven by TabsConfig.ts.
 * The only thing you change here is how icons are rendered —
 * swap the renderIcon() call to match your icon library.
 */

// ── Swap this function for your actual icon component ──────────────────────
// Example shown uses a placeholder. Replace with Phosphor, Lucide, custom SVG etc.
function renderIcon(iconName: string, color: string, size = 24) {
  // e.g. with phosphor-react-native:
  // const Icon = PhosphorIcons[iconName];
  // return <Icon size={size} color={color} />;

  // Placeholder — replace this:
  return null;
}
// ──────────────────────────────────────────────────────────────────────────

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: TabBarStyle,
        tabBarActiveTintColor: TabBarColors.active,
        tabBarInactiveTintColor: TabBarColors.inactive,
        tabBarLabelStyle: {
          fontSize: TabBarColors.labelSize,
          fontFamily: "NeueMontreal-Medium",
        },
      }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.label,
            tabBarIcon: ({ color, focused }) =>
              renderIcon(focused ? tab.icon.active : tab.icon.inactive, color),
          }}
        />
      ))}
    </Tabs>
  );
}
