import {
  useSettingsQuery,
  useUpdateSettingsMutation,
} from "@/features/user/api/profileApi";
import {
  FiatCurrency,
  UpdateSettingsRequest,
} from "@/features/user/types/profile";
import { showErrorToast, showSuccessToast } from "@/shared/hooks/showToast";
import { useAppDispatch } from "@/core/store/hooks";
import { updateUserSettings } from "@/features/auth/storage/authSlice";
import { getErrorMessage } from "@/shared/utils/errors";
import { logger } from "@/shared/utils/logger";

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
    refetch,
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
        message: getErrorMessage(
          error,
          "Could not toggle biometric setting. Please check your network connection.",
        ),
      });
      logger.log(error);
    }
  };

  const changeFiatCurrency = async (newCurrency: FiatCurrency) => {
    const prevCurrency = settings?.fiatCurrency;
    if (prevCurrency === newCurrency) return;
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
        message: getErrorMessage(
          error,
          "Could not change fiat currency. Please check your network connection.",
        ),
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
