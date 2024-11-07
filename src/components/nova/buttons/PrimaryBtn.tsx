import Link from "next/link";
import { Button } from "../../ui/button";
import type { ButtonHTMLAttributes } from "react";

interface PrimaryBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  hasLink?: boolean;
  href?: string;
}

export default function PrimaryBtn({
  hasLink = false,
  href,
  children,
  ...props
}: PrimaryBtnProps) {
  return (
    <Button
      asChild={hasLink}
      className={`text-md inline-flex w-fit items-center justify-center gap-3 whitespace-nowrap rounded-3xl border-[1px] border-white/40 bg-background px-8 py-6 font-sans font-medium text-neutral-400 ring-offset-background transition-all duration-200 hover:border-secondary hover:bg-blue-700/10 hover:text-secondary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50`}
      variant="default"
      size="lg"
      {...props}
    >
      {hasLink && href ? <Link href={href}>{children}</Link> : children}
    </Button>
  );
}
