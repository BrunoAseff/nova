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

export interface Space {
  name: string;
  clock: ClockProps;
  pomodoro: PomodoroProps;
  quote: QuoteProps;
  timer: TimerProps;
  background: string;
  icon: JSX.Element;
}
