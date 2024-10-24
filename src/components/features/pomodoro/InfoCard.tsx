import { Info } from "@/components/icons/Info";
import IconBtn from "@/components/nova/buttons/IconBtn";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/HoverCard";
import { CyclesContext } from "@/contexts/cycleContext";
import { useContext, useEffect, useState } from "react";
import { differenceInSeconds } from "date-fns";

export default function InfoCard() {
  const {
    cycleCounter,
    completedCycles,
    startTime,
    focusedTime,
    breakTime,
    activeCycle,
  } = useContext(CyclesContext);

  const [overallTime, setOverallTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (startTime && activeCycle) {
        setOverallTime(differenceInSeconds(new Date(), startTime));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, activeCycle]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    }
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  return (
    <HoverCard openDelay={500}>
      <HoverCardTrigger>
        <IconBtn>
          <Info />
        </IconBtn>
      </HoverCardTrigger>
      <HoverCardContent
        side="top"
        sideOffset={30}
        align="center"
        className="w-80"
      >
        <div className="flex flex-col gap-3 bg-background text-sm text-foreground">
          <strong className="text-lg">Pomodoro stats</strong>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p>Current cycle progress:</p>
              <span className="rounded-full bg-muted px-3 py-1">
                {cycleCounter}/4
              </span>
            </div>

            <div className="flex items-center justify-between">
              <p>Cycles completed:</p>
              <span className="rounded-full bg-muted px-3 py-1">
                {completedCycles}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <p>Overall time:</p>
              <span className="rounded-full bg-muted px-3 py-1">
                {formatTime(overallTime)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <p>Focused time:</p>
              <span className="rounded-full bg-muted px-3 py-1">
                {formatTime(focusedTime)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <p>Break time:</p>
              <span className="rounded-full bg-muted px-3 py-1">
                {formatTime(breakTime)}
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
