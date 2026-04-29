import Ill1 from "@/assets/images/onboard1.svg";
import Ill2 from "@/assets/images/onboard2.svg";
import Ill3 from "@/assets/images/onboard3.svg";
import { Spacer } from "@/components/Spacer";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Dimensions,
  ImageBackground,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

type Page = {
  id: number;
  image: React.FC<{ style?: any }>;
  title: string;
  subtitle: string;
};

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const PagesConfig: Page[] = [
  {
    id: 1,
    image: Ill1,
    title: "Trade anytime anywhere",
    subtitle:
      "Access the market 24/7 and execute trades instantly with a seamless, secure, and reliable platform built for speed.",
  },
  {
    id: 2,
    image: Ill2,
    title: "Save and invest at the same time",
    subtitle:
      "Grow your money effortlessly by saving and investing in one place, with smart tools that help you plan and stay consistent.",
  },
  {
    id: 3,
    image: Ill3,
    title: "Transact fast and easy",
    subtitle:
      "Send, receive, and manage transactions in seconds with a simple interface designed to make every payment smooth and stress-free.",
  },
];

export default function Index() {
  const navigation = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  const handleNext = () => {
    const nextIndex = activeIndex + 1;
    if (nextIndex < PagesConfig.length) {
      scrollRef.current?.scrollTo({
        x: nextIndex * SCREEN_WIDTH,
        animated: true,
      });
      setActiveIndex(nextIndex);
    } else {
      navigation.push("/(auth)");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ImageBackground
        source={require("@/assets/images/onboarding-bg.png")}
        resizeMode="cover"
        style={styles.image}
      >
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          style={{ flexGrow: 0 }}
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          onMomentumScrollEnd={handleScroll}
        >
          {PagesConfig.map((page, index) => {
            const Illustration = page.image;
            return (
              <View key={index} style={styles.page}>
                <Illustration style={styles.ill} />
                <Spacer size={55} />
                <View style={styles.textContainer}>
                  <ThemedText style={[styles.title, styles.text]}>
                    {page.title}
                  </ThemedText>
                  <ThemedText style={[styles.subtitle, styles.text]}>
                    {page.subtitle}
                  </ThemedText>
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* Indicators */}
        <Spacer size={41} />
        <View style={styles.indicatorContainer}>
          {PagesConfig.map((_, index) => (
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

        {/* Button */}
        <Spacer size={41} />
        <View style={styles.buttonContainer}>
          <ThemedButton
            title={
              activeIndex === PagesConfig.length - 1 ? "Get Started" : "Next"
            }
            variant="primary"
            style={styles.button}
            onPress={handleNext}
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
    width: SCREEN_WIDTH, // ✅ each page = exact screen width
    alignItems: "center",
    justifyContent: "flex-end",
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
  subtitle: {
    color: Colors.textMuted,
    fontSize: 18,
    letterSpacing: 0.0264 * 18,
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
  ellipse: {
    width: 12.24,
    height: 12.24,
    borderRadius: 12.24,
  },
  activeEllipse: {
    backgroundColor: Colors.textMuted,
  },
  inActiveEllipse: {
    backgroundColor: Colors.surfaceElevated,
  },
  indicatorContainer: {
    flexDirection: "row",
    gap: Spacing.sm,
    justifyContent: "center",
  },
});
