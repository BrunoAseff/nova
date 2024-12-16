import AppearanceIllustration from "@/components/svgs/AppearanceIllustration";
import { TabHeader } from "@/components/tabHeader";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTheme } from "next-themes";
import { Check, Minus } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function AppearanceTab() {
  const { theme, setTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(theme ?? "system");

  useEffect(() => {
    // Synchronize the selected theme state with the actual theme
    setSelectedTheme(theme ?? "system");
  }, [theme]);

  const items = [
    {
      id: "radio-18-r1",
      value: "light",
      label: "Light",
      image: "/ui-light.webp",
    },
    { id: "radio-18-r2", value: "dark", label: "Dark", image: "/ui-dark.webp" },
    {
      id: "radio-18-r3",
      value: "system",
      label: "System",
      image: "/ui-system.webp",
    },
  ];

  const handleThemeChange = (value: string) => {
    setTheme(value);
    setSelectedTheme(value);
  };

  return (
    <main className="h-screen">
      <TabHeader
        title="Appearance"
        subtitle="Personalize the visual theme to match your aesthetic preferences."
        Icon={AppearanceIllustration}
      />
      <div className="mt-28 flex h-full flex-col gap-10">
        <fieldset className="space-y-4">
          <legend className="text-sm font-medium leading-none text-foreground">
            Choose a theme
          </legend>
          <RadioGroup
            className="flex gap-3"
            value={selectedTheme}
            onValueChange={handleThemeChange}
          >
            {items.map((item) => (
              <label key={item.id} htmlFor={item.id}>
                <RadioGroupItem
                  id={item.id}
                  value={item.value}
                  className="peer sr-only after:absolute after:inset-0"
                />
                <Image
                  src={item.image}
                  alt={item.label}
                  width={88}
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
      </div>
    </main>
  );
}
