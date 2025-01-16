import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { useSpacesContext } from "@/contexts/spaceContext";
import AmbientSoundShortcut from "./AmbientSoundShortcut";
import AppearanceShortcut from "./AppearanceShortcut";
import BackgroundShortcut from "./BackgroundShortcut";
import BreathingExerciseShortcut from "./BreathingExerciseShortcut";
import ClockShortcut from "./ClockShortcut";
import MusicShortcut from "./MusicShortcut";
import PomodoroShortcut from "./PomodoroShortcut";
import QuoteShortcut from "./QuoteShortcut";
import ReminderShortcut from "./ReminderShortcut";
import type { ShortcutName } from "@/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import {
  Alarm,
  HourglassHigh,
  Images,
  LightbulbFilament,
  MusicNotes,
  Palette,
  Quotes,
  Waveform,
  Wind,
} from "@phosphor-icons/react";

type ShortcutConfig = {
  icon: React.ComponentType;
  component: React.ComponentType;
};

const shortcutConfigs: Record<ShortcutName, ShortcutConfig> = {
  clock: {
    icon: Alarm,
    component: ClockShortcut,
  },
  pomodoro: {
    icon: HourglassHigh,
    component: PomodoroShortcut,
  },
  quote: {
    icon: Quotes,
    component: QuoteShortcut,
  },
  background: {
    icon: Images,
    component: BackgroundShortcut,
  },
  music: {
    icon: MusicNotes,
    component: MusicShortcut,
  },
  reminder: {
    icon: LightbulbFilament,
    component: ReminderShortcut,
  },
  breathingExercise: {
    icon: Wind,
    component: BreathingExerciseShortcut,
  },

  ambientSound: {
    icon: Waveform,
    component: AmbientSoundShortcut,
  },
  appearance: {
    icon: Palette,
    component: AppearanceShortcut,
  },
};

export default function Shortcut() {
  const { shortcut } = useSpacesContext();

  if (!shortcut || !shortcutConfigs[shortcut]) {
    return null;
  }

  const ShortcutIcon = shortcutConfigs[shortcut].icon;
  const ShortcutComponent = shortcutConfigs[shortcut].component;

  return (
    <Tooltip delayDuration={200}>
      <DropdownMenu>
        <TooltipTrigger className="hidden md:flex" asChild>
          <DropdownMenuTrigger asChild>
            <Button
              aria-label="Shortcut"
              className="absolute bottom-10 right-[17.5rem] z-10 overflow-hidden rounded-xl bg-background p-5 text-sm text-foreground shadow-md animate-in fade-in-0 hover:bg-background hover:text-secondary"
              size="icon"
            >
              <div className="text-xl">
                <ShortcutIcon />
              </div>
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>

        <DropdownMenuContent className="mb-6 min-h-[300px] min-w-[300px] p-4">
          <ShortcutComponent />
        </DropdownMenuContent>
      </DropdownMenu>

      <TooltipContent className="font-inter flex items-center gap-3 font-medium">
        Shortcut
      </TooltipContent>
    </Tooltip>
  );
}
