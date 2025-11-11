import type { ReminderMessage, ShortcutName, Space } from "@/types";

export interface SpaceContextValue {
  spaces: Space[];
  selectedTab: number;
  selectTab: (tab: number) => void;
  updateSpaceProperty: (
    spaceId: number,
    propertyName: keyof Space,
    value: any,
  ) => Promise<void>;
  playPomodoroAlarm: () => Promise<void>;
  stopPomodoroAlarm: ({ currentSpace }: { currentSpace: Space }) => void;
  isAlarmPlaying: boolean;
  shortcut: ShortcutName;
  ambientSound: string;
  updateShortcut: (newShortcut: ShortcutName) => Promise<void>;
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
  updateReminder: (newReminder: ReminderMessage) => Promise<void>;
  deleteReminder: (id: string) => Promise<void>;
  updateReminderType: (
    id: string,
    newType: ReminderMessage["type"],
  ) => Promise<void>;
  updateReminderText: (id: string, newText: string) => Promise<void>;
}

export interface settingsType {
  spaces: Space[];
  shortcut: ShortcutName;
  reminderMessages: ReminderMessage[];
  ambientSound: string;
  ambientSoundVolume: number;
  isAmbientSoundPlaying: boolean;
}
