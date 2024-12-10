import type { ReactNode } from "react";
import clsx from "clsx";

type TabCardProps = {
  children: ReactNode;
  className?: string;
  variant?: "default" | "danger";
};

const TabCard = ({
  children,
  className,
  variant = "default",
}: TabCardProps) => {
  return (
    <div
      className={clsx(
        "flex min-h-16 w-[95%] items-center justify-between rounded-2xl border-[1px] p-4",
        variant === "danger"
          ? "border-destructive bg-destructive/10"
          : "border-accent/20 bg-accent-foreground",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default TabCard;
