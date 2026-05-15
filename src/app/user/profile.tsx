import Arrow from "@/assets/icons/back.svg";
import Avatar from "@/assets/icons/user/avatar.svg";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import useMisc from "@/constants/misc";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

const Profile = () => {
  const { displayName } = useMisc();
  const { details } = useMisc();

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
          <View style={styles.detail} key={detail.label}>
            <ThemedText size={14} color={Colors.textFaint}>
              {detail.label}
            </ThemedText>
            <View style={styles.valueContainer}>
              <ThemedText size={14} color={Colors.textMuted}>
                {detail.value}
              </ThemedText>
              <Arrow
                color={Colors.textMuted}
                style={{ transform: [{ rotate: "180deg" }] }}
                onPress={() =>
                  router.push(`/user/edit-profile?edit=${detail.name}`)
                }
                hitSlop={20}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default Profile;

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
    flex: 1,
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
