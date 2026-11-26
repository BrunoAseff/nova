import { quoteOfTheDay } from "@/content/quotes";
import { cn } from "@/lib/utils";

/** L1 · Ambiente. Tamanho de leitura (lido quando se olha), não de display. */
export function Quote({ align }: { align: "start" | "end" | "center" }) {
  const quote = quoteOfTheDay();
  return (
    <figure
      className={cn(
        "on-scene max-w-[26rem]",
        align === "end" && "text-right",
        align === "center" && "text-center",
      )}
    >
      <blockquote className="text-[1.375rem] leading-snug font-normal tracking-[-0.01em] text-balance">
        “{quote.text}”
      </blockquote>
      <figcaption className="mt-3 text-[0.9375rem] font-medium text-scene-ink-soft">
        {quote.author}
      </figcaption>
    </figure>
  );
}
