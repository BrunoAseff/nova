export type Position = "top-left" | "top-right" | "bottom-left" | "center";

export interface ClockProps {
  timeFormat: "12h" | "24h";
  position: Position;
  isHidden?: boolean;
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

export interface TimerProps {
  isHidden?: boolean;
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
  timer: TimerProps;
  background: Background;
  icon: JSX.Element;
}

export type ShortcutName =
  | "clock"
  | "pomodoro"
  | "quote"
  | "background"
  | "music"
  | "reminder"
  | "breathingExercise"
  | "spaces"
  | "profile"
  | "ambientSound"
  | "appearance";

export type ambientSound = string;
