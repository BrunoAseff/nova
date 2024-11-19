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
  const [value, setValue] = useState(selectedTab || spaces[0]?.name);

  useEffect(() => {
    setValue(selectedTab || spaces[0]?.name);
  }, [selectedTab, spaces]);

  return (
    <div className="ml-5 mt-5 w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="min-w-[25%] justify-between rounded-xl border-[1px] border-muted bg-transparent py-2 text-foreground hover:border-secondary hover:bg-secondary-smooth-700/10 hover:text-foreground"
          >
            {spaces.find((space) => space.name === value)?.name ??
              "Select Space..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px]">
          <Command>
            <CommandInput placeholder="Search space..." />
            <CommandList>
              <CommandEmpty>No space found.</CommandEmpty>
              <CommandGroup>
                {spaces.map((space) => (
                  <CommandItem
                    key={space.name}
                    value={space.name}
                    onSelect={(val) => {
                      setValue(val);
                      selectTab(val);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === space.name ? "opacity-100" : "opacity-0",
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
