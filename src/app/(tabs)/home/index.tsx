import Coins from "@/components/home/Coins";
import Grid from "@/components/home/Grid";
import HomeCard from "@/components/home/HomeCard";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";

const Home = () => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
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
