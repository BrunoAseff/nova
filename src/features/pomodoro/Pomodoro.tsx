import { RotateCcw, SkipForward } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Tooltip } from "@/components/arc/tooltip/tooltip";
import { Button } from "@/components/ui/Button";
import { ConfirmButton } from "@/components/ui/ConfirmButton";
import { Digits } from "@/components/ui/Digits";
import { calm, duration, ease } from "@/lib/motion";
import { useSceneTone } from "@/lib/sceneTone";
import { sized } from "@/lib/widgetSize";
import { useAttentionStore } from "@/stores/attention";
import { usePomodoroStore } from "@/stores/pomodoro";
import { useActiveSpace } from "@/stores/spaces";
import { useRemainingMs } from "./hooks";
import { LONG_BREAK_EVERY, type Phase, phaseDurationMs } from "./machine";

const PHASE_LABEL: Record<Phase, string> = {
  focus: "Focus",
  shortBreak: "Short break",
  longBreak: "Long break",
};

function formatClock(ms: number) {
  const total = Math.ceil(ms / 1000);
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

/**
 * L2 · Instrumento. Forma completa (atento ou parado) e recolhida (em repouso com o timer
 * correndo). Ao recolher, o vidro e os controles esmaecem no lugar, sem mexer nos números:
 * o que se lê de longe nunca pula.
 */
const WIDTH = { width: sized("20rem", "24rem", "30rem") };
const PADDING = {
  paddingInline: sized("1.5rem", "1.75rem", "2.5rem"),
  paddingBlock: sized("1.25rem", "1.5rem", "2rem"),
};
const DIGITS = { fontSize: sized("3.75rem", "5rem", "7.5rem") };

export function Pomodoro() {
  const session = usePomodoroStore((s) => s.session);
  const { start, pause, resume, skip, reset, setTask } = usePomodoroStore.getState();
  const config = useActiveSpace().widgets.pomodoro;
  const attention = useAttentionStore((s) => s.attention);
  const remaining = useRemainingMs();
  const [draft, setDraft] = useState("");

  const idle = session.status === "idle";
  const phase: Phase = idle ? "focus" : session.phase;
  const total = idle ? config.focusMin * 60_000 : phaseDurationMs(phase, session.config);
  const shown = idle ? total : remaining;
  const progress = idle ? 0 : 1 - shown / total;
  const completed = idle ? 0 : session.completedFocus;
  const collapsed = attention === "rest" && session.status === "running";
  const ref = useRef<HTMLElement>(null);
  useSceneTone(ref);
  const freshPhase = session.status === "paused" && session.remainingMs === total;
  const task = idle ? draft : session.task;

  useEffect(() => {
    document.title = idle ? "Nova" : `${formatClock(shown)} · ${PHASE_LABEL[phase]}`;
  }, [idle, shown, phase]);

  const primary = idle
    ? { label: "Start focus", action: () => start(draft.trim()) }
    : session.status === "running"
      ? { label: "Pause", action: pause }
      : {
          label: freshPhase ? `Start ${PHASE_LABEL[phase].toLowerCase()}` : "Resume",
          action: resume,
        };

  return (
    <section
      ref={ref}
      aria-label="Pomodoro"
      data-collapsed={collapsed}
      style={WIDTH}
      className="pomodoro relative flex flex-col items-center text-center"
    >
      {/* O vidro é uma camada própria, para esmaecer sem afetar o conteúdo. */}
      <motion.div
        aria-hidden="true"
        className="glass fade absolute inset-0 rounded-[2rem]"
        initial={false}
        animate={{ "--self-fade": collapsed ? 0 : 1, scale: collapsed ? 0.98 : 1 }}
        transition={calm}
      />

      <div className="fade relative flex w-full flex-col items-center" style={PADDING}>
        <div className="pomodoro-ink flex h-6 items-center gap-3 text-sm font-medium">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={`${phase}-${session.status === "paused"}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: duration.base, ease: ease.out }}
            >
              {PHASE_LABEL[phase]}
              {session.status === "paused" && !freshPhase && " · paused"}
            </motion.span>
          </AnimatePresence>
          <span
            className="flex gap-1"
            role="img"
            aria-label={`${completed} of ${LONG_BREAK_EVERY} focus sessions done`}
          >
            {Array.from({ length: LONG_BREAK_EVERY }, (_, i) => (
              <motion.span
                // biome-ignore lint/suspicious/noArrayIndexKey: posições fixas do ciclo
                key={i}
                className="size-1.5 rounded-full bg-current"
                animate={{ opacity: i < completed ? 1 : 0.28 }}
                transition={{ duration: duration.base }}
              />
            ))}
          </span>
        </div>

        <Digits
          value={formatClock(shown)}
          className="pomodoro-ink glance mt-3 mb-5 block"
          style={DIGITS}
        />

        <div className="pomodoro-track h-[3px] w-full max-w-[16rem] overflow-hidden rounded-full">
          <motion.div
            className="h-full origin-left rounded-full bg-current"
            initial={false}
            animate={{ scaleX: progress }}
            transition={{ duration: 1, ease: "linear" }}
          />
        </div>

        <motion.div
          className="flex w-full flex-col items-center"
          initial={false}
          animate={
            collapsed
              ? { opacity: 0, y: 6, filter: "blur(4px)" }
              : { opacity: 1, y: 0, filter: "blur(0px)" }
          }
          transition={calm}
          style={{ pointerEvents: collapsed ? "none" : "auto" }}
          data-keep-awake
        >
          <input
            value={task}
            maxLength={80}
            onChange={(event) =>
              idle ? setDraft(event.target.value) : setTask(event.target.value)
            }
            onKeyDown={(event) => event.key === "Enter" && event.currentTarget.blur()}
            placeholder="What are you focusing on?"
            aria-label="What are you focusing on?"
            className="mt-6 h-10 w-full max-w-[20rem] truncate rounded-full bg-transparent px-4 text-center text-[0.9375rem] text-ink-2 transition-colors duration-200 outline-none placeholder:text-ink-3 hover:bg-[var(--fill-hover)] focus-visible:bg-[var(--fill-hover)] focus-visible:text-ink"
          />

          <div className="mt-5 flex h-12 items-center justify-center gap-2">
            <Button variant="primary" size="lg" onClick={primary.action} className="min-w-[9.5rem]">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={primary.label}
                  initial={{ opacity: 0, filter: "blur(4px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(4px)" }}
                  transition={{ duration: duration.quick }}
                >
                  {primary.label}
                </motion.span>
              </AnimatePresence>
            </Button>
            <AnimatePresence initial={false}>
              {!idle && (
                <motion.div
                  key="secondary"
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: duration.base, ease: ease.out }}
                >
                  <Tooltip content="Skip to next phase">
                    <Button size="lg" icon aria-label="Skip to next phase" onClick={skip}>
                      <SkipForward />
                    </Button>
                  </Tooltip>
                  <ConfirmButton
                    size="lg"
                    icon
                    aria-label="Reset timer"
                    confirmLabel="Reset?"
                    onConfirm={reset}
                  >
                    <RotateCcw />
                  </ConfirmButton>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
