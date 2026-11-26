import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { type BreathStep, breathingTechniques } from "@/content/breathing";
import { duration, ease } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Space } from "@/stores/spaces";

const KIND_LABEL: Record<BreathStep["kind"], string> = {
  in: "Breathe in",
  hold: "Hold",
  out: "Breathe out",
};

/**
 * L2 · Instrumento. A única coisa que se move o tempo todo, porque o movimento é o
 * conteúdo (P5): o orbe cresce ao inspirar, para ao segurar e encolhe ao expirar,
 * na duração exata de cada etapa.
 */
export function Breathing({
  technique,
  hero,
}: {
  technique: Space["widgets"]["breathing"]["technique"];
  hero: boolean;
}) {
  const current = breathingTechniques.find((t) => t.id === technique) ?? breathingTechniques[0];
  const steps: readonly BreathStep[] = current.steps;
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [left, setLeft] = useState(steps[0]?.seconds ?? 4);
  const step = steps[index] ?? steps[0];

  // biome-ignore lint/correctness/useExhaustiveDependencies: reinicia ao trocar de técnica
  useEffect(() => {
    setIndex(0);
    setLeft(steps[0]?.seconds ?? 4);
  }, [technique]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (left > 1) return setLeft(left - 1);
      const next = (index + 1) % steps.length;
      setIndex(next);
      setLeft(steps[next]?.seconds ?? 4);
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [left, index, steps]);

  if (!step) return null;
  const previous = steps[(index - 1 + steps.length) % steps.length];
  const expanded = step.kind === "in" || (step.kind === "hold" && previous?.kind === "in");

  return (
    <section aria-label="Breathing exercise" className="flex flex-col items-center gap-7">
      <div
        className={cn(
          "relative grid place-items-center",
          hero ? "size-[min(24rem,42vh)]" : "size-56",
        )}
      >
        <motion.div
          aria-hidden="true"
          className="breath-orb absolute inset-0 rounded-full"
          initial={false}
          animate={{ scale: reduced ? 1 : expanded ? 1 : 0.58 }}
          transition={{
            duration: step.kind === "hold" ? 0.4 : step.seconds,
            ease: [0.37, 0, 0.63, 1],
          }}
        />
        <div className="relative flex flex-col items-center gap-1 text-ink">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={`${index}-${step.kind}`}
              initial={{ opacity: 0, filter: "blur(6px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(6px)" }}
              transition={{ duration: duration.calm, ease: ease.out }}
              className="text-lg font-medium"
              aria-live="polite"
            >
              {step.label ?? KIND_LABEL[step.kind]}
            </motion.span>
          </AnimatePresence>
          <span className="glance text-base text-ink-2 tabular-nums" aria-hidden="true">
            {left}
          </span>
        </div>
      </div>
      <p className="on-scene text-[0.9375rem] font-medium">{current.name}</p>
    </section>
  );
}
