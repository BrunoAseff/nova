import React, { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { MutedVolumeIcon } from "@/components/icons/MutedVolumeIcon";
import { VolumeIcon } from "@/components/icons/VolumeIcon";
import { PlaceholderIcon } from "@/components/icons/PlaceholderIcon";
import { ambientSounds } from "content/ambientSounds";
import Image from "next/image";
import { useSpacesContext } from "@/contexts/spaceContext";
import type { Type } from "content/ambientSounds";
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

  return (
    <main className="h-screen w-full">
      <div className="absolute top-3 flex w-fit items-center text-secondary">
        <div className="grid h-full grid-cols-2 items-center justify-start">
          <div className="flex flex-col gap-2">
            <h1 className="font-delius text-3xl text-secondary-foreground/80">
              <span className="text-secondary">Ambient Sound</span> settings
            </h1>
            <p className="text-sm text-muted-foreground">
              Customize and select from a variety of soothing background sounds.
            </p>
          </div>
          <Image
            src="/illustrations/ambient-sound.svg"
            alt="Ambient Sound"
            width={270}
            height={220}
          />
        </div>
      </div>

      <div className="mt-28 flex h-full flex-col">
        <div className="flex min-h-10 min-w-[110%] items-center justify-between space-x-2 rounded-2xl border-[1px] border-background pl-4">
          <div className="mt-2 flex w-full items-center justify-evenly gap-1">
            <Label htmlFor="controls" className="text-md text-foreground">
              Controls:
            </Label>

            <div className="flex items-center space-x-4 rounded-full border-[1px] border-muted p-3">
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
        {/* Volume Control with Play/Pause */}

        <div className="flex min-h-10 min-w-[110%] items-center justify-between space-x-2 rounded-2xl border-[1px] border-background pl-4">
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

            {/* Sound Selection */}

            <RadioGroup
              value={currentSound?.name ?? ""}
              onValueChange={handleSoundChange}
              className="scrollbar-thin scrollbar-track-background scrollbar-thumb-accent mx-auto grid max-h-[43vh] w-[110%] grid-cols-4 justify-between gap-4 overflow-y-auto pb-10 pr-2"
            >
              {filteredSounds.map((sound) => {
                const isChecked = sound.url === ambientSound;
                return (
                  <label
                    key={sound.name}
                    className={`relative flex max-w-36 cursor-pointer flex-col items-center gap-3 rounded-xl border px-2 py-3 text-center shadow-sm ring-offset-background transition-colors ${
                      isChecked
                        ? "border-secondary bg-secondary-smooth-700/10"
                        : "border-input"
                    } ${isChecked ? "text-secondary" : "text-foreground"} focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2`}
                  >
                    <RadioGroupItem
                      value={sound.name}
                      className="sr-only items-center justify-center"
                    />
                    <PlaceholderIcon
                      className={`text-foreground opacity-60 ${isChecked ? "text-secondary" : ""}`}
                      aria-hidden="true"
                    />
                    <p
                      className={`text-xs font-medium leading-none ${isChecked ? "text-secondary" : "text-foreground"}`}
                    >
                      {sound.name}
                    </p>
                  </label>
                );
              })}
            </RadioGroup>
          </div>
        </div>
      </div>
    </main>
  );
}
