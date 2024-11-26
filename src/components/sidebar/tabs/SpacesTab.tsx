import { PlusIcon } from "@/components/icons/PlusIcon";
import { Label } from "@/components/ui/label";
import { useSpacesContext } from "@/contexts/spaceContext";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from "@/components/ui/select";
import type { ShortcutName } from "@/types";
import { useInteractionLock } from "@/contexts/InteractionLockContext";

// Map display names to shortcut values
const shortcutMapping: Record<string, ShortcutName> = {
  Clock: "clock",
  Pomodoro: "pomodoro",
  Quote: "quote",
  Background: "background",
  Music: "music",
  Reminder: "reminder",
  "Breathing Exercise": "breathingExercise",
  Spaces: "spaces",
  Profile: "profile",
  "Ambient Sound": "ambientSound",
  Appearance: "appearance",
};

// Reverse mapping for displaying the current value
const reverseShortcutMapping: Record<ShortcutName, string> = Object.entries(
  shortcutMapping,
).reduce(
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {} as Record<ShortcutName, string>,
);

export default function SpacesTab() {
  const { shortcut, updateShortcut, spaces } = useSpacesContext();
  const shortcutOptions = Object.keys(shortcutMapping);
  const { setSelectOpen, lastSelectCloseTime } = useInteractionLock();

  return (
    <main className="h-screen">
      <div className="absolute top-3 flex w-fit items-center text-secondary">
        <div className="grid h-full grid-cols-2 items-center justify-start">
          <div className="flex flex-col gap-2">
            <h1 className="font-delius text-3xl text-secondary-foreground/80">
              <span className="text-secondary">Spaces</span> settings
            </h1>
            <p className="text-sm text-muted-foreground">
              Customize and organize your workspace layouts.
            </p>
          </div>

          <Image
            src="/illustrations/spaces.svg"
            alt="Spaces"
            width={290}
            height={220}
          />
        </div>
      </div>

      <div className="mt-28 flex h-full max-w-[95%] flex-col gap-10">
        <div className="mt-6 flex min-h-10 w-[95%] items-center justify-between space-x-2 rounded-2xl border-[1px] border-accent p-4">
          <div>
            <Label className="text-md text-foreground">Your Spaces</Label>
            <p className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-muted-foreground">
              Manage your personalized spaces and create new ones to suit your
              needs.
            </p>
            <div className="space-between mt-6 flex gap-10">
              {spaces.map((space) => (
                <div
                  key={space.name}
                  className="flex h-24 w-24 flex-col items-center justify-center gap-2 rounded-2xl border-[1px] border-secondary p-12 text-secondary"
                >
                  <p>{space.icon}</p>
                  <p>{space.name}</p>
                </div>
              ))}
              <div className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-[1px] border-dashed border-muted-foreground p-12 text-muted-foreground hover:border-secondary hover:text-secondary">
                <p>
                  <PlusIcon />
                </p>
                <p>Add</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex min-h-10 w-[95%] items-center justify-between space-x-2 rounded-2xl border-[1px] border-accent p-4">
          <div>
            {" "}
            <Label className="text-md text-foreground">Shortcut</Label>
            <p className="overflow-hidden text-sm text-muted-foreground">
              Choose which feature to quickly access from your workspace using
              the shortcut button.
            </p>
            <div className="space-between mt-6 flex gap-10">
              <Select
                onOpenChange={(isOpen) => {
                  setSelectOpen(isOpen);
                  if (!isOpen) {
                    lastSelectCloseTime.current = Date.now();
                  }
                }}
                data-exclude-sidebar
                value={reverseShortcutMapping[shortcut]}
                onValueChange={(value) => {
                  const shortcutName = shortcutMapping[value];
                  if (shortcutName) {
                    updateShortcut(shortcutName);
                  }
                }}
              >
                <SelectTrigger data-exclude-sidebar className="w-[180px]">
                  <SelectValue placeholder="Shortcut" />
                </SelectTrigger>
                <SelectContent data-exclude-sidebar>
                  <SelectGroup>
                    <SelectLabel>Shortcut</SelectLabel>
                    {shortcutOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
