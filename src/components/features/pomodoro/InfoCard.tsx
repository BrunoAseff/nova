import { Info } from "@/components/icons/Info";
import IconBtn from "@/components/nova/buttons/IconBtn";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/HoverCard";
import { CyclesContext } from "@/contexts/cycleContext";
import { useContext, useEffect } from "react";
import { differenceInSeconds } from "date-fns";

export default function InfoCard() {
  const {
    cycleCounter,
    completedCycles,
    startTime,
    focusedTimeStat,
    breakTimeStat,
    overallTimeStat,
    updateOverallTimeStat,
    activeCycle,
    initialStartTime,
    currentTab,
    setFocusedTimeStat,
    setBreakTimeStat,
  } = useContext(CyclesContext);

  useEffect(() => {
    const interval = setInterval(() => {
      if (initialStartTime) {
        const currentOverallTime = differenceInSeconds(
          new Date(),
          initialStartTime,
        );
        updateOverallTimeStat(currentOverallTime);
      }
      if (startTime && activeCycle) {
        if (currentTab === "Focus") {
          setFocusedTimeStat(focusedTimeStat + 1);
        } else {
          setBreakTimeStat(breakTimeStat + 1);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [
    initialStartTime,
    startTime,
    activeCycle,
    currentTab,
    updateOverallTimeStat,
    setBreakTimeStat,
    setFocusedTimeStat,
    breakTimeStat,
    focusedTimeStat,
  ]);

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
        <div className="border-bg-accent flex flex-col gap-3 rounded-xl border-[1px] bg-background p-6 text-sm text-foreground">
          <strong className="text-lg">Pomodoro stats</strong>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p>Current cycle progress:</p>
              <span className="rounded-full border-[1px] border-muted-foreground/40 bg-background px-3 py-1 text-foreground/90">
                {cycleCounter}/4
              </span>
            </div>

            <div className="flex items-center justify-between">
              <p>Cycles completed:</p>
              <span className="rounded-full border-[1px] border-muted-foreground/40 bg-background px-3 py-1 text-foreground/90">
                {completedCycles}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <p>Overall time:</p>
              <span className="rounded-full border-[1px] border-muted-foreground/40 bg-background px-3 py-1 text-foreground/90">
                {formatTime(overallTimeStat)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <p>Focused time:</p>
              <span className="rounded-full border-[1px] border-muted-foreground/40 bg-background px-3 py-1 text-foreground/90">
                {formatTime(focusedTimeStat)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <p>Break time:</p>
              <span className="rounded-full border-[1px] border-muted-foreground/40 bg-background px-3 py-1 text-foreground/90">
                {formatTime(breakTimeStat)}
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
