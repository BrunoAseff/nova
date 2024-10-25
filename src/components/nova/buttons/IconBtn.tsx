import Link from "next/link";
import { Button } from "../../ui/button";
import type { ButtonHTMLAttributes } from "react";

interface PrimaryBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  hasLink?: boolean;
  href?: string;
  variant?: "default" | "destructive" | "secondary" | "fill";
}

export default function IconBtn({
  hasLink = false,
  href,
  children,
  variant = "default",
  ...props
}: PrimaryBtnProps) {
  const variantClasses = {
    default: "bg-background text-foreground hover:bg-muted",
    secondary: "bg-foreground text-background hover:bg-foreground-muted",
    destructive: "bg-background text-destructive hover:bg-destructive",
    fill: "bg-primary-foreground text-secondary-foreground hover:bg-foreground-muted",
  };

  return (
    <Button
      asChild={hasLink}
      className={`text-md gap-2 rounded-full font-sans text-lg font-[400] transition-colors ${variantClasses[variant]}`}
      variant="default"
      size="icon"
      {...props}
    >
      {hasLink && href ? <Link href={href}>{children}</Link> : children}
    </Button>
  );
}
