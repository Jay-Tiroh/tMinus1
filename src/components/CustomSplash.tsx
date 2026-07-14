// components/CustomSplash.tsx
import { Image, StyleSheet, View } from "react-native";

export function CustomSplash() {
  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/splash_screen.png")}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#171D22" },
  image: { flex: 1, width: "100%", height: "100%" },
});
