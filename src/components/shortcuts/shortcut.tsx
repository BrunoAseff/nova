import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ClockIcon } from "../icons/Clock";
import { PomodoroIcon } from "../icons/featureIcons/PomodoroIcon";
import { QuoteIcon } from "../icons/featureIcons/QuoteIcon";
import { BackgroundIcon } from "../icons/featureIcons/BackgroundIcon";
import { AmbientSoundIcon } from "../icons/featureIcons/AmbientSoundIcon";
import { MusicIcon } from "../icons/featureIcons/MusicIcon";
import { ReminderIcon } from "../icons/featureIcons/ReminderIcon";
import { BreathingIcon } from "../icons/featureIcons/BreathingIcon";
import { SpacesIcon } from "../icons/featureIcons/SpacesIcon";
import { AppearanceIcon } from "../icons/featureIcons/AppearanceIcon";
import { ProfileIcon } from "../icons/featureIcons/ProfileIcon";
import { Button } from "../ui/button";
import { useSpacesContext } from "@/contexts/spaceContext";
import AmbientSoundShortcut from "./AmbientSoundShortcut";
import AppearanceShortcut from "./AppearanceShortcut";
import BackgroundShortcut from "./BackgroundShortcut";
import BreathingExerciseShortcut from "./BreathingExerciseShortcut";
import ClockShortcut from "./ClockShortcut";
import MusicShortcut from "./MusicShortcut";
import PomodoroShortcut from "./PomodoroShortcut";
import ProfileShortcut from "./ProfileShortcut";
import QuoteShortcut from "./QuoteShortcut";
import ReminderShortcut from "./ReminderShortcut";
import SpacesShortcut from "./SpacesShortcut";
import type { ShortcutName } from "@/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

type ShortcutConfig = {
  icon: React.ComponentType;
  component: React.ComponentType;
};

const shortcutConfigs: Record<ShortcutName, ShortcutConfig> = {
  clock: {
    icon: ClockIcon,
    component: ClockShortcut,
  },
  pomodoro: {
    icon: PomodoroIcon,
    component: PomodoroShortcut,
  },
  quote: {
    icon: QuoteIcon,
    component: QuoteShortcut,
  },
  background: {
    icon: BackgroundIcon,
    component: BackgroundShortcut,
  },
  music: {
    icon: MusicIcon,
    component: MusicShortcut,
  },
  reminder: {
    icon: ReminderIcon,
    component: ReminderShortcut,
  },
  breathingExercise: {
    icon: BreathingIcon,
    component: BreathingExerciseShortcut,
  },
  spaces: {
    icon: SpacesIcon,
    component: SpacesShortcut,
  },
  profile: {
    icon: ProfileIcon,
    component: ProfileShortcut,
  },
  ambientSound: {
    icon: AmbientSoundIcon,
    component: AmbientSoundShortcut,
  },
  appearance: {
    icon: AppearanceIcon,
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
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <DropdownMenu>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                className="absolute bottom-10 right-72 z-10 overflow-hidden rounded-xl bg-background text-sm text-foreground shadow-md animate-in fade-in-0 hover:bg-background hover:text-secondary"
                size="icon"
              >
                <div className="scale-110">
                  <ShortcutIcon />
                </div>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>

          <DropdownMenuContent className="mb-6 min-h-[300px] min-w-[300px] p-4">
            <ShortcutComponent />
          </DropdownMenuContent>
        </DropdownMenu>

        <TooltipContent className="flex items-center gap-3 font-open font-light">
          Shortcut
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
