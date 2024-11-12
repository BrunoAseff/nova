import { useEffect, useState, useRef } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useSpacesContext } from "@/contexts/spaceContext";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const alarmSounds = [
  { name: "Calming Alarm", value: "/alarm-sounds/calming-alarm.wav" },
  {
    name: "Digital Clock Alarm",
    value: "/alarm-sounds/digital-clock-alarm.wav",
  },
  { name: "Flute", value: "/alarm-sounds/flute-alarm.wav" },
  { name: "Game Sound", value: "/alarm-sounds/game-sound-alarm.wav" },
  { name: "Retro Game", value: "/alarm-sounds/retro-game-alarm.wav" },
  { name: "Rooster", value: "/alarm-sounds/rooster-alarm.wav" },
];

export default function PomodoroTab() {
  const { spaces, selectedTab, updateSpaceProperty } = useSpacesContext();
  const [isHidden, setIsHidden] = useState(false);
  const [autoStart, setAutoStart] = useState(false);
  const [alarmSound, setAlarmSound] = useState(false);
  const [alarmSoundURL, setAlarmSoundURL] = useState(
    "/alarm-sounds/calming-alarm.wav",
  );
  const [alarmRepeatTimes, setAlarmRepeatTimes] = useState(3);
  const [shortBreakDuration, setShortBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
      setAlarmRepeatTimes(selectedSpace.pomodoro.alarmRepeatTimes ?? 3);
      setShortBreakDuration(selectedSpace.pomodoro.shortBreakDuration ?? 5);
      setLongBreakDuration(selectedSpace.pomodoro.longBreakDuration ?? 15);
    }
  }, [spaces, selectedTab]);

  const handleNumberInput = (
    value: string,
    setter: (n: number) => void,
    updateFn: (n: number) => void,
  ) => {
    // Remove any non-digit characters
    const cleanValue = value.replace(/\D/g, "");

    // Limit to 2 digits
    const limitedValue = cleanValue.slice(0, 2);

    // Convert to number, default to 1 if empty or 0
    const numberValue = parseInt(limitedValue) || 1;

    // Update state and space property
    setter(numberValue);
    updateFn(numberValue);
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

  const handleShortBreakDurationChange = (duration: number) => {
    updateSpaceProperty(selectedTab, "pomodoro", {
      ...spaces.find((s) => s.name === selectedTab)?.pomodoro,
      shortBreakDuration: duration,
    });
  };

  const handleLongBreakDurationChange = (duration: number) => {
    updateSpaceProperty(selectedTab, "pomodoro", {
      ...spaces.find((s) => s.name === selectedTab)?.pomodoro,
      longBreakDuration: duration,
    });
  };

  const handleAlarmSoundURLChange = (url: string) => {
    setAlarmSoundURL(url);
    updateSpaceProperty(selectedTab, "pomodoro", {
      ...spaces.find((s) => s.name === selectedTab)?.pomodoro,
      alarmSoundURL: url,
    });

    // Play the selected alarm sound
    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.play();
    }
  };

  const handleAlarmRepeatTimesChange = (times: number) => {
    setAlarmRepeatTimes(times);
    updateSpaceProperty(selectedTab, "pomodoro", {
      ...spaces.find((s) => s.name === selectedTab)?.pomodoro,
      alarmRepeatTimes: times,
    });
  };

  return (
    <main className="flex flex-col gap-10">
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
              transition={{ duration: 0.3 }}
              className="flex"
            >
              <div className="flex items-center justify-between space-x-4">
                <Select
                  value={alarmSoundURL}
                  onValueChange={handleAlarmSoundURLChange}
                >
                  <SelectTrigger className="w-60">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {alarmSounds.map((sound) => (
                      <SelectItem key={sound.value} value={sound.value}>
                        {sound.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  id="pomodoro-alarm-repeat"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={alarmRepeatTimes}
                  onChange={(e) =>
                    handleAlarmRepeatTimesChange(parseInt(e.target.value) || 1)
                  }
                  min={1}
                  max={10}
                  className="ml-auto w-20"
                />
                <p className="text-sm text-muted-foreground">Repeat Times</p>
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
          value={shortBreakDuration}
          onChange={(e) =>
            handleNumberInput(
              e.target.value,
              setShortBreakDuration,
              handleShortBreakDurationChange,
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
          value={longBreakDuration}
          onChange={(e) =>
            handleNumberInput(
              e.target.value,
              setLongBreakDuration,
              handleLongBreakDurationChange,
            )
          }
          className="w-20"
        />
      </div>
    </main>
  );
}
