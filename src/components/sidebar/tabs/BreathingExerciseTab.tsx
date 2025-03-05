import { AlternateIcon } from "@/components/icons/breathingExercise/AlternateIcon";
import { BoxIcon } from "@/components/icons/breathingExercise/BoxIcon";
import { FourSevenEightIcon } from "@/components/icons/breathingExercise/FourSevenEightIcon";
import { WimHofIcon } from "@/components/icons/breathingExercise/WimHofIcon";
import BreathingExerciseIllustration from "@/components/svgs/BreathingExerciseIllustration";
import { TabHeader } from "@/components/tabHeader";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { useSpacesContext } from "@/contexts/spaceContext";
import type { techniqueType } from "@/types";
import { useEffect, useState } from "react";

export default function BreathingExerciseTab() {
  const { spaces, selectedTab, updateSpaceProperty } = useSpacesContext();
  const [technique, setTechnique] = useState<techniqueType>("Box Breathing");

  const [isBreathingExerciseVisible, setIsBreathingExerciseVisible] =
    useState(true);

  useEffect(() => {
    const selectedSpace = spaces.find((space) => space.id === selectedTab);
    if (selectedSpace) {
      setIsBreathingExerciseVisible(!selectedSpace.breathingExercise.isHidden);
      setTechnique(selectedSpace.breathingExercise.technique);
    }
  }, [spaces, selectedTab]);

  const handleBreathingExerciseVisibilityChange = (visible: boolean) => {
    setIsBreathingExerciseVisible(visible);
    updateSpaceProperty(selectedTab, "breathingExercise", {
      ...spaces.find((s) => s.id === selectedTab)?.breathingExercise,
      isHidden: !visible,
    });
  };

  const HandleTechniqueChange = (technique: techniqueType) => {
    setTechnique(technique);
    updateSpaceProperty(selectedTab, "breathingExercise", {
      ...spaces.find((s) => s.id === selectedTab)?.breathingExercise,
      technique: technique,
    });
  };

  return (
    <main className="h-screen w-[140%] md:w-[110%]">
      <TabHeader
        title="Breathing Exercise"
        subtitle="Configure and select guided breathing techniques.
"
        Icon={BreathingExerciseIllustration}
      />
      <div className="scrollbar-thin scrollbar-gutter-stable scrollbar-track-background scrollbar-thumb-accent z-50 mt-36 max-h-[65vh] min-w-[95%] max-w-[115%] space-y-6 overflow-y-auto pr-2">
        <div className="flex min-h-10 w-full items-center justify-between space-x-2 rounded-2xl border-[1px] border-accent/20 bg-accent-foreground p-4">
          <div className="flex w-[90%] flex-col gap-1">
            <Label
              htmlFor="BreathingExercise-visibility"
              className="text-md text-foreground"
            >
              Visibility
            </Label>
            <p className="hidden overflow-hidden text-xs text-muted-foreground md:block md:max-w-none md:text-sm">
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
        <div className="flex min-h-10 w-full items-center justify-between space-x-2 rounded-2xl border-[1px] border-accent/20 bg-accent-foreground p-4 pb-16">
          <div className="flex w-full flex-col gap-1">
            <Label
              htmlFor="BreathingExercise-technique"
              className="text-md text-foreground"
            >
              Choose the breathing technique
            </Label>
            <RadioGroup
              onValueChange={HandleTechniqueChange}
              className="mt-4 gap-4"
              defaultValue={technique}
            >
              <div className="relative flex w-full items-start gap-3 rounded-2xl border border-muted-foreground/30 p-4 duration-300 hover:border-muted-foreground hover:bg-accent/60 has-[[data-state=checked]]:border-emerald-500 has-[[data-state=checked]]:bg-emerald-700/10 has-[[data-state=checked]]:text-emerald-500">
                <RadioGroupItem
                  onClick={() => HandleTechniqueChange("Box Breathing")}
                  value="Box Breathing"
                  id="radio-09-Box Breathing"
                  aria-describedby="radio-09-Box Breathing-description"
                  className="order-1 after:absolute after:inset-0"
                />
                <div className="flex grow items-start gap-3">
                  <BoxIcon />

                  <div className="grid grow gap-2">
                    <Label htmlFor="radio-09-Box Breathing">
                      Box Breathing
                    </Label>
                    <p
                      id="radio-09-Box Breathing-description"
                      className="text-xs text-muted-foreground"
                    >
                      Inhale, hold, and exhale for 4 seconds each.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative flex w-full items-start gap-3 rounded-2xl border border-muted-foreground/30 p-4 duration-300 hover:border-muted-foreground hover:bg-accent/60 has-[[data-state=checked]]:border-indigo-500 has-[[data-state=checked]]:bg-indigo-700/10 has-[[data-state=checked]]:text-indigo-500">
                <RadioGroupItem
                  onClick={() => HandleTechniqueChange("4-7-8")}
                  value="4-7-8"
                  id="radio-09-4-7-8"
                  aria-describedby="radio-09-4-7-8-description"
                  className="order-1 after:absolute after:inset-0"
                />
                <div className="flex grow items-start gap-3">
                  <FourSevenEightIcon />
                  <div className="grid grow gap-2">
                    <Label htmlFor="radio-09-4-7-8">4-7-8</Label>
                    <p
                      id="radio-09-4-7-8-description"
                      className="text-xs text-muted-foreground"
                    >
                      Inhale for 4 seconds, hold for 7 seconds, exhale for 8
                      seconds.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative flex w-full items-start gap-3 rounded-2xl border border-muted-foreground/30 p-4 duration-300 hover:border-muted-foreground hover:bg-accent/60 has-[[data-state=checked]]:border-amber-500 has-[[data-state=checked]]:bg-amber-700/10 has-[[data-state=checked]]:text-amber-500">
                <RadioGroupItem
                  onClick={() =>
                    HandleTechniqueChange("Alternate Nostril Breathing")
                  }
                  value="Alternate Nostril Breathing"
                  id="radio-09-Alternate Nostril Breathing"
                  aria-describedby="radio-09-Alternate Nostril Breathing-description"
                  className="order-1 after:absolute after:inset-0"
                />
                <div className="flex grow items-start gap-3">
                  <AlternateIcon />
                  <div className="grid grow gap-2">
                    <Label htmlFor="radio-09-Alternate Nostril Breathing">
                      Alternate Nostril Breathing
                    </Label>
                    <p
                      id="radio-09-Alternate Nostril Breathing-description"
                      className="text-xs text-muted-foreground"
                    >
                      Breathe through alternating nostrils to balance breathing.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative flex w-full items-start gap-3 rounded-2xl border border-muted-foreground/30 p-4 duration-300 hover:border-muted-foreground hover:bg-accent/60 has-[[data-state=checked]]:border-rose-500 has-[[data-state=checked]]:bg-rose-700/10 has-[[data-state=checked]]:text-rose-500">
                <RadioGroupItem
                  onClick={() => HandleTechniqueChange("Wim Hof Method")}
                  value="Wim Hof Method"
                  id="radio-09-Wim Hof Method"
                  aria-describedby="radio-09-Wim Hof Method-description"
                  className="order-1 after:absolute after:inset-0"
                />
                <div className="flex grow items-start gap-3">
                  <WimHofIcon />
                  <div className="grid grow gap-2">
                    <Label htmlFor="radio-09-Wim Hof Method">
                      Wim Hof Method
                    </Label>
                    <p
                      id="radio-09-r3-description"
                      className="text-xs text-muted-foreground"
                    >
                      Deep, rapid breathing followed by breath retention.
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
