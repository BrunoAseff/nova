import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import clsx from "clsx";
import { useSpacesContext } from "@/contexts/spaceContext";
import type { Position } from "@/types";

type Category = "Fact" | "Success" | "Motivational" | "Gratitude" | "Self Care";
const CATEGORIES: Category[] = [
  "Fact",
  "Success",
  "Motivational",
  "Gratitude",
  "Self Care",
];

export default function QuoteTab() {
  const { spaces, selectedTab, updateSpaceProperty } = useSpacesContext();
  const [selectedPosition, setSelectedPosition] =
    useState<Position>("bottom-left");
  const [isQuoteVisible, setIsQuoteVisible] = useState(true);
  const [showAuthor, setShowAuthor] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "all",
  ]);

  // Synchronize local state with the selected space
  useEffect(() => {
    const selectedSpace = spaces.find((space) => space.name === selectedTab);
    if (selectedSpace) {
      setSelectedPosition(selectedSpace.quote.position);
      setIsQuoteVisible(!selectedSpace.quote.isHidden);
      setShowAuthor(selectedSpace.quote.showAuthor ?? true);
      setSelectedCategories(selectedSpace.quote.categories ?? ["all"]);
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

  const handleCategoryChange = (category: Category) => {
    let newCategories: string[];

    if (selectedCategories.includes("all")) {
      // If currently showing all categories, switch to only the selected category
      newCategories = [category];
    } else if (selectedCategories.includes(category)) {
      // Remove the category if it's already selected
      newCategories = selectedCategories.filter((c) => c !== category);
      // If no categories would be selected, switch to "all"
      if (newCategories.length === 0) {
        newCategories = ["all"];
      }
    } else {
      // Add the new category to the selection
      newCategories = [...selectedCategories, category];
    }

    setSelectedCategories(newCategories);
    updateSpaceProperty(selectedTab, "quote", {
      ...spaces.find((s) => s.name === selectedTab)?.quote,
      categories: newCategories,
    });
  };

  return (
    <main className="flex flex-col gap-10 overflow-y-auto">
      {/* Visibility Switch */}
      <div className="flex min-h-10 w-[90%] items-center justify-between space-x-2 rounded-2xl border-[1px] border-accent p-4">
        <div className="flex flex-col gap-1">
          <Label htmlFor="quote-visibility" className="text-md text-foreground">
            Visibility
          </Label>
          <p className="text-sm text-muted-foreground">
            Controls if the quote is visible on the screen.
          </p>
        </div>
        <Switch
          id="quote-visibility"
          checked={isQuoteVisible}
          onCheckedChange={handleQuoteVisibilityChange}
        />
      </div>

      {/* Show Author Switch */}
      <div className="flex min-h-10 w-[90%] items-center justify-between space-x-2 rounded-2xl border-[1px] border-accent p-4">
        <div className="flex flex-col gap-1">
          <Label htmlFor="show-author" className="text-md text-foreground">
            Show Author
          </Label>
          <p className="text-sm text-muted-foreground">
            Display the author&apos;s name with the quote.
          </p>
        </div>
        <Switch
          id="show-author"
          checked={showAuthor}
          onCheckedChange={handleShowAuthorChange}
        />
      </div>

      {/* Position Selector */}
      <div className="ml-3 flex flex-col gap-4">
        <Label htmlFor="quote-position" className="text-md text-foreground">
          Position
        </Label>
        <RadioGroup
          className="flex w-[90%] items-center justify-evenly gap-2"
          orientation="horizontal"
          value={selectedPosition}
          onValueChange={handleQuotePositionChange}
        >
          {["top-right", "top-left", "bottom-left", "center"].map((pos) => (
            <div
              key={pos}
              className={clsx(
                "flex cursor-pointer flex-col items-center justify-center gap-2 space-x-2 rounded-xl border-[1px] border-accent px-6 py-4",
                {
                  "border-secondary bg-blue-700/10": selectedPosition === pos,
                  "hover:bg-accent-foreground": selectedPosition !== pos,
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
                {pos.charAt(0).toUpperCase() + pos.slice(1).replace("-", " ")}
              </Label>
              <RadioGroupItem value={pos} id={`pos-${pos}`} />
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Categories Selector */}
      <div className="ml-3 flex w-[90%] flex-col gap-4">
        <Label className="text-md text-foreground">Categories</Label>
        <div className="flex flex-wrap gap-4">
          <div
            className={clsx(
              "cursor-pointer rounded-xl border-[1px] border-accent px-6 py-4 transition-colors",
              {
                "border-secondary bg-blue-700/10":
                  selectedCategories.includes("all"),
                "hover:bg-accent-foreground":
                  !selectedCategories.includes("all"),
              },
            )}
            onClick={() => setSelectedCategories(["all"])}
          >
            <span
              className={clsx({
                "text-secondary": selectedCategories.includes("all"),
              })}
            >
              All Categories
            </span>
          </div>
          {CATEGORIES.map((category) => (
            <div
              key={category}
              className={clsx(
                "cursor-pointer rounded-xl border-[1px] border-accent px-6 py-4 transition-colors",
                {
                  "border-secondary bg-blue-700/10":
                    selectedCategories.includes(category),
                  "hover:bg-accent-foreground":
                    !selectedCategories.includes(category),
                },
              )}
              onClick={() => handleCategoryChange(category)}
            >
              <span
                className={clsx({
                  "text-secondary": selectedCategories.includes(category),
                })}
              >
                {category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
