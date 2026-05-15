import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, Easing, StyleSheet, View } from "react-native";

const CARD_WIDTH = Dimensions.get("window").width * 0.7;

const CoinCardsSkeleton = () => {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </>
  );
};

const SkeletonCard = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1400,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-250, 250],
  });

  return (
    <View style={styles.card}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.shimmerWrapper,
          {
            transform: [
              {
                translateX,
              },
              {
                rotate: "12deg",
              },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={[
            "rgba(255,255,255,0)",
            "rgba(255,255,255,0.35)",
            "rgba(255,255,255,0.25)",
            "rgba(255,255,255,0.35)",
            "rgba(255,255,255,0)",
          ]}
          locations={[0, 0.35, 0.5, 0.65, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.shimmer}
        />
      </Animated.View>

      {/* Top */}
      <View style={styles.top}>
        <View style={[styles.block, styles.price]} />
        <View style={[styles.block, styles.icon]} />
      </View>

      {/* Middle */}
      <View style={styles.middle}>
        <View style={[styles.block, styles.pair]} />
        <View style={[styles.block, styles.change]} />
      </View>

      {/* Bottom */}
      <View style={styles.bottom}>
        <View style={[styles.block, styles.chart]} />
      </View>
    </View>
  );
};

export default CoinCardsSkeleton;

const styles = StyleSheet.create({
  card: {
    width: 163,
    height: 118,
    borderRadius: 16,
    padding: 8,
    backgroundColor: "#F8FAFC",
    overflow: "hidden",
    gap: 8,
    boxShadow: "0px 16px 50px rgba(22, 28, 34, 0.08)",
  },

  shimmerWrapper: {
    position: "absolute",
    top: -40,
    left: -120,
    width: 100,
    height: 220,
    zIndex: 20,
  },

  shimmer: {
    width: "100%",
    height: "100%",
  },

  block: {
    backgroundColor: "#E5E7EB",
  },

  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  middle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  bottom: {
    marginTop: 8,
  },

  price: {
    width: 120,
    height: 20,
    borderRadius: 8,
  },

  icon: {
    width: 24,
    height: 24,
    borderRadius: 999,
  },

  pair: {
    width: 60,
    height: 8,
    borderRadius: 6,
  },

  change: {
    width: 60,
    height: 8,
    borderRadius: 6,
  },

  chart: {
    width: "100%",
    height: 30,
    borderRadius: 16,
  },
});
