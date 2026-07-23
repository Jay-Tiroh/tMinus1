import React from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

const Loader = () => {
  const rotateAnim = React.useRef(new Animated.Value(0)).current;
  const fillAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const rotateLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 0.5,
          duration: 500,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0.5,
          duration: 500,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]),
    );

    const fillLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(fillAnim, {
          toValue: 0,
          duration: 500,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
        Animated.timing(fillAnim, {
          toValue: 0,
          duration: 500,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
        Animated.timing(fillAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
        Animated.timing(fillAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
      ]),
    );

    rotateLoop.start();
    fillLoop.start();

    return () => {
      rotateLoop.stop();
      fillLoop.stop();
    };
  }, [fillAnim, rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["0deg", "180deg", "360deg"],
  });

  const fillHeight = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.loader,
          {
            transform: [{ rotate }],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.loaderInner,
            {
              height: fillHeight,
            },
          ]}
        />
      </Animated.View>
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },

  loader: {
    width: 30,
    height: 30,
    borderWidth: 4,
    borderColor: "#fff",
    overflow: "hidden",
  },

  loaderInner: {
    width: "100%",
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
  },
});
