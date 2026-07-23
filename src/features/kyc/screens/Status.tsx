import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { useKyc } from "@/features/kyc/hooks/useKyc";
import { useGoToRoute } from "@/shared/hooks/useGoToRoute";
import { ms } from "@/shared/utils/responsive";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { Approved } from "../components/Approved";
import { Failed } from "../components/Failed";
import { InProgress } from "../components/InProgress";
import { Template } from "../components/Template";

const Config = [
  {
    phase: "inProgress",
    title: "Review in progress",
    description: "Your identity submission has been sent for manual review.",
    cta: "Back to home",
  },
  {
    phase: "approved",
    title: "Verification approved",
    description: "Your account limits have been upgraded.",
    cta: "Start trading",
  },
  {
    phase: "failed",
    title: "Review needs attention",
    description: "Compliance could not approve your submission yet.",
    cta: "Resubmit documents",
  },
];

const KycStatus = () => {
  const [phase, setPhase] = React.useState<
    "inProgress" | "approved" | "failed"
  >("inProgress");
  const [currentConfig, setCurrentConfig] = React.useState(Config[0]);

  const getConfigForPhase = (phase: string) => {
    return Config.find((item) => item.phase === phase);
  };

  const { kycStatus } = useKyc();
  const goHome = useGoToRoute("/(tabs)/home");
  const goTrade = useGoToRoute("/(tabs)/markets");
  const goKyc = useGoToRoute("/kyc/step1");
  const handlePress = () => {
    if (phase === "inProgress") {
      goHome();
    }
    if (phase === "approved") {
      goTrade();
    }
    if (phase === "failed") {
      goKyc();
    }
  };

  useEffect(() => {
    if (kycStatus === "approved") {
      setPhase("approved");
    } else if (kycStatus === "rejected") {
      setPhase("failed");
    } else if (kycStatus === "pending") {
      setPhase("inProgress");
    }

    const phaseConfig = getConfigForPhase(phase);
    if (phaseConfig) {
      setCurrentConfig(phaseConfig);
    }
  }, [phase, kycStatus]);

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
        style: phase === "failed" && {
          backgroundColor: Colors.lossBright,
        },
        textStyle:
          phase === "failed"
            ? styles.red
            : {
                fontSize: ms(14),
                fontFamily: Fonts.bold,
              },
        onPress: () => handlePress(),
      }}
    >
      {phase === "inProgress" && <InProgress />}
      {phase === "approved" && <Approved />}
      {phase === "failed" && <Failed />}
    </Template>
  );
};

export default KycStatus;

const styles = StyleSheet.create({
  red: {
    color: Colors.snowGray,
    fontSize: ms(14),
    fontFamily: Fonts.bold,
  },
});
