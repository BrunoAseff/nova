import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useSpacesContext } from "@/contexts/spaceContext";
import { Input } from "@/components/ui/input";

export default function PomodoroTab() {
  const { spaces, selectedTab, updateSpaceProperty } = useSpacesContext();
  const [isHidden, setIsHidden] = useState(false);
  const [autoStart, setAutoStart] = useState(false);
  const [alarmSound, setAlarmSound] = useState(false);
  const [shortBreakDuration, setShortBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);

  useEffect(() => {
    const selectedSpace = spaces.find((space) => space.name === selectedTab);
    if (selectedSpace) {
      setIsHidden(selectedSpace.pomodoro.isHidden ?? false);
      setAutoStart(selectedSpace.pomodoro.autoStart ?? false);
      setAlarmSound(selectedSpace.pomodoro.alarmSound ?? false);
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

      <div className="flex min-h-10 w-[90%] items-center justify-between space-x-2 rounded-2xl border-[1px] border-accent p-4">
        <div className="flex flex-col gap-1">
          <Label htmlFor="pomodoro-alarm" className="text-md text-foreground">
            Alarm Sound
          </Label>
          <p className="text-sm text-muted-foreground">
            Controls if the Pomodoro timer should play a sound when the time is
            up.
          </p>
        </div>
        <Switch
          id="pomodoro-alarm"
          checked={alarmSound}
          onCheckedChange={handleAlarmSoundChange}
        />
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
