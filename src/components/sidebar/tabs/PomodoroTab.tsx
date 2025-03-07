import { useEffect, useState, useRef } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useSpacesContext } from "@/contexts/spaceContext";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { WindIcon } from "@/components/icons/WindIcon";
import { DigitalClockIcon } from "@/components/icons/DigitalClock";
import { JoystickIcon } from "@/components/icons/JoystickIcon";
import { MusicNoteIcon } from "@/components/icons/MusicNoteIcon";
import { GameControllerIcon } from "@/components/icons/GameController";
import { RoosterIcon } from "@/components/icons/RoosterIcon";
import { TabHeader } from "@/components/tabHeader";
import TabBody from "@/components/tabBody";
import PomodoroIllustration from "@/components/svgs/PomodoroIllustration";

const alarmSounds = [
  { name: "Melodic", value: "/alarm-sounds/calming-alarm.wav", icon: WindIcon },
  {
    name: "Digital Clock",
    value: "/alarm-sounds/digital-clock-alarm.wav",
    icon: DigitalClockIcon,
  },
  {
    name: "Flute",
    value: "/alarm-sounds/flute-alarm.wav",
    icon: MusicNoteIcon,
  },
  {
    name: "Game Sound",
    value: "/alarm-sounds/game-sound-alarm.wav",
    icon: GameControllerIcon,
  },
  {
    name: "Retro Game",
    value: "/alarm-sounds/retro-game-alarm.wav",
    icon: JoystickIcon,
  },
  {
    name: "Rooster",
    value: "/alarm-sounds/rooster-alarm.wav",
    icon: RoosterIcon,
  },
];

const DEFAULT_VALUES = {
  alarmRepeat: 3,
  shortBreak: 5,
  longBreak: 15,
};

export default function PomodoroTab() {
  const { spaces, selectedTab, updateSpaceProperty } = useSpacesContext();
  const [isHidden, setIsHidden] = useState(false);
  const [autoStart, setAutoStart] = useState(false);
  const [alarmSound, setAlarmSound] = useState(false);
  const [alarmSoundURL, setAlarmSoundURL] = useState(
    "/alarm-sounds/calming-alarm.wav",
  );
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [alarmRepeatDisplay, setAlarmRepeatDisplay] = useState(
    String(DEFAULT_VALUES.alarmRepeat),
  );
  const [shortBreakDisplay, setShortBreakDisplay] = useState(
    String(DEFAULT_VALUES.shortBreak),
  );
  const [longBreakDisplay, setLongBreakDisplay] = useState(
    String(DEFAULT_VALUES.longBreak),
  );

  useEffect(() => {
    const selectedSpace = spaces.find((space) => space.id === selectedTab);
    if (selectedSpace) {
      setIsHidden(selectedSpace.pomodoro.isHidden ?? false);
      setAutoStart(selectedSpace.pomodoro.autoStart ?? false);
      setAlarmSound(selectedSpace.pomodoro.alarmSound ?? false);
      setAlarmSoundURL(
        selectedSpace.pomodoro.alarmSoundURL ??
          "/alarm-sounds/calming-alarm.wav",
      );

      setAlarmRepeatDisplay(
        String(
          selectedSpace.pomodoro.alarmRepeatTimes ?? DEFAULT_VALUES.alarmRepeat,
        ),
      );
      setShortBreakDisplay(
        String(
          selectedSpace.pomodoro.shortBreakDuration ??
            DEFAULT_VALUES.shortBreak,
        ),
      );
      setLongBreakDisplay(
        String(
          selectedSpace.pomodoro.longBreakDuration ?? DEFAULT_VALUES.longBreak,
        ),
      );
    }
  }, [spaces, selectedTab]);

  const handleInputChange = (
    value: string,
    displaySetter: (value: string) => void,
  ) => {
    if (value === "" || /^\d{1,2}$/.test(value)) {
      displaySetter(value);
    }
  };

  const handleInputBlur = (
    displayValue: string,
    displaySetter: (s: string) => void,
    updatePropertyName: string,
    defaultValue: number,
  ) => {
    const numberValue =
      displayValue === ""
        ? defaultValue
        : parseInt(displayValue) || defaultValue;
    displaySetter(String(numberValue));
    updateSpaceProperty(selectedTab, "pomodoro", {
      ...spaces.find((s) => s.id === selectedTab)?.pomodoro,
      [updatePropertyName]: numberValue,
    });
  };

  const handleIsHiddenChange = (hidden: boolean) => {
    setIsHidden(!hidden);
    updateSpaceProperty(selectedTab, "pomodoro", {
      ...spaces.find((s) => s.id === selectedTab)?.pomodoro,
      isHidden: !hidden,
    });
  };

  const handleAutoStartChange = (start: boolean) => {
    setAutoStart(start);
    updateSpaceProperty(selectedTab, "pomodoro", {
      ...spaces.find((s) => s.id === selectedTab)?.pomodoro,
      autoStart: start,
    });
  };

  const handleAlarmSoundChange = (sound: boolean) => {
    setAlarmSound(sound);
    updateSpaceProperty(selectedTab, "pomodoro", {
      ...spaces.find((s) => s.id === selectedTab)?.pomodoro,
      alarmSound: sound,
    });
  };

  const handleAlarmSoundURLChange = (url: string) => {
    setAlarmSoundURL(url);
    updateSpaceProperty(selectedTab, "pomodoro", {
      ...spaces.find((s) => s.id === selectedTab)?.pomodoro,
      alarmSoundURL: url,
    });

    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.play();
    }
  };

  return (
    <main className="mb-10 h-screen">
      <TabHeader
        title="Pomodoro"
        subtitle="Configure your Pomodoro timer settings for effective time
              management."
        Icon={PomodoroIllustration}
      />
      <TabBody>
        <div className="flex min-h-10 items-center justify-between space-x-2 rounded-2xl border-[1px] border-accent/20 bg-accent-foreground p-4 md:w-[55%]">
          <div className="flex flex-col gap-1">
            <Label
              htmlFor="pomodoro-visibility"
              className="text-md text-foreground"
            >
              Visibility
            </Label>
            <p className="hidden text-sm text-muted-foreground md:block">
              Controls if the Pomodoro timer is visible on the screen.
            </p>
          </div>
          <Switch
            id="pomodoro-visibility"
            checked={!isHidden}
            onCheckedChange={handleIsHiddenChange}
          />
        </div>

        <div className="flex min-h-10 w-full items-center justify-between space-x-2 rounded-2xl border-[1px] border-accent/20 bg-accent-foreground p-4 md:w-[55%]">
          <div className="flex flex-col gap-1">
            <Label
              htmlFor="pomodoro-autostart"
              className="text-md text-foreground"
            >
              Auto Start
            </Label>
            <p className="hidden max-w-[90%] text-sm text-muted-foreground md:block">
              Controls if the Pomodoro timer automatically starts when the tab
              is switched.
            </p>
          </div>
          <Switch
            id="pomodoro-autostart"
            checked={autoStart}
            onCheckedChange={handleAutoStartChange}
          />
        </div>

        <div className="flex min-h-10 w-full flex-col items-center justify-between gap-10 space-x-2 rounded-2xl border-[1px] border-accent/20 bg-accent-foreground p-4 md:w-[55%]">
          <div className="flex w-full items-center justify-between md:w-full">
            <div className="flex flex-col gap-1">
              <Label
                htmlFor="pomodoro-alarm"
                className="text-md text-foreground"
              >
                Alarm Sound
              </Label>
              <p className="hidden max-w-[90%] text-sm text-muted-foreground md:block">
                Controls if the Pomodoro timer should play a sound when the time
                is up.
              </p>
            </div>
            <Switch
              id="pomodoro-alarm"
              checked={alarmSound}
              onCheckedChange={handleAlarmSoundChange}
            />
          </div>
          <AnimatePresence>
            {alarmSound && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex w-full flex-col gap-4 md:w-[90%]"
              >
                <RadioGroup
                  value={alarmSoundURL}
                  onValueChange={handleAlarmSoundURLChange}
                  className="grid w-full grid-cols-2 gap-4 md:grid-cols-3"
                >
                  {alarmSounds.map((sound) => {
                    const Icon = sound.icon;
                    const isChecked = alarmSoundURL === sound.value;
                    return (
                      <label
                        key={sound.value}
                        className={`relative flex w-full max-w-32 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-[1px] px-2 py-3 text-center shadow-sm ring-offset-background transition-colors duration-300 ${
                          isChecked
                            ? "border-secondary bg-secondary-smooth-700/10"
                            : "border-muted-foreground/30 hover:border-muted-foreground hover:bg-accent/60"
                        } ${isChecked ? "text-secondary" : "text-foreground"} focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2`}
                      >
                        <RadioGroupItem
                          value={sound.value}
                          className="sr-only items-center justify-center"
                        />
                        <Icon
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

                <div className="mx-auto mt-3 flex items-center gap-2">
                  <Label
                    htmlFor="pomodoro-alarm-repeat"
                    className="text-md text-foreground"
                  >
                    Repeat Times
                  </Label>
                  <Input
                    id="pomodoro-alarm-repeat"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={alarmRepeatDisplay}
                    onChange={(e) =>
                      handleInputChange(e.target.value, setAlarmRepeatDisplay)
                    }
                    onBlur={() =>
                      handleInputBlur(
                        alarmRepeatDisplay,
                        setAlarmRepeatDisplay,
                        "alarmRepeatTimes",
                        DEFAULT_VALUES.alarmRepeat,
                      )
                    }
                    className="w-20"
                  />
                </div>
                <audio ref={audioRef} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex min-h-10 w-full items-center justify-between space-x-2 rounded-2xl border-[1px] border-accent/20 bg-accent-foreground p-4 md:w-[55%]">
          <div className="flex flex-col gap-1">
            <Label
              htmlFor="short-break-duration"
              className="text-md text-foreground"
            >
              Short Break Duration
            </Label>
            <p className="hidden text-sm text-muted-foreground md:block">
              The duration of the short break, in minutes.
            </p>
          </div>
          <Input
            id="short-break-duration"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={shortBreakDisplay}
            onChange={(e) =>
              handleInputChange(e.target.value, setShortBreakDisplay)
            }
            onBlur={() =>
              handleInputBlur(
                shortBreakDisplay,
                setShortBreakDisplay,
                "shortBreakDuration",
                DEFAULT_VALUES.shortBreak,
              )
            }
            className="w-20"
          />
        </div>

        <div className="flex min-h-10 w-full items-center justify-between space-x-2 rounded-2xl border-[1px] border-accent/20 bg-accent-foreground p-4 md:w-[55%]">
          <div className="flex flex-col gap-1">
            <Label
              htmlFor="long-break-duration"
              className="text-md text-foreground"
            >
              Long Break Duration
            </Label>
            <p className="hidden text-sm text-muted-foreground md:block">
              The duration of the long break, in minutes.
            </p>
          </div>
          <Input
            id="long-break-duration"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={longBreakDisplay}
            onChange={(e) =>
              handleInputChange(e.target.value, setLongBreakDisplay)
            }
            onBlur={() =>
              handleInputBlur(
                longBreakDisplay,
                setLongBreakDisplay,
                "longBreakDuration",
                DEFAULT_VALUES.longBreak,
              )
            }
            className="w-20"
          />
        </div>
      </TabBody>
    </main>
  );
}
