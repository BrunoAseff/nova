import { TabHeader } from "@/components/tabHeader";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useSpacesContext } from "@/contexts/spaceContext";
import { useEffect, useState } from "react";

export default function BreathingExerciseTab() {
  const { spaces, selectedTab, updateSpaceProperty } = useSpacesContext();

  const [isBreathingExerciseVisible, setIsBreathingExerciseVisible] =
    useState(true);

  useEffect(() => {
    const selectedSpace = spaces.find((space) => space.name === selectedTab);
    if (selectedSpace) {
      setIsBreathingExerciseVisible(!selectedSpace.breathingExercise.isHidden);
    }
  }, [spaces, selectedTab]);

  const handleBreathingExerciseVisibilityChange = (visible: boolean) => {
    setIsBreathingExerciseVisible(visible);
    updateSpaceProperty(selectedTab, "breathingExercise", {
      ...spaces.find((s) => s.name === selectedTab)?.breathingExercise,
      isHidden: !visible,
    });
  };

  return (
    <main className="h-screen">
      <TabHeader
        title="Breathing Exercise"
        subtitle="Configure and select guided breathing techniques.
"
        src="/illustrations/breathing-exercise.svg"
      />
      <div className="mt-32 flex h-full min-w-[110%] flex-col gap-10">
        <div className="flex min-h-10 w-full items-center justify-between space-x-2 rounded-2xl border-[1px] border-accent p-4">
          <div className="flex w-full flex-col gap-1">
            <Label
              htmlFor="BreathingExercise-visibility"
              className="text-md text-foreground"
            >
              Visibility
            </Label>
            <p className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-muted-foreground">
              Controls if the Breathing Exercise is visible on the screen.
            </p>
          </div>
          <Switch
            className="ml-auto"
            id="BreathingExercise-visibility"
            checked={isBreathingExerciseVisible}
            onCheckedChange={handleBreathingExerciseVisibilityChange}
          />
        </div>
      </div>
    </main>
  );
}
