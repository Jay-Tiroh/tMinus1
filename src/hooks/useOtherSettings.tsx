import { showErrorToast, showSuccessToast } from "@/hooks/showToast";
import { useAppDispatch } from "@/store/hooks";
import {
  useSettingsQuery,
  useUpdateSettingsMutation,
} from "@/store/services/profileApi";
import { updateUserSettings } from "@/store/slices/authSlice";
import { FiatCurrency, UpdateSettingsRequest } from "@/types/profile";
import { getErrorMessage } from "@/utils/errors";
import { logger } from "@/utils/logger";

export default function useOtherSettings() {
  const [
    updateSettings,
    { isLoading: updating, isSuccess: updated, isError: updateFailed },
  ] = useUpdateSettingsMutation();
  const {
    data: settings,
    isLoading: fetchingSettings,
    isSuccess: fetched,
    isError: fetchFailed,
    refetch: refetch,
  } = useSettingsQuery();
  const dispatch = useAppDispatch();

  const toggleBiometricSetting = async () => {
    const prevState = settings?.biometricEnabled;

    try {
      const result = await updateSettings({
        biometricEnabled: !prevState,
      }).unwrap();

      const newValue = result?.biometricEnabled ?? !prevState;
      dispatch(updateUserSettings({ biometricEnabled: newValue }));

      showSuccessToast({ title: "Biometric setting updated!" });
    } catch (error) {
      showErrorToast({
        title: "Action Failed!",
        message:
          getErrorMessage(error,"Could not toggle biometric setting. Please check your network connection."),
      });
      logger.log(error);
    }
  };

  const changeFiatCurrency = async (newCurrency: FiatCurrency) => {
    const prevCurrency = settings?.fiatCurrency;
    if (prevCurrency === newCurrency) return; // No change needed
    const update: UpdateSettingsRequest = {
      fiatCurrency: newCurrency,
    };
    try {
      await updateSettings(update).unwrap();

      showSuccessToast({
        title: "Fiat currency updated!",
      });
    } catch (error) {
      showErrorToast({
        title: "Action Failed!",
        message:
          getErrorMessage(error, "Could not change fiat currency. Please check your network connection."),
      });

      logger.log(error);
    }
  };

  return {
    settings,
    fetchingSettings,
    fetched,
    fetchFailed,
    updating,
    updated,
    updateFailed,
    toggleBiometricSetting,
    changeFiatCurrency,
    refetch,
  };
}
