export interface ClockProps {
  timeFormat: "12h" | "24h";
  position: "top-left" | "top-right" | "bottom-left" | "center";
  isHidden?: boolean;
}

export interface PomodoroProps {
  isHidden?: boolean;
}

export interface TimerProps {
  isHidden?: boolean;
}

export interface Space {
  name: string;
  clock: ClockProps;
  pomodoro: PomodoroProps;
  timer: TimerProps;
  background: string;
  icon: JSX.Element;
}
