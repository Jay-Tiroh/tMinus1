import Avatar from "@/assets/icons/user/avatar.svg";
import Camera from "@/assets/icons/user/camera.svg";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/user/ThemedTextInput";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import useMisc from "@/constants/misc";
import { useUser } from "@/hooks/useUser";
import {
  EditProfileFormData,
  editProfileSchema,
} from "@/schemas/profileSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, TextInput, View } from "react-native";

const EditProfile = () => {
  const { fullName, email, phone } = useUser();

  const { displayName } = useMisc();
  const { details } = useMisc();
  const { edit } = useLocalSearchParams<{ edit?: keyof EditProfileFormData }>();

  const inputRefs = useRef<
    Partial<Record<keyof EditProfileFormData, TextInput | null>>
  >({});

  const [focusedInput, setFocusedInput] = useState<
    keyof EditProfileFormData | null
  >(null);

  const { control, handleSubmit, setValue, watch, clearErrors } =
    useForm<EditProfileFormData>({
      resolver: zodResolver(editProfileSchema),
      mode: "onChange",
      defaultValues: {
        username: displayName,
        email: email ?? "",
        phone: phone ?? "",
      },
    });

  // Focus the field that was tapped on the Profile screen
  useEffect(() => {
    if (!edit || Array.isArray(edit)) return;

    requestAnimationFrame(() => {
      setTimeout(() => {
        inputRefs.current[edit]?.focus();
      }, 50);
    });
  }, [edit]);

  const handleBlur = (
    fieldName: keyof EditProfileFormData,
    defaultValue: string,
  ) => {
    setFocusedInput(null);
    const currentValue = watch(fieldName);
    if (!currentValue || currentValue.trim() === "") {
      setValue(fieldName, defaultValue);
      clearErrors(fieldName);
    }
  };

  const onSubmit = async (data: EditProfileFormData) => {
    console.log("Data:", data);
  };

  return (
    <View style={styles.container}>
      {/* Avatar + username */}
      <View style={styles.imageContainer}>
        <LinearGradient
          colors={[Colors.surface, Colors.primary + "1A"]}
          style={styles.gradient}
        />
        <View style={styles.avatarContainer}>
          <View style={styles.avatarWrapper}>
            <Avatar width={110} height={110} style={{ opacity: 0.8 }} />
            <View style={styles.cameraWrapper}>
              <Camera />
            </View>
          </View>
          <ThemedTextInput
            ref={(el) => {
              inputRefs.current["username"] = el;
            }}
            control={control}
            name="username"
            style={[styles.valueInput, styles.usernameInput]}
            onBlurCustom={() => handleBlur("username", displayName)}
          />
        </View>
      </View>

      {/* Other fields */}
      <View style={styles.otherDetails}>
        {details.map((detail) => (
          <View style={styles.detail} key={detail.label}>
            <ThemedText size={12} color={Colors.textMuted}>
              {detail.label}
            </ThemedText>
            <ThemedTextInput
              ref={(el) => {
                inputRefs.current[detail.name] = el;
              }}
              control={control}
              name={detail.name}
              style={[
                styles.valueInput,
                focusedInput === detail.name && {
                  borderBottomColor: Colors.white,
                },
              ]}
              onBlurCustom={() => handleBlur(detail.name, detail.value ?? "")}
              onFocus={() => setFocusedInput(detail.name)}
            />
          </View>
        ))}
      </View>

      {/* Save CTA */}
      <View style={styles.CTA}>
        <ThemedButton
          title="Cancel"
          variant="secondary"
          style={{ width: "50%" }}
        />
        <ThemedButton
          title="Save Changes"
          variant="primary"
          style={{ width: "50%" }}
        />
      </View>
    </View>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    gap: 34,
  },
  imageContainer: {
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  gradient: {
    width: "100%",
    height: 100,
    position: "absolute",
    top: 0,
  },
  avatarContainer: {
    height: "100%",
    gap: 16,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  avatarWrapper: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    width: 112,
    height: 112,
    borderRadius: 60,
    borderColor: Colors.white,
    borderWidth: 1,
  },
  cameraWrapper: {
    position: "absolute",
    bottom: -4,
    right: -8,
    width: 36,
    height: 36,
    borderRadius: 20,
    backgroundColor: Colors.surfaceDim,
    justifyContent: "center",
    alignItems: "center",
  },

  otherDetails: {
    flex: 1,
    padding: 30,
    paddingTop: 0,
    width: "100%",
    borderTopWidth: 0.5,
    borderTopColor: Colors.border + "1A",
    gap: 30,
  },
  detail: {
    gap: 4,
    height: 62,
  },
  valueInput: {
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border + "1A",
    color: Colors.white,
    width: "100%",
  },
  usernameInput: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    textAlign: "center",
    borderBottomWidth: 0,
  },
  CTA: {
    paddingBottom: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "100%",
    paddingHorizontal: 30,
    gap: 8,
    flex: 1,
  },
});
