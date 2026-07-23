import { Colors } from "@/constants/Colors";
import { Spacer } from "@/shared/components/Spacer";
import { ThemedButton } from "@/shared/components/ThemedButton";
import { ThemedView } from "@/shared/components/ThemedView";
import { s } from "@/shared/utils/responsive";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  ImageBackground,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { OnboardingPage } from "../components/OnboardingPage";
import { OnboardingPagination } from "../components/OnboardingPagination";
import { ONBOARDING_PAGES } from "../constants/onboarding.constants";
import { onboardingStorage } from "../storage/onboarding.storage";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const OnboardingScreen = () => {
  const navigation = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  const handleNext = async () => {
    const nextIndex = activeIndex + 1;
    if (nextIndex < ONBOARDING_PAGES.length) {
      scrollRef.current?.scrollTo({
        x: nextIndex * SCREEN_WIDTH,
        animated: true,
      });
      setActiveIndex(nextIndex);
    } else {
      await onboardingStorage.markAsComplete();
      navigation.replace("/(auth)");
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
          style={styles.scrollArea}
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          onMomentumScrollEnd={handleScroll}
        >
          {ONBOARDING_PAGES.map((page) => (
            <OnboardingPage key={page.id} page={page} />
          ))}
        </ScrollView>

        <Spacer size={41} />
        <OnboardingPagination
          total={ONBOARDING_PAGES.length}
          activeIndex={activeIndex}
        />

        <Spacer size={41} />
        <View style={styles.buttonContainer}>
          <ThemedButton
            title={
              activeIndex === ONBOARDING_PAGES.length - 1
                ? "Get Started"
                : "Next"
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  scrollArea: {
    flexGrow: 0,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: s(20),
    alignItems: "center",
  },
  button: {
    width: s(180),
  },
});
