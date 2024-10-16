import Link from "next/link";
import { Button } from "../../ui/button";
import { inter } from "../inter";

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
      className={`rounded-3xl text-lg transition-colors ${inter.className} text-md w-fit text-black hover:bg-primary-foreground`}
      variant="default"
      size="lg"
    >
      {hasLink && href ? <Link href={href}>{children}</Link> : children}
    </Button>
  );
}
