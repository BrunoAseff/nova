import React, { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { MutedVolumeIcon } from "@/components/icons/MutedVolumeIcon";
import { VolumeIcon } from "@/components/icons/VolumeIcon";
import { useSpacesContext } from "@/contexts/spaceContext";
import { ambientSounds, type Type } from "content/ambientSounds";
import { Pause } from "@/components/icons/pause";
import { Play } from "@/components/icons/Play";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from "@/components/ui/select";
import { useInteractionLock } from "@/contexts/InteractionLockContext";
import IconBtn from "@/components/nova/buttons/IconBtn";
import Beach from "@/components/icons/ambientSound/Beach";
import Birds from "@/components/icons/ambientSound/Birds";
import Cafe from "@/components/icons/ambientSound/Cafe";
import Fire from "@/components/icons/ambientSound/Fire";
import HeavyRain from "@/components/icons/ambientSound/HeavyRain";
import Rain from "@/components/icons/ambientSound/Rain";
import Tropical from "@/components/icons/ambientSound/Tropical";
import Underwater from "@/components/icons/ambientSound/Underwater";
import Waves from "@/components/icons/ambientSound/Waves";
import { TabHeader } from "@/components/tabHeader";
import TabBody from "@/components/tabBody";
import AmbientSoundIllustration from "@/components/svgs/AmbientSoundIllustration";

export default function AmbientSoundTab() {
  const {
    ambientSound,
    ambientSoundVolume,
    isAmbientSoundPlaying,
    updateAmbientSound,
    updateAmbientSoundVolume,
    playAmbientSound,
    pauseAmbientSound,
  } = useSpacesContext();

  const [selectedType, setSelectedType] = useState<Type | "All">("All");
  const { setSelectOpen, lastSelectCloseTime } = useInteractionLock();

  const currentSound = ambientSounds.find(
    (sound) => sound.url === ambientSound,
  );

  const handleSoundChange = (soundName: string) => {
    const selected = ambientSounds.find((sound) => sound.name === soundName);
    if (selected) {
      updateAmbientSound(selected.url);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    if (value[0] !== undefined) {
      updateAmbientSoundVolume(value[0]);
    }
  };

  const handleMuteToggle = () => {
    updateAmbientSoundVolume(ambientSoundVolume > 0 ? 0 : 50);
  };

  const handlePlayPause = () => {
    if (isAmbientSoundPlaying) {
      pauseAmbientSound();
    } else {
      playAmbientSound();
    }
  };

  const filteredSounds = ambientSounds.filter((sound) => {
    return selectedType === "All" || sound.type.includes(selectedType as Type);
  });

  // Mapping of sound names to icon components
  const SoundIconMap: Record<string, React.ComponentType> = {
    "Ocean Waves": Waves,
    Rain: Rain,
    Birds: Birds,
    Fire: Fire,
    Underwater: Underwater,
    "Crowded Cafe": Cafe,
    Beach: Beach,
    Tropical: Tropical,
    "Heavy Rain": HeavyRain,
  };

  return (
    <main className="h-screen w-full md:min-w-[115%]">
      <TabHeader
        title="Ambient Sound"
        subtitle="Customize the appearance and behavior of the clock on your screen."
        Icon={AmbientSoundIllustration}
      />

      <TabBody hasScrollbar={true}>
        <div className="mt-4 flex min-h-10 w-[93%] items-center gap-2 space-x-2 rounded-2xl border-[1px] border-accent/20 bg-accent-foreground p-4 md:w-[60%]">
          <div className="justify-left mt-2 flex w-full flex-col gap-1">
            <Label htmlFor="controls" className="text-md text-foreground">
              Controls
            </Label>

            <div className="flex w-fit items-center space-x-4 rounded-full border-[1px] border-muted bg-background p-3">
              <IconBtn onClick={handlePlayPause}>
                {isAmbientSoundPlaying ? <Pause /> : <Play />}
              </IconBtn>
              <IconBtn onClick={handleMuteToggle}>
                {ambientSoundVolume === 0 ? (
                  <MutedVolumeIcon />
                ) : (
                  <VolumeIcon />
                )}
              </IconBtn>
              <Slider
                value={[ambientSoundVolume]}
                onValueChange={handleVolumeChange}
                max={100}
                step={1}
                className="w-40 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="min-w-none flex min-h-10 w-[93%] items-center justify-between space-x-2 rounded-2xl border-[1px] border-accent/20 bg-accent-foreground pl-4 md:w-[60%]">
          <div className="flex flex-col gap-1">
            <div className="my-3 flex items-center justify-between space-x-2">
              <div className="flex flex-col gap-1">
                <p className="text-sm text-foreground">Type</p>

                <Select
                  onOpenChange={(isOpen) => {
                    setSelectOpen(isOpen);
                    if (!isOpen) {
                      lastSelectCloseTime.current = Date.now();
                    }
                  }}
                  data-sidebar-exclude
                  value={selectedType}
                  onValueChange={(value) =>
                    setSelectedType(value as Type | "All")
                  }
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Types</SelectLabel>
                      <SelectItem value="All">All</SelectItem>
                      <SelectItem value="Nature">Nature</SelectItem>
                      <SelectItem value="Urban">Urban</SelectItem>
                      <SelectItem value="Meditation">Meditation</SelectItem>
                      <SelectItem value="Weather">Weather</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <RadioGroup
              value={currentSound?.name ?? ""}
              onValueChange={handleSoundChange}
              className="scrollbar-thin scrollbar-track-background scrollbar-thumb-accent auto-fit z-50 mt-2 grid max-h-[43vh] min-w-0 grid-cols-3 items-center justify-between gap-4 overflow-y-auto pb-10 md:grid-cols-4"
            >
              {filteredSounds.map((sound) => {
                const isChecked = sound.url === ambientSound;
                const SoundIcon = SoundIconMap[sound.name];
                return (
                  <Label
                    key={sound.name}
                    className={`relative z-50 flex h-[4.8rem] w-[6rem] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-[1px] border-accent bg-accent-foreground p-2 text-center shadow-sm ring-offset-background transition-colors md:h-[5.5rem] md:w-[7rem] md:p-0 ${
                      isChecked
                        ? "border-secondary bg-secondary-smooth-700/10"
                        : "hover:bg-background"
                    } ${isChecked ? "text-secondary" : "text-foreground"} focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2`}
                  >
                    <RadioGroupItem
                      value={sound.name}
                      className="sr-only items-center justify-center"
                    />
                    <div
                      className={`flex h-6 w-6 items-center justify-center md:h-8 md:w-8 ${
                        isChecked ? "text-secondary" : "text-muted-foreground"
                      } ${isChecked ? "opacity-100" : "opacity-100"}`}
                    >
                      {SoundIcon ? <SoundIcon /> : null}
                    </div>
                    <p
                      className={`text-xs font-medium leading-none ${
                        isChecked ? "text-secondary" : "text-foreground"
                      }`}
                    >
                      {sound.name}
                    </p>
                  </Label>
                );
              })}
            </RadioGroup>
          </div>
        </div>
      </TabBody>
    </main>
  );
}
