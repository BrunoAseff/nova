"use client";
import Link from "next/link";
import Logo from "../nova/Logo";
import { Button } from "../ui/button";
import { LinkBtn } from "../nova/buttons/LinkBtn";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { List } from "@phosphor-icons/react";

export default function Nav() {
  return (
    <>
      <nav className="hidden w-full items-center justify-evenly py-6 md:flex">
        <div className="scale-75">
          <Logo />
        </div>
        <ul className="flex gap-10 text-base text-foreground">
          <li>
            <LinkBtn className="cursor-pointer text-foreground hover:text-secondary">
              <Link href="#features">Features</Link>
            </LinkBtn>
          </li>
          <li>
            <LinkBtn className="cursor-pointer text-foreground hover:text-secondary">
              <Link href="#pricing">Pricing</Link>
            </LinkBtn>
          </li>
          <li>
            <LinkBtn className="cursor-pointer text-foreground hover:text-secondary">
              <Link href="#footer">Contact</Link>
            </LinkBtn>
          </li>
        </ul>
        <div className="flex items-center gap-2">
          <Button className="font-semibold" asChild>
            <Link href="/spaces">Go to Nova</Link>
          </Button>
        </div>
      </nav>
      <MobileNav />
    </>
  );
}

function MobileNav() {
  return (
    <nav className="fixed z-[98] flex w-full items-center justify-between border-b-[1px] border-secondary/10 bg-secondary/10 px-2 py-1 backdrop-blur-lg md:hidden">
      <div className="w-full origin-left scale-50">
        <Logo />
      </div>
      <div className="flex items-center gap-3">
        <Button className="block bg-secondary font-semibold md:hidden">
          <Link href="/spaces">Try for free</Link>
        </Button>
        <Sheet>
          <SheetTrigger>
            <List className="text-foreground" size={32} />
          </SheetTrigger>
          <SheetContent className="z-[99] flex flex-col gap-10">
            <SheetTitle className="text-transparent">
              <div className="w-full origin-left scale-50">
                <Logo />
              </div>
            </SheetTitle>
            <ul className="mt-6 flex flex-col gap-6 text-base text-foreground">
              <li>
                <LinkBtn className="cursor-pointer text-foreground">
                  <SheetClose asChild>
                    <Link href="#features">Features</Link>
                  </SheetClose>
                </LinkBtn>
              </li>
              <li>
                <LinkBtn className="cursor-pointer text-foreground">
                  <SheetClose asChild>
                    <Link href="#pricing">Pricing</Link>
                  </SheetClose>
                </LinkBtn>
              </li>
              <li>
                <LinkBtn className="cursor-pointer text-foreground">
                  <SheetClose asChild>
                    <Link href="#footer">Contact</Link>
                  </SheetClose>
                </LinkBtn>
              </li>
            </ul>
            <div className="flex items-center gap-2">
              <Button className="bg-secondary font-semibold" asChild>
                <SheetClose asChild>
                  <Link href="/spaces">Go to Nova</Link>
                </SheetClose>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
