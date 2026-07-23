import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { ms, s } from "@/utils/responsive";
import React from "react";
import { StyleSheet, View } from "react-native";

type OnboardingPaginationProps = {
  total: number;
  activeIndex: number;
};

export const OnboardingPagination = ({
  total,
  activeIndex,
}: OnboardingPaginationProps) => {
  return (
    <View style={styles.indicatorContainer}>
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.ellipse,
            index === activeIndex
              ? styles.activeEllipse
              : styles.inActiveEllipse,
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  ellipse: {
    width: ms(12.24),
    height: ms(12.24),
    borderRadius: ms(6.12),
  },
  activeEllipse: {
    backgroundColor: Colors.textMuted,
  },
  inActiveEllipse: {
    backgroundColor: Colors.surfaceElevated,
  },
  indicatorContainer: {
    flexDirection: "row",
    gap: s(Spacing.sm),
    justifyContent: "center",
  },
});
