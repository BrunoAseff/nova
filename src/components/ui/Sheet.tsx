import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useDragControls } from "motion/react";
import type { ReactNode } from "react";
import { calm, duration, ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * L4 no celular: o painel sobe de baixo (fundamentos de design, camadas). Ocupa a largura
 * toda e no máximo ~88% da altura, escurece a cena atrás e fecha arrastando para baixo
 * pela alça (ou pelo cabeçalho), tocando fora ou com Esc.
 *
 * O arrasto começa só na alça e no cabeçalho: o conteúdo rola normalmente.
 */
export function Sheet({
  open,
  onOpenChange,
  title,
  header,
  children,
  className,
  onCloseAutoFocus,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Nome para leitores de tela (e título visível, se não houver `header`). */
  title: string;
  /** Cabeçalho próprio, no lugar do título simples (deve ter o seu `Dialog.Title`). Também arrasta. */
  header?: ReactNode;
  children: ReactNode;
  className?: string;
  onCloseAutoFocus?: (event: Event) => void;
}) {
  const drag = useDragControls();

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-30 bg-[oklch(12%_0.02_280/0.32)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: duration.base }}
              />
            </Dialog.Overlay>
            <Dialog.Content
              asChild
              forceMount
              aria-describedby={undefined}
              onCloseAutoFocus={onCloseAutoFocus}
            >
              <motion.div
                data-keep-awake
                tabIndex={-1}
                className={cn(
                  "glass glass-strong fixed inset-x-0 bottom-0 z-40 flex max-h-[88dvh] flex-col rounded-t-[1.75rem] pb-[env(safe-area-inset-bottom)] outline-none",
                  className,
                )}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%", transition: { duration: duration.base, ease: ease.out } }}
                transition={calm}
                drag="y"
                dragControls={drag}
                dragListener={false}
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={{ top: 0, bottom: 0.7 }}
                onDragEnd={(_, info) => {
                  if (info.offset.y > 90 || info.velocity.y > 600) onOpenChange(false);
                }}
              >
                <div
                  className="flex shrink-0 cursor-grab touch-none flex-col active:cursor-grabbing"
                  onPointerDown={(event) => drag.start(event)}
                >
                  <span
                    aria-hidden="true"
                    className="mx-auto mt-2.5 mb-1 h-1 w-9 rounded-full bg-[var(--fill-active)]"
                  />
                  {header ?? (
                    <Dialog.Title className="px-6 pt-2 pb-3 text-lg font-medium text-ink">
                      {title}
                    </Dialog.Title>
                  )}
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
