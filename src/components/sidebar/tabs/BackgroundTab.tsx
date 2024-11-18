import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSpacesContext } from "@/contexts/spaceContext";
import { backgrounds } from "backgrounds";
import Image from "next/image";
import { useEffect, useState } from "react";
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

type Environment =
  | "Nature"
  | "Urban"
  | "Home"
  | "Interior"
  | "Exterior"
  | "Space"
  | "Underwater"
  | "Fantasy"
  | "Abstract";

type Color = "Green" | "Yellow" | "Orange" | "Red" | "Pink" | "Purple" | "Blue";

export default function BackgroundTab() {
  const [backgroundURL, setBackgroundURL] = useState(
    "https://utfs.io/f/C3k2e5UQDa979nPTYgc69pKfgXcSlCYx1ADa82uERWQ3BFUM",
  );
  const [selectedEnvironment, setSelectedEnvironment] = useState<
    Environment | "all"
  >("all");
  const [selectedColor, setSelectedColor] = useState<Color | "all">("all");
  const [excludeAI, setExcludeAI] = useState(false);
  const { spaces, selectedTab, updateSpaceProperty } = useSpacesContext();

  // Get unique environments and colors from backgrounds
  const environments = [
    "all",
    ...new Set(backgrounds.flatMap((bg) => bg.environment)),
  ] as (Environment | "all")[];
  const colors = ["all", ...new Set(backgrounds.flatMap((bg) => bg.color))] as (
    | Color
    | "all"
  )[];

  useEffect(() => {
    const selectedSpace = spaces.find((space) => space.name === selectedTab);
    if (selectedSpace) {
      setBackgroundURL(selectedSpace.background.url);
    }
  }, [spaces, selectedTab]);

  const handleBackgroundURLChange = (name: string) => {
    const selectedBackground = backgrounds.find((bg) => bg.name === name);
    if (selectedBackground) {
      const newURL = selectedBackground.url;
      setBackgroundURL(newURL);
      updateSpaceProperty(selectedTab, "background", {
        url: newURL,
      });
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

  return (
    <main className="flex w-[100%] flex-col gap-10">
      <div className="flex items-center justify-center gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-foreground">Environment</p>
          <Select
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
            value={selectedColor}
            onValueChange={(value) => setSelectedColor(value as Color | "all")}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Color" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Color</SelectLabel>
                {colors.map((color) => (
                  <SelectItem key={color} value={color}>
                    {color.charAt(0).toUpperCase() + color.slice(1)}
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

      <Label className="text-md text-foreground">Background </Label>
      <RadioGroup
        value={backgrounds.find((bg) => bg.url === backgroundURL)?.name ?? ""}
        onValueChange={handleBackgroundURLChange}
        className="mx-auto grid w-full grid-cols-2 justify-between gap-4"
      >
        {filteredBackgrounds.map((background) => {
          const isChecked = background.url === backgroundURL;

          return (
            <label
              key={background.name}
              className={`relative flex max-w-fit cursor-pointer flex-col flex-wrap items-center justify-between gap-3 rounded-xl border p-3 text-center shadow-sm ring-offset-background transition-colors ${
                isChecked
                  ? "bg-secondary-smooth-700/10 border-secondary"
                  : "border-background hover:border-accent hover:bg-accent-foreground hover:text-foreground"
              } ${isChecked ? "text-secondary" : "text-foreground"} focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2`}
            >
              <RadioGroupItem
                value={background.name}
                className="sr-only items-center justify-center"
              />
              <Image
                src={background.url}
                alt={background.name}
                width={200}
                height={200}
                className="rounded-xl"
              />
              <p
                className={`text-sm font-medium leading-none ${isChecked ? "text-secondary" : "text-foreground"}`}
              >
                {background.name}
              </p>
            </label>
          );
        })}
      </RadioGroup>
    </main>
  );
}
