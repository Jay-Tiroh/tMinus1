import AccountLimits from "@/components/kyc/AccountLimits";
import IndexPage from "@/components/kyc/IndexPage";
import React from "react";

const IndexScreen = () => {
  const [step, setStep] = React.useState<number>(0);

  const handleChangeStep = (newStep: number) => {
    setStep(newStep);
  };
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
