import Link from "next/link";
import { Button } from "../../ui/button";
import type { ButtonHTMLAttributes } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PrimaryBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  hasLink?: boolean;
  href?: string;
  variant?: "default" | "destructive" | "secondary" | "fill";
  tooltipContent?: string;
}

export default function IconBtn({
  hasLink = false,
  href,
  children,
  variant = "default",
  tooltipContent,
  ...props
}: PrimaryBtnProps) {
  const variantClasses = {
    default:
      "bg-background border-[1px] border-background hover:border-secondary text-foreground hover:text-secondary hover:bg-blue-700/10",
    secondary: "bg-foreground text-background hover:bg-foreground-muted",
    destructive:
      "bg-background border-[1px] border-background text-destructive hover:border-destructive hover:bg-red-700/20",
    fill: "bg-primary-foreground text-secondary-foreground hover:bg-foreground-muted",
  };

  const buttonElement = (
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

  // If there's no link but a tooltip is provided, wrap the button in a tooltip
  if (!hasLink && tooltipContent) {
    return (
      <TooltipProvider >
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            {buttonElement}
          </TooltipTrigger>
          <TooltipContent className="bg-muted" >
            {tooltipContent}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Otherwise, return the button as is
  return buttonElement;
}