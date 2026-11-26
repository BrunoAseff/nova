import { useNow } from "@/lib/useNow";
import { cn } from "@/lib/utils";

/** L1 · Ambiente. Texto direto na cena; o herói é lido do outro lado da mesa. */
export function Clock({ format, hero }: { format: "12h" | "24h"; hero: boolean }) {
  const now = useNow();
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
      className={cn(
        "on-scene flex flex-col",
        hero ? "items-center text-center" : "items-end text-right",
      )}
    >
      <time
        dateTime={now.toISOString()}
        className={cn("glance", hero ? "text-[clamp(7rem,15vw,15rem)]" : "text-[3.5rem]")}
      >
        {time}
      </time>
      <p
        className={cn(
          "font-medium text-scene-ink-soft",
          hero ? "mt-5 text-lg" : "mt-2 text-[0.9375rem]",
        )}
      >
        {date}
      </p>
    </div>
  );
}
