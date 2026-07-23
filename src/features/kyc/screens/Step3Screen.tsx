import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { GeneralStyles } from "@/constants/themes";
import { useAppSelector } from "@/core/store/hooks";
import { Template } from "@/features/kyc/components/Template";
import { selectKycFiles } from "@/features/kyc/store/kycSlice";
import { LabelValueItem } from "@/shared/components/LabelValueItem";
import { Spacer } from "@/shared/components/Spacer";
import TextBlock from "@/shared/components/TextBlock";
import { ms, s, vs } from "@/shared/utils/responsive";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useSubmitKyc } from "../hooks/useSubmitKyc";
import { getDocumentByType } from "../utils/kyc.constants";

export const Step3Screen = () => {
  const kyc = useAppSelector((state) => state.kyc);
  const selectedFiles = useAppSelector(selectKycFiles);
  const selfieFile = selectedFiles.selfie;

  const { submit, isLoading, isReady } = useSubmitKyc();

  const Config = [
    {
      title: "Legal Name",
      value: kyc.legalName,
    },
    {
      title: "Country",
      value: kyc.country,
    },
    {
      title: "Document",
      value: getDocumentByType(kyc.documentType)?.label,
    },
    {
      title: "Document image",
      value: selectedFiles.document_front ? "Uploaded" : "Not uploaded",
    },
    {
      title: "Selfie image",
      value: selfieFile ? "Uploaded" : "Not uploaded",
    },
  ];

  return (
    <Template
      headerProps={{
        goBack: true,
        title: "Review submission",
        body: "Check the details and files before sending them for admin review.",
        stage: 3,
      }}
      ctaProps={{
        variant: "primary",
        title: "Submit for review",
        disabled: !isReady || isLoading,
        iconComponent: isLoading ? (
          <ActivityIndicator color={Colors.backgroundInk} />
        ) : null,
        textStyle: {
          fontSize: ms(14),
          fontFamily: Fonts.bold,
        },
        onPress: submit,
      }}
    >
      <View style={styles.container}>
        <Spacer size={12} />
        <View style={[GeneralStyles.wrapper, { gap: vs(14) }]}>
          {Config.map((item) => (
            <LabelValueItem
              key={item.title}
              label={item.title}
              value={item.value ?? "Nil"}
            />
          ))}
        </View>

        <Spacer size={38} />

        <View style={[GeneralStyles.wrapper]}>
          <View
            style={[
              GeneralStyles.box,
              {
                padding: ms(16),
                justifyContent: "center",
                alignItems: "center",
                borderRadius: ms(16),
                minHeight: vs(86),
              },
            ]}
          >
            <TextBlock
              body="After submission your status changes to pending and trade/withdraw remain locked until approved."
              bodyStyle={{
                fontSize: ms(13),
                maxWidth: s(300),
              }}
            />
          </View>
        </View>
      </View>
    </Template>
  );
};

export default Step3Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
