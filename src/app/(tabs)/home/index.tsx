import Coins from "@/components/home/Coins";
import Grid from "@/components/home/Grid";
import HomeCard from "@/components/home/HomeCard";
import { useSafeBottom } from "@/hooks/useSafeBottom";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";

const Home = () => {
  const safeBottom = useSafeBottom();
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.container, { paddingBottom: safeBottom }]}
    >
      <Grid />
      <HomeCard />
      <Coins />
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
