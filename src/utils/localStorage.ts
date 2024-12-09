import type { ReminderMessage, Space } from "@/types";

export function updateLocalStorage(spaces: Space[]) {
  const spacesToStore = spaces.map((space) => ({
    ...space,
    icon: space.name,
  }));
  localStorage.setItem("spaces", JSON.stringify(spacesToStore));
}

export function updateShortcutLocalStorage(shortcut: string) {
  localStorage.setItem("shortcut", shortcut);
}

export function updateAmbientSoundLocalStorage(ambientSound: string) {
  localStorage.setItem("ambientSound", ambientSound);
}

export function updateAmbientSoundVolumeLocalStorage(volume: number) {
  localStorage.setItem("ambientSoundVolume", volume.toString());
}

export function updateReminderMessagesLocalStorage(
  messages: ReminderMessage[],
) {
  localStorage.setItem("reminderMessages", JSON.stringify(messages));
}
