import { Info } from "@/components/icons/Info";
import IconBtn from "@/components/nova/buttons/IconBtn";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/HoverCard";
import { CyclesContext } from "@/contexts/cycleContext";
import { useContext } from "react";

export default function InfoCard() {
  const { cycleCounter } = useContext(CyclesContext);

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
        className="w-fit"
      >
        <div className="flex flex-col justify-between gap-2 bg-background text-foreground">
          <strong className="mb-2">Pomodoro information</strong>
          <div className="flex items-center gap-1">
            <p>Cycle Counter:</p>
            <span className="rounded-full bg-muted px-3 py-1">
              {cycleCounter}
            </span>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
