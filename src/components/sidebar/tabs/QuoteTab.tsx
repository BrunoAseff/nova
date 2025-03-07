import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import clsx from "clsx";
import { useSpacesContext } from "@/contexts/spaceContext";
import type { Position } from "@/types";
import { TabHeader } from "@/components/tabHeader";
import QuoteIllustration from "@/components/svgs/QuoteIllustration";

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

  useEffect(() => {
    const selectedSpace = spaces.find((space) => space.id === selectedTab);
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
      ...spaces.find((s) => s.id === selectedTab)?.quote,
      isHidden: !visible,
    });
  };

  const handleQuotePositionChange = (position: Position) => {
    setSelectedPosition(position);
    updateSpaceProperty(selectedTab, "quote", {
      ...spaces.find((s) => s.id === selectedTab)?.quote,
      position,
    });
  };

  const handleShowAuthorChange = (show: boolean) => {
    setShowAuthor(show);
    updateSpaceProperty(selectedTab, "quote", {
      ...spaces.find((s) => s.id === selectedTab)?.quote,
      showAuthor: show,
    });
  };

  const handleCategoryChange = (category: Category) => {
    let newCategories: string[];

    if (selectedCategories.includes("all")) {
      newCategories = [category];
    } else if (selectedCategories.includes(category)) {
      newCategories = selectedCategories.filter((c) => c !== category);
      if (newCategories.length === 0) {
        newCategories = ["all"];
      }
    } else {
      newCategories = [...selectedCategories, category];
    }

    setSelectedCategories(newCategories);
    updateSpaceProperty(selectedTab, "quote", {
      ...spaces.find((s) => s.id === selectedTab)?.quote,
      categories: newCategories,
    });
  };

  return (
    <main className="h-screen">
      <TabHeader
        title="Quote"
        subtitle="Personalize your quotes and choose what you want to see."
        Icon={QuoteIllustration}
      />
      <div className="scrollbar-thin scrollbar-gutter-stable scrollbar-track-background scrollbar-thumb-accent z-50 mt-32 max-h-[65vh] w-[135%] max-w-none space-y-6 overflow-y-auto pr-2 md:w-auto md:max-w-[95%]">
        <div className="flex min-h-16 w-[100%] items-center justify-between space-x-2 rounded-2xl border-[1px] border-accent/20 bg-accent-foreground p-4 md:w-[95%]">
          <div className="flex flex-col gap-1">
            <Label
              htmlFor="quote-visibility"
              className="text-md text-foreground"
            >
              Visibility
            </Label>
            <p className="hidden text-xs text-muted-foreground md:block md:text-sm">
              Controls if the quote is visible on the screen.
            </p>
          </div>
          <Switch
            id="quote-visibility"
            checked={isQuoteVisible}
            onCheckedChange={handleQuoteVisibilityChange}
          />
        </div>

        <div className="flex min-h-10 w-[100%] items-center justify-between space-x-2 rounded-2xl border-[1px] border-accent/20 bg-accent-foreground p-4 md:w-[95%]">
          <div className="flex flex-col gap-1">
            <Label htmlFor="show-author" className="text-md text-foreground">
              Show Author
            </Label>
            <p className="hidden text-xs text-muted-foreground md:block md:text-sm">
              Display the author&apos;s name with the quote.
            </p>
          </div>
          <Switch
            id="show-author"
            checked={showAuthor}
            onCheckedChange={handleShowAuthorChange}
          />
        </div>

        <div className="flex min-h-10 w-[100%] items-center justify-between space-x-2 rounded-2xl border-[1px] border-accent/20 bg-accent-foreground p-4 md:w-[95%]">
          <div className="flex w-full flex-col gap-4">
            <Label htmlFor="quote-position" className="text-md text-foreground">
              Position
            </Label>

            <RadioGroup
              className="grid w-full grid-cols-2 items-center justify-between md:flex"
              orientation="horizontal"
              value={selectedPosition}
              onValueChange={handleQuotePositionChange}
            >
              {["top-right", "top-left", "bottom-left", "center"].map((pos) => (
                <div
                  key={pos}
                  className={clsx(
                    "flex cursor-pointer flex-col items-center justify-between gap-2 space-x-2 rounded-xl border-[1px] border-accent px-6 py-4 transition-all duration-300",
                    {
                      "border-secondary bg-secondary-smooth-700/10":
                        selectedPosition === pos,
                      "border-muted-foreground/30 hover:border-muted-foreground hover:bg-accent/60":
                        selectedPosition !== pos,
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

        <div className="flex h-fit w-[100%] items-center justify-between space-x-2 rounded-2xl border-[1px] border-accent/20 bg-accent-foreground p-3 md:w-[95%]">
          <div className="ml-3 flex w-[100%] flex-col gap-4 p-1 md:w-[95%]">
            <Label className="text-md text-foreground">Categories</Label>
            <div className="flex flex-wrap gap-4">
              <div
                className={clsx(
                  "cursor-pointer rounded-2xl border-[1px] border-accent px-4 py-4 transition-colors duration-300",
                  {
                    "border-secondary bg-secondary-smooth-700/10":
                      selectedCategories.includes("all"),
                    "border-muted-foreground/30 hover:border-muted-foreground hover:bg-accent/60 hover:text-foreground":
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
                    "cursor-pointer rounded-2xl border-[1px] border-accent px-6 py-4 transition-colors duration-300",
                    {
                      "border-secondary bg-secondary-smooth-700/10":
                        selectedCategories.includes(category),
                      "border-muted-foreground/30 hover:border-muted-foreground hover:bg-accent/60 hover:text-foreground":
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
        </div>
      </div>
    </main>
  );
}
