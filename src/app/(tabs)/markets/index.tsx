import AddCircle from "@/assets/icons/markets/add-circle.svg";
import CoinList from "@/components/CoinList";
import Switcher from "@/components/markets/Switcher";
import { Spacer } from "@/components/Spacer";
import { ThemedButton } from "@/components/ThemedButton";
import { Colors } from "@/constants/Colors";
import { useAllAssets } from "@/hooks/useAllAssets";
import { useSafeBottom } from "@/hooks/useSafeBottom";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const TABS = ["Convert", "Spot", "Margin", "Fiat"] as const;
type Tab = (typeof TABS)[number];

const Markets = () => {
  const bottomPadding = useSafeBottom();
  const scrollRef = useRef<ScrollView>(null);
  const [activeTab, setActiveTab] = useState<Tab>("Convert");
  const [visitedTabs, setVisitedTabs] = useState<Set<Tab>>(
    new Set(["Convert"]),
  );

  const { coins } = useAllAssets();

  const handleTabPress = useCallback((tab: string) => {
    setActiveTab(tab as Tab);
    setVisitedTabs((prev) => new Set(prev).add(tab as Tab));
    scrollRef.current?.scrollTo({
      x: TABS.indexOf(tab as Tab) * SCREEN_WIDTH,
      animated: true,
    });
  }, []);

  const handleMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const tab =
        TABS[Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH)];
      setActiveTab(tab);
      setVisitedTabs((prev) => new Set(prev).add(tab));
    },
    [],
  );

  const tabPages = useMemo(
    () =>
      TABS.map((tab) => (
        <View key={tab} style={styles.tabPage}>
          {visitedTabs.has(tab) ? (
            <CoinList
              data={coins}
              coinItemConfig={{ showChange: true, showChart: true }}
              contentContainerStyle={{ paddingTop: 12 }}
            />
          ) : null}
        </View>
      )),
    [visitedTabs, coins],
  );

  return (
    <View style={[styles.container, { paddingBottom: bottomPadding * 2 }]}>
      <View style={styles.switcherWrapper}>
        <Switcher
          tabs={TABS}
          activeTab={activeTab}
          onTabPress={handleTabPress}
        />
      </View>

      <Spacer size={40} />

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        contentContainerStyle={styles.scrollContent}
      >
        {tabPages}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <ThemedButton
          title="Add Favorite"
          icon={<AddCircle />}
          style={styles.button}
          textStyle={styles.buttonText}
        />
      </View>
    </View>
  );
};

export default Markets;

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
    flex: 1,
    alignItems: "center",
  },
  switcherWrapper: {
    width: "100%",
    paddingHorizontal: 24,
  },
  scrollContent: {
    flexGrow: 1,
  },
  tabPage: {
    width: SCREEN_WIDTH,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 10,
    paddingHorizontal: 24,
  },
  button: {
    backgroundColor: Colors.border + "1A",
    borderColor: Colors.border + "80",
    borderWidth: 2,
    borderStyle: "dotted",
    height: 60,
  },
  buttonText: {
    color: Colors.textMuted,
  },
});
