import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import Entypo from "@expo/vector-icons/Entypo";
import React from "react";
import { StyleSheet, View } from "react-native";

type ActivityStatus = "Filled" | "Cancelled";
type ActivityType = "L/B" | "L/S";

interface RecentActivity {
  id: string;
  type: ActivityType;
  pair: string;
  date: string;
  amountFilled: string;
  amountTotal: string;
  price: string;
  status: ActivityStatus;
}

const recentActivities: RecentActivity[] = [
  {
    id: "1",
    type: "L/B",
    pair: "BTC/BUSD",
    date: "2021-08-02 04:39:26",
    amountFilled: "0.49975",
    amountTotal: "0.49975",
    price: "2652.00",
    status: "Filled",
  },
  {
    id: "2",
    type: "L/S",
    pair: "BTC/BUSD",
    date: "2021-08-02 04:39:26",
    amountFilled: "0.49975",
    amountTotal: "0.49975",
    price: "2652.00",
    status: "Cancelled",
  },
  {
    id: "3",
    type: "L/B",
    pair: "BTC/BUSD",
    date: "2021-08-02 04:39:26",
    amountFilled: "0.49975",
    amountTotal: "0.49975",
    price: "2652.00",
    status: "Filled",
  },
  {
    id: "4",
    type: "L/S",
    pair: "BTC/BUSD",
    date: "2021-08-02 04:39:26",
    amountFilled: "0.49975",
    amountTotal: "0.49975",
    price: "2652.00",
    status: "Cancelled",
  },
];

const statusColorMap: Record<ActivityStatus, string> = {
  Filled: Colors.profit,
  Cancelled: Colors.loss,
};

const typeColorMap: Record<ActivityType, string> = {
  "L/B": Colors.profit,
  "L/S": Colors.loss,
};

const Recent = () => {
  return (
    <View style={styles.container}>
      <ThemedText size={18} weight="bold" color="white">
        Recent Activity
      </ThemedText>

      {recentActivities.map((activity) => {
        const typeColor = typeColorMap[activity.type];
        const statusColor = statusColorMap[activity.status];

        return (
          <View key={activity.id} style={[styles.row, styles.content]}>
            <View
              style={[styles.typeBadge, { backgroundColor: typeColor + "33" }]}
            >
              <ThemedText color={typeColor} size={14}>
                {activity.type}
              </ThemedText>
            </View>
            <View style={{ flex: 1 }}>
              <View style={[styles.flexRow, styles.row]}>
                <ThemedText size={14} weight="bold" color="white">
                  {activity.pair}
                </ThemedText>
                <View style={styles.flexRow}>
                  <ThemedText color={Colors.textMuted} size={12}>
                    {activity.date}
                  </ThemedText>
                  <Entypo
                    name="chevron-right"
                    size={14}
                    color={Colors.textSecondary}
                    hitSlop={10}
                  />
                </View>
              </View>
              <View style={[styles.flexRow, styles.row]}>
                <ThemedText color={Colors.textMuted} size={14}>
                  Amount
                </ThemedText>
                <View style={styles.flexRow}>
                  <ThemedText color={typeColor} size={14}>
                    {activity.amountFilled}/
                  </ThemedText>
                  <ThemedText color={Colors.textSecondary} size={14}>
                    {activity.amountTotal}
                  </ThemedText>
                </View>
              </View>
              <View style={[styles.flexRow, styles.row]}>
                <ThemedText color={Colors.textMuted} size={14}>
                  Price
                </ThemedText>
                <ThemedText color={Colors.textSecondary} size={14}>
                  {activity.price}
                </ThemedText>
              </View>
              <View style={[styles.flexRow, styles.row]}>
                <ThemedText color={Colors.textMuted} size={14}>
                  Status
                </ThemedText>
                <ThemedText color={statusColor} size={14}>
                  {activity.status}
                </ThemedText>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default Recent;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    gap: 30,
  },
  content: {
    width: "100%",
    gap: 12,
    flexDirection: "row",
  },
  typeBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  row: {
    justifyContent: "space-between",
    width: "100%",
  },
});
