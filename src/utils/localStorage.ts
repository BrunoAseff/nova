import type { ReminderMessage, Space } from "@/types";

export function updateLocalStorage(spaces: Space[]) {
  const spacesToStore = spaces.map((space) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { icon, ...spaceWithoutIcon } = space;
    return spaceWithoutIcon;
  });

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
