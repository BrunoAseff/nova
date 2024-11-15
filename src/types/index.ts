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

export interface Background {
  url: string;
}

export interface Space {
  name: string;
  clock: ClockProps;
  pomodoro: PomodoroProps;
  quote: QuoteProps;
  timer: TimerProps;
  background: Background;
  icon: JSX.Element;
}
