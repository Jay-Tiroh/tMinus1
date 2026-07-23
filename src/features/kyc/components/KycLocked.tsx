import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { GeneralStyles } from "@/constants/themes";
import { useProfile } from "@/features/user";
import BadgeStuff from "@/shared/components/BadgeStuff";
import { Spacer } from "@/shared/components/Spacer";
import TextBlock from "@/shared/components/TextBlock";
import { ThemedButton } from "@/shared/components/ThemedButton";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";

const KycLocked = () => {
  const router = useRouter();
  const { kycStatus } = useProfile();
  const isVerified = kycStatus === "approved";
  return isVerified ? null : (
    <View
      style={{
        ...GeneralStyles.box,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        borderRadius: 24,
      }}
    >
      <BadgeStuff
        outerColor={Colors.warningAmber}
        innerColor={"transparent"}
        IconComponent={
          <FontAwesome5
            name="exclamation"
            size={62}
            color={Colors.warningAmber}
          />
        }
      />
      <Spacer size={16} />
      <TextBlock
        title="Verify to trade"
        body="Trading and withdrawals are locked until your identity is approved."
        titleStyle={{ fontSize: 16, textAlign: "center" }}
        bodyStyle={{ fontSize: 14, textAlign: "center" }}
      />
      <Spacer size={16} />
      <ThemedButton
        variant="primary"
        title="Start verification"
        style={{
          height: 36,
          maxWidth: 200,
        }}
        textStyle={{ fontSize: 12, fontFamily: Fonts.bold }}
        onPress={() => router.replace("/kyc")}
      />
    </View>
  );
};

export default KycLocked;
