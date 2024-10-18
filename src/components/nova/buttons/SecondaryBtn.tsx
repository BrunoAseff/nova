import Link from "next/link";
import { Button } from "../../ui/button";
import type { ButtonHTMLAttributes } from "react";

interface SecondaryBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  hasLink?: boolean;
  href?: string;
}

export default function SecondaryBtn({
  hasLink = false,
  href,
  children,
  ...props
}: SecondaryBtnProps) {
  return (
    <Button
      asChild={hasLink}
      className={`text-md w-fit gap-2 rounded-3xl bg-background font-sans text-lg font-[400] text-foreground transition-colors hover:bg-muted`}
      variant="default"
      size="lg"
      {...props}
    >
      {hasLink && href ? <Link href={href}>{children}</Link> : children}
    </Button>
  );
}
