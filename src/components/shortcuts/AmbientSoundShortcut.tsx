import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { MutedVolumeIcon } from "@/components/icons/MutedVolumeIcon";
import { VolumeIcon } from "@/components/icons/VolumeIcon";
import type { Type } from "@/content/ambientSounds";
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
import { useAmbientSound } from "@/stores/useAmbientSound";

export default function AmbientSoundShortcut() {
  const {
    ambientSound,
    ambientSoundVolume,
    isPlaying,
    toggleMute,
    togglePlayPause,
    handleSoundChange,
    handleVolumeChange,
    selectedType,
    setSelectedType,
    getCurrentSound,
    getFilteredSounds,
  } = useAmbientSound();

  const { setSelectOpen, lastSelectCloseTime } = useInteractionLock();
  const currentSound = getCurrentSound();
  const filteredSounds = getFilteredSounds();

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
      <h1 className="mb-3 text-lg text-secondary-foreground/80">
        Ambient Sound
      </h1>

      <div className="w-fill flex items-center gap-2 space-x-2 rounded-2xl border-[1px] border-background p-2">
        <div className="flex w-full items-center justify-evenly gap-1">
          <div className="mt-1 flex items-center space-x-4 rounded-full">
            <IconBtn onClick={togglePlayPause}>
              {isPlaying ? <Pause /> : <Play />}
            </IconBtn>
            <IconBtn onClick={toggleMute}>
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

      <div className="my-1 flex min-h-10 min-w-[110%] items-center justify-between rounded-2xl border-[1px] border-background">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between space-x-2">
            <div className="flex flex-col gap-1">
              <p className="text-md text-muted-foreground">Filter by type</p>
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
                <SelectTrigger className="mb-3 w-40">
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
            className="scrollbar-thin scrollbar-track-background scrollbar-thumb-accent overflow mt-2 grid max-h-[43vh] w-full grid-cols-3 items-center justify-between gap-4 overflow-y-auto pb-2 pr-2"
          >
            {filteredSounds.map((sound) => {
              const isChecked = sound.url === ambientSound;
              const SoundIcon = SoundIconMap[sound.name];
              return (
                <label
                  key={sound.name}
                  className={`relative z-50 flex h-[5rem] w-[6.3rem] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-[1px] bg-accent-foreground text-center shadow-sm ring-offset-background transition-colors duration-300 ${
                    isChecked
                      ? "border-secondary bg-secondary-smooth-700/10"
                      : "border-muted-foreground/30 hover:border-muted-foreground hover:bg-accent/60"
                  } ${isChecked ? "text-secondary" : "text-foreground"} focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2`}
                >
                  <RadioGroupItem
                    value={sound.name}
                    className="sr-only items-center justify-center"
                  />
                  <div
                    className={`flex h-6 w-6 items-center justify-center ${
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
                </label>
              );
            })}
          </RadioGroup>
        </div>
      </div>
    </main>
  );
}
