import { AlternateIcon } from "@/components/icons/breathingExercise/AlternateIcon";
import { BoxIcon } from "@/components/icons/breathingExercise/BoxIcon";
import { FourSevenEightIcon } from "@/components/icons/breathingExercise/FourSevenEightIcon";
import { WimHofIcon } from "@/components/icons/breathingExercise/WimHofIcon";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { useSpacesContext } from "@/contexts/spaceContext";
import type { techniqueType } from "@/types";
import { useEffect, useState } from "react";

export default function BreathingExerciseShortcut() {
  const { spaces, selectedTab, updateSpaceProperty } = useSpacesContext();
  const [technique, setTechnique] = useState<techniqueType>("Box Breathing");

  const [isBreathingExerciseVisible, setIsBreathingExerciseVisible] =
    useState(true);

  useEffect(() => {
    const selectedSpace = spaces.find((space) => space.name === selectedTab);
    if (selectedSpace) {
      setIsBreathingExerciseVisible(!selectedSpace.breathingExercise.isHidden);
      setTechnique(selectedSpace.breathingExercise.technique);
    }
  }, [spaces, selectedTab]);

  const handleBreathingExerciseVisibilityChange = (visible: boolean) => {
    setIsBreathingExerciseVisible(visible);
    updateSpaceProperty(selectedTab, "breathingExercise", {
      ...spaces.find((s) => s.name === selectedTab)?.breathingExercise,
      isHidden: !visible,
    });
  };

  const HandleTechniqueChange = (technique: techniqueType) => {
    setTechnique(technique);
    updateSpaceProperty(selectedTab, "breathingExercise", {
      ...spaces.find((s) => s.name === selectedTab)?.breathingExercise,
      technique: technique,
    });
  };

  return (
    <main className="h-fit">
      <h1 className="mb-6 font-delius text-xl text-secondary-foreground/80">
        <span className="text-secondary">Breathing Exercise</span> settings
      </h1>
      <div className="z-50 space-y-3">
        <div className="flex min-h-10 w-full items-center justify-between space-x-2 rounded-2xl border-[1px] border-accent/20 bg-accent-foreground p-4">
          <div className="flex w-full flex-col gap-1">
            <Label
              htmlFor="BreathingExercise-visibility"
              className="text-md text-foreground"
            >
              Visibility
            </Label>
          </div>
          <Switch
            className="ml-auto"
            id="BreathingExercise-visibility"
            checked={isBreathingExerciseVisible}
            onCheckedChange={handleBreathingExerciseVisibilityChange}
          />
        </div>
        <div className="flex min-h-10 w-full items-center justify-between space-x-2 rounded-2xl border-[1px] border-accent/20 bg-accent-foreground p-4 pb-4">
          <div className="flex w-full flex-col gap-1">
            <Label
              htmlFor="BreathingExercise-technique"
              className="text-md text-foreground"
            >
              Technique
            </Label>
            <RadioGroup
              onValueChange={HandleTechniqueChange}
              className="mt-1 gap-4"
              defaultValue={technique}
            >
              <div className="relative flex w-full items-center justify-center gap-3 rounded-2xl border border-accent p-4 hover:bg-background has-[[data-state=checked]]:border-purple-500 has-[[data-state=checked]]:bg-purple-700/10 has-[[data-state=checked]]:text-purple-500">
                <RadioGroupItem
                  onClick={() => HandleTechniqueChange("Box Breathing")}
                  value="Box Breathing"
                  id="radio-09-Box Breathing"
                  aria-describedby="radio-09-Box Breathing-description"
                  className="order-1 after:absolute after:inset-0"
                />
                <div className="flex grow items-center justify-center gap-3">
                  <BoxIcon />

                  <div className="grid grow gap-2">
                    <Label htmlFor="radio-09-Box Breathing">
                      Box Breathing
                    </Label>
                  </div>
                </div>
              </div>

              <div className="relative flex w-full items-center justify-center gap-3 rounded-2xl border border-accent p-4 hover:bg-background has-[[data-state=checked]]:border-blue-500 has-[[data-state=checked]]:bg-blue-700/10 has-[[data-state=checked]]:text-blue-500">
                <RadioGroupItem
                  onClick={() => HandleTechniqueChange("4-7-8")}
                  value="4-7-8"
                  id="radio-09-4-7-8"
                  aria-describedby="radio-09-4-7-8-description"
                  className="order-1 after:absolute after:inset-0"
                />
                <div className="flex grow items-center justify-center gap-3">
                  <FourSevenEightIcon />
                  <div className="grid grow gap-2">
                    <Label htmlFor="radio-09-4-7-8">4-7-8</Label>
                  </div>
                </div>
              </div>

              <div className="relative flex w-full items-center justify-center gap-3 rounded-2xl border border-accent p-4 hover:bg-background has-[[data-state=checked]]:border-yellow-500 has-[[data-state=checked]]:bg-yellow-700/10 has-[[data-state=checked]]:text-yellow-500">
                <RadioGroupItem
                  onClick={() =>
                    HandleTechniqueChange("Alternate Nostril Breathing")
                  }
                  value="Alternate Nostril Breathing"
                  id="radio-09-Alternate Nostril Breathing "
                  aria-describedby="radio-09-Alternate Nostril Breathing-description"
                  className="order-1 after:absolute after:inset-0"
                />
                <div className="flex grow items-center justify-center gap-3">
                  <AlternateIcon />
                  <div className="grid grow gap-2 text-sm">
                    <Label
                      className="max-w-32"
                      htmlFor="radio-09-Alternate Nostril Breathing "
                    >
                      Alternate Nostril Breathing
                    </Label>
                  </div>
                </div>
              </div>

              <div className="relative flex w-full items-center justify-center gap-3 rounded-2xl border border-accent p-4 hover:bg-background has-[[data-state=checked]]:border-red-500 has-[[data-state=checked]]:bg-red-700/10 has-[[data-state=checked]]:text-red-500">
                <RadioGroupItem
                  onClick={() => HandleTechniqueChange("Wim Hof Method")}
                  value="Wim Hof Method"
                  id="radio-09-Wim Hof Method"
                  aria-describedby="radio-09-Wim Hof Method-description"
                  className="order-1 after:absolute after:inset-0"
                />
                <div className="flex grow items-center justify-center gap-3">
                  <WimHofIcon />
                  <div className="grid grow gap-2">
                    <Label
                      className="max-w-28"
                      htmlFor="radio-09-Wim Hof Method"
                    >
                      Wim Hof Method
                    </Label>
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
