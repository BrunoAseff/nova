export interface ClockProps {
  timeFormat: "12h" | "24h";
  position: "top-left" | "top-right" | "bottom-left" | "center";
  isHidden?: boolean;
}

export interface PomodoroProps {
  isHidden?: boolean;
}

export interface Space {
  name: string;
  clock: ClockProps;
  pomodoro: PomodoroProps;
  background: string;
}
