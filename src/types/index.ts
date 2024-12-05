export type Position = "top-left" | "top-right" | "bottom-left" | "center";

export interface ClockProps {
  timeFormat: "12h" | "24h";
  position: Position;
  isHidden?: boolean;
}

export type techniqueType =
  | "4-7-8"
  | "Box Breathing"
  | "Alternate Nostril Breathing"
  | "Wim Hof Method";

export interface breathingExerciseProps {
  isHidden: boolean;
  technique: techniqueType;
}

export interface PomodoroProps {
  isHidden?: boolean;
  shortBreakDuration: number;
  longBreakDuration: number;
  autoStart: boolean;
  alarmSound: boolean;
  alarmSoundURL: string;
  alarmRepeatTimes: number;
}

export interface QuoteProps {
  position: Position;
  isHidden?: boolean;
  showAuthor?: boolean;
  categories?: string[];
}

export type Background = string;

export interface Space {
  name: string;
  clock: ClockProps;
  pomodoro: PomodoroProps;
  quote: QuoteProps;
  breathingExercise: breathingExerciseProps;
  background: Background;
  icon: JSX.Element;
}

export type ShortcutName = string;

export type ambientSound = string;
