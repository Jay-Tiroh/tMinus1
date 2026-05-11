import BL from "@/assets/icons/wallets/qr/bl.svg";
import BR from "@/assets/icons/wallets/qr/br.svg";
import LargeCamera from "@/assets/icons/wallets/qr/large-camera.svg";
import TL from "@/assets/icons/wallets/qr/tl.svg";
import TR from "@/assets/icons/wallets/qr/tr.svg";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

const Scanner = () => {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const handleBarcodeScanned = ({
    type,
    data,
  }: {
    type: string;
    data: string;
  }) => {
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    setScanned(true);
  };

  const showCamera = !permission?.granted || scanned;

  return (
    <>
      <View style={styles.container}>
        <TL style={styles.topLeft} />
        <TR style={styles.topRight} />
        <BL style={styles.bottomLeft} />
        <BR style={styles.bottomRight} />
        {scanned && (
          <ThemedButton
            onPress={() => setScanned(false)}
            title="Scan Again"
            iconComponent={
              <FontAwesome6
                name="arrow-rotate-right"
                size={14}
                color={Colors.offWhite}
              />
            }
            style={{
              position: "absolute",
              bottom: 16,
              alignSelf: "center",
              zIndex: 99,
              width: 180,
              height: 40,
              backgroundColor: Colors.info + "80",
            }}
            textStyle={{
              fontSize: 14,
              color: Colors.offWhite,
            }}
          />
        )}
        <View style={styles.cameraContainer}>
          {permission?.granted && !scanned && (
            <CameraView
              style={styles.camera}
              facing={facing}
              onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
              barcodeScannerSettings={{
                barcodeTypes: ["qr", "ean13", "code128"], // Limit types for better performance
              }}
            />
          )}
          {showCamera && <LargeCamera />}
        </View>
        {
          // Camera permissions are not granted yet.
          !permission?.granted && (
            <View style={styles.permission}>
              <ThemedText
                size={14}
                weight="medium"
                letterSpacing={2.64}
                color={Colors.border}
              >
                We need your permission to show the camera
              </ThemedText>
              <ThemedButton
                onPress={requestPermission}
                title="grant permission"
                style={{ marginTop: 16, width: 220, height: 40 }}
                textStyle={{ fontSize: 14 }}
              />
            </View>
          )
        }
      </View>
    </>
  );
};

export default Scanner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    maxHeight: 430,
    width: "100%",
  },
  cameraContainer: {
    backgroundColor: Colors.surfaceNight,
    width: "100%",
    height: 420,
    justifyContent: "center",
    alignItems: "center",
  },
  topLeft: {
    position: "absolute",
    top: 0,
    left: -2,
    zIndex: 99,
  },
  topRight: {
    position: "absolute",
    top: 0,
    right: -2,
    zIndex: 99,
  },
  bottomLeft: {
    position: "absolute",
    bottom: 0,
    left: -2,
    zIndex: 99,
  },
  bottomRight: {
    position: "absolute",
    bottom: 0,
    right: -2,
    zIndex: 99,
  },
  camera: {
    width: "100%",
    height: 425,
  },
  permission: {
    padding: 16,
    backgroundColor: Colors.offWhite,
    borderRadius: 8,
    alignItems: "center",
    position: "absolute",
    bottom: "50%",
    // right: "50%",
    transform: [{ translateX: 0 }, { translateY: 50 }],
    zIndex: 99,
  },
});
