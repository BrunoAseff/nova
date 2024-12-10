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
      className={`w-fit gap-2 rounded-xl border-[1px] p-5 font-open text-sm font-[600] text-background transition-colors hover:bg-foreground`}
      variant="destructive"
      size="sm"
      {...props}
    >
      {hasLink && href ? <Link href={href}>{children}</Link> : children}
    </Button>
  );
}
