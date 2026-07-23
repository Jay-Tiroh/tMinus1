import { Colors } from "@/constants/Colors";
import { useAllAssets } from "@/features/markets";
import { CryptoIcon } from "@/shared/components/CryptoIcon";
import { ThemedText } from "@/shared/components/ThemedText";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type Asset = {
  id: string;
  name: string;
  symbol: string;
  network: string;
  priceUsd: number;
  change24h: number;
  iconUrl: string;
  isActive: boolean;
  minBuyUsd: number;
  minSellUsd: number;
};

interface AssetPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (asset: Asset) => void;
  assetsToShow?: string[]; // Defined the prop as an array of strings
}

export const AssetPickerModal = ({
  visible,
  onClose,
  onSelect,
  assetsToShow,
}: AssetPickerModalProps) => {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Handle Search Debounce
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Clear search query when modal closes
  useEffect(() => {
    if (!visible) {
      setSearchQuery("");
      setDebouncedQuery("");
    }
  }, [visible]);

  const { coins = [], isError } = useAllAssets(debouncedQuery);

  // Filter the coins based on the assetsToShow prop
  const displayCoins = useMemo(() => {
    // If no specific assets are requested, show everything returned by the hook
    if (!assetsToShow || assetsToShow.length === 0) {
      return coins;
    }
    // Otherwise, filter down to just the ones in the assetsToShow array
    return coins.filter((coin) => assetsToShow.includes(coin.symbol));
  }, [coins, assetsToShow]);

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { paddingBottom: insets.bottom }]}>
          <View style={styles.modalHeader}>
            <ThemedText weight="bold" size={18}>
              Select Asset
            </ThemedText>
            <TouchableOpacity onPress={onClose}>
              <ThemedText color={Colors.primaryClean} size={14}>
                Close
              </ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search assets..."
              placeholderTextColor={Colors.textMidGray}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCorrect={false}
              autoCapitalize="none"
            />
          </View>

          <FlatList
            data={displayCoins} // Updated to use the filtered array
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            initialNumToRender={20}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                {isError ? (
                  <ThemedText color={Colors.textMidGray}>
                    Failed to load assets.
                  </ThemedText>
                ) : (
                  <ActivityIndicator size="small" color={Colors.primaryClean} />
                )}
              </View>
            )}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.assetRow}
                onPress={() => onSelect(item)}
              >
                <CryptoIcon symbol={item.symbol} size={32} />

                <View style={styles.assetInfo}>
                  <ThemedText size={16} color={Colors.snowGray}>
                    {item.name}
                  </ThemedText>
                  <ThemedText size={14} color={Colors.textMidGray}>
                    {item.network}
                  </ThemedText>
                </View>

                <ThemedText size={16} color={Colors.textMidGray}>
                  {item.symbol}
                </ThemedText>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.surfaceNavy,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: "75%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceNavy,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceNavy,
  },
  searchInput: {
    backgroundColor: Colors.backgroundDark,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 44,
    color: Colors.snowGray,
    fontSize: 14,
  },
  assetRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceAlt,
  },
  assetInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
