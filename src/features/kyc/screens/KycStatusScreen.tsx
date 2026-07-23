import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { ms } from "@/shared/utils/responsive";
import React from "react";
import { StyleSheet } from "react-native";
import { Approved } from "../components/Approved";
import { Failed } from "../components/Failed";
import { InProgress } from "../components/InProgress";
import { Template } from "../components/Template";
import { useKycStatus } from "../hooks/useKycStatus";

export const KycStatusScreen = () => {
  const { phase, currentConfig, handlePress } = useKycStatus();

  return (
    <Template
      headerProps={{
        goBack: true,
        title: currentConfig.title,
        body: currentConfig.description,
        stage: 3,
      }}
      ctaProps={{
        variant: "primary",
        title: currentConfig.cta,
        style:
          phase === "failed"
            ? { backgroundColor: Colors.lossBright }
            : undefined,
        textStyle:
          phase === "failed"
            ? styles.red
            : {
                fontSize: ms(14),
                fontFamily: Fonts.bold,
              },
        onPress: handlePress,
      }}
    >
      {phase === "inProgress" && <InProgress />}
      {phase === "approved" && <Approved />}
      {phase === "failed" && <Failed />}
    </Template>
  );
};

export default KycStatusScreen;

const styles = StyleSheet.create({
  red: {
    color: Colors.snowGray,
    fontSize: ms(14),
    fontFamily: Fonts.bold,
  },
});
