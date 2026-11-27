import { useRef } from "react";
import { quoteOfTheDay } from "@/content/quotes";
import { useSceneTone } from "@/lib/sceneTone";
import { cn } from "@/lib/utils";
import { sized } from "@/lib/widgetSize";

const TEXT = {
  // `--fit` só existe no celular: lá a citação nunca passa da largura da coluna.
  maxWidth: `min(var(--fit, 100vw), ${sized("22rem", "26rem", "34rem")})`,
  fontSize: sized("1.125rem", "1.375rem", "1.875rem"),
};

/** L1 · Ambiente. Tamanho de leitura (lido quando se olha), não de display. */
export function Quote({ align }: { align: "start" | "end" | "center" }) {
  const quote = quoteOfTheDay();
  const ref = useRef<HTMLElement>(null);
  useSceneTone(ref);
  return (
    <figure
      ref={ref}
      style={TEXT}
      className={cn(
        "on-scene fade",
        align === "end" && "text-right",
        align === "center" && "text-center",
      )}
    >
      <blockquote className="leading-snug font-normal tracking-[-0.01em] text-balance">
        “{quote.text}”
      </blockquote>
      <figcaption className="mt-3 text-[0.9375rem] font-medium text-scene-ink-soft">
        {quote.author}
      </figcaption>
    </figure>
  );
}
