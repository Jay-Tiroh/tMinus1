import { showErrorToast, showInfoToast } from "@/shared/hooks/showToast";
import { logger } from "@/shared/utils/logger";
import * as Updates from "expo-updates";
import { Alert } from "react-native";

/**
 * Checks if an OTA update is available.
 * Returns the update info if found, or null if not.
 */
export async function checkForUpdate() {
  try {
    if (__DEV__) {
      logger.log("Skipping update check in development");
      return null;
    }

    const update = await Updates.checkForUpdateAsync();

    if (update.isAvailable) {
      logger.log("Update available:", update.manifest);
      return update;
    }

    logger.log("No update available");
    return null;
  } catch (error) {
    logger.error("Error checking for update:", error);
    return null;
  }
}

/**
 * Downloads and applies an available update, then reloads the app.
 * Call this after checkForUpdate() confirms one exists.
 */
export async function applyUpdate() {
  try {
    const result = await Updates.fetchUpdateAsync();

    if (result.isNew) {
      // Update downloaded successfully — reload to run it
      await Updates.reloadAsync();
    } else {
      logger.log("Fetched update was not new — nothing to apply");
      showInfoToast({
        title: "No Update",
        message: "The fetched update was not new. No changes applied.",
      });
    }
  } catch (error) {
    logger.error("Error fetching/applying update:", error);
    Alert.alert(
      "Update Failed",
      "Something went wrong while updating. Please try again later.",
    );
    showErrorToast({
      title: "Update Failed",
      message: "Something went wrong while updating. Please try again later.",
    });
  }
}
