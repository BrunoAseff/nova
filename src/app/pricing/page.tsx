"use client";
import { Button } from "@/components/ui/button";
import DotPattern from "@/components/ui/dot-pattern";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CheckCircle } from "@phosphor-icons/react";
import { novaItems, supernovaItems } from "@/content/PricingItems";
import Link from "next/link";

export default function Pricing() {
  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-hidden overflow-y-auto rounded-lg bg-background p-20">
      <h1 className="my-10 text-4xl font-[600] text-foreground">Pricing</h1>

      <div className="grid w-[65vw] grid-cols-1 items-stretch justify-center gap-4 md:grid-cols-2">
        <div className="z-50 flex rounded-2xl border-[1px] border-foreground/10 bg-background">
          <div className="flex w-full flex-col items-center justify-between p-10">
            <div className="w-full">
              <Label className="flex w-full justify-between text-2xl font-[600]">
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

        <div className="relative z-40 flex rounded-2xl border-[1px] border-secondary/20 bg-background">
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
            <p className="text-base text-foreground">Coming soon...</p>
          </div>
          <div className="flex w-full flex-col items-center justify-between p-10">
            <div className="w-full">
              <Label className="flex w-full justify-between bg-none text-2xl font-[600]">
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

      <DotPattern
        width={50}
        height={50}
        cx={1}
        cy={1}
        cr={1}
        className={cn(
          "[mask-image:radial-gradient(1300px_circle_at_center,white,transparent)]",
        )}
      />
    </main>
  );
}
