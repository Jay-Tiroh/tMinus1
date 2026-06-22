import Template from "@/components/kyc/Template";
import ModalSelector from "@/components/ModalSelector";
import { Spacer } from "@/components/Spacer";
import TextBlock from "@/components/TextBlock";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { GeneralStyles } from "@/constants/themes";
import { useGoToRoute } from "@/hooks/useGoToRoute";
import { KycStep1FormValues, kycStep1Schema } from "@/schemas/kycSchemas";
import { useAppDispatch } from "@/store/hooks";
import { setStep1Data } from "@/store/slices/kycSlice";
import {
  getDocumentByLabel,
  KYC_DOCUMENT_LABELS,
  KycDocumentType,
} from "@/types/kyc";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

const Step1 = () => {
  const [isDocTypeModalVisible, setDocTypeModalVisible] = useState(false);

  const dispatch = useAppDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<KycStep1FormValues>({
    resolver: zodResolver(kycStep1Schema),
    mode: "onChange",
    defaultValues: {
      legalName: "",
      country: "Nigeria",
      documentType: "",
      documentNumber: "",
    },
  });

  const handlePress = useGoToRoute("/kyc/step2");
  const onSubmit = (data: KycStep1FormValues) => {
    console.log("Validated Data:", data);
    const strictDocumentType = (getDocumentByLabel(data.documentType)?.type ||
      data.documentType) as KycDocumentType;
    dispatch(
      setStep1Data({
        legalName: data.legalName,
        country: data.country,
        documentType: strictDocumentType,
        documentNumber: data.documentNumber,
      }),
    );
    handlePress();
  };

  return (
    <Template
      headerProps={{
        title: "Identity details",
        body: "Enter details exactly as they appear on your document.",
        stage: 1,
      }}
      ctaProps={{
        variant: "primary",
        title: "Continue",
        onPress: handleSubmit(onSubmit),
        disabled: !isValid,
        textStyle: {
          fontSize: 14,
          fontFamily: Fonts.bold,
        },
      }}
    >
      <View
        style={[
          GeneralStyles.wrapper,
          {
            gap: 20,
            paddingVertical: 8,
          },
        ]}
      >
        {/* Legal Name */}
        <Controller
          control={control}
          name="legalName"
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <View
                style={[
                  styles.inputContainer,
                  errors.legalName && styles.inputError,
                ]}
              >
                <TextInput
                  placeholder="Legal name"
                  style={styles.input}
                  placeholderTextColor={Colors.textMidGray}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              </View>
              {errors.legalName && (
                <ThemedText style={styles.errorText}>
                  {errors.legalName.message}
                </ThemedText>
              )}
            </View>
          )}
        />

        {/* Country */}
        <View style={styles.inputContainer}>
          <ThemedText
            style={[styles.input, { color: Colors.textMidGray }]}
            color={Colors.textMidGray}
          >
            🇳🇬{"  "}Nigeria
          </ThemedText>
        </View>

        {/* Document Type */}
        <Controller
          control={control}
          name="documentType"
          render={({ field: { onChange, value } }) => (
            <View>
              <Pressable
                style={[
                  styles.inputContainer,
                  { position: "relative" },
                  errors.documentType && styles.inputError,
                ]}
                onPress={() => setDocTypeModalVisible(true)}
              >
                <ThemedText
                  style={[
                    styles.input,
                    { paddingLeft: 2 },
                    !value && { color: Colors.textMidGray },
                  ]}
                >
                  {value ? value : "Document type"}
                </ThemedText>
                <ModalSelector
                  visible={isDocTypeModalVisible}
                  setVisible={setDocTypeModalVisible}
                  options={KYC_DOCUMENT_LABELS}
                  value={value}
                  setValue={onChange}
                  width={200}
                />
              </Pressable>
              {errors.documentType && (
                <ThemedText style={styles.errorText}>
                  {errors.documentType.message}
                </ThemedText>
              )}
            </View>
          )}
        />

        {/* Document Number */}
        <Controller
          control={control}
          name="documentNumber"
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <View
                style={[
                  styles.inputContainer,
                  errors.documentNumber && styles.inputError,
                ]}
              >
                <TextInput
                  placeholder="Document number"
                  style={styles.input}
                  placeholderTextColor={Colors.textMidGray}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              </View>
              {errors.documentNumber && (
                <ThemedText style={styles.errorText}>
                  {errors.documentNumber.message}
                </ThemedText>
              )}
            </View>
          )}
        />
      </View>

      <Spacer size={56} />
      <View style={[GeneralStyles.wrapper]}>
        <View
          style={{
            ...GeneralStyles.box,
            flexDirection: "row",
            alignItems: "center",
            padding: 16,
            gap: 8,
            minHeight: 82,
          }}
        >
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: Colors.warningAmber + "59",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FontAwesome6
              name="exclamation"
              size={14}
              color={Colors.warningAmber}
            />
          </View>
          <TextBlock
            body="Mismatched details can delay approval or require resubmission."
            bodyStyle={{
              fontSize: 12,
              maxWidth: 250,
            }}
          />
        </View>
      </View>
      <Spacer size={94} />
    </Template>
  );
};

export default Step1;

const styles = StyleSheet.create({
  inputContainer: {
    borderRadius: 12,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.backgroundDark,
    flexDirection: "row",
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderColor: "transparent",
  },
  input: {
    flex: 1,
    fontFamily: Fonts.regular,
    color: Colors.snowGray,
    fontSize: 14,
  },
  inputError: {
    borderColor: Colors.lossBright,
  },
  errorText: {
    color: Colors.lossBright,
    fontSize: 11,
    marginTop: 6,
    marginLeft: 8,
  },
});
