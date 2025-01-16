import { settings as defaultSettings } from "@/contexts/settings";
import { getUserSettings } from "../getUserSettings";
import { getTimestamp } from "../getTimestamp";

export const fetchSpacesData = async ({
  userId,
}: {
  userId: string | undefined;
}) => {
  try {
    const finalSettings = {
      spaces: defaultSettings.spaces,
      shortcut: defaultSettings.shortcut,
      ambientSound: defaultSettings.ambientSound,
      reminderMessages: [],
    };

    if (userId) {
      const dbTimestamp = await getTimestamp(userId);
      const localTimestamp = localStorage.getItem("lastModified");

      // Fetch from DB if timestamps don't match or no local timestamp
      if (
        !localTimestamp ||
        !dbTimestamp ||
        new Date(localTimestamp).getTime() !== dbTimestamp.getTime()
      ) {
        const dbSettings = await getUserSettings(userId);

        // Override with database values where they exist
        if (dbSettings.spaces) finalSettings.spaces = dbSettings.spaces;
        if (dbSettings.shortcut) finalSettings.shortcut = dbSettings.shortcut;
        if (dbSettings.ambientSound)
          finalSettings.ambientSound = dbSettings.ambientSound;
        if (dbSettings.reminderMessages)
          finalSettings.reminderMessages = dbSettings.reminderMessages;

        // Update local storage with fresh data
        localStorage.setItem("spaces", JSON.stringify(finalSettings.spaces));
        localStorage.setItem("shortcut", finalSettings.shortcut);
        localStorage.setItem("ambientSound", finalSettings.ambientSound);
        localStorage.setItem(
          "reminderMessages",
          JSON.stringify(finalSettings.reminderMessages),
        );
        if (dbTimestamp) {
          localStorage.setItem("lastModified", dbTimestamp.toISOString());
        }

        return finalSettings;
      }
    }

    // If no userId or timestamps match, try localStorage
    const localSpacesData = localStorage.getItem("spaces");
    const localShortcut = localStorage.getItem("shortcut");
    const localReminderMessagesRaw = localStorage.getItem("reminderMessages");
    const localAmbientSound = localStorage.getItem("ambientSound");

    // Override defaults with localStorage values if they exist
    if (localSpacesData) {
      const parsedSpaces = JSON.parse(localSpacesData);
      finalSettings.spaces = parsedSpaces.map((space: any) => {
        const defaultSpace = defaultSettings.spaces.find(
          (s) => s.id === space.id,
        );
        if (!defaultSpace) {
          console.warn(`No default space found for ID ${space.id}`);
          return space;
        }
        return {
          ...defaultSpace,
          ...space,
          icon: defaultSpace.icon,
        };
      });
    }

    if (localShortcut) finalSettings.shortcut = localShortcut;
    if (localAmbientSound) finalSettings.ambientSound = localAmbientSound;
    if (localReminderMessagesRaw) {
      finalSettings.reminderMessages = JSON.parse(localReminderMessagesRaw);
    }

    return finalSettings;
  } catch (error) {
    console.error("Error fetching spaces data:", error);
    // Fall back to defaults if everything fails
    return {
      spaces: defaultSettings.spaces,
      shortcut: defaultSettings.shortcut,
      ambientSound: defaultSettings.ambientSound,
      reminderMessages: [],
    };
  }
};
