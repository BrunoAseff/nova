import Link from "next/link";
import { Button } from "../../ui/button";
import type { ButtonHTMLAttributes } from "react";

interface PrimaryBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  hasLink?: boolean;
  href?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
}

export default function IconBtn({
  hasLink = false,
  href,
  children,
  variant = "default",
  ...props
}: PrimaryBtnProps) {
  const defaultHoverClass =
    variant === "default"
      ? "hover:bg-primary-foreground"
      : "hover:brightness-110";

  return (
    <Button
      asChild={hasLink}
      className={`text-md gap-2 rounded-full font-sans text-lg font-[400] transition-colors ${defaultHoverClass}`}
      variant={variant}
      size="icon"
      {...props}
    >
      {hasLink && href ? <Link href={href}>{children}</Link> : children}
    </Button>
  );
}
