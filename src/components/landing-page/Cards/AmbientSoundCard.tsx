import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { MutedVolumeIcon } from "@/components/icons/MutedVolumeIcon";
import { VolumeIcon } from "@/components/icons/VolumeIcon";
import { ambientSounds } from "@/content/ambientSounds";
import { Pause } from "@/components/icons/pause";
import { Play } from "@/components/icons/Play";
import { useAmbientSound } from "@/stores/useAmbientSound";

import IconBtn from "@/components/nova/buttons/IconBtn";
import Waves from "../../icons/ambientSound/Waves";
import Rain from "../../icons/ambientSound/Rain";
import Birds from "../../icons/ambientSound/Birds";
import Fire from "../../icons/ambientSound/Fire";
import Underwater from "../../icons/ambientSound/Underwater";
import Cafe from "../../icons/ambientSound/Cafe";
import Beach from "../../icons/ambientSound/Beach";
import Tropical from "../../icons/ambientSound/Tropical";
import HeavyRain from "../../icons/ambientSound/HeavyRain";

export const AmbientSoundCard = () => {
  const {
    ambientSound,
    ambientSoundVolume,
    isPlaying,
    setAmbientSound,
    setVolume,
    play,
    pause,
  } = useAmbientSound();

  const currentSound = ambientSounds.find(
    (sound) => sound.url === ambientSound,
  );

  const handleSoundChange = (soundName: string) => {
    const selected = ambientSounds.find((sound) => sound.name === soundName);
    if (selected) {
      setAmbientSound(selected.url);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    if (value[0] !== undefined) {
      setVolume(value[0]);
    }
  };

  const handleMuteToggle = () => {
    setVolume(ambientSoundVolume > 0 ? 0 : 50);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

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
    <>
      <div className="flex w-full items-center gap-2 space-x-2 rounded-2xl">
        <div className="mt-1 flex w-full items-center justify-center space-x-4">
          <IconBtn
            className="rounded-full border-[1px] border-transparent bg-transparent hover:border-secondary hover:bg-secondary-smooth-700/10 hover:text-secondary"
            onClick={handlePlayPause}
          >
            {isPlaying ? <Pause /> : <Play />}
          </IconBtn>
          <IconBtn
            className="rounded-full border-[1px] border-transparent bg-transparent hover:border-secondary hover:bg-secondary-smooth-700/10 hover:text-secondary"
            onClick={handleMuteToggle}
          >
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

      <div className="flex w-full items-center justify-center rounded-2xl">
        <div className="flex flex-col gap-1">
          <RadioGroup
            value={currentSound?.name ?? ""}
            onValueChange={handleSoundChange}
            className="scrollbar-thin scrollbar-track-background scrollbar-thumb-accent overflow mt-2 grid max-h-[43vh] w-full grid-cols-3 items-center justify-between gap-4 overflow-y-auto pb-2 pr-2"
          >
            {ambientSounds.map((sound) => {
              const isChecked = sound.url === ambientSound;
              const SoundIcon = SoundIconMap[sound.name];
              return (
                <label
                  key={sound.name}
                  className={`relative z-50 flex h-[5rem] w-[6.3rem] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-[1px] border-muted bg-accent-foreground text-center shadow-sm ring-offset-background transition-colors ${
                    isChecked
                      ? "border-secondary bg-secondary-smooth-700/10"
                      : "border-muted hover:bg-background"
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
    </>
  );
};
