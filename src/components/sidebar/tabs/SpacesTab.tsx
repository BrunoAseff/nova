import { Label } from "@/components/ui/label";
import { useSpacesContext } from "@/contexts/spaceContext";
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
import DangerBtn from "@/components/nova/buttons/DangerBtn";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TabHeader } from "@/components/tabHeader";
import TabBody from "@/components/tabBody";
import TabCard from "@/components/tabCard";
import SpacesIllustration from "@/components/svgs/SpacesIllustration";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const shortcutMapping: Record<string, ShortcutName> = {
  Clock: "clock",
  Pomodoro: "pomodoro",
  Quote: "quote",
  Background: "background",
  Music: "music",
  Reminder: "reminder",
  "Breathing Exercise": "breathingExercise",
  "Ambient Sound": "ambientSound",
  Appearance: "appearance",
};

const reverseShortcutMapping: Record<ShortcutName, string> = Object.entries(
  shortcutMapping,
).reduce(
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {} as Record<ShortcutName, string>,
);

export default function SpacesTab() {
  const {
    shortcut,
    updateShortcut,
    spaces,
    resetSpaces,

    updateSpaceProperty,
  } = useSpacesContext();

  const shortcutOptions = Object.keys(shortcutMapping);
  const { setSelectOpen, lastSelectCloseTime } = useInteractionLock();
  const [editingSpaceIndex, setEditingSpaceIndex] = useState<number | null>(
    null,
  ); // Track which space is being edited
  const [tempSpaceNames, setTempSpaceNames] = useState<string[]>(
    spaces.map((space) => space.name), // Temp state to hold names while editing
  );

  function handleSpaceNameChange(index: number): void {
    const space = spaces[index];
    if (!space) return; // Ensure the space exists
    const newName = tempSpaceNames[index];
    updateSpaceProperty(space.name, "name", newName);
    setEditingSpaceIndex(null);
  }

  function handleCancelEdit(index: number): void {
    const space = spaces[index];
    if (!space) return;
    const originalName = space.name;
    setTempSpaceNames((prev: string[]) => {
      const updatedNames = [...prev];
      updatedNames[index] = originalName;
      return updatedNames;
    });
    setEditingSpaceIndex(null);
  }

  return (
    <main className="h-screen">
      <TabHeader
        title="Spaces"
        subtitle="Customize and organize your workspace layouts."
        Icon={SpacesIllustration}
      />
      <TabBody>
        <TabCard>
          <div>
            <Label className="text-md text-foreground">Your Spaces</Label>
            <p className="max-w-[90%] overflow-hidden text-xs text-muted-foreground md:text-sm">
              Manage your personalized spaces and create new ones to suit your
              needs.
            </p>
            <div className="mt-2 flex w-full flex-col items-center gap-4">
              {spaces.map((space, index) => (
                <div
                  key={index}
                  className="flex w-full flex-col items-center gap-2 rounded-2xl p-1 text-muted-foreground md:flex-row md:p-4"
                >
                  <p>{space.icon}</p>

                  <Input
                    className="w-fit"
                    value={tempSpaceNames[index] ?? "failed to load your space"}
                    readOnly={editingSpaceIndex !== index}
                    onChange={(e) => {
                      const newName = e.target.value;
                      setTempSpaceNames((prev: string[]) => {
                        const updatedNames = [...prev];
                        updatedNames[index] = newName;
                        return updatedNames;
                      });
                    }}
                  />

                  {editingSpaceIndex !== index ? (
                    <Button
                      variant="ghost"
                      className="mx-auto mt-2 text-sm md:mt-0"
                      onClick={() => setEditingSpaceIndex(index)}
                    >
                      Change space name
                    </Button>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <Button
                        variant="ghost"
                        className="mt-2 w-[7.3rem] text-sm md:mt-0"
                        onClick={() => handleSpaceNameChange(index)}
                      >
                        Save change
                      </Button>
                      <Button
                        variant="ghost"
                        className="mt-2 text-sm md:mt-0"
                        onClick={() => handleCancelEdit(index)}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </TabCard>
        <TabCard className="hidden md:block">
          <div>
            {" "}
            <Label className="text-md text-foreground">Shortcut</Label>
            <p className="overflow-hidden text-xs text-muted-foreground md:text-sm">
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
        </TabCard>
        <div>
          <Label
            htmlFor="clock-reset"
            className="mb-1 text-xs text-destructive md:text-sm"
          >
            Danger Zone
          </Label>
          <TabCard className="flex flex-col gap-4 md:flex-row" variant="danger">
            <div className="flex w-full flex-col gap-1">
              <Label htmlFor="clock-reset" className="text-md text-foreground">
                Reset spaces
              </Label>
              <p className="overflow-hidden text-ellipsis whitespace-nowrap text-xs text-muted-foreground md:text-sm">
                Reset all spaces to their default settings.
              </p>
            </div>
            <AlertDialog
              onOpenChange={(isOpen) => {
                setSelectOpen(isOpen);
                if (!isOpen) {
                  lastSelectCloseTime.current = Date.now();
                }
              }}
              data-exclude-sidebar
            >
              <AlertDialogTrigger asChild>
                <DangerBtn>Reset spaces</DangerBtn>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently reset
                    all spaces and their settings.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="w-fit gap-2 rounded-xl border-[1px] border-muted bg-muted p-3 font-sans text-xs font-[500] text-foreground transition-colors hover:border-secondary hover:bg-secondary-smooth-700/10 hover:text-secondary md:text-sm">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={resetSpaces}
                    className="w-fit gap-2 rounded-xl border-[1px] bg-foreground p-3 font-sans text-xs font-[500] text-background transition-colors hover:border-destructive hover:bg-red-700/10 hover:text-destructive md:text-sm"
                  >
                    Reset Spaces
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </TabCard>
        </div>
      </TabBody>
    </main>
  );
}
