import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import {
  Country,
  useGetCountriesQuery,
} from "@/store/country-picker/countriesApi";
import React, { useMemo, useState } from "react";
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

type CountryPickerProps = {
  value?: string;
  onChangeText?: (text: string) => void;
  onCountryChange?: (country: Country) => void;
  showDialCode?: boolean;
  showPhoneInput?: boolean;
};

export const CountryPicker = ({
  value = "",
  onChangeText,
  onCountryChange,
  showDialCode = true,
  showPhoneInput = true,
}: CountryPickerProps) => {
  const { data: countries = [], isLoading } = useGetCountriesQuery();
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const insets = useSafeAreaInsets();

  const displayCountry = selectedCountry || countries[0];

  const filteredCountries = useMemo(() => {
    if (!searchQuery) return countries;
    return countries.filter((c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [countries, searchQuery]);

  const handleSelect = (country: Country) => {
    setSelectedCountry(country);
    setModalVisible(false);
    setSearchQuery("");
    if (onCountryChange) onCountryChange(country);
  };

  return (
    <View>
      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={[
            styles.pickerButton,
            !showPhoneInput && {
              borderRightWidth: 0,
              flex: 1,
              justifyContent: "space-between",
            },
          ]}
          onPress={() => setModalVisible(true)}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={Colors.primaryClean} />
          ) : (
            <>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <ThemedText size={16}>{displayCountry?.flag}</ThemedText>
                {!showPhoneInput && (
                  <ThemedText
                    size={14}
                    style={{ marginLeft: 8 }}
                    color={Colors.textOnDark}
                  >
                    {displayCountry?.name}
                  </ThemedText>
                )}
              </View>
              {showDialCode && (
                <ThemedText size={14} style={{ marginLeft: 6 }}>
                  {displayCountry?.dialCode}
                </ThemedText>
              )}
            </>
          )}
        </TouchableOpacity>

        {showPhoneInput && (
          <TextInput
            style={styles.input}
            keyboardType="phone-pad"
            value={value}
            onChangeText={onChangeText}
            placeholder="Phone number"
            placeholderTextColor={Colors.textMidGray}
          />
        )}
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: insets.bottom }]}>
            <View style={styles.modalHeader}>
              <ThemedText weight="bold" size={18}>
                Select Country
              </ThemedText>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <ThemedText color={Colors.primaryClean} size={14}>
                  Close
                </ThemedText>
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search countries..."
                placeholderTextColor={Colors.textMidGray}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCorrect={false}
              />
            </View>

            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => item.code}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              initialNumToRender={20}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.countryRow}
                  onPress={() => handleSelect(item)}
                >
                  <ThemedText size={20}>{item.flag}</ThemedText>
                  <ThemedText
                    size={16}
                    style={{ flex: 1, marginLeft: 12 }}
                    color={Colors.textMidGray}
                  >
                    {item.name}
                  </ThemedText>
                  {showDialCode && (
                    <ThemedText size={14} color={Colors.textMidGray}>
                      {item.dialCode}
                    </ThemedText>
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundDark,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  pickerButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: Colors.surfaceNavy,
    height: "100%",
  },
  input: {
    flex: 1,
    marginLeft: 12,
    color: Colors.snowGray,
    fontSize: 14,
    height: "100%",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
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
  countryRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceAlt,
  },
});
