import type { PomodoroProps } from "@/types";
import FocusTimer from "./FocusTimer";

export default function Pomodoro(props: PomodoroProps) {
  const { isHidden = false } = props;

  if (isHidden) return null;

  return (
    <div>
      <FocusTimer />
    </div>
  );
}
