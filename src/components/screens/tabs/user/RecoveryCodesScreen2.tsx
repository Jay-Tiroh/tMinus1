import { Spacer } from "@/components/Spacer";
import TextBlock from "@/components/TextBlock";
import { ThemedText } from "@/components/ThemedText";
import Template from "@/components/trades/Template";
import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import React from "react";
import { StyleSheet, View } from "react-native";

const RECOVERY_CODES_CONFIG = [
  { id: "1", code: "C7K9-PQ2A", status: "unused" },
  { id: "2", code: "N4TX-18HD", status: "unused" },
  { id: "3", code: "V2RA-M6LK", status: "unused" },
  { id: "4", code: "Q9FE-Z3BY", status: "unused" },
  { id: "5", code: "L5DU-7RKC", status: "unused" },
  { id: "6", code: "P8MN-X4TA", status: "unused" },
];

const RecoveryCodesScreen = () => {
  const CtaFooter = () => (
    <View style={{ alignItems: "center", marginTop: 16 }}>
      <ThemedText size={14} color={Colors.textMidGray}>
        Regenerate codes later in Security
      </ThemedText>
    </View>
  );

  return (
    <Template
      textBlockProps={{
        title: "Recovery codes",
        body: "Save these backup codes somewhere secure.",
      }}
      ctaProps={{
        title: "I saved my codes",
        variant: "primary",
      }}
      ctaFooter={<CtaFooter />}
    >
      <View style={GeneralStyles.wrapper}>
        {/* Codes List Box */}
        <View style={styles.codesContainer}>
          {RECOVERY_CODES_CONFIG.map((item, index) => {
            const isLast = index === RECOVERY_CODES_CONFIG.length - 1;
            return (
              <View
                key={item.id}
                style={[styles.codeRow, !isLast && styles.borderBottom]}
              >
                <ThemedText size={16} weight="bold" color={Colors.snowGray}>
                  {item.code}
                </ThemedText>
                <ThemedText size={14} color={Colors.textMidGray}>
                  {item.status}
                </ThemedText>
              </View>
            );
          })}
        </View>

        <Spacer size={24} />

        {/* Warning Banner */}
        <View style={styles.warningBox}>
          <View style={styles.warningIcon}>
            <ThemedText color={Colors.warningBright} weight="bold">
              !
            </ThemedText>
          </View>
          <TextBlock
            title="One-time use"
            body="Each code can unlock your account once if your authenticator is unavailable."
            titleStyle={{ fontSize: 16, color: Colors.snowGray }}
            bodyStyle={{ fontSize: 12, color: Colors.textMidGray }}
          />
        </View>
      </View>
    </Template>
  );
};

export default RecoveryCodesScreen;

const styles = StyleSheet.create({
  codesContainer: {
    ...GeneralStyles.box,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  codeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  warningBox: {
    ...GeneralStyles.box,
    flexDirection: "row",
    padding: 16,
    gap: 16,
    alignItems: "center",
  },
  warningIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.warningBrown,
    alignItems: "center",
    justifyContent: "center",
  },
});
