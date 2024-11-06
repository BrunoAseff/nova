import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import clsx from "clsx";
import { useSpacesContext } from "@/contexts/spaceContext";
import type { Position } from "@/types";

export default function ClockTab() {
  const { spaces, selectedTab, updateSpaceProperty } = useSpacesContext();
  const [selectedPosition, setSelectedPosition] = useState<Position>("center");
  const [timeFormat, setTimeFormat] = useState<"12h" | "24h">("24h");
  const [isClockVisible, setIsClockVisible] = useState(true);

  // Synchronize local state with the selected space
  useEffect(() => {
    const selectedSpace = spaces.find((space) => space.name === selectedTab);
    if (selectedSpace) {
      setSelectedPosition(selectedSpace.clock.position);
      setTimeFormat(selectedSpace.clock.timeFormat);
      setIsClockVisible(!selectedSpace.clock.isHidden);
    }
  }, [spaces, selectedTab]);

  const handleClockVisibilityChange = (visible: boolean) => {
    setIsClockVisible(visible);
    updateSpaceProperty(selectedTab, "clock", {
      ...spaces.find((s) => s.name === selectedTab)?.clock,
      isHidden: !visible,
    });
  };

  const handleClockPositionChange = (position: Position) => {
    setSelectedPosition(position);
    updateSpaceProperty(selectedTab, "clock", {
      ...spaces.find((s) => s.name === selectedTab)?.clock,
      position,
    });
  };

  const handleTimeFormatChange = (format: "12h" | "24h") => {
    setTimeFormat(format);
    updateSpaceProperty(selectedTab, "clock", {
      ...spaces.find((s) => s.name === selectedTab)?.clock,
      timeFormat: format,
    });
  };

  return (
    <main className="flex flex-col gap-10">
      <div className="flex min-h-10 w-[90%] items-center justify-between space-x-2 rounded-2xl border-[1px] border-accent p-4">
        <div className="flex flex-col gap-1">
          <Label htmlFor="clock-visibility" className="text-md text-foreground">
            Visibility
          </Label>
          <p className="text-sm text-muted-foreground">
            Controls if the clock is visible on the screen.
          </p>
        </div>
        <Switch
          id="clock-visibility"
          checked={isClockVisible}
          onCheckedChange={handleClockVisibilityChange}
        />
      </div>

      <div className="ml-3 flex flex-col gap-4">
        <Label htmlFor="clock-position" className="text-md text-foreground">
          Position
        </Label>
        <RadioGroup
          className="flex w-[90%] justify-evenly gap-2"
          orientation="horizontal"
          value={selectedPosition}
          onValueChange={handleClockPositionChange}
        >
          {["top-right", "top-left", "bottom-left", "center"].map((pos) => (
            <div
              key={pos}
              className={clsx(
                "flex cursor-pointer flex-col items-center justify-center gap-2 space-x-2 rounded-xl border-[1px] border-accent px-6 py-4",
                {
                  "bg-muted": selectedPosition === pos,
                  "hover:bg-accent-foreground": selectedPosition !== pos,
                },
              )}
              onClick={() => handleClockPositionChange(pos as Position)}
            >
              <Label
                htmlFor={`pos-${pos}`}
                className={clsx({
                  "text-secondary": selectedPosition === pos,
                })}
              >
                {pos.charAt(0).toUpperCase() + pos.slice(1).replace("-", " ")}
              </Label>
              <RadioGroupItem value={pos} id={`pos-${pos}`} />
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="ml-3 flex flex-col gap-4">
        <Label htmlFor="time-format" className="text-md text-foreground">
          Time Format
        </Label>
        <RadioGroup
          className="flex w-[90%] justify-center gap-4"
          orientation="horizontal"
          value={timeFormat}
          onValueChange={handleTimeFormatChange}
        >
          {["24h", "12h"].map((format) => (
            <div
              key={format}
              className={clsx(
                "flex cursor-pointer flex-col items-center justify-center gap-2 space-x-2 rounded-xl border-[1px] border-accent px-6 py-4",
                {
                  "bg-muted": timeFormat === format,
                  "hover:bg-accent-foreground": timeFormat !== format,
                },
              )}
              onClick={() => handleTimeFormatChange(format as "12h" | "24h")}
            >
              <Label
                htmlFor={`format-${format}`}
                className={clsx({
                  "text-secondary": timeFormat === format,
                })}
              >
                {format}
              </Label>
              <RadioGroupItem value={format} id={`format-${format}`} />
            </div>
          ))}
        </RadioGroup>
      </div>
    </main>
  );
}