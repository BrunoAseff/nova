import { PlusIcon } from "@/components/icons/PlusIcon";
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
import LimitedFeature from "@/components/limitedFeature";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CircleNotch } from "@phosphor-icons/react";

// Map display names to shortcut values
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
  const { shortcut, updateShortcut, spaces, resetSpaces } = useSpacesContext();
  const shortcutOptions = Object.keys(shortcutMapping);
  const { setSelectOpen, lastSelectCloseTime } = useInteractionLock();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingSpace, setIsEditingSpace] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function handleAddSpaces() {
    setIsModalOpen(true);
  }

  function handleSpaceNameChange() {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
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
            <p className="max-w-[90%] overflow-hidden text-sm text-muted-foreground">
              Manage your personalized spaces and create new ones to suit your
              needs.
            </p>
            <div className="mt-2 flex w-full flex-col items-center gap-4">
              {spaces.map((space) => (
                <div
                  key={space.name}
                  className="flex w-full items-center gap-2 rounded-2xl p-4 text-muted-foreground"
                >
                  <p>{space.icon}</p>

                  <Input
                    className="w-fit"
                    value={space.name ?? "failed to load your space"}
                    readOnly={!isEditingSpace}
                    disabled={!isEditingSpace}
                  />

                  {!isEditingSpace ? (
                    <Button
                      variant="ghost"
                      className="mx-auto text-sm"
                      onClick={() => setIsEditingSpace(true)}
                    >
                      Change space name
                    </Button>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <Button
                        variant="ghost"
                        className="w-[7.3rem] text-sm"
                        onClick={() => {
                          handleSpaceNameChange();
                        }}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <CircleNotch className="animate-spin" size={18} />
                        ) : (
                          "Save change"
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        className="text-sm"
                        onClick={() => {
                          setIsEditingSpace(false);
                        }}
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              <button
                onClick={handleAddSpaces}
                className="mt-1 flex w-full items-center justify-center rounded-2xl border-2 border-dotted border-accent p-4 transition-all hover:border-secondary hover:bg-secondary-smooth-700/10 hover:text-secondary"
              >
                <PlusIcon />
              </button>
              <LimitedFeature
                feature="spaces"
                limit="3 spaces"
                open={isModalOpen}
                onOpenChange={() => setIsModalOpen(!isModalOpen)}
              />{" "}
            </div>
          </div>
        </TabCard>

        <TabCard>
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
        </TabCard>
        <div>
          <Label
            htmlFor="clock-reset"
            className="mb-1 text-sm text-destructive"
          >
            Danger Zone
          </Label>
          <TabCard variant="danger">
            <div className="flex w-full flex-col gap-1">
              <Label htmlFor="clock-reset" className="text-md text-foreground">
                Reset spaces
              </Label>
              <p className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-muted-foreground">
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
                  <AlertDialogCancel className="w-fit gap-2 rounded-xl border-[1px] border-muted bg-muted p-3 font-sans text-sm font-[500] text-foreground transition-colors hover:border-secondary hover:bg-secondary-smooth-700/10 hover:text-secondary">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={resetSpaces}
                    className="w-fit gap-2 rounded-xl border-[1px] bg-foreground p-3 font-sans text-sm font-[500] text-background transition-colors hover:border-destructive hover:bg-red-700/10 hover:text-destructive"
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
