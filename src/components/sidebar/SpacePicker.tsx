import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { useSpacesContext } from "@/contexts/spaceContext";

export default function SpacePicker() {
  const { spaces, selectedTab, selectTab } = useSpacesContext();
  const [open, setOpen] = useState(false);

  // Find the selected space using the ID
  const selectedSpace = spaces.find((space) => space.id === selectedTab);
  const [value, setValue] = useState(selectedSpace?.id ?? spaces[1]?.id);

  useEffect(() => {
    setValue(selectedTab ?? spaces[1]?.id);
  }, [selectedTab, spaces, selectTab]);

  return (
    <div className="ml-5 mt-5 hidden w-full md:block">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            aria-label="Select Space"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="min-w-[25%] justify-between rounded-xl border-[1px] border-muted bg-transparent py-2 text-foreground hover:border-secondary hover:bg-secondary-smooth-700/10 hover:text-foreground"
          >
            {spaces.find((space) => space.id === value)?.name ??
              "Select Space..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent data-sidebar-exclude className="w-[200px]">
          <Command>
            <CommandInput placeholder="Search space..." />
            <CommandList>
              <CommandEmpty>No space found.</CommandEmpty>
              <CommandGroup>
                {spaces.map((space) => (
                  <CommandItem
                    key={space.id}
                    // Use the space name for searching/filtering
                    value={space.name}
                    onSelect={() => {
                      setValue(space.id);
                      selectTab(space.id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === space.id ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {space.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
