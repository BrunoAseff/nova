import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import type { Position } from "@/content/widgets";
import { Breathing } from "@/features/breathing/Breathing";
import { Clock } from "@/features/clock/Clock";
import { Pomodoro } from "@/features/pomodoro/Pomodoro";
import { Quote } from "@/features/quote/Quote";
import { duration, ease } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useActiveSpace } from "@/stores/spaces";
import { compose, isHero, type Placed } from "./composition";

const ZONE_CLASS: Record<Position, string> = {
  "top-left": "[grid-area:tl] items-start justify-start",
  "top-right": "[grid-area:tr] items-end justify-start",
  "bottom-left": "[grid-area:bl] items-start justify-end",
  "bottom-right": "[grid-area:br] items-end justify-end",
  center: "[grid-area:c] items-center justify-center",
};

const ZONE_ALIGN: Record<Position, "start" | "end" | "center"> = {
  "top-left": "start",
  "bottom-left": "start",
  "top-right": "end",
  "bottom-right": "end",
  center: "center",
};

// Sem `filter` aqui: um ancestral com filter quebra o backdrop-filter do vidro dentro dele.
const appear = {
  initial: { opacity: 0, scale: 0.97 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.97 },
  transition: { duration: duration.calm, ease: ease.out },
} as const;

/**
 * Palco: cinco zonas e a faixa de baixo reservada ao dock. Trocar de espaço
 * esmaece um espaço e revela o outro; ligar ou desligar um widget faz o mesmo
 * só com ele.
 */
export function Stage() {
  const space = useActiveSpace();
  const composition = compose(space.widgets);

  const render = (item: Placed, zone: Position): ReactNode => {
    const hero = isHero(composition, item);
    switch (item) {
      case "clock":
        return <Clock format={space.widgets.clock.format} hero={hero} />;
      case "pomodoro":
        return <Pomodoro hero={hero} />;
      case "breathing":
        return <Breathing technique={space.widgets.breathing.technique} hero={hero} />;
      case "quote":
        return <Quote align={ZONE_ALIGN[zone]} />;
    }
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={space.id}
        className="stage absolute inset-0 grid px-[clamp(1.5rem,4vw,4rem)] pt-[clamp(1.5rem,5vh,4rem)] pb-[calc(clamp(1rem,3vh,2rem)+5.5rem)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: duration.base, ease: ease.out }}
      >
        {(Object.keys(ZONE_CLASS) as Position[]).map((zone) => (
          <div key={zone} className={cn("flex min-h-0 min-w-0 flex-col gap-8", ZONE_CLASS[zone])}>
            <AnimatePresence initial={false}>
              {composition[zone]?.map((item) => (
                <motion.div key={item} layout="position" {...appear}>
                  {render(item, zone)}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
