import { AlternateIcon } from "@/components/icons/breathingExercise/AlternateIcon";
import { BoxIcon } from "@/components/icons/breathingExercise/BoxIcon";
import { FourSevenEightIcon } from "@/components/icons/breathingExercise/FourSevenEightIcon";
import { WimHofIcon } from "@/components/icons/breathingExercise/WimHofIcon";
import { TabHeader } from "@/components/tabHeader";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
      <div className="mt-32 flex h-full min-w-[110%] flex-col gap-8">
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
        <div className="flex min-h-10 w-full items-center justify-between space-x-2 rounded-2xl border-[1px] border-accent p-4">
          <div className="flex w-full flex-col gap-1">
            <Label
              htmlFor="BreathingExercise-technique"
              className="text-md text-foreground"
            >
              Choose the breathing technique
            </Label>
            <RadioGroup className="mt-4 gap-4" defaultValue="r1">
              <div className="relative flex w-full items-start gap-3 rounded-2xl border border-accent p-4 has-[[data-state=checked]]:border-purple-500 has-[[data-state=checked]]:bg-purple-700/10 has-[[data-state=checked]]:text-purple-500">
                <RadioGroupItem
                  value="r1"
                  id="radio-09-r1"
                  aria-describedby="radio-09-r1-description"
                  className="order-1 after:absolute after:inset-0"
                />
                <div className="flex grow items-start gap-3">
                  <BoxIcon />

                  <div className="grid grow gap-2">
                    <Label htmlFor="radio-09-r1">Box Breathing</Label>
                    <p
                      id="radio-09-r1-description"
                      className="text-xs text-muted-foreground"
                    >
                      You can use this card with a label and a description.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative flex w-full items-start gap-3 rounded-2xl border border-accent p-4 has-[[data-state=checked]]:border-blue-500 has-[[data-state=checked]]:bg-blue-700/10 has-[[data-state=checked]]:text-blue-500">
                <RadioGroupItem
                  value="r2"
                  id="radio-09-r2"
                  aria-describedby="radio-09-r2-description"
                  className="order-1 after:absolute after:inset-0"
                />
                <div className="flex grow items-start gap-3">
                  <FourSevenEightIcon />
                  <div className="grid grow gap-2">
                    <Label htmlFor="radio-09-r2">4-7-8</Label>
                    <p
                      id="radio-09-r2-description"
                      className="text-xs text-muted-foreground"
                    >
                      You can use this card with a label and a description.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative flex w-full items-start gap-3 rounded-2xl border border-accent p-4 has-[[data-state=checked]]:border-yellow-500 has-[[data-state=checked]]:bg-yellow-700/10 has-[[data-state=checked]]:text-yellow-500">
                <RadioGroupItem
                  value="r3"
                  id="radio-09-r3"
                  aria-describedby="radio-09-r3-description"
                  className="order-1 after:absolute after:inset-0"
                />
                <div className="flex grow items-start gap-3">
                  <AlternateIcon />
                  <div className="grid grow gap-2">
                    <Label htmlFor="radio-09-r3">
                      Alternate Nostril Breathing
                    </Label>
                    <p
                      id="radio-09-r3-description"
                      className="text-xs text-muted-foreground"
                    >
                      You can use this card with a label and a description.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative flex w-full items-start gap-3 rounded-2xl border border-accent p-4 has-[[data-state=checked]]:border-red-500 has-[[data-state=checked]]:bg-red-700/10 has-[[data-state=checked]]:text-red-500">
                <RadioGroupItem
                  value="r4"
                  id="radio-09-r4"
                  aria-describedby="radio-09-r4-description"
                  className="order-1 after:absolute after:inset-0"
                />
                <div className="flex grow items-start gap-3">
                  <WimHofIcon />
                  <div className="grid grow gap-2">
                    <Label htmlFor="radio-09-r4">Wim Hof Method</Label>
                    <p
                      id="radio-09-r3-description"
                      className="text-xs text-muted-foreground"
                    >
                      You can use this card with a label and a description.
                    </p>
                  </div>
                </div>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>
    </main>
  );
}
