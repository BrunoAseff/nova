import type { PomodoroProps } from "@/types";
import FocusTimer from "./FocusTimer";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/nova/PomodoroTabs";

export default function Pomodoro(props: PomodoroProps) {
  const { isHidden = false } = props;

  if (isHidden) return null;

  return (
    <Tabs
      defaultValue="Focus"
      className="border-1 fixed left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-center text-foreground shadow-foreground drop-shadow-xl"
    >
      <TabsList>
        <TabsTrigger value="Focus">Focus</TabsTrigger>
        <TabsTrigger value="Short Break">Short Break</TabsTrigger>
        <TabsTrigger value="Long Break">Long Break</TabsTrigger>
      </TabsList>
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
