import Approved from "@/components/kyc/step3/Approved";
import Failed from "@/components/kyc/step3/Failed";
import InProgress from "@/components/kyc/step3/InProgress";
import Template from "@/components/kyc/Template";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { useKyc } from "@/hooks/useKyc";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";

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

  const handlePress = () => {
    if (phase === "inProgress") {
      setPhase("approved");
    }
    if (phase === "approved") {
      setPhase("failed");
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
    console.log("Current KYC status:", kycStatus);
  }, [phase]);

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
                fontSize: 14,
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
    fontSize: 14,
    fontFamily: Fonts.bold,
  },
});
