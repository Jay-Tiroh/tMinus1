import Ill from "@/assets/images/auth-success.svg";

import { Spacer } from "@/components/Spacer";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { useRouter } from "expo-router";
import { ImageBackground, StyleSheet, View } from "react-native";

export default function Success() {
  const navigation = useRouter();

  return (
    <ThemedView style={styles.container}>
      <ImageBackground
        source={require("@/assets/images/onboarding-bg.png")}
        resizeMode="cover"
        style={styles.image}
      >
        <View style={styles.page}>
          <Ill style={styles.ill} />
          <Spacer size={55} />
          <View style={styles.textContainer}>
            <ThemedText
              size={32}
              weight="bold"
              style={{
                color: Colors.white,
                lineHeight: 46,
                textAlign: "center",
              }}
            >
              Your account has been successfully created!
            </ThemedText>
          </View>
        </View>

        {/* Button */}
        <Spacer size={41} />
        <View style={styles.buttonContainer}>
          <ThemedButton
            title="Get Started"
            variant="primary"
            style={styles.button}
            onPress={() => navigation.push("/(tabs)/home")}
          />
        </View>
        <Spacer size={41} />
      </ImageBackground>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  image: {
    flex: 1,
    justifyContent: "center", // pushes indicators + button to bottom
  },
  page: {
    width: "100%",
    alignItems: "center",
    // justifyContent: "flex-end",
    paddingTop: 60,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 20,
    alignItems: "center",
  },
  button: {
    boxShadow: "0 20px 60px rgba(94, 213, 168, .16)",
    width: 180,
  },
  text: {
    textAlign: "center",
    maxWidth: 366,
  },
  title: {
    color: Colors.white,
    fontSize: 24,
    letterSpacing: 0.0264 * 24,
  },

  ill: {
    width: "100%",
    height: 387,
  },
  textContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
    gap: Spacing.lg,
  },
});
