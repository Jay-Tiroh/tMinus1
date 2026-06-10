import Status from "@/app/kyc/status";
import AccountLimits from "@/components/kyc/AccountLimits";
import IndexPage from "@/components/kyc/IndexPage";
import { useKyc } from "@/hooks/useKyc";
import React from "react";

const IndexScreen = () => {
  const [step, setStep] = React.useState<number>(0);

  const handleChangeStep = (newStep: number) => {
    setStep(newStep);
  };
  const { kycStatus } = useKyc();
  if (
    kycStatus === "approved" ||
    kycStatus === "rejected" ||
    kycStatus === "pending"
  ) {
    return <Status />;
  }
  return (
    <>
      {step === 0 ? (
        <IndexPage handlePress={handleChangeStep} />
      ) : (
        <AccountLimits handlePress={handleChangeStep} />
      )}
    </>
  );
};

export default IndexScreen;
