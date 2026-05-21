import AddCircle from "@/assets/icons/markets/add-circle.svg";
import CoinList from "@/components/CoinList";
import Switcher from "@/components/markets/Switcher";
import { Spacer } from "@/components/Spacer";
import { ThemedButton } from "@/components/ThemedButton";
import { Colors } from "@/constants/Colors";
import { useAllAssets } from "@/hooks/useAllAssets";
import { useSafeBottom } from "@/hooks/useSafeBottom";
import React, { memo, useCallback, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const TABS = ["Convert", "Spot", "Margin", "Fiat"] as const;
type Tab = (typeof TABS)[number];

interface TabPageProps {
  tab: Tab;
  isVisited: boolean;
  coins: ReturnType<typeof useAllAssets>["coins"];
}

const TabPage = memo(function TabPage({ isVisited, coins }: TabPageProps) {
  return (
    <View style={styles.tabPage}>
      {isVisited && (
        <CoinList
          data={coins}
          coinItemConfig={{ showChange: true, showChart: true }}
          contentContainerStyle={{ paddingTop: 12 }}
        />
      )}
    </View>
  );
});

const TABS_ARRAY = [...TABS];

const MarketsScreen = () => {
  const bottomPadding = useSafeBottom();
  const flatListRef = useRef<FlatList<Tab>>(null);
  const [activeTab, setActiveTab] = useState<Tab>("Convert");
  const [visitedTabs, setVisitedTabs] = useState<Set<Tab>>(
    new Set(["Convert"]),
  );
  const { coins } = useAllAssets();

  const handleTabPress = useCallback((tab: string) => {
    const t = tab as Tab;
    const index = TABS.indexOf(t);
    setActiveTab(t);
    setVisitedTabs((prev) => new Set(prev).add(t));
    flatListRef.current?.scrollToIndex({ index, animated: true });
  }, []);

  const handleMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
      const tab = TABS[index];
      setActiveTab(tab);
      setVisitedTabs((prev) => new Set(prev).add(tab));
    },
    [],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Tab>) => (
      <TabPage tab={item} isVisited={visitedTabs.has(item)} coins={coins} />
    ),
    [visitedTabs, coins],
  );

  const getItemLayout = useCallback(
    (_: ArrayLike<Tab> | null | undefined, index: number) => ({
      length: SCREEN_WIDTH,
      offset: SCREEN_WIDTH * index,
      index,
    }),
    [],
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
      <FlatList
        ref={flatListRef}
        data={TABS_ARRAY}
        renderItem={renderItem}
        keyExtractor={(item) => item}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        getItemLayout={getItemLayout}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        windowSize={3}
        style={styles.pager}
        contentContainerStyle={styles.pagerContent}
      />
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

export default MarketsScreen;

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
  pager: {
    flex: 1,
    width: SCREEN_WIDTH,
  },
  pagerContent: {
    flexGrow: 1,
  },
  tabPage: {
    width: SCREEN_WIDTH,
    flex: 1,
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
