import Arrow from "@/assets/icons/back.svg";
import NoFeedbackSwitch from "@/components/ThemedSwitch";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useUpdateSettingsMutation } from "@/store/services/profileApi";
import {
  UpdateSettingsRequest,
  UpdateSettingsRequestData,
} from "@/types/profile";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SvgProps } from "react-native-svg";

type ItemProps = {
  label: string;
  value: string | boolean;
  settingKey?: keyof UpdateSettingsRequestData;
  icon?: React.FC<SvgProps>;
  altIcon?: (props: { color: string; size: number }) => React.ReactNode;
  pushTo?: string;
};

const Item = ({
  label,
  value,
  settingKey,
  icon: Icon,
  altIcon,
  pushTo,
}: ItemProps) => {
  const router = useRouter();
  const [updateSettings, { isLoading }] = useUpdateSettingsMutation();

  const isToggle = typeof value === "boolean";
  const [isEnabled, setIsEnabled] = useState(Boolean(value));

  // Re-sync local state when server data updates after refetch
  useEffect(() => {
    setIsEnabled(Boolean(value));
  }, [value]);

  const handlePress = () => {
    if (pushTo) router.push(`/user/edit-profile?edit=${pushTo}`);
  };

  const toggleSwitch = async () => {
    const nextState = !isEnabled;
    setIsEnabled(nextState); // Optimistic update

    if (settingKey) {
      const update = {
        [settingKey]: nextState,
      } as unknown as UpdateSettingsRequest;

      const result = await updateSettings(update);

      if ("error" in result) {
        // Revert only THIS item on failure
        console.error("Failed to update setting:", result.error);
        setIsEnabled(!nextState);
      }
      console.log("Update result:", result);
    }
  };

  return (
    <View style={styles.detail} key={label}>
      <View style={styles.valueContainer}>
        {Icon && (
          <View style={styles.iconContainer}>
            <Icon width={17} height={17} color={Colors.profit} />
          </View>
        )}
        {altIcon && (
          <View style={styles.iconContainer}>
            {altIcon({ color: Colors.profit, size: 17 })}
          </View>
        )}
        <View>
          <ThemedText size={14} color={Colors.textFaint}>
            {label}
          </ThemedText>
        </View>
      </View>
      <View style={styles.valueContainer}>
        {!isToggle && (
          <ThemedText size={14} color={Colors.textMuted}>
            {value as string}
          </ThemedText>
        )}
        {isToggle ? (
          <NoFeedbackSwitch
            onValueChange={toggleSwitch}
            value={isEnabled}
            disabled={isLoading}
          />
        ) : (
          <Arrow
            color={Colors.textMuted}
            style={{ transform: [{ rotate: "180deg" }] }}
            onPress={handlePress}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          />
        )}
      </View>
    </View>
  );
};

export default Item;

const styles = StyleSheet.create({
  detail: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border + "4d",
    height: 62,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceCard,
    justifyContent: "center",
    alignItems: "center",
  },
});
