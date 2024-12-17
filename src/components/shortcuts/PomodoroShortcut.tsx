import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useSpacesContext } from "@/contexts/spaceContext";
import { Input } from "@/components/ui/input";

const DEFAULT_VALUES = {
  alarmRepeat: 3,
  shortBreak: 5,
  longBreak: 15,
};

export default function PomodoroShortcut() {
  const { spaces, selectedTab, updateSpaceProperty } = useSpacesContext();
  const [autoStart, setAutoStart] = useState(false);
  const [alarmSound, setAlarmSound] = useState(false);

  const [shortBreakDisplay, setShortBreakDisplay] = useState(
    String(DEFAULT_VALUES.shortBreak),
  );
  const [longBreakDisplay, setLongBreakDisplay] = useState(
    String(DEFAULT_VALUES.longBreak),
  );

  useEffect(() => {
    const selectedSpace = spaces.find((space) => space.name === selectedTab);
    if (selectedSpace) {
      setAutoStart(selectedSpace.pomodoro.autoStart ?? false);
      setAlarmSound(selectedSpace.pomodoro.alarmSound ?? false);

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

  return (
    <main className="h-fit">
      <h1 className="mb-3 text-lg text-secondary-foreground/80">Pomodoro</h1>

      <div className="flex flex-col gap-1">
        <div className="my-1 flex min-h-10 w-full items-center justify-between space-x-2 rounded-2xl border-[1px] border-accent/20 bg-accent-foreground p-4">
          <div className="flex w-full justify-between gap-2">
            <Label
              htmlFor="pomodoro-autostart"
              className="text-sm text-foreground"
            >
              Auto Start
            </Label>
            <Switch
              id="pomodoro-autostart"
              checked={autoStart}
              onCheckedChange={handleAutoStartChange}
            />
          </div>
        </div>
        <div className="my-1 flex min-h-10 w-full items-center justify-between space-x-2 rounded-2xl border-[1px] border-accent/20 bg-accent-foreground p-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="pomodoro-alarm" className="text-sm text-foreground">
              Alarm Sound
            </Label>
          </div>
          <Switch
            id="pomodoro-alarm"
            checked={alarmSound}
            onCheckedChange={handleAlarmSoundChange}
          />
        </div>

        <div className="my-1 flex min-h-10 w-full items-center justify-between space-x-2 rounded-2xl border-[1px] border-accent/20 bg-accent-foreground p-4">
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="short-break-duration"
              className="text-sm text-foreground"
            >
              Short Break Duration
            </Label>
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

        <div className="my-1 flex min-h-10 w-full items-center justify-between space-x-2 rounded-2xl border-[1px] border-accent/20 bg-accent-foreground p-4">
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="long-break-duration"
              className="text-sm text-foreground"
            >
              Long Break Duration
            </Label>
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
      </div>
    </main>
  );
}
