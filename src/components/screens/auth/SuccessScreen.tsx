import Ill from "@/assets/images/auth-success.svg";
import { Spacer } from "@/components/Spacer";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { s, vs } from "@/utils/responsive";
import { useRouter } from "expo-router";
import { ImageBackground, StyleSheet, View } from "react-native";

export default function SuccessScreen() {
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
                lineHeight: vs(46),
                textAlign: "center",
              }}
            >
              Your account has been successfully created!
            </ThemedText>
          </View>
        </View>

        <Spacer size={41} />
        <View style={styles.buttonContainer}>
          <ThemedButton
            title="Get Started"
            variant="primary"
            style={styles.button}
            onPress={() => navigation.replace("/(tabs)/home")}
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
    justifyContent: "center",
  },
  page: {
    width: "100%",
    alignItems: "center",
    paddingTop: vs(60),
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: s(20),
    alignItems: "center",
  },
  button: {
    width: s(180),
  },
  ill: {
    width: "100%",
    height: vs(387),
  },
  textContainer: {
    alignItems: "center",
    paddingHorizontal: s(20),
    gap: vs(Spacing.lg),
  },
});
