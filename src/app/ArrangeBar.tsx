import { LayoutGrid } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { calm, duration, ease } from "@/lib/motion";
import { useAttentionStore } from "@/stores/attention";
import { useActiveSpace, useSpacesStore } from "@/stores/spaces";

/**
 * A barra do modo de arranjar, no lugar do dock (que some enquanto se arranja): a faixa
 * de baixo é reservada, então a barra nunca cobre um widget. Diz o que dá para fazer,
 * restaura o layout inicial do espaço e sai (também com Esc ou E).
 */
export function ArrangeBar() {
  const arranging = useAttentionStore((s) => s.arranging);
  const setArranging = useAttentionStore((s) => s.setArranging);
  const space = useActiveSpace();
  const resetLayout = useSpacesStore((s) => s.resetLayout);

  return (
    <AnimatePresence>
      {arranging && (
        // A opacidade fica no próprio vidro (num ancestral ela apagaria o desfoque).
        <motion.div
          data-keep-awake
          role="toolbar"
          aria-label="Arrange this space"
          className="glass glass-strong absolute inset-x-0 bottom-[clamp(1rem,3vh,2rem)] z-20 mx-auto flex w-fit items-center gap-3.5 rounded-full py-2 pr-2 pl-2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16, transition: { duration: duration.base, ease: ease.out } }}
          transition={calm}
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
            <LayoutGrid className="size-[1.05rem]" aria-hidden="true" />
          </span>
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="text-[0.9375rem] leading-tight font-medium text-ink">
              Arranging {space.name}
            </span>
            <span className="text-[0.8125rem] leading-tight text-ink-2">
              Drag to move · <Kbd>←</Kbd> <Kbd>→</Kbd> nudge · <Kbd>Esc</Kbd> to finish
            </span>
          </div>
          <span className="mx-1 h-8 w-px bg-[var(--hairline)]" aria-hidden="true" />
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" onClick={() => resetLayout(space.id)}>
              Reset
            </Button>
            <Button variant="primary" onClick={() => setArranging(false)}>
              Done
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Uma tecla, para o texto de ajuda: lê como tecla sem pesar mais que o texto. */
function Kbd({ children }: { children: string }) {
  return (
    <kbd className="inline-grid h-[1.15rem] min-w-[1.15rem] place-items-center rounded-[0.3rem] px-1 font-sans text-[0.6875rem] font-medium text-ink-2 shadow-[inset_0_0_0_1px_var(--hairline),0_1px_0_var(--hairline)]">
      {children}
    </kbd>
  );
}
