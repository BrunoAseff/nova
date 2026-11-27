import { PopoverAnchor } from "@radix-ui/react-popover";
import { ArrowRight, Pencil, Plus } from "lucide-react";
import { AnimatePresence, type HTMLMotionProps, motion } from "motion/react";
import { forwardRef, useEffect, useRef, useState } from "react";
import { Popover, PopoverContent } from "@/components/arc/popover/popover";
import { Tooltip } from "@/components/arc/tooltip/tooltip";
import { AutoHeight } from "@/components/ui/AutoHeight";
import { Reveal } from "@/components/ui/Reveal";
import { REMINDER_TYPE_LABEL } from "@/content/reminders";
import { duration, ease } from "@/lib/motion";
import { useSceneTone } from "@/lib/sceneTone";
import { cn } from "@/lib/utils";
import { sized } from "@/lib/widgetSize";
import { useAttentionStore } from "@/stores/attention";
import { usePomodoroStore } from "@/stores/pomodoro";
import { useRemindersStore } from "@/stores/reminders";
import { ReminderEditor } from "./ReminderEditor";

/** Sem pomodoro mudando de fase, o lembrete troca sozinho a cada 10 minutos. */
const ROTATE_EVERY_MS = 10 * 60 * 1000;

/** Botões que só aparecem no hover: a opacidade é a do próprio vidro (`--self-fade`). */
const REVEAL =
  "[transition:--self-fade_300ms,color_150ms] group-hover/reminders:[--self-fade:1] group-focus-within/reminders:[--self-fade:1]";

/**
 * Botão pequeno sobre a foto: uma pílula de vidro, como o dock (L3). Texto branco direto
 * na cena some em fotos claras; o vidro lê em qualquer fundo.
 */
const SceneButton = forwardRef<HTMLButtonElement, HTMLMotionProps<"button">>(function SceneButton(
  { className, ...props },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      type="button"
      className={cn(
        "glass fade inline-flex h-8 items-center justify-center gap-1.5 rounded-full text-[0.8125rem] font-medium text-ink-2 transition-colors duration-150 hover:text-ink [&_svg]:size-4",
        className,
      )}
      {...props}
    />
  );
});

/**
 * L1 · Ambiente. Uma frase sua por vez, direto na cena, como a citação: é algo para ter
 * em mente, nunca um alerta. Troca devagar a cada fase do pomodoro (ou a cada 10 min).
 * No hover aparecem "próximo" e "editar"; editar abre a lista ali mesmo, sem ir às
 * configurações.
 */
const TEXT = { fontSize: sized("1rem", "1.1875rem", "1.5rem") };

export function Reminders({ align }: { align: "start" | "end" | "center" }) {
  const reminders = useRemindersStore((s) => s.reminders);
  const resting = useAttentionStore((s) => s.attention === "rest");
  const phaseKey = usePomodoroStore((s) =>
    s.session.status === "idle" ? "idle" : `${s.session.phase}-${s.session.completedFocus}`,
  );
  const [index, setIndex] = useState(0);
  const [editing, setEditing] = useState(false);
  const [newId, setNewId] = useState<string | null>(null);
  const container = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLDivElement>(null);
  useSceneTone(text);

  const shown = reminders.filter((r) => r.text.trim());
  const current = shown.length > 0 ? shown[index % shown.length] : undefined;
  const next = () => setIndex((i) => i + 1);

  useEffect(() => {
    const timer = window.setInterval(() => setIndex((i) => i + 1), ROTATE_EVERY_MS);
    return () => window.clearInterval(timer);
  }, []);

  // Fase nova do pomodoro, lembrete novo. A primeira leitura não conta.
  const lastPhase = useRef(phaseKey);
  useEffect(() => {
    if (lastPhase.current === phaseKey) return;
    const wasIdle = lastPhase.current === "idle";
    lastPhase.current = phaseKey;
    if (!wasIdle && phaseKey !== "idle") setIndex((i) => i + 1);
  }, [phaseKey]);

  const openEditor = (withNew: boolean) => {
    setNewId(withNew ? useRemindersStore.getState().addReminder("", "motivation") : null);
    setEditing(true);
  };

  // Fechar o editor leva junto os lembretes que ficaram vazios.
  const setOpen = (open: boolean) => {
    setEditing(open);
    if (open) return;
    useRemindersStore.getState().removeEmpty();
  };

  const alignClass =
    align === "end"
      ? "items-end text-right"
      : align === "center"
        ? "items-center text-center"
        : "items-start";

  return (
    <Popover open={editing} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div
          ref={container}
          className={cn("group/reminders flex max-w-[24rem] flex-col", alignClass)}
          data-keep-awake
        >
          {/* O que sai deixa o fluxo (popLayout) e esmaece no lugar; a altura vai da frase
              antiga à nova animando (AutoHeight), e o que está embaixo desliza junto, em vez
              de pular. */}
          <AutoHeight>
            <div
              ref={text}
              className={cn(
                "on-scene flex flex-col",
                align === "end" ? "items-end" : align === "center" ? "items-center" : "items-start",
              )}
            >
              <AnimatePresence
                initial={false}
                mode="popLayout"
                anchorX={align === "end" ? "right" : "left"}
              >
                {current ? (
                  <motion.figure
                    key={current.id}
                    className={cn("flex flex-col", alignClass)}
                    initial={{ opacity: 0, y: 6, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -6, filter: "blur(6px)" }}
                    transition={{ duration: duration.calm, ease: ease.out }}
                  >
                    <figcaption className="fade text-[0.75rem] font-medium tracking-[0.08em] text-scene-ink-soft uppercase">
                      {REMINDER_TYPE_LABEL[current.type]}
                    </figcaption>
                    <p
                      className="fade mt-1.5 leading-snug tracking-[-0.005em] text-balance"
                      style={TEXT}
                    >
                      {current.text}
                    </p>
                  </motion.figure>
                ) : (
                  <SceneButton
                    key="empty"
                    className="px-3.5"
                    initial={{ "--self-fade": 0 }}
                    animate={{ "--self-fade": resting ? 0 : 1 }}
                    exit={{ "--self-fade": 0 }}
                    transition={{ duration: duration.calm, ease: ease.out }}
                    aria-expanded={editing}
                    onClick={() => (editing ? setOpen(false) : openEditor(true))}
                  >
                    <Plus aria-hidden="true" />
                    Add a reminder
                  </SceneButton>
                )}
              </AnimatePresence>
            </div>
          </AutoHeight>

          {/* Os botões entram e saem abrindo espaço: sem isso, o primeiro lembrete (ou o
              último apagado) fazia o widget, e o popover ancorado nele, pular 44px. */}
          <AnimatePresence initial={false}>
            {current && (
              <Reveal key="actions" clip={false}>
                <div className="flex gap-1.5 pt-3">
                  {shown.length > 1 && (
                    <Tooltip content="Next reminder">
                      <SceneButton
                        className={cn(
                          "w-8",
                          REVEAL,
                          editing ? "[--self-fade:1]" : "[--self-fade:0]",
                        )}
                        aria-label="Next reminder"
                        onClick={next}
                      >
                        <ArrowRight aria-hidden="true" />
                      </SceneButton>
                    </Tooltip>
                  )}
                  <Tooltip content="Edit reminders">
                    <SceneButton
                      className={cn("w-8", REVEAL, editing ? "[--self-fade:1]" : "[--self-fade:0]")}
                      aria-label="Edit reminders"
                      aria-expanded={editing}
                      onClick={() => (editing ? setOpen(false) : openEditor(false))}
                    >
                      <Pencil aria-hidden="true" />
                    </SceneButton>
                  </Tooltip>
                </div>
              </Reveal>
            )}
          </AnimatePresence>
        </div>
      </PopoverAnchor>

      <PopoverContent
        side="bottom"
        align={align === "end" ? "end" : align === "center" ? "center" : "start"}
        sideOffset={10}
        className="w-[23rem] !max-w-[calc(100vw-20px)] !p-3"
        onOpenAutoFocus={(event) => event.preventDefault()}
        // Os botões do próprio lembrete abrem e fecham: clicar neles não conta como "fora".
        onInteractOutside={(event) => {
          if (container.current?.contains(event.target as Node)) event.preventDefault();
        }}
      >
        <ReminderEditor initialFocusId={newId} />
      </PopoverContent>
    </Popover>
  );
}
