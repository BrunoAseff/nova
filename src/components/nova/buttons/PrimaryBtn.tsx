import Link from "next/link";
import { Button } from "../../ui/button";

interface PrimaryBtnProps {
  hasLink?: boolean;
  href?: string;
  children: React.ReactNode;
}

export default function PrimaryBtn({
  hasLink = false,
  href,
  children,
}: PrimaryBtnProps) {
  return (
    <Button
      asChild={hasLink}
      className={`text-md w-fit gap-2 rounded-3xl font-sans text-lg font-[400] text-black transition-colors hover:bg-primary-foreground`}
      variant="default"
      size="lg"
    >
      {hasLink && href ? <Link href={href}>{children}</Link> : children}
    </Button>
  );
}
