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
import { useState } from "react";
import { useSpacesContext } from "@/contexts/spaceContext";

export default function SpacePicker() {
  const { state } = useSpacesContext();
  const { spaces } = state;
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(spaces[0]?.name ?? "");

  return (
    <div className="ml-5 mt-5 w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="min-w-[25%] justify-between rounded-xl bg-muted text-foreground hover:bg-muted hover:text-secondary"
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
                    onSelect={() => {
                      setValue(space.name);
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
