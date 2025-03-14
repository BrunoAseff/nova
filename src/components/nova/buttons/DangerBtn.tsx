import Link from "next/link";
import { Button } from "../../ui/button";
import type { ButtonHTMLAttributes } from "react";

interface PrimaryBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  hasLink?: boolean;
  href?: string;
}

export default function DangerBtn({
  hasLink = false,
  href,
  children,
  ...props
}: PrimaryBtnProps) {
  return (
    <Button
      asChild={hasLink}
      className={`w-fit gap-2 rounded-3xl border-[1px] bg-foreground p-5 font-sans text-sm font-[500] text-background transition-colors hover:bg-destructive hover:text-foreground`}
      variant="destructive"
      size="sm"
      {...props}
    >
      {hasLink && href ? <Link href={href}>{children}</Link> : children}
    </Button>
  );
}
