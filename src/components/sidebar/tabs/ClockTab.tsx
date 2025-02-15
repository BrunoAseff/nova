import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import clsx from "clsx";
import type { Position } from "@/types";
import { TabHeader } from "@/components/tabHeader";
import ClockIllustration from "@/components/svgs/ClockIllustration";
import { useClockSettings } from "@/hooks/feature-settings/useClockSettings";
import { TabSection } from "@/components/nova/tabSection";

export default function ClockTab() {
  const { selectedPosition, timeFormat, isClockVisible, updateClockProperty } =
    useClockSettings();

  const handleClockVisibilityChange = (visible: boolean) => {
    updateClockProperty("isHidden", !visible);
  };

  const handleClockPositionChange = (position: Position) => {
    updateClockProperty("position", position);
  };

  const handleTimeFormatChange = (format: "12h" | "24h") => {
    updateClockProperty("timeFormat", format);
  };

  return (
    <main className="h-screen">
      <TabHeader
        title="Clock"
        subtitle="Customize the appearance and behavior of the clock on your screen."
        Icon={ClockIllustration}
      />
      <div className="scrollbar-thin scrollbar-gutter-stable sm-min-w-full scrollbar-track-background scrollbar-thumb-accent mt-[6.1rem] h-[calc(100vh-190px)] w-[140%] flex-col gap-6 space-y-4 overflow-y-auto pb-10 pr-6 md:h-[calc(100vh-250px)] md:w-[110%]">
        {" "}
        <TabSection>
          <div className="flex items-center justify-between">
            <div className="flex w-full flex-col gap-1">
              <Label
                htmlFor="clock-visibility"
                className="text-md text-foreground"
              >
                Visibility
              </Label>
              <p className="overflow-hidden text-ellipsis whitespace-nowrap text-xs text-muted-foreground md:text-sm">
                Controls if the clock is visible on the screen.
              </p>
            </div>
            <Switch
              aria-label="Change clock visibility"
              className="ml-auto"
              id="clock-visibility"
              checked={isClockVisible}
              onCheckedChange={handleClockVisibilityChange}
            />
          </div>
        </TabSection>
        <TabSection>
          <div className="flex w-full flex-col gap-4">
            <Label htmlFor="clock-position" className="text-md text-foreground">
              Position
            </Label>
            <RadioGroup
              className="grid w-full cursor-pointer grid-cols-2 items-center justify-evenly gap-2 md:flex"
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
                      "border-secondary bg-secondary-smooth-700/10":
                        selectedPosition === pos,
                      "hover:bg-background": selectedPosition !== pos,
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
                    {pos.charAt(0).toUpperCase() +
                      pos.slice(1).replace("-", " ")}
                  </Label>
                  <RadioGroupItem
                    aria-label={`Select ${pos} position`}
                    value={pos}
                    id={`pos-${pos}`}
                  />
                </div>
              ))}
            </RadioGroup>
          </div>
        </TabSection>
        <TabSection>
          <div className="flex w-[90%] flex-col gap-4">
            <Label htmlFor="time-format" className="text-md text-foreground">
              Time Format
            </Label>
            <RadioGroup
              className="flex w-full cursor-pointer items-center justify-center gap-4"
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
                      "border-secondary bg-secondary-smooth-700/10":
                        timeFormat === format,
                      "hover:bg-background": timeFormat !== format,
                    },
                  )}
                  onClick={() =>
                    handleTimeFormatChange(format as "12h" | "24h")
                  }
                >
                  <Label
                    htmlFor={`format-${format}`}
                    className={clsx({
                      "text-secondary": timeFormat === format,
                    })}
                  >
                    {format}
                  </Label>
                  <RadioGroupItem
                    aria-label={`Choose ${format} format`}
                    value={format}
                    id={`format-${format}`}
                  />
                </div>
              ))}
            </RadioGroup>
          </div>
        </TabSection>
      </div>
    </main>
  );
}
