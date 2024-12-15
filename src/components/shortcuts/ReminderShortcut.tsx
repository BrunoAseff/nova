import { useSpacesContext } from "@/contexts/spaceContext";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import clsx from "clsx";
import { useEffect, useState } from "react";

export default function ReminderShortcut() {
  const { spaces, selectedTab, updateSpaceProperty } = useSpacesContext();

  const [selectedPosition, setSelectedPosition] = useState<
    "bottom-left" | "top-right" | "top-left" | "center"
  >("bottom-left");

  const [isReminderVisible, setIsReminderVisible] = useState(true);

  useEffect(() => {
    const selectedSpace = spaces.find((space) => space.name === selectedTab);
    if (selectedSpace) {
      setSelectedPosition(selectedSpace.reminder.position);
      setIsReminderVisible(!selectedSpace.reminder.isHidden);
    }
  }, [spaces, selectedTab]);

  const handleReminderVisibilityChange = (visible: boolean) => {
    setIsReminderVisible(visible);
    updateSpaceProperty(selectedTab, "reminder", {
      ...spaces.find((s) => s.name === selectedTab)?.reminder,
      isHidden: !visible,
    });
  };

  const handleReminderPositionChange = (
    position: "bottom-left" | "top-right" | "top-left" | "center",
  ) => {
    setSelectedPosition(position);
    updateSpaceProperty(selectedTab, "reminder", {
      ...spaces.find((s) => s.name === selectedTab)?.reminder,
      position,
    });
  };
  return (
    <main className="h-fit">
      <h1 className="mb-2 font-delius text-xl text-secondary-foreground/80">
        <span className="text-secondary">Reminder</span> settings
      </h1>
      <div className="z-50 space-y-3">
        <div className="flex min-h-16 w-full items-center justify-between space-x-2 rounded-2xl border-[1px] border-accent/20 bg-accent-foreground p-4">
          <div className="flex flex-col gap-1">
            <Label
              htmlFor="reminder-visibility"
              className="text-md text-foreground"
            >
              Visibility
            </Label>
          </div>
          <Switch
            id="reminder-visibility"
            checked={isReminderVisible}
            onCheckedChange={handleReminderVisibilityChange}
          />
        </div>
        <div className="flex min-h-16 w-full items-center justify-between space-x-2 rounded-2xl border-[1px] border-accent/20 bg-accent-foreground p-4">
          <div className="flex w-full flex-col gap-4">
            <Label htmlFor="quote-position" className="text-md text-foreground">
              Position
            </Label>
            <RadioGroup
              className="grid w-full grid-cols-2 items-center justify-evenly gap-2"
              orientation="horizontal"
              value={selectedPosition}
              onValueChange={handleReminderPositionChange}
            >
              {["top-right", "top-left", "bottom-left", "center"].map((pos) => (
                <div
                  key={pos}
                  className={clsx(
                    "flex w-full cursor-pointer flex-col items-center justify-center gap-2 space-x-2 rounded-xl border-[1px] border-accent px-3 py-4",
                    {
                      "border-secondary bg-secondary-smooth-700/10":
                        selectedPosition === pos,
                      "hover:bg-background": selectedPosition !== pos,
                    },
                  )}
                  onClick={() =>
                    handleReminderPositionChange(
                      pos as
                        | "bottom-left"
                        | "top-right"
                        | "top-left"
                        | "center",
                    )
                  }
                >
                  <Label
                    htmlFor={`pos-${pos}`}
                    className={clsx("w-full text-center", {
                      "text-secondary": selectedPosition === pos,
                    })}
                  >
                    {pos.charAt(0).toUpperCase() +
                      pos.slice(1).replace("-", " ")}
                  </Label>
                  <RadioGroupItem value={pos} id={`pos-${pos}`} />
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      </div>
    </main>
  );
}
