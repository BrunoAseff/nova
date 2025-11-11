"use server";

import { settings as defaultSettings } from "@/contexts/settings";
import { getUserSettings } from "../getUserSettings";

export async function fetchSpacesFromDb(userId: string) {
  try {
    const dbSettings = await getUserSettings(userId);

    const finalSettings = {
      spaces: dbSettings.spaces ?? defaultSettings.spaces,
      shortcut: dbSettings.shortcut ?? defaultSettings.shortcut,
      ambientSound: dbSettings.ambientSound ?? defaultSettings.ambientSound,
      reminderMessages: dbSettings.reminderMessages ?? [],
    };

    return finalSettings;
  } catch (error) {
    console.error("Error fetching spaces from database:", error);
    return {
      spaces: defaultSettings.spaces,
      shortcut: defaultSettings.shortcut,
      ambientSound: defaultSettings.ambientSound,
      reminderMessages: [],
    };
  }
}
