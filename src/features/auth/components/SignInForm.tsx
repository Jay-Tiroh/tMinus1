import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { Spacer } from "@/shared/components/Spacer";
import { ThemedButton } from "@/shared/components/ThemedButton";
import { ThemedText } from "@/shared/components/ThemedText";
import { formatPhoneInternational } from "@/shared/utils/formatPhoneNumber";
import { vs } from "@/shared/utils/responsive";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useSignInFlow } from "../hooks/useSignInFlow";
import { InfoBanner } from "./InfoBanner";
import { ThemedInput } from "./ThemedTextInput";

const SignInForm = () => {
  const {
    isEmail,
    errorMessage,
    isLoading,
    isError,
    emailForm,
    phoneForm,
    activeForm,
    handleToggle,
    handleSubmit,
  } = useSignInFlow();

  return (
    <View style={{ flex: 1 }}>
      {(isError || errorMessage !== "") && (
        <ThemedText
          color={Colors.lossAlt}
          style={{ width: "100%", marginBottom: vs(8) }}
        >
          {errorMessage}
        </ThemedText>
      )}

      <View style={{ gap: vs(16) }}>
        <View style={styles.labelRow}>
          <ThemedText size={14} color={Colors.textSecondary}>
            {isEmail ? "Email" : "Mobile Number"}
          </ThemedText>
          <ThemedText
            size={14}
            color={Colors.primaryClean}
            onPress={handleToggle}
          >
            {isEmail ? "Sign in with mobile" : "Sign in with email"}
          </ThemedText>
        </View>

        {isEmail ? (
          <ThemedInput
            key="email-input"
            control={emailForm.control}
            name="email"
            icon={<Feather name="mail" size={20} color={Colors.primaryClean} />}
            placeholder="student@cryptoclass.test"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        ) : (
          <ThemedInput
            key="phone-input"
            control={phoneForm.control}
            name="phone"
            icon={
              <Feather name="phone" size={20} color={Colors.primaryClean} />
            }
            placeholder="Enter your mobile number"
            keyboardType="phone-pad"
            formatter={formatPhoneInternational}
          />
        )}

        <ThemedInput
          key={isEmail ? "email-password" : "phone-password"}
          control={activeForm}
          name="password"
          icon={
            <MaterialIcons
              name="lock-outline"
              size={20}
              color={Colors.primaryClean}
            />
          }
          placeholder="Password"
          secureTextEntry
          hasToggle
        />
      </View>

      <Spacer size={32} />

      <View style={{ gap: vs(16) }}>
        <ThemedButton
          title="Sign in"
          variant="primary"
          onPress={handleSubmit}
          disabled={isLoading}
          iconComponent={
            isLoading ? (
              <ActivityIndicator color={Colors.backgroundInk} />
            ) : null
          }
          textStyle={{ fontFamily: Fonts.medium }}
        />
      </View>

      <Spacer size={40} />
      <InfoBanner
        type="success"
        title="Secure session"
        desc="We will request 2FA when your account has it enabled."
      />
      <Spacer size={40} />

      <View style={styles.centerRow}>
        <ThemedText color={Colors.textMidGray} size={14}>
          New here?{" "}
          <ThemedText color={Colors.snowGray} weight="medium">
            Create an account
          </ThemedText>
        </ThemedText>
      </View>
    </View>
  );
};

export default SignInForm;

const styles = StyleSheet.create({
  forgotRow: { alignItems: "flex-end", width: "100%", marginTop: vs(12) },
  centerRow: { alignItems: "center", width: "100%" },
  labelRow: { flexDirection: "row", justifyContent: "space-between" },
});
