import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { GeneralStyles } from "@/constants/themes";
import { useAppSelector } from "@/core/store/hooks";
import { useLogout } from "@/features/auth";
import { Spacer } from "@/shared/components/Spacer";
import Template from "@/shared/components/Template";
import { ThemedButton } from "@/shared/components/ThemedButton";
import { ThemedText } from "@/shared/components/ThemedText";
import { useBiometrics } from "@/shared/hooks/useBiometrics";
import { ms, s, vs } from "@/shared/utils/responsive";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useWelcomeBackFlow } from "../hooks/useWelcomeBackFlow";

const WelcomeBackScreen = () => {
  const [password, setPassword] = useState("");
  const [isHidden, setIsHidden] = useState(true);
  const [passwordError, setPasswordError] = useState("");

  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);

  const initials =
    user?.fullName
      ?.split(" ")
      .map((x) => x[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "U";

  const { isSupported, isEnrolled, authenticate } = useBiometrics();
  const { performLogout, isLoading: isLoggingOut } = useLogout();
  const { handleSignIn, handleBiometrics, isLoginLoading } =
    useWelcomeBackFlow();

  useEffect(() => {
    if (!user) {
      router.replace("/(auth)");
    }
  }, [user, router]);

  if (!user) return null;

  const validatePassword = (value: string) => {
    if (value.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return false;
    }
    if (!/[0-9]/.test(value)) {
      setPasswordError("Password must contain at least one number");
      return false;
    }
    if (!/[^a-zA-Z0-9]/.test(value)) {
      setPasswordError("Password must contain at least one symbol");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordError) validatePassword(text);
  };

  const onSignInPress = () => {
    if (!validatePassword(password)) return;
    handleSignIn(user, password);
  };

  const onBiometricsPress = () => {
    if (!user?.settings.biometricEnabled || !isSupported || !isEnrolled) return;
    handleBiometrics(user, authenticate);
  };

  const isPasswordValid = password.length >= 8;

  return (
    <Template
      textBlockProps={{
        title: "Welcome back",
        titleStyle: { fontSize: ms(28) },
      }}
      ctaProps={{
        title: "Sign in",
        variant: "primary",
        onPress: onSignInPress,
        disabled: !isPasswordValid || isLoginLoading,
      }}
      ctaFooter={
        <View style={styles.footerActions}>
          {user?.settings.biometricEnabled && isSupported && isEnrolled && (
            <ThemedButton
              title="Use Biometric Authentication"
              variant="default"
              onPress={onBiometricsPress}
              style={styles.secondaryButton}
            />
          )}

          <TouchableOpacity
            onPress={performLogout}
            activeOpacity={0.7}
            style={styles.notYouCta}
            disabled={isLoggingOut}
          >
            <ThemedText color={Colors.textMidGray} size={14} weight="medium">
              Not you?
            </ThemedText>
          </TouchableOpacity>
        </View>
      }
    >
      <View style={GeneralStyles.wrapper}>
        <View style={styles.profileSection}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              backgroundColor: Colors.primary,
              position: "relative",
            }}
          >
            <ThemedText size={32} weight="bold" color={Colors.backgroundInk}>
              {initials}
            </ThemedText>
            {user?.avatarUrl && (
              <Image
                source={{
                  uri: user?.avatarUrl,
                }}
                width={72}
                height={72}
                style={{ position: "absolute", top: 0, left: 0 }}
              />
            )}
          </View>

          <Spacer size={20} />

          <ThemedText size={20} weight="bold" color={Colors.snowGray}>
            {user?.fullName ?? "User"}
          </ThemedText>

          <Spacer size={8} />

          <ThemedText
            size={14}
            color={Colors.textMidGray}
            style={styles.textCenter}
          >
            Use password or Face ID approved on this device.
          </ThemedText>
        </View>

        <Spacer size={40} />

        <View>
          <View style={[GeneralStyles.box, styles.inputContainer]}>
            <ThemedText size={12} color={Colors.textMidGray}>
              Password
            </ThemedText>

            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                secureTextEntry={isHidden}
                placeholder="••••••••"
                placeholderTextColor={Colors.textDim}
                value={password}
                onChangeText={handlePasswordChange}
                onBlur={() => validatePassword(password)}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                onPress={() => setIsHidden((prev) => !prev)}
                style={styles.toggle}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name={isHidden ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={Colors.textMidGray}
                />
              </TouchableOpacity>
            </View>
          </View>

          {passwordError !== "" && (
            <ThemedText
              size={12}
              color={Colors.lossAlt}
              style={styles.errorText}
            >
              {passwordError}
            </ThemedText>
          )}
        </View>
      </View>
    </Template>
  );
};

export default WelcomeBackScreen;

const styles = StyleSheet.create({
  profileSection: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: vs(20),
  },
  avatar: {
    width: s(100),
    height: vs(100),
    borderRadius: ms(50),
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  textCenter: { textAlign: "center" },
  inputContainer: {
    paddingHorizontal: s(20),
    paddingVertical: vs(16),
    height: vs(80),
    justifyContent: "center",
    gap: vs(4),
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    color: Colors.snowGray,
    fontSize: ms(20),
    fontFamily: Fonts.bold,
    padding: 0,
    margin: 0,
  },
  toggle: {
    padding: ms(4),
    marginRight: s(-4),
  },
  errorText: {
    marginTop: vs(6),
    marginLeft: s(4),
  },
  footerActions: {
    width: "100%",
    gap: vs(16),
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: Colors.surfaceNavy,
  },
  notYouCta: {
    paddingVertical: vs(8),
    paddingHorizontal: s(16),
  },
});
