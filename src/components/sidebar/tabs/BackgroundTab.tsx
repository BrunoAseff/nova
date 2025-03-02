import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSpacesContext } from "@/contexts/spaceContext";
import { backgrounds } from "@/content/backgrounds";
import type { Color, Environment } from "@/content/backgrounds";
import Image from "next/image";
import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useInteractionLock } from "@/contexts/InteractionLockContext";
import { Badge } from "@/components/ui/badge";
import { Close } from "@/components/icons/Close";
import { TabHeader } from "@/components/tabHeader";
import { Label } from "@/components/ui/label";
import BackgroundIllustration from "@/components/svgs/BackgroundIllustration";
import NoResultsIllustration from "@/components/svgs/NoResultsIllustration";

export default function BackgroundTab() {
  const { spaces, selectedTab, updateSpaceProperty } = useSpacesContext();
  const [selectedEnvironment, setSelectedEnvironment] = useState<
    Environment | "all"
  >("all");
  const [selectedColor, setSelectedColor] = useState<Color | "all">("all");
  const [excludeAI, setExcludeAI] = useState(false);

  const environments = [
    "all",
    ...new Set(backgrounds.flatMap((bg) => bg.environment)),
  ] as (Environment | "all")[];
  const colors = ["all", ...new Set(backgrounds.flatMap((bg) => bg.color))] as (
    | Color
    | "all"
  )[];

  const currentBackgroundURL =
    spaces.find((space) => space.id === selectedTab)?.background ?? "";

  const handleBackgroundURLChange = (name: string) => {
    const selectedBackground = backgrounds.find((bg) => bg.name === name);
    if (selectedBackground) {
      updateSpaceProperty(selectedTab, "background", selectedBackground.url);
    }
  };

  const filteredBackgrounds = useMemo(() => {
    return backgrounds.filter((bg) => {
      const matchesEnvironment =
        selectedEnvironment === "all" ||
        bg.environment.includes(selectedEnvironment);
      const matchesColor =
        selectedColor === "all" || bg.color.includes(selectedColor);
      const matchesAI = excludeAI ? !bg.AIgenerated : true;
      return matchesEnvironment && matchesColor && matchesAI;
    });
  }, [selectedEnvironment, selectedColor, excludeAI]);

  const COLOR_MAP: Record<Color, string> = {
    Green: "bg-green-500",
    Yellow: "bg-yellow-500",
    Orange: "bg-orange-500",
    Red: "bg-red-500",
    Pink: "bg-pink-500",
    Purple: "bg-purple-500",
    Blue: "bg-blue-500",
  };

  const { setSelectOpen, lastSelectCloseTime } = useInteractionLock();

  const resetFilters = () => {
    setSelectedEnvironment("all");
    setSelectedColor("all");
    setExcludeAI(false);
  };

  const isAnyFilterActive =
    selectedEnvironment !== "all" || selectedColor !== "all" || excludeAI;

  return (
    <main className="h-screen">
      <TabHeader
        title="Background"
        subtitle="Choose background images to create your ideal workspace atmosphere."
        Icon={BackgroundIllustration}
      />

      <div className="mt-16 flex w-[93%] flex-col">
        <div className="ml-auto flex w-[145%] items-center justify-center gap-4 md:ml-0 md:w-auto">
          <div className="flex flex-col gap-1">
            <p className="text-sm text-foreground">Environment</p>
            <Select
              onOpenChange={(isOpen) => {
                setSelectOpen(isOpen);
                if (!isOpen) {
                  lastSelectCloseTime.current = Date.now();
                }
              }}
              data-sidebar-exclude
              value={selectedEnvironment}
              onValueChange={(value) =>
                setSelectedEnvironment(value as Environment | "all")
              }
            >
              <SelectTrigger className="w-[130px] md:w-[180px]">
                <SelectValue placeholder="Environment" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Environment</SelectLabel>
                  {environments.map((env) => (
                    <SelectItem key={env} value={env}>
                      {env.charAt(0).toUpperCase() + env.slice(1)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm text-foreground">Color</p>
            <Select
              onOpenChange={(isOpen) => {
                setSelectOpen(isOpen);
                if (!isOpen) {
                  lastSelectCloseTime.current = Date.now();
                }
              }}
              value={selectedColor}
              onValueChange={(value) =>
                setSelectedColor(value as Color | "all")
              }
            >
              <SelectTrigger className="w-[130px] md:w-[180px]">
                <SelectValue placeholder="Color" />
              </SelectTrigger>
              <SelectContent
                onPointerDownOutside={(event) => {
                  const target = event.target as HTMLElement;
                  if (target.closest("[data-exclude-sidebar]")) {
                    event.preventDefault();
                  }
                }}
              >
                <SelectGroup>
                  <SelectLabel>Color</SelectLabel>
                  {colors.map((color) => (
                    <SelectItem key={color} value={color}>
                      <div className="flex items-center gap-2">
                        {color !== "all" && (
                          <div
                            className={`h-2 w-2 shrink-0 rounded-full ${COLOR_MAP[color as Color]}`}
                          />
                        )}
                        <span>
                          {color.charAt(0).toUpperCase() + color.slice(1)}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-6 hidden items-center gap-2 py-4 md:flex">
            <Checkbox
              id="exclude-ai"
              checked={excludeAI}
              onCheckedChange={(checked) => setExcludeAI(checked as boolean)}
            />
            <label
              htmlFor="exclude-ai"
              className={`text-sm font-medium leading-none transition-all duration-300 hover:text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${excludeAI ? "text-secondary hover:text-secondary" : ""}`}
            >
              Exclude AI Generated
            </label>
          </div>
        </div>
        <div className="mt-1 min-h-4 md:min-h-8">
          {" "}
          {isAnyFilterActive && (
            <Badge
              variant="outline"
              className="text-xm w-fit cursor-pointer items-center gap-2 border-[1px] hover:border-secondary hover:bg-secondary-smooth-700/10 hover:text-secondary"
              onClick={resetFilters}
            >
              Remove filters
              <Close className="h-3 w-3" />
            </Badge>
          )}
        </div>
        {filteredBackgrounds.length > 0 ? (
          <div className="relative">
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-12 bg-gradient-to-t from-background to-transparent" />

            <RadioGroup
              value={
                backgrounds.find((bg) => bg.url === currentBackgroundURL)
                  ?.name ?? ""
              }
              onValueChange={handleBackgroundURLChange}
              className="scrollbar-thin scrollbar-track-background scrollbar-thumb-accent mx-auto grid max-h-[60vh] w-[145%] scroll-pb-56 grid-cols-2 justify-between gap-4 overflow-y-auto pb-56 pr-4 md:w-full md:grid-cols-3"
            >
              {filteredBackgrounds.map((background) => {
                const isChecked = background.url === currentBackgroundURL;

                return (
                  <Label
                    key={background.name}
                    className={`relative flex max-w-fit cursor-pointer flex-col flex-wrap items-center justify-between gap-3 rounded-xl border p-3 text-center ring-offset-background transition-colors duration-300 ${
                      isChecked
                        ? "border-secondary bg-secondary-smooth-700/10"
                        : "border-background hover:border-muted-foreground hover:bg-accent/60 hover:text-foreground"
                    } ${isChecked ? "text-secondary" : "text-foreground"} focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2`}
                  >
                    <RadioGroupItem
                      value={background.name}
                      className="sr-only items-center justify-center"
                    />
                    <div className="aspect-video w-full overflow-hidden rounded-xl">
                      <Image
                        src={background.url}
                        alt={background.name}
                        width={200}
                        height={200}
                        className="rounded-xl"
                        quality={50}
                      />
                    </div>
                    <p
                      className={`text-sm font-medium leading-none ${isChecked ? "text-secondary" : "text-foreground"}`}
                    >
                      {background.name}
                    </p>
                  </Label>
                );
              })}
            </RadioGroup>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <NoResultsIllustration className="h-44 w-44 fill-muted-foreground" />
            <h2 className="text-xl font-semibold text-muted-foreground">
              No backgrounds found
            </h2>
            <p className="text-sm text-muted-foreground">
              Try adjusting your filters to find more backgrounds
            </p>
            <button
              onClick={resetFilters}
              className="text-sm text-secondary hover:underline"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
