import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import clsx from "clsx";
import { useSpacesContext } from "@/contexts/spaceContext";
import type { Position } from "@/types";

export default function QuoteShortcut() {
  const { spaces, selectedTab, updateSpaceProperty } = useSpacesContext();
  const [selectedPosition, setSelectedPosition] =
    useState<Position>("bottom-left");
  const [isQuoteVisible, setIsQuoteVisible] = useState(true);
  const [showAuthor, setShowAuthor] = useState(true);

  useEffect(() => {
    const selectedSpace = spaces.find((space) => space.name === selectedTab);
    if (selectedSpace) {
      setSelectedPosition(selectedSpace.quote.position);
      setIsQuoteVisible(!selectedSpace.quote.isHidden);
      setShowAuthor(selectedSpace.quote.showAuthor ?? true);
    }
  }, [spaces, selectedTab]);

  const handleQuoteVisibilityChange = (visible: boolean) => {
    setIsQuoteVisible(visible);
    updateSpaceProperty(selectedTab, "quote", {
      ...spaces.find((s) => s.name === selectedTab)?.quote,
      isHidden: !visible,
    });
  };

  const handleQuotePositionChange = (position: Position) => {
    setSelectedPosition(position);
    updateSpaceProperty(selectedTab, "quote", {
      ...spaces.find((s) => s.name === selectedTab)?.quote,
      position,
    });
  };

  const handleShowAuthorChange = (show: boolean) => {
    setShowAuthor(show);
    updateSpaceProperty(selectedTab, "quote", {
      ...spaces.find((s) => s.name === selectedTab)?.quote,
      showAuthor: show,
    });
  };

  return (
    <main className="h-fit">
      <h1 className="mb-3 text-lg text-secondary-foreground/80">Quote</h1>

      <div className="z-50 max-w-full space-y-4">
        <div className="flex min-h-16 w-full items-center justify-between space-x-2 rounded-2xl border-[1px] border-accent/20 bg-accent-foreground p-4">
          <div className="flex flex-col gap-1">
            <Label
              htmlFor="quote-visibility"
              className="text-sm text-foreground"
            >
              Visibility
            </Label>
          </div>
          <Switch
            id="quote-visibility"
            checked={isQuoteVisible}
            onCheckedChange={handleQuoteVisibilityChange}
          />
        </div>

        {/* Show Author Switch */}
        <div className="flex min-h-10 w-full items-center justify-between space-x-2 rounded-2xl border-[1px] border-accent/20 bg-accent-foreground p-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="show-author" className="text-sm text-foreground">
              Show Author
            </Label>
          </div>
          <Switch
            id="show-author"
            checked={showAuthor}
            onCheckedChange={handleShowAuthorChange}
          />
        </div>

        <div className="flex min-h-10 w-full items-center justify-between space-x-2 rounded-2xl border-[1px] border-accent/20 bg-accent-foreground p-4">
          <div className="flex flex-col gap-4">
            <Label htmlFor="quote-position" className="text-sm text-foreground">
              Position
            </Label>
            <RadioGroup
              className="grid w-full grid-cols-2 items-center justify-between gap-3"
              orientation="horizontal"
              value={selectedPosition}
              onValueChange={handleQuotePositionChange}
            >
              {["top-right", "top-left", "bottom-left", "center"].map((pos) => (
                <div
                  key={pos}
                  className={clsx(
                    "flex cursor-pointer flex-col items-center justify-between gap-2 space-x-2 rounded-xl border-[1px] border-accent px-5 py-3 text-sm",
                    {
                      "border-secondary bg-secondary-smooth-700/10":
                        selectedPosition === pos,
                      "hover:bg-background": selectedPosition !== pos,
                    },
                  )}
                  onClick={() => handleQuotePositionChange(pos as Position)}
                >
                  <Label
                    htmlFor={`pos-${pos}`}
                    className={clsx({
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
