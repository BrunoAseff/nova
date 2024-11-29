import React, { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import Waves from "../icons/ambientSound/Waves";
import Rain from "../icons/ambientSound/Rain";
import Birds from "../icons/ambientSound/Birds";
import Fire from "../icons/ambientSound/Fire";
import Underwater from "../icons/ambientSound/Underwater";
import Cafe from "../icons/ambientSound/Cafe";
import Beach from "../icons/ambientSound/Beach";
import Tropical from "../icons/ambientSound/Tropical";
import HeavyRain from "../icons/ambientSound/HeavyRain";

export default function AmbientSoundShortcut() {
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
    <main className="h-fit">
      <h1 className="font-delius text-xl text-secondary-foreground/80">
        <span className="text-secondary">Ambient Sound</span> settings
      </h1>
      <div className="w-fill flex items-center gap-2 space-x-2 rounded-2xl border-[1px] border-background p-2">
        <div className="flex w-full items-center justify-evenly gap-1">
          <div className="mt-1 flex items-center space-x-4 rounded-full">
            <IconBtn onClick={handlePlayPause}>
              {isAmbientSoundPlaying ? <Pause /> : <Play />}
            </IconBtn>
            <IconBtn onClick={handleMuteToggle}>
              {ambientSoundVolume === 0 ? <MutedVolumeIcon /> : <VolumeIcon />}
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
      {/* Volume Control with Play/Pause */}

      <div className="my-1 flex min-h-10 min-w-[110%] items-center justify-between space-x-2 rounded-2xl border-[1px] border-background">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between space-x-2">
            <div className="flex flex-col gap-1">
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

          {/* Sound Selection */}

          <RadioGroup
            value={currentSound?.name ?? ""}
            onValueChange={handleSoundChange}
            className="scrollbar-thin scrollbar-track-background scrollbar-thumb-accent overflow mt-2 grid max-h-[43vh] w-full grid-cols-3 items-center justify-between gap-4 overflow-y-auto pb-10 pr-2"
          >
            {filteredSounds.map((sound) => {
              const isChecked = sound.url === ambientSound;
              const SoundIcon = SoundIconMap[sound.name];
              return (
                <label
                  key={sound.name}
                  className={`relative flex h-20 w-24 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border text-center shadow-sm ring-offset-background transition-colors ${
                    isChecked
                      ? "border-secondary bg-secondary-smooth-700/10"
                      : "border-accent"
                  } ${isChecked ? "text-secondary" : "text-foreground"} focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2`}
                >
                  <RadioGroupItem
                    value={sound.name}
                    className="sr-only items-center justify-center"
                  />
                  <div
                    className={`flex h-6 w-6 items-center justify-center ${
                      isChecked ? "text-secondary" : "text-foreground"
                    } ${isChecked ? "opacity-100" : "opacity-60"}`}
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
                </label>
              );
            })}
          </RadioGroup>
        </div>
      </div>
    </main>
  );
}
