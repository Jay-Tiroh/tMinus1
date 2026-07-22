import { Spacer } from "@/shared/components/Spacer";
import { ThemedButton } from "@/shared/components/ThemedButton";
import { ThemedText } from "@/shared/components/ThemedText";
import Template from "@/shared/components/Template";
import { ThemedTextInput } from "@/components/user/ThemedTextInput";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import useMisc from "@/constants/misc";
import { showErrorToast, showSuccessToast } from "@/shared/hooks/showToast";
import { EditProfileFormData, editProfileSchema } from "@/schemas/authSchemas";
import { useUpdateProfileMutation } from "@/store/services/profileApi";
import { UpdateProfileRequest } from "@/types/profile";
import { getErrorMessage } from "@/utils/errors";
import { logger } from "@/utils/logger";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, StyleSheet, View } from "react-native";

const EditProfileScreen = () => {
  const { profileData } = useMisc();
  const { email, phone, fullName: displayName, avatarUrl } = profileData;
  const url =
    "https://i.pinimg.com/736x/5b/be/ee/5bbeee93769cc27ca229e3b2a3025d4c.jpg";

  const { control, handleSubmit, reset } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    mode: "onChange",
    defaultValues: {
      fullName: displayName || "",
      avatarUrl: avatarUrl || "",
    },
  });

  // Keep form in sync if displayName updates externally
  useEffect(() => {
    if (displayName) {
      reset({ fullName: displayName });
    }
  }, [displayName, reset]);

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const router = useRouter();
  const onSubmit = async (data: EditProfileFormData) => {
    // Avoid unnecessary API calls if the name hasn't changed
    // if (data.fullName.trim() === displayName) return;

    const payload: UpdateProfileRequest = {
      fullName: data.fullName.trim(),
      avatarUrl: data.avatarUrl?.trim() ? data.avatarUrl?.trim() : url,
    };
    try {
      await updateProfile(payload).unwrap();
      showSuccessToast({
        title: "Profile Updated",
        message: "Your profile details have been saved successfully.",
      });
      router.replace("/(tabs)/user/profile");
    } catch (error) {
      logger.error("Failed to update profile:", error);
      showErrorToast({
        title: "Update Failed",
        message: getErrorMessage(
          error,
          "We couldn't update your profile right now. Please try again.",
        ),
      });
    }
  };

  // Config-driven locked fields
  const lockedFields = [
    {
      id: "email",
      label: "Email Address",
      value: email,
      fallback: "No email linked",
    },
    {
      id: "phone",
      label: "Mobile Number",
      value: phone,
      fallback: "No phone linked",
    },
  ];

  return (
    <Template
      textBlockProps={{
        title: "Edit Profile",
        body: "Update your personal details. Security-sensitive fields are locked and cannot be changed here.",
      }}
      ctaProps={undefined}
    >
      <View style={[styles.container, { paddingHorizontal: 24 }]}>
        {/* Editable Fields Container */}
        <View style={styles.fieldsContainer}>
          <View style={styles.inputBox}>
            <ThemedText size={12} color={Colors.textMidGray}>
              Full Name
            </ThemedText>
            <ThemedTextInput
              control={control}
              name="fullName"
              style={styles.textInput}
              placeholder="Enter your full name"
            />
          </View>
          <View style={styles.inputBox}>
            <ThemedText size={12} color={Colors.textMidGray}>
              Avatar URL (optional)
            </ThemedText>
            <ThemedTextInput
              control={control}
              name="avatarUrl"
              style={styles.textInput}
              placeholder="Enter your profile picture URL"
            />
          </View>
        </View>

        <Spacer size={24} />

        {/* Locked Fields Container */}
        <View style={styles.fieldsContainer}>
          {lockedFields.map((field) => (
            <View key={field.id} style={styles.lockedBox}>
              <View style={styles.lockedTextGroup}>
                <ThemedText size={12} color={Colors.textMidGray}>
                  {field.label}
                </ThemedText>
                <ThemedText size={16} color={Colors.textFaint} weight="medium">
                  {field.value || field.fallback}
                </ThemedText>
              </View>
              <MaterialCommunityIcons
                name="lock-outline"
                size={20}
                color={Colors.textMidGray}
              />
            </View>
          ))}
        </View>

        <Spacer size={42} />

        {/* Form Actions */}
        <View style={styles.ctaRow}>
          <ThemedButton
            title="Cancel"
            variant="secondary"
            style={styles.flexButton}
            onPress={() => {
              reset();
              router.back();
            }}
            disabled={isLoading}
          />
          <ThemedButton
            title="Save Changes"
            variant="primary"
            style={styles.flexButton}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            iconComponent={
              isLoading ? (
                <ActivityIndicator color={Colors.surfaceNavy} />
              ) : undefined
            }
          />
        </View>
      </View>
    </Template>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
  },
  fieldsContainer: {
    gap: 16,
    width: "100%",
  },
  inputBox: {
    backgroundColor: Colors.backgroundDark,
    borderRadius: 18,
    paddingHorizontal: 16,
    height: 86,
    justifyContent: "center",
    gap: 8,
  },
  textInput: {
    color: Colors.snowGray,
    fontSize: 18,
    fontFamily: Fonts.medium,
    paddingTop: 0,
    paddingBottom: 0,
    margin: 0,
    borderBottomWidth: 0,
  },
  lockedBox: {
    backgroundColor: Colors.backgroundDark,
    borderRadius: 18,
    paddingHorizontal: 16,
    height: 86,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  lockedTextGroup: {
    gap: 4,
    justifyContent: "center",
  },
  ctaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    gap: 12,
  },
  flexButton: {
    flex: 1,
  },
});
