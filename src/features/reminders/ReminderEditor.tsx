import { Plus, Trash2 } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ConfirmButton } from "@/components/ui/ConfirmButton";
import { Reveal } from "@/components/ui/Reveal";
import { useRovingGroup } from "@/components/ui/useRovingGroup";
import { REMINDER_TYPE_LABEL, type ReminderType, reminderTypes } from "@/content/reminders";
import { cn } from "@/lib/utils";
import {
  MAX_REMINDER_LENGTH,
  MAX_REMINDERS,
  type Reminder,
  useRemindersStore,
} from "@/stores/reminders";

/**
 * Lista editável dos lembretes, no popover do próprio widget. Cada linha é o texto
 * (editado no lugar) com o tipo embaixo; os tipos abrem na linha em que se está
 * mexendo. Ela só fecha quando outra abre (ou com Enter), nunca no blur: assim nada
 * pula de lugar debaixo do cursor no meio de um clique. Lembretes vazios saem quando o
 * popover fecha.
 */
export function ReminderEditor({
  initialFocusId,
  heading = true,
}: {
  initialFocusId: string | null;
  /** O título próprio; no sheet do celular quem titula é o sheet. */
  heading?: boolean;
}) {
  const reminders = useRemindersStore((s) => s.reminders);
  const addReminder = useRemindersStore((s) => s.addReminder);
  const [focusId, setFocusId] = useState(initialFocusId);
  const [activeId, setActiveId] = useState(initialFocusId);
  const lastType = useRef<ReminderType>("motivation");
  const scroller = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const [scrollable, setScrollable] = useState(false);

  // Rola só quando a lista, parada, passa do limite. Com rolagem sempre ligada, o que
  // sobra por um instante durante uma animação (uma linha entrando, os tipos abrindo)
  // fazia a barra de rolagem piscar.
  useLayoutEffect(() => {
    const box = scroller.current;
    const content = list.current;
    if (!box || !content) return;
    const measure = () => {
      const style = getComputedStyle(box);
      const room =
        Number.parseFloat(style.maxHeight) -
        Number.parseFloat(style.paddingTop) -
        Number.parseFloat(style.paddingBottom);
      setScrollable(content.offsetHeight > room + 1);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(content);
    return () => observer.disconnect();
  }, []);

  // Já existe um vazio esperando texto: vai para ele em vez de criar outro.
  const add = () => {
    const id = reminders.find((r) => !r.text.trim())?.id ?? addReminder("", lastType.current);
    if (!id) return;
    setFocusId(id);
    setActiveId(id);
  };

  return (
    <div data-keep-awake className="flex flex-col">
      {heading && (
        <div className="flex items-baseline justify-between px-1 pt-1 pb-2">
          <h2 className="text-[0.9375rem] font-medium text-ink">Reminders</h2>
          <span className="text-[0.8125rem] text-ink-3">One at a time, on the screen</span>
        </div>
      )}

      {/* Folga de 8px em volta: o anel de foco (4px) cabe sem o overflow cortar. */}
      <div
        ref={scroller}
        className="-mx-2 -my-1 max-h-[min(24rem,50vh)] px-2 py-1"
        style={{ overflowY: scrollable ? "auto" : "hidden" }}
      >
        <div ref={list} className="flex flex-col divide-y divide-[var(--hairline)]">
          <AnimatePresence initial={false}>
            {reminders.map((reminder) => (
              <Reveal key={reminder.id}>
                <ReminderRow
                  reminder={reminder}
                  autoFocus={reminder.id === focusId}
                  expanded={reminder.id === activeId}
                  onActivate={(active) => setActiveId(active ? reminder.id : null)}
                  onType={(type) => {
                    lastType.current = type;
                  }}
                />
              </Reveal>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-1 flex items-center justify-between border-t border-[var(--hairline)] pt-2">
        <Button
          variant="ghost"
          size="sm"
          className="-ml-1"
          onClick={add}
          disabled={reminders.length >= MAX_REMINDERS}
        >
          <Plus aria-hidden="true" />
          New reminder
        </Button>
      </div>
    </div>
  );
}

function ReminderRow({
  reminder,
  autoFocus,
  expanded,
  onActivate,
  onType,
}: {
  reminder: Reminder;
  autoFocus: boolean;
  expanded: boolean;
  onActivate: (active: boolean) => void;
  onType: (type: ReminderType) => void;
}) {
  const { updateReminder, removeReminder } = useRemindersStore.getState();
  const field = useRef<HTMLTextAreaElement>(null);
  const setType = (type: ReminderType) => {
    updateReminder(reminder.id, { type });
    onType(type);
  };
  const roving = useRovingGroup(reminderTypes, reminder.type, setType);

  useEffect(() => {
    if (autoFocus) field.current?.focus();
  }, [autoFocus]);

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: só observa o foco entrando na linha
    <div className="group/row flex items-start gap-2 py-2" onFocus={() => onActivate(true)}>
      <div className="flex min-w-0 flex-1 flex-col">
        <textarea
          ref={field}
          value={reminder.text}
          rows={1}
          maxLength={MAX_REMINDER_LENGTH}
          placeholder="Something to keep in mind"
          aria-label="Reminder"
          onChange={(event) => updateReminder(reminder.id, { text: event.target.value })}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              event.currentTarget.blur();
              onActivate(false);
            }
          }}
          className="field-sizing-content min-h-9 resize-none rounded-lg bg-transparent px-2 py-1.5 text-[0.9375rem] leading-snug text-ink transition-colors duration-200 outline-none placeholder:text-ink-3 hover:bg-[var(--fill-hover)] focus-visible:bg-[var(--fill-hover)] focus-visible:shadow-none"
        />

        {/* O tipo (texto) e as opções de tipo trocam abrindo e fechando a altura ao mesmo
            tempo, uma embaixo da outra: nada se sobrepõe e a linha cresce de uma vez. */}
        <AnimatePresence initial={false}>
          {!expanded && (
            <Reveal key="label">
              <span className="block px-2 pb-0.5 text-[0.75rem] font-medium text-ink-3">
                {REMINDER_TYPE_LABEL[reminder.type]}
              </span>
            </Reveal>
          )}
          {expanded && (
            <Reveal key="types">
              <div
                role="radiogroup"
                aria-label="Reminder type"
                className="flex flex-wrap gap-1 px-1 pt-1.5 pb-0.5"
              >
                {reminderTypes.map((type) => {
                  const selected = type === reminder.type;
                  return (
                    // biome-ignore lint/a11y/useSemanticElements: opção visual de um radiogroup (padrão ARIA)
                    <button
                      key={type}
                      {...roving(type)}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setType(type)}
                      className={cn(
                        "h-7 rounded-full px-2.5 text-[0.75rem] font-medium transition-colors duration-200",
                        selected
                          ? "bg-accent-soft text-accent"
                          : "text-ink-3 hover:bg-[var(--fill-hover)] hover:text-ink",
                      )}
                    >
                      {REMINDER_TYPE_LABEL[type]}
                    </button>
                  );
                })}
              </div>
            </Reveal>
          )}
        </AnimatePresence>
      </div>

      <ConfirmButton
        variant="ghost"
        icon
        size="sm"
        aria-label="Delete reminder"
        confirmLabel="Delete"
        className="mt-0.5 opacity-0 transition-opacity duration-200 group-hover/row:opacity-100 focus-visible:opacity-100 data-[asking=true]:opacity-100 [@media(hover:none)]:opacity-100"
        onConfirm={() => removeReminder(reminder.id)}
      >
        <Trash2 />
      </ConfirmButton>
    </div>
  );
}
