import Avatar from "@/assets/icons/user/avatar.svg";
import LogOutBtn from "@/components/LogOutBtn";
import { ThemedText } from "@/components/ThemedText";
import Item from "@/components/user/Item";
import { Colors } from "@/constants/Colors";
import useMisc from "@/constants/misc";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

const ProfileScreen = () => {
  const { displayName, details } = useMisc();

  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <LinearGradient
          colors={[Colors.surface, Colors.primary + "1A"]}
          style={styles.gradient}
        ></LinearGradient>
        <View style={styles.avatarContainer}>
          <Avatar />
          <ThemedText
            weight="bold"
            size={18}
            color={Colors.white}
            style={{ position: "absolute", bottom: 8 }}
          >
            {displayName}
          </ThemedText>
        </View>
      </View>
      <View style={styles.otherDetails}>
        {details.map((detail, _) => (
          <Item
            key={detail.label}
            label={detail.label}
            value={detail.value as string}
            pushTo={detail.name}
          />
        ))}
      </View>
      <LogOutBtn />
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    gap: 34,
  },
  imageContainer: {
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  gradient: {
    width: "100%",
    height: 100,
    position: "absolute",
    top: 0,
  },
  avatarContainer: {
    height: "100%",
    gap: 16,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  otherDetails: {
    padding: 30,
    paddingTop: 0,
    width: "100%",
    borderTopWidth: 0.5,
    borderTopColor: Colors.border + "1A",
  },
  detail: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border + "1A",
    height: 62,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
