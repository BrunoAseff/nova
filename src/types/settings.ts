import type { ReminderMessage, ShortcutName, Space } from "@/types";

export interface SpaceContextValue {
  spaces: Space[];
  selectedTab: string;
  selectTab: (tab: string) => void;
  updateSpaceProperty: (
    spaceName: string,
    propertyName: keyof Space,
    value: any,
  ) => void;
  updateSpaceSharedProperty: (propertyName: "isHidden", value: boolean) => void;
  playPomodoroAlarm: () => Promise<void>;
  stopPomodoroAlarm: ({ currentSpace }: { currentSpace: Space }) => void;
  isAlarmPlaying: boolean;
  shortcut: ShortcutName;
  ambientSound: string;
  updateShortcut: (newShortcut: ShortcutName) => void;
  ambientSoundVolume: number;
  isAmbientSoundPlaying: boolean;
  playAmbientSound: (soundUrl?: string) => void;
  pauseAmbientSound: () => void;
  updateAmbientSound: (soundUrl: string) => void;
  updateAmbientSoundVolume: (volume: number) => void;
  toggleAmbientSound: () => void;
  resetSpaces: () => void;
  setSpaces: (spaces: Space[]) => void;
  setShortcut: (shortcut: ShortcutName) => void;
  setAmbientSound: (ambientSound: string) => void;
  setAmbientSoundVolume: (volume: number) => void;
  setReminderMessages: (messages: ReminderMessage[]) => void;
  reminderMessages: ReminderMessage[];
  updateReminder: (newReminder: ReminderMessage) => void;
}

export interface settingsType {
  spaces: Space[];
  shortcut: ShortcutName;
  reminderMessages: ReminderMessage[];
  ambientSound: string;
  ambientSoundVolume: number;
  isAmbientSoundPlaying: boolean;
}
