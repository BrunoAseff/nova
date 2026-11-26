import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ease } from "@/lib/motion";

/**
 * Números que trocam com calma: o dígito novo sobe e assenta enquanto o antigo
 * sai por cima, esmaecendo. Só os dígitos que mudaram se mexem, e a largura
 * nunca muda (números tabulares, cada posição numa célula própria).
 */
export function Digits({ value, className }: { value: string; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <span className={className} role="timer" aria-label={value}>
      {value.split("").map((char, index) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: cada posição é uma célula fixa
          key={index}
          className="inline-grid overflow-hidden"
          aria-hidden="true"
          style={char === ":" ? { width: "0.32em", justifyItems: "center" } : undefined}
        >
          <AnimatePresence initial={false}>
            <motion.span
              key={char}
              className="[grid-area:1/1]"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: "0.32em", filter: "blur(6px)" }}
              animate={{ opacity: 1, y: "0em", filter: "blur(0px)" }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: "-0.32em", filter: "blur(6px)" }}
              transition={{ duration: 0.5, ease: ease.out }}
            >
              {char}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
    </span>
  );
}
