import AppearanceIllustration from "@/components/svgs/AppearanceIllustration";
import { TabHeader } from "@/components/tabHeader";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTheme } from "next-themes";
import { Check, Minus } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import NovaTheme from "@/components/svgs/NovaTheme";
import NebulaTheme from "@/components/svgs/NebulaTheme";
import QuasarTheme from "@/components/svgs/QuasarTheme";
import IgnitionTheme from "@/components/svgs/IgnitionTheme";

export default function AppearanceTab() {
  const { theme, setTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(theme ?? "system");
  const [selectedCustomTheme, setSelectedCustomTheme] = useState("nova");

  useEffect(() => {
    if (theme?.includes("_")) {
      const baseTheme = getBaseTheme(theme);
      const customTheme = getCustomTheme(theme);
      setSelectedTheme(baseTheme);
      setSelectedCustomTheme(customTheme);
    } else {
      theme ? setSelectedTheme(theme) : null;
      setSelectedCustomTheme("nova"); // Default to "nova" if no custom theme is set
    }
  }, [theme]);

  const getBaseTheme = (theme: string): string => {
    if (theme.includes("_light")) return "light";
    if (theme.includes("_dark")) return "dark";
    return theme;
  };

  const getCustomTheme = (theme: string): string => {
    const parts = theme.split("_");
    return parts[0] ?? "nova"; // Extract the custom theme before the underscore
  };

  const systemItems = [
    {
      id: "radio-18-r1",
      value: "light",
      label: "Light",
      image: "/ui-light.webp",
    },
    {
      id: "radio-18-r2",
      value: "dark",
      label: "Dark",
      image: "/ui-dark.webp",
    },
  ];

  const themeItems = [
    {
      id: "nova",
      label: "Nova",
      icon: <NovaTheme />,
    },
    {
      id: "nebula",
      label: "Nebula",
      icon: <NebulaTheme />,
    },
    {
      id: "ignition",
      label: "Ignition",
      icon: <IgnitionTheme />,
    },
    {
      id: "quasar",
      label: "Quasar",
      icon: <QuasarTheme />,
    },
    {
      id: "supernova",
      label: "Supernova",
      icon: <NovaTheme />,
    },
    {
      id: "singularity",
      label: "Singularity",
      icon: <NovaTheme />,
    },
  ];

  const handleThemeChange = (value: string) => {
    setSelectedTheme(value);

    if (selectedCustomTheme === "nova") {
      setTheme(value);
    } else {
      const newTheme = `${selectedCustomTheme}_${value}`;
      setTheme(newTheme);
    }
  };

  const handleCustomThemeChange = (value: string) => {
    setSelectedCustomTheme(value);

    if (value === "nova") {
      setTheme(selectedTheme);
    } else {
      const baseTheme = selectedTheme === "system" ? "light" : selectedTheme;
      const newTheme = `${value}_${baseTheme}`;
      setTheme(newTheme);
    }
  };

  return (
    <main className="h-screen">
      <TabHeader
        title="Appearance"
        subtitle="Personalize the visual theme to match your aesthetic preferences."
        Icon={AppearanceIllustration}
      />
      <div className="mt-28 flex h-full flex-col gap-10">
        {/* System Theme Selection */}
        <fieldset className="space-y-4">
          <legend className="text-md font-medium leading-none text-foreground">
            Choose a theme
          </legend>
          <RadioGroup
            className="flex gap-3"
            value={selectedTheme}
            onValueChange={handleThemeChange}
          >
            {systemItems.map((item) => (
              <label key={item.id} htmlFor={item.id}>
                <RadioGroupItem
                  id={item.id}
                  value={item.value}
                  className="peer sr-only after:absolute after:inset-0"
                />
                <Image
                  src={item.image}
                  alt={item.label}
                  width={100}
                  height={70}
                  className="relative cursor-pointer overflow-hidden rounded-lg border-2 border-input shadow-sm shadow-black/5 outline-offset-2 transition-colors peer-[:focus-visible]:outline peer-[:focus-visible]:outline-2 peer-[:focus-visible]:outline-ring/70 peer-data-[disabled]:cursor-not-allowed peer-data-[state=checked]:border-secondary peer-data-[state=checked]:bg-accent peer-data-[disabled]:opacity-50"
                />
                <span className="group mt-2 flex items-center gap-1 text-secondary peer-data-[state=unchecked]:text-muted-foreground/70">
                  <Check
                    size={16}
                    strokeWidth={2}
                    className="peer-data-[state=unchecked]:group-[]:hidden"
                    aria-hidden="true"
                  />
                  <Minus
                    size={16}
                    strokeWidth={2}
                    className="peer-data-[state=checked]:group-[]:hidden"
                    aria-hidden="true"
                  />
                  <span className="text-xs font-medium">{item.label}</span>
                </span>
              </label>
            ))}
          </RadioGroup>
        </fieldset>

        {/* Custom Theme Selection */}
        <fieldset className="space-y-4">
          <legend className="text-md font-medium leading-none text-foreground">
            Choose a custom theme
          </legend>
          <RadioGroup
            className="grid w-full grid-cols-3 gap-10"
            value={selectedCustomTheme}
            onValueChange={handleCustomThemeChange}
          >
            {themeItems.map((item) => (
              <label key={item.id} htmlFor={item.id}>
                <RadioGroupItem
                  id={item.id}
                  value={item.id}
                  className="peer sr-only after:absolute after:inset-0"
                />
                <div className="relative cursor-pointer overflow-hidden rounded-2xl border-2 border-input fill-foreground px-3 py-1 outline-offset-1 transition-colors peer-[:focus-visible]:outline peer-[:focus-visible]:outline-2 peer-[:focus-visible]:outline-ring/70 peer-data-[disabled]:cursor-not-allowed peer-data-[state=checked]:border-secondary peer-data-[state=checked]:bg-secondary-smooth-700/10 peer-data-[state=checked]:fill-secondary peer-data-[disabled]:opacity-50">
                  {item.icon}
                </div>
                <span className="group mt-2 flex items-center gap-1 text-secondary peer-data-[state=unchecked]:text-muted-foreground/70">
                  <Check
                    size={16}
                    strokeWidth={2}
                    className="peer-data-[state=unchecked]:group-[]:hidden"
                    aria-hidden="true"
                  />
                  <Minus
                    size={16}
                    strokeWidth={2}
                    className="peer-data-[state=checked]:group-[]:hidden"
                    aria-hidden="true"
                  />
                  <span className="text-xs font-medium">{item.label}</span>
                </span>
              </label>
            ))}
          </RadioGroup>
        </fieldset>
      </div>
    </main>
  );
}
