import AddCircle from "@/assets/icons/markets/add-circle.svg";
import CoinItem from "@/components/CoinItem";
import Loader from "@/components/Loader";
import { Spacer } from "@/components/Spacer";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { CoinIcons } from "@/constants/AssetsMap";
import { Colors } from "@/constants/Colors";
import { useSafeBottom } from "@/hooks/useSafeBottom";
import { useAllAssetsQuery } from "@/store/services/marketsApi";
import { Asset } from "@/types/assets";
import { LinearGradient } from "expo-linear-gradient";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Dimensions,
  FlatList,
  InteractionManager,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

// ─── Constants ────────────────────────────────────────────────────────────────

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const TABS = ["Convert", "Spot", "Margin", "Fiat"] as const;
type Tab = (typeof TABS)[number];

const TAB_ITEM_HEIGHT = 38;
const TAB_HEIGHT = 46;
const TAB_RADIUS = (TAB_HEIGHT / TAB_ITEM_HEIGHT) * 12;

// ─── Separator ────────────────────────────────────────────────────────────────

const Separator = () => (
  <View style={{ paddingVertical: 20 }}>
    <View
      style={{
        borderBottomWidth: 1,
        borderColor: Colors.border + "1A",
        width: "100%",
      }}
    />
  </View>
);

// ─── Switcher ─────────────────────────────────────────────────────────────────

type SwitcherProps = {
  tabs: readonly string[];
  activeTab: string;
  onTabPress: (tab: string) => void;
};

const Switcher = React.memo(function Switcher({
  tabs,
  activeTab,
  onTabPress,
}: SwitcherProps) {
  return (
    <View style={styles.tab}>
      {tabs.map((tab) => (
        <Pressable
          key={tab}
          onPress={() => onTabPress(tab)}
          style={[styles.tabItem, activeTab === tab && styles.activeTabItem]}
        >
          <ThemedText
            size={14}
            color={activeTab === tab ? Colors.textFaint : Colors.textMuted}
          >
            {tab}
          </ThemedText>
        </Pressable>
      ))}
    </View>
  );
});

// ─── CoinList ─────────────────────────────────────────────────────────────────

type CoinListProps = {
  data: Asset[] | undefined;
  loader: React.ReactNode;
  onReady: () => void;
  isReady: boolean;
};

const CoinList = React.memo(function CoinList({
  data,
  loader,
  onReady,
  isReady,
}: CoinListProps) {
  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      onReady();
    });
    return () => task.cancel();
  }, [onReady]);

  const renderItem = useCallback(
    ({ item }: { item: Asset }) => (
      <View style={styles.coinItemWrapper}>
        <CoinItem
          name={item.name}
          amount={30594}
          icon={CoinIcons[item.symbol]}
          alias={item.symbol}
          amountInUsd={item.priceUsd}
          showAmountInUsd={false}
          change={item.change24h}
          showChange
          showChart
        />
      </View>
    ),
    [],
  );

  const keyExtractor = useCallback((item: Asset) => item.id, []);

  if (!isReady) return loader;

  return (
    <View style={styles.coinListContainer}>
      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        ItemSeparatorComponent={Separator}
        showsVerticalScrollIndicator={false}
      />
      <LinearGradient
        colors={["transparent", Colors.black + "33"]}
        style={styles.fadeGradient}
      />
    </View>
  );
});

// ─── Markets ──────────────────────────────────────────────────────────────────

const Markets = () => {
  const bottomPadding = useSafeBottom();
  const scrollRef = useRef<ScrollView>(null);
  const [activeTab, setActiveTab] = useState<Tab>("Convert");
  const [visitedTabs, setVisitedTabs] = useState<Set<Tab>>(
    new Set(["Convert"]),
  );
  const { data: coins } = useAllAssetsQuery();

  const [readyTabs, setReadyTabs] = useState<Set<Tab>>(new Set());

  const markTabReady = useCallback((tab: Tab) => {
    setReadyTabs((prev) => new Set(prev).add(tab));
  }, []);

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

  const loader = useMemo(() => <Loader />, []);
  const tabPages = useMemo(
    () =>
      TABS.map((tab) => (
        <View key={tab} style={styles.tabPage}>
          {visitedTabs.has(tab) ? (
            <CoinList
              data={coins}
              isReady={readyTabs.has(tab)}
              onReady={() => markTabReady(tab)}
              loader={loader}
            />
          ) : null}
        </View>
      )),
    [visitedTabs, coins, readyTabs, loader, markTabReady],
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

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  switcherWrapper: {
    width: "100%",
    paddingHorizontal: 24,
  },
  tab: {
    flexDirection: "row",
    borderRadius: TAB_RADIUS,
    backgroundColor: Colors.surfaceCard,
    width: "100%",
    height: TAB_HEIGHT,
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  tabItem: {
    height: TAB_ITEM_HEIGHT,
    width: "25%",
    justifyContent: "center",
    alignItems: "center",
  },
  activeTabItem: {
    borderRadius: 12,
    backgroundColor: Colors.surface,
  },
  scrollContent: {
    flexGrow: 1,
  },
  tabPage: {
    width: SCREEN_WIDTH,
  },
  coinListContainer: {
    position: "relative",
    flex: 1,
    paddingBottom: 20,
  },
  coinItemWrapper: {
    paddingHorizontal: 24,
  },
  fadeGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    zIndex: 99,
    pointerEvents: "none",
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
