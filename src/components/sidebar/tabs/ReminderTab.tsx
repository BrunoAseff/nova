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
import { AnimatePresence, motion } from "framer-motion";
import ReminderIllustration from "@/components/svgs/ReminderIllustration";
import LimitedFeature from "@/components/limitedFeature";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const selectedSpace = spaces.find((space) => space.id === selectedTab);
    if (selectedSpace) {
      setSelectedPosition(selectedSpace.reminder.position);
      setIsReminderVisible(!selectedSpace.reminder.isHidden);
    }
  }, [spaces, selectedTab]);

  const handleReminderVisibilityChange = (visible: boolean) => {
    setIsReminderVisible(visible);
    updateSpaceProperty(selectedTab, "reminder", {
      ...spaces.find((s) => s.id === selectedTab)?.reminder,
      isHidden: !visible,
    });
  };

  const handleReminderPositionChange = (
    position: "bottom-left" | "top-right" | "top-left" | "center",
  ) => {
    setSelectedPosition(position);
    updateSpaceProperty(selectedTab, "reminder", {
      ...spaces.find((s) => s.id === selectedTab)?.reminder,
      position,
    });
  };

  const handleAddReminder = () => {
    if (reminderMessages.length >= 3) {
      setIsModalOpen(true);
    } else {
      const newReminder: ReminderMessage = {
        id: nanoid(),
        text: "",
        type: "Gratitude",
      };
      updateReminder(newReminder);
    }
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

  const reminderPlaceholders = {
    Gratitude:
      "\"I'm grateful for my family's unwavering support through everything.\"",
    Motivation:
      '"I will become a successful entrepreneur and make a positive impact."',
    Affirmation:
      '"I am capable of learning and growing beyond my current limitations."',
    Challenge:
      '"I will overcome my fear of public speaking and become a confident communicator."',
    Dream:
      '"My dream is to travel to all continents and experience diverse cultures."',
    Mindset:
      '"I choose to see obstacles as opportunities for growth and learning."',
  };

  const types = Object.keys(reminderPlaceholders) as ReminderMessage["type"][];

  return (
    <main
      className={clsx("h-screen", {
        "w-[95%]": reminderMessages.length === 0,
        "w-auto": reminderMessages.length > 0,
      })}
    >
      {" "}
      <TabHeader
        title="Reminder"
        subtitle="Set up and manage your personal reminders to keep what you want in mind."
        Icon={ReminderIllustration}
      />
      <div className="scrollbar-thin scrollbar-gutter-stable scrollbar-track-background scrollbar-thumb-accent z-50 mt-[7rem] max-h-[65vh] w-[150%] min-w-[95%] space-y-6 overflow-y-auto pr-6 md:w-auto md:max-w-[115%]">
        <div className="flex min-h-16 w-[97%] items-center justify-between space-x-2 rounded-2xl border-[1px] border-accent/20 bg-accent-foreground p-4 md:w-auto md:max-w-[99%]">
          <div className="flex flex-col gap-1">
            <Label
              htmlFor="reminder-visibility"
              className="text-md text-foreground"
            >
              Visibility
            </Label>
            <p className="text-xs text-muted-foreground md:text-sm">
              Controls if the reminder is visible on the screen.
            </p>
          </div>
          <Switch
            id="reminder-visibility"
            checked={isReminderVisible}
            onCheckedChange={handleReminderVisibilityChange}
          />
        </div>
        <div className="flex min-h-16 w-[97%] items-center justify-between space-x-2 rounded-2xl border-[1px] border-accent/20 bg-accent-foreground p-4 md:w-auto md:max-w-[99%]">
          <div className="flex w-full flex-col gap-4">
            <Label htmlFor="quote-position" className="text-md text-foreground">
              Position
            </Label>
            <RadioGroup
              className="grid w-full grid-cols-2 items-center justify-evenly gap-2 md:flex"
              orientation="horizontal"
              value={selectedPosition}
              onValueChange={handleReminderPositionChange}
            >
              {["top-right", "top-left", "bottom-left", "center"].map((pos) => (
                <div
                  key={pos}
                  className={clsx(
                    "flex w-full cursor-pointer flex-col items-center justify-center gap-2 space-x-2 rounded-xl border-[1px] border-accent px-2.5 py-3.5 md:px-3 md:py-4",
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
        <div className="flex min-h-16 w-[97%] items-center justify-between space-x-2 rounded-2xl border-[1px] border-accent/20 bg-accent-foreground p-4 md:w-auto md:max-w-[99%]">
          <div className="flex max-w-[100%] flex-col gap-4">
            <Label htmlFor="reminders" className="text-md text-foreground">
              Your reminders
            </Label>
            {reminderMessages.length === 0 ? (
              <div className="w-full text-xs text-muted-foreground md:text-sm">
                <p>
                  Tip: Write anything you want your future self to know: what
                  you are grateful about, the good things in your life, what
                  things you need to keep in mind...
                </p>
              </div>
            ) : (
              <AnimatePresence>
                {reminderMessages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-2 rounded-2xl border-[1px] border-accent/60 bg-background p-4"
                  >
                    <RadioGroup
                      className="grid grid-cols-3 gap-2 md:flex"
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
                          className="w-fit cursor-pointer items-center justify-center rounded-2xl border-[1px] border-accent/60 p-2 text-xs text-muted-foreground transition-colors hover:bg-accent-foreground has-[[data-state=checked]]:border-secondary has-[[data-state=checked]]:bg-secondary-smooth-700/10 has-[[data-state=checked]]:text-secondary"
                        >
                          <RadioGroupItem
                            value={type}
                            className="sr-only after:absolute after:inset-0"
                          />
                          <p className="font-medium leading-none">{type}</p>
                        </label>
                      ))}
                    </RadioGroup>
                    <div className="flex w-full justify-between">
                      <Textarea
                        maxLength={140}
                        placeholder={reminderPlaceholders[message.type]}
                        defaultValue={message.text}
                        className="md:text-md mt-2 w-[90%] text-sm"
                        rows={3}
                        onBlur={(e) =>
                          handleTextChange(message.id, e.target.value)
                        }
                      />
                      <div className="ml-2 mt-auto md:ml-0">
                        <IconBtn
                          variant="destructive"
                          onClick={() => handleDeleteReminder(message.id)}
                        >
                          <TrashIcon />
                        </IconBtn>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
            <button
              onClick={handleAddReminder}
              className="mt-1 flex w-full items-center justify-center rounded-2xl border-2 border-dotted border-accent p-4 transition-all hover:border-secondary hover:bg-secondary-smooth-700/10 hover:text-secondary"
            >
              <PlusIcon />
            </button>
            <LimitedFeature
              feature="remiders"
              limit="3 reminders"
              open={isModalOpen}
              onOpenChange={() => setIsModalOpen(!isModalOpen)}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
