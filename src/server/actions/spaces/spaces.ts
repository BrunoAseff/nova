import { settings } from "@/contexts/settings";
import type { ReminderMessage } from "@/types";

export const fetchSpacesData = async () => {
  const fetchBackendSpaces = async () => {
    return null;
  };

  try {
    const backendData = await fetchBackendSpaces(); // Placeholder function for backend API call.
    if (backendData) return backendData;

    // Fetch spaces from local storage
    const localSpacesData = localStorage.getItem("spaces");
    const localShortcut = localStorage.getItem("shortcut") ?? settings.shortcut;
    const localReminderMessagesRaw = localStorage.getItem("reminderMessages");
    const localAmbientSound =
      localStorage.getItem("ambientSound") ?? settings.ambientSound;
    const localAmbientSoundVolume = localStorage.getItem("ambientSoundVolume")
      ? parseInt(localStorage.getItem("ambientSoundVolume")!, 10)
      : settings.ambientSoundVolume;

    // Parse reminder messages safely
    const localReminderMessages: ReminderMessage[] = localReminderMessagesRaw
      ? JSON.parse(localReminderMessagesRaw)
      : [];

    if (localSpacesData) {
      const parsedSpacesData = JSON.parse(localSpacesData);
      const reconstructedSpaces = parsedSpacesData.map((space: any) => ({
        ...settings.spaces.find((s) => s.name === space.name),
        ...space,
        icon: settings.spaces.find((s) => s.name === space.name)?.icon,
      }));

      return {
        spaces: reconstructedSpaces,
        shortcut: localShortcut,
        ambientSound: localAmbientSound,
        ambientSoundVolume: localAmbientSoundVolume,
        reminderMessages: localReminderMessages,
      };
    }

    return {
      spaces: settings.spaces,
      shortcut: settings.shortcut,
      ambientSound: settings.ambientSound,
      ambientSoundVolume: settings.ambientSoundVolume,
      reminderMessages: [],
    };
  } catch (error) {
    console.error("Error fetching spaces data:", error);
    return {
      spaces: settings.spaces,
      shortcut: settings.shortcut,
      ambientSound: settings.ambientSound,
      ambientSoundVolume: settings.ambientSoundVolume,
      reminderMessages: [],
    };
  }
};
