import { settings as defaultSettings } from "@/contexts/settings";
import { getUserSettings } from "../getUserSettings";

export const fetchSpacesData = async ({
  userId,
}: {
  userId: string | undefined;
}) => {
  try {
    // Initialize with default settings
    // eslint-disable-next-line prefer-const
    let finalSettings = {
      spaces: defaultSettings.spaces,
      shortcut: defaultSettings.shortcut,
      ambientSound: defaultSettings.ambientSound,
      reminderMessages: [],
    };

    // Try to get localStorage values
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

    // If we have a userId, get database values
    if (userId) {
      const dbSettings = await getUserSettings(userId);

      // Override with database values where they exist
      if (dbSettings.spaces) finalSettings.spaces = dbSettings.spaces;
      if (dbSettings.shortcut) finalSettings.shortcut = dbSettings.shortcut;
      if (dbSettings.ambientSound)
        finalSettings.ambientSound = dbSettings.ambientSound;
      if (dbSettings.reminderMessages)
        finalSettings.reminderMessages = dbSettings.reminderMessages;
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
