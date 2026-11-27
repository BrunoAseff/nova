import { useRef } from "react";
import { useSceneTone } from "@/lib/sceneTone";
import { useNow } from "@/lib/useNow";
import { cn } from "@/lib/utils";
import { sized } from "@/lib/widgetSize";

/** L1 · Ambiente. Texto direto na cena; o grande é lido do outro lado da mesa. */
const TIME = { fontSize: sized("3.5rem", "clamp(4.5rem,8vw,7.5rem)", "clamp(7rem,15vw,15rem)") };
const DATE = {
  fontSize: sized("0.9375rem", "1rem", "1.125rem"),
  marginTop: sized("0.5rem", "0.75rem", "1.25rem"),
  lineHeight: 1.5,
};

export function Clock({
  format,
  align,
}: {
  format: "12h" | "24h";
  align: "start" | "center" | "end";
}) {
  const now = useNow();
  const ref = useRef<HTMLDivElement>(null);
  useSceneTone(ref);
  const time = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: format === "12h",
  })
    .format(now)
    .replace(/\s?[AP]M$/i, "");
  const date = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(now);

  return (
    <div
      ref={ref}
      className={cn(
        "on-scene fade flex flex-col",
        align === "center" && "items-center text-center",
        align === "end" && "items-end text-right",
        align === "start" && "items-start text-left",
      )}
    >
      <time dateTime={now.toISOString()} className="glance" style={TIME}>
        {time}
      </time>
      <p className="font-medium text-scene-ink-soft" style={DATE}>
        {date}
      </p>
    </div>
  );
}
