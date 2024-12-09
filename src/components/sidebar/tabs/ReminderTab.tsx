import { useSpacesContext } from "@/contexts/spaceContext";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { TabHeader } from "@/components/tabHeader";
import { PlusIcon } from "@/components/icons/PlusIcon";
import { TrashIcon } from "@/components/icons/TrashIcon";
import { Textarea } from "@/components/ui/textarea";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import IconBtn from "@/components/nova/buttons/IconBtn";
import type { ReminderMessage } from "@/types";

export default function ReminderTab() {
  const {
    spaces,
    selectedTab,
    updateSpaceProperty,
    reminderMessages,
    updateReminder,
    deleteReminder,
    updateReminderType,
    updateReminderText,
  } = useSpacesContext();

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

  const handleAddReminder = () => {
    const newReminder: ReminderMessage = {
      id: nanoid(),
      text: "",
      type: "Gratitude",
    };
    updateReminder(newReminder);
  };

  const handleDeleteReminder = (id: string) => {
    deleteReminder(id);
  };

  const handleTextChange = (id: string, text: string) => {
    updateReminderText(id, text);
  };

  const handleTypeChange = (id: string, type: ReminderMessage["type"]) => {
    updateReminderType(id, type);
  };

  const types = [
    "Gratitude",
    "Motivation",
    "Affirmation",
    "Challenge",
    "Dream",
    "Mindset",
  ];

  return (
    <main className="h-screen">
      <TabHeader
        title="Reminder"
        subtitle="Set up and manage your personal reminders and notifications."
        src="/illustrations/reminder.svg"
      />
      <div className="scrollbar-thin scrollbar-gutter-stable scrollbar-track-background scrollbar-thumb-accent z-50 mt-36 max-h-[65vh] min-w-[95%] max-w-[115%] space-y-6 overflow-y-auto pr-6">
        <div className="flex min-h-16 max-w-[99%] items-center justify-between space-x-2 rounded-2xl border-[1px] border-accent p-4">
          <div className="flex flex-col gap-1">
            <Label
              htmlFor="reminder-visibility"
              className="text-md text-foreground"
            >
              Visibility
            </Label>
            <p className="text-sm text-muted-foreground">
              Controls if the reminder is visible on the screen.
            </p>
          </div>
          <Switch
            id="reminder-visibility"
            checked={isReminderVisible}
            onCheckedChange={handleReminderVisibilityChange}
          />
        </div>
        <div className="flex min-h-16 max-w-[99%] items-center justify-between space-x-2 rounded-2xl border-[1px] border-accent p-4">
          <div className="flex w-full flex-col gap-4">
            <Label htmlFor="quote-position" className="text-md text-foreground">
              Position
            </Label>
            <RadioGroup
              className="flex w-full items-center justify-evenly gap-2"
              orientation="horizontal"
              value={selectedPosition}
              onValueChange={handleReminderPositionChange}
            >
              {["top-right", "top-left", "bottom-left", "center"].map((pos) => (
                <div
                  key={pos}
                  className={clsx(
                    "flex w-full cursor-pointer flex-col items-center justify-center gap-2 space-x-2 rounded-xl border-[1px] border-accent px-4 py-4",
                    {
                      "border-secondary bg-secondary-smooth-700/10":
                        selectedPosition === pos,
                      "hover:bg-accent-foreground": selectedPosition !== pos,
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

        <div className="flex max-w-[99%] flex-col gap-4">
          <Label htmlFor="reminders" className="text-md text-foreground">
            Create reminders
          </Label>
          {reminderMessages.length === 0 ? (
            <div className="w-full text-sm text-muted-foreground">
              <p>
                Tip: Write anything you want your future self to know: what you
                are grateful about, the good things in your life, what things
                you need to keep in mind...
              </p>
            </div>
          ) : (
            reminderMessages.map((message) => (
              <div
                key={message.id}
                className="flex flex-col gap-2 rounded-2xl border-[1px] border-accent p-4"
              >
                <RadioGroup
                  className="flex gap-2"
                  value={message.type}
                  onValueChange={(type) =>
                    handleTypeChange(
                      message.id,
                      type as ReminderMessage["type"],
                    )
                  }
                >
                  {types.map((type) => (
                    <label
                      key={type}
                      className="w-fit cursor-pointer items-center justify-center rounded-2xl border-[1px] border-accent p-2 text-xs text-muted-foreground transition-colors hover:bg-accent-foreground has-[[data-state=checked]]:border-secondary has-[[data-state=checked]]:bg-secondary-smooth-700/10 has-[[data-state=checked]]:text-secondary"
                    >
                      <RadioGroupItem
                        value={type}
                        className="sr-only after:absolute after:inset-0"
                      />
                      <p className="font-medium leading-none">{type}</p>
                    </label>
                  ))}
                </RadioGroup>

                <Textarea
                  placeholder="Write your reminder message here..."
                  defaultValue={message.text}
                  className="mt-2 w-full"
                  rows={3}
                  onBlur={(e) => handleTextChange(message.id, e.target.value)}
                />
                <div className="ml-auto">
                  <IconBtn
                    variant="destructive"
                    onClick={() => handleDeleteReminder(message.id)}
                  >
                    <TrashIcon />
                  </IconBtn>
                </div>
              </div>
            ))
          )}
          <button
            onClick={handleAddReminder}
            className="mt-4 flex w-full items-center justify-center rounded-2xl border-2 border-dotted border-accent p-4 transition-all hover:border-secondary hover:bg-secondary-smooth-700/10 hover:text-secondary"
          >
            <PlusIcon />
          </button>
        </div>
      </div>
    </main>
  );
}
