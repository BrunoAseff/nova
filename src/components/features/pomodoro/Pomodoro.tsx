import type { PomodoroProps } from "@/types";
import FocusTimer from "./FocusTimer";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/nova/PomodoroTabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCycleStore } from "@/stores/useCycleStore";

export default function Pomodoro(props: PomodoroProps) {
  const { isHidden = false } = props;

  const currentTab = useCycleStore((state) => state.currentTab);

  if (isHidden) return null;

  return (
    <Tabs
      value={currentTab}
      className="border-1 fixed left-1/2 top-1/2 flex min-w-[63%] -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-center text-foreground shadow-foreground drop-shadow-xl"
    >
      <Tooltip delayDuration={0}>
        <div className="hover:none flex flex-col items-center justify-center font-montserrat">
          <TooltipTrigger asChild>
            <TabsList>
              <TabsTrigger value="Focus">Focus</TabsTrigger>
              <TabsTrigger value="Short Break">Short Break</TabsTrigger>
              <TabsTrigger value="Long Break">Long Break</TabsTrigger>
            </TabsList>
          </TooltipTrigger>
        </div>
        <TooltipContent className="font-inter font-medium">
          The tabs switch automatically
        </TooltipContent>
      </Tooltip>

      <TabsContent value="Focus">
        <FocusTimer />
      </TabsContent>
      <TabsContent value="Short Break">
        <FocusTimer />
      </TabsContent>
      <TabsContent value="Long Break">
        <FocusTimer />
      </TabsContent>
    </Tabs>
  );
}
