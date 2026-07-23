import { Colors } from "@/constants/Colors";
import { CryptoAssetItem } from "@/features/wallets";
import { ms, s, vs } from "@/utils/responsive";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { DashboardAction } from "../hooks/useHomeDashboard";

const CircleIcon = () => <View style={styles.circleIcon} />;

type DashboardActionListProps = {
  actions: DashboardAction[];
};

export const DashboardActionList = ({ actions }: DashboardActionListProps) => {
  const router = useRouter();

  return (
    <View style={styles.actionList}>
      {actions.map((action) => (
        <TouchableOpacity
          key={action.id}
          activeOpacity={0.7}
          onPress={() => router.replace(action.route)}
        >
          <CryptoAssetItem
            iconComponent={<CircleIcon />}
            leftTitle={action.title}
            leftBody={action.subtitle}
            rightTitle={action.statusText ?? ""}
            rightBody=""
            numberOfLines={1}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  circleIcon: {
    width: s(32),
    height: vs(32),
    borderRadius: ms(16),
    backgroundColor: Colors.primaryClean,
  },
  actionList: {
    gap: vs(12),
  },
});
