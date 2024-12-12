import React from "react";

interface TabHeaderProps {
  title: string;
  subtitle: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>; // Accepts a TSX component for an SVG
}

export function TabHeader({ title, subtitle, Icon }: TabHeaderProps) {
  return (
    <div className="absolute top-3 flex w-fit items-center text-secondary">
      <div className="grid h-full grid-cols-2 items-center justify-start gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="font-delius text-3xl text-secondary-foreground/80">
            <span className="text-secondary">{title}</span> settings
          </h1>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <div className="flex items-center justify-center">
          <Icon className="h-52 w-52 fill-secondary text-secondary opacity-80" />
        </div>
      </div>
    </div>
  );
}
