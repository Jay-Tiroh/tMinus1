import Loader from "@/components/Loader";
import { ThemedText } from "@/components/ThemedText";
import Item from "@/components/user/Item";
import { Colors } from "@/constants/Colors";
import { buildSettingsList } from "@/hooks/useSettings";
import { useSettingsQuery } from "@/store/services/profileApi";
import { UpdateSettingsRequestData } from "@/types/profile";
import React from "react";
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

const SettingsScreen = () => {
  const {
    data: settings,
    isLoading,
    isFetching,
    isError,
    refetch,
    error,
  } = useSettingsQuery();

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Loader />
      </View>
    );
  }

  if (isError || !settings) {
    console.log(error);
    return (
      <ScrollView
        contentContainerStyle={styles.centerContainer}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      >
        <ThemedText style={styles.errorText}>
          Failed to load settings.
        </ThemedText>
        <ThemedText style={styles.subText}>Pull down to try again</ThemedText>
      </ScrollView>
    );
  }

  const settingsList = buildSettingsList(settings);
  // console.log("Settings:", settings);

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.container}
      data={settingsList}
      keyExtractor={(item) => item.label}
      renderItem={({ item }) => (
        <Item
          label={item.label}
          icon={item.icon}
          altIcon={item.altIcon}
          value={item.value}
          settingKey={item.settingKey as keyof UpdateSettingsRequestData}
          options={item.options}
        />
      )}
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={refetch}
          tintColor={Colors.primary}
          colors={[Colors.primary]}
        />
      }
    />
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  list: {
    flex: 1,
    width: "100%",
  },
  container: {
    padding: 30,
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: Colors.border + "1A",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  errorText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "red",
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    color: "gray",
  },
});
