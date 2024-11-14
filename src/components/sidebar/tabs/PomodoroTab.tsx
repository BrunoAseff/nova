import { useEffect, useState, useRef } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useSpacesContext } from "@/contexts/spaceContext";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { WindIcon } from "@/components/icons/WindIcon"; // for melodic
import { DigitalClockIcon } from "@/components/icons/DigitalClock"; // for digital clock
import { JoystickIcon } from "@/components/icons/JoystickIcon"; // for retro game
import { MusicNoteIcon } from "@/components/icons/MusicNoteIcon"; // for flute
import { GameControllerIcon } from "@/components/icons/GameController"; // for game sound
import { RoosterIcon } from "@/components/icons/RoosterIcon";

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

  // Input display states
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
    const selectedSpace = spaces.find((space) => space.name === selectedTab);
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
    // Allow empty string or numbers only
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
      ...spaces.find((s) => s.name === selectedTab)?.pomodoro,
      [updatePropertyName]: numberValue,
    });
  };

  const handleIsHiddenChange = (hidden: boolean) => {
    setIsHidden(!hidden);
    updateSpaceProperty(selectedTab, "pomodoro", {
      ...spaces.find((s) => s.name === selectedTab)?.pomodoro,
      isHidden: !hidden,
    });
  };

  const handleAutoStartChange = (start: boolean) => {
    setAutoStart(start);
    updateSpaceProperty(selectedTab, "pomodoro", {
      ...spaces.find((s) => s.name === selectedTab)?.pomodoro,
      autoStart: start,
    });
  };

  const handleAlarmSoundChange = (sound: boolean) => {
    setAlarmSound(sound);
    updateSpaceProperty(selectedTab, "pomodoro", {
      ...spaces.find((s) => s.name === selectedTab)?.pomodoro,
      alarmSound: sound,
    });
  };

  const handleAlarmSoundURLChange = (url: string) => {
    setAlarmSoundURL(url);
    updateSpaceProperty(selectedTab, "pomodoro", {
      ...spaces.find((s) => s.name === selectedTab)?.pomodoro,
      alarmSoundURL: url,
    });

    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.play();
    }
  };

  return (
    <main className="mb-4 flex h-full flex-col gap-10">
      <div className="flex min-h-10 w-[90%] items-center justify-between space-x-2 rounded-2xl border-[1px] border-accent p-4">
        <div className="flex flex-col gap-1">
          <Label
            htmlFor="pomodoro-visibility"
            className="text-md text-foreground"
          >
            Visibility
          </Label>
          <p className="text-sm text-muted-foreground">
            Controls if the Pomodoro timer is visible on the screen.
          </p>
        </div>
        <Switch
          id="pomodoro-visibility"
          checked={!isHidden}
          onCheckedChange={handleIsHiddenChange}
        />
      </div>

      <div className="flex min-h-10 w-[90%] items-center justify-between space-x-2 rounded-2xl border-[1px] border-accent p-4">
        <div className="flex flex-col gap-1">
          <Label
            htmlFor="pomodoro-autostart"
            className="text-md text-foreground"
          >
            Auto Start
          </Label>
          <p className="text-sm text-muted-foreground">
            Controls if the Pomodoro timer automatically starts when the tab is
            switched.
          </p>
        </div>
        <Switch
          id="pomodoro-autostart"
          checked={autoStart}
          onCheckedChange={handleAutoStartChange}
        />
      </div>

      <div className="flex min-h-10 w-[90%] flex-col items-center justify-between gap-10 space-x-2 rounded-2xl border-[1px] border-accent p-4">
        <div className="space-between flex items-center">
          <div className="flex flex-col gap-1">
            <Label htmlFor="pomodoro-alarm" className="text-md text-foreground">
              Alarm Sound
            </Label>
            <p className="text-sm text-muted-foreground">
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
              className="flex w-full flex-col gap-4"
            >
              <RadioGroup
                value={alarmSoundURL}
                onValueChange={handleAlarmSoundURLChange}
                className="mx-auto grid grid-cols-3 gap-4"
              >
                {alarmSounds.map((sound) => {
                  const Icon = sound.icon;
                  const isChecked = alarmSoundURL === sound.value; // Determine if the current item is selected
                  return (
                    <label
                      key={sound.value}
                      className={`relative flex max-w-36 cursor-pointer flex-col items-center gap-3 rounded-xl border px-2 py-3 text-center shadow-sm ring-offset-background transition-colors ${
                        isChecked
                          ? "border-secondary bg-blue-700/10"
                          : "border-input"
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

      <div className="flex min-h-10 w-[90%] items-center justify-between space-x-2 rounded-2xl border-[1px] border-accent p-4">
        <div className="flex flex-col gap-1">
          <Label
            htmlFor="short-break-duration"
            className="text-md text-foreground"
          >
            Short Break Duration
          </Label>
          <p className="text-sm text-muted-foreground">
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

      <div className="flex min-h-10 w-[90%] items-center justify-between space-x-2 rounded-2xl border-[1px] border-accent p-4">
        <div className="flex flex-col gap-1">
          <Label
            htmlFor="long-break-duration"
            className="text-md text-foreground"
          >
            Long Break Duration
          </Label>
          <p className="text-sm text-muted-foreground">
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
    </main>
  );
}
