import { Colors } from "@/constants/Colors";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useSegments } from "expo-router";
import React, { forwardRef, useMemo } from "react";
import { Pressable, StyleSheet } from "react-native";
type ThemedBottomSheetProps = {
  children?: React.ReactNode;
  onClose?: () => void;
};

const ThemedBottomSheet = forwardRef<BottomSheet, ThemedBottomSheetProps>(
  ({ children, onClose }, ref) => {
    const snapPoints = useMemo(() => ["25%", "50%"], []);
    const handleCollapse = () => {
      if (ref && "current" in ref && ref.current) {
        ref.current.collapse();
      }
    };
    const segments = useSegments() as string[];
    const isTradeScreens = segments.includes("trades");

    return (
      <BottomSheet
        ref={ref}
        snapPoints={snapPoints}
        index={-1}
        enablePanDownToClose={true}
        onClose={onClose}
        style={styles.container}
        backgroundStyle={styles.sheetBackground}
        handleComponent={() =>
          isTradeScreens && (
            <Pressable
              style={styles.closeButtonContainer}
              onPress={handleCollapse}
            >
              <FontAwesome5 name="angle-double-down" size={18} color="white" />
            </Pressable>
          )
        }
        handleIndicatorStyle={{ display: "none" }}
      >
        <BottomSheetView style={styles.contentContainer}>
          {children}
        </BottomSheetView>
      </BottomSheet>
    );
  },
);
ThemedBottomSheet.displayName = "ThemedBottomSheet";
export default ThemedBottomSheet;

const styles = StyleSheet.create({
  container: {},
  sheetBackground: {
    backgroundColor: Colors.surface,
    boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.2)",
    borderTopLeftRadius: 27,
    borderTopRightRadius: 27,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    width: "100%",
    padding: 24,
  },
  closeButtonContainer: {
    position: "absolute",
    top: "-50%",
    left: 30,
    transform: [{ translateY: `-50%` }],
    zIndex: 1000,
    backgroundColor: Colors.surface,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.2)",
  },
});
