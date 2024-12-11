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
  const { shortcut, updateShortcut, spaces, resetSpaces } = useSpacesContext();
  const shortcutOptions = Object.keys(shortcutMapping);
  const { setSelectOpen, lastSelectCloseTime } = useInteractionLock();

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
            <div className="space-between mt-6 flex gap-10">
              {spaces.map((space) => (
                <div
                  key={space.name}
                  className="flex h-24 w-24 flex-col items-center justify-center gap-2 rounded-2xl border-[1px] border-secondary bg-secondary-smooth-700/10 p-12 text-secondary"
                >
                  <p>{space.icon}</p>
                  <p>{space.name}</p>
                </div>
              ))}
              <div className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-[1px] border-dashed border-muted-foreground p-12 text-muted-foreground transition-all hover:border-secondary hover:bg-secondary-smooth-700/10 hover:text-secondary">
                <p>
                  <PlusIcon />
                </p>
                <p>Add</p>
              </div>
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
                <DangerBtn>Reset</DangerBtn>
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
                  <AlertDialogCancel className="w-fit gap-2 rounded-xl border-[1px] border-muted bg-muted p-3 text-sm font-[500] text-foreground transition-colors hover:border-secondary hover:bg-secondary-smooth-700/10 hover:text-secondary">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={resetSpaces}
                    className="w-fit gap-2 rounded-xl border-[1px] bg-foreground p-3 text-sm font-[500] text-background transition-colors hover:border-destructive hover:bg-red-700/10 hover:text-destructive"
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
