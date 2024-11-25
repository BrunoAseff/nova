import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSpacesContext } from "@/contexts/spaceContext";
import { backgrounds } from "backgrounds";
import type { Color, Environment } from "backgrounds";
import Image from "next/image";
import { useState } from "react";
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

export default function BackgroundTab() {
  const { spaces, selectedTab, updateSpaceProperty } = useSpacesContext();
  const [selectedEnvironment, setSelectedEnvironment] = useState<
    Environment | "all"
  >("all");
  const [selectedColor, setSelectedColor] = useState<Color | "all">("all");
  const [excludeAI, setExcludeAI] = useState(false);

  // Get unique environments and colors from backgrounds
  const environments = [
    "all",
    ...new Set(backgrounds.flatMap((bg) => bg.environment)),
  ] as (Environment | "all")[];
  const colors = ["all", ...new Set(backgrounds.flatMap((bg) => bg.color))] as (
    | Color
    | "all"
  )[];

  // Get the current background URL from the selected space
  const currentBackgroundURL =
    spaces.find((space) => space.name === selectedTab)?.background ?? "";

  const handleBackgroundURLChange = (name: string) => {
    const selectedBackground = backgrounds.find((bg) => bg.name === name);
    if (selectedBackground) {
      updateSpaceProperty(selectedTab, "background", selectedBackground.url);
    }
  };

  const filteredBackgrounds = backgrounds.filter((bg) => {
    const matchesEnvironment =
      selectedEnvironment === "all" ||
      bg.environment.includes(selectedEnvironment as Environment);
    const matchesColor =
      selectedColor === "all" || bg.color.includes(selectedColor as Color);
    const matchesAI = excludeAI ? !bg.AIgenerated : true;
    return matchesEnvironment && matchesColor && matchesAI;
  });

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

  return (
    <main className="h-screen">
      <div className="absolute top-3 flex w-fit items-center text-secondary">
        <div className="grid h-full grid-cols-2 items-center justify-start">
          <div className="flex flex-col gap-2">
            <h1 className="font-delius text-3xl text-secondary-foreground/80">
              <span className="text-secondary">Background</span> settings
            </h1>
            <p className="text-sm text-muted-foreground">
              Choose and customize background images to create your ideal
              workspace atmosphere.
            </p>
          </div>

          <Image
            src="/illustrations/background.svg"
            alt="Background"
            width={290}
            height={220}
          />
        </div>
      </div>

      <div className="mt-28 flex w-[100%] flex-col gap-10">
        <div className="flex items-center justify-center gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-sm text-foreground">Environment</p>
            <Select
              onOpenChange={(isOpen) => {
                setSelectOpen(isOpen);
                if (!isOpen) {
                  // When select closes, update the timestamp
                  lastSelectCloseTime.current = Date.now();
                }
              }}
              data-sidebar-exclude
              value={selectedEnvironment}
              onValueChange={(value) =>
                setSelectedEnvironment(value as Environment | "all")
              }
            >
              <SelectTrigger className="w-[180px]">
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
                  // When select closes, update the timestamp
                  lastSelectCloseTime.current = Date.now();
                }
              }}
              value={selectedColor}
              onValueChange={(value) =>
                setSelectedColor(value as Color | "all")
              }
            >
              <SelectTrigger className="w-[180px]">
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

          <div className="mt-6 flex items-center gap-2 py-4">
            <Checkbox
              id="exclude-ai"
              checked={excludeAI}
              onCheckedChange={(checked) => setExcludeAI(checked as boolean)}
            />
            <label
              htmlFor="exclude-ai"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Exclude AI Generated
            </label>
          </div>
        </div>
        <div className="relative">
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-12 bg-gradient-to-t from-background to-transparent" />

          <RadioGroup
            value={
              backgrounds.find((bg) => bg.url === currentBackgroundURL)?.name ??
              ""
            }
            onValueChange={handleBackgroundURLChange}
            className="scrollbar-thin scrollbar-track-background scrollbar-thumb-accent mx-auto grid max-h-[55vh] w-full grid-cols-2 justify-between gap-4 overflow-y-auto pr-2"
          >
            {filteredBackgrounds.map((background) => {
              const isChecked = background.url === currentBackgroundURL;

              return (
                <label
                  key={background.name}
                  className={`relative flex max-w-fit cursor-pointer flex-col flex-wrap items-center justify-between gap-3 rounded-xl border p-3 text-center shadow-sm ring-offset-background transition-colors ${
                    isChecked
                      ? "border-secondary bg-secondary-smooth-700/10"
                      : "border-background hover:border-accent hover:bg-accent-foreground hover:text-foreground"
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
                </label>
              );
            })}
          </RadioGroup>
        </div>
      </div>
    </main>
  );
}
