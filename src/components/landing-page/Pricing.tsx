import { CheckCircle } from "@phosphor-icons/react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import Link from "next/link";

export default function Pricing() {
  const novaItems = [
    "Pomodoro",
    "Background images",
    "Ambient sounds",
    "Up to 3 customizable spaces",
    "Up to 3 reminders",
    "Only available backgrounds",
    "Only light and dark themes",
  ];

  const supernovaItems = [
    "Everything in free",
    "10 customizable spaces",
    "Unlimited remiders",
    "Upload your own background images",
    "Access to all themes",
    "Curated playlists",
    "Add your custom playlists",
  ];

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <h1 className="mb-10 mt-0 text-4xl font-[500] text-foreground md:mt-10">
        Pricing
      </h1>

      <div className="grid w-[90vw] grid-cols-1 items-stretch justify-center gap-4 md:grid-cols-2">
        <div className="z-50 flex rounded-2xl border-[1px] border-foreground/10 bg-background">
          <div className="flex w-full flex-col items-center justify-between p-8 md:p-10">
            <div className="w-full">
              <Label className="flex w-full justify-between text-xl font-[600] md:text-2xl">
                <p className="text-foreground">Nova</p>
                <p>Free</p>
              </Label>
              <ul className="mt-6 flex w-full flex-col gap-6 text-muted-foreground">
                {novaItems.map((item, index) => (
                  <li className="flex items-center gap-3" key={index}>
                    <CheckCircle
                      weight="duotone"
                      size={18}
                      className="text-muted-foreground"
                    />
                    <p>{item}</p>
                  </li>
                ))}
              </ul>
            </div>
            <Button
              asChild
              className="mt-10 w-full gap-2 rounded-xl border-[1px] bg-foreground p-3 font-sans text-sm font-[600] text-background shadow-[0px_20px_207px_3px] shadow-transparent transition-all hover:bg-foreground hover:shadow-foreground/10"
            >
              <Link href="/spaces">Go to spaces</Link>
            </Button>
          </div>
        </div>

        <div className="z-40 flex rounded-2xl border-[1px] border-secondary/20 bg-background">
          <div className="flex w-full flex-col items-center justify-between p-8 md:p-10">
            <div className="w-full">
              <Label className="flex w-full justify-between bg-none text-xl font-[600] md:text-2xl">
                <p className="bg-gradient-to-tl from-secondary via-secondary-smooth-500 to-secondary bg-clip-text text-transparent">
                  Supernova
                </p>
                <p>$3 / month</p>
              </Label>
              <ul className="mt-6 flex w-full flex-col gap-6 text-muted-foreground">
                {supernovaItems.map((item, index) => (
                  <li className="flex items-center gap-3" key={index}>
                    <CheckCircle
                      weight="duotone"
                      size={18}
                      className="text-muted-foreground"
                    />
                    <p>{item}</p>
                  </li>
                ))}
              </ul>
            </div>
            <Button className="mt-10 w-full gap-2 rounded-xl border-[1px] bg-gradient-to-r from-secondary via-secondary-smooth-400 to-secondary-smooth-500 p-3 font-sans text-sm font-[600] text-background shadow-[0px_20px_207px_10px] shadow-secondary/60 transition-all hover:bg-secondary-smooth-700/10 hover:shadow-secondary/80">
              Upgrade now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
