import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { SectionTitle } from "@/components/ui/List";
import { Reveal } from "@/components/ui/Reveal";
import { useRovingGroup } from "@/components/ui/useRovingGroup";
import { type Background, backgrounds } from "@/content/backgrounds";
import { glide } from "@/lib/motion";
import { cn } from "@/lib/utils";

const COLUMNS = 3;
/** Fechada, a grade mostra duas linhas; o resto abre embaixo, rolando com o painel. */
const COLLAPSED = COLUMNS * 2;

/**
 * Grade de miniaturas em 3 colunas, rolando junto com o painel. Começa sempre fechada,
 * com duas linhas; se a escolhida estiver mais para baixo, ela entra no lugar da última
 * miniatura, para estar sempre à vista. "Show all" fica ao lado do título, como um link.
 * Clicar troca o fundo na hora (a cena faz o crossfade atrás do painel); as setas andam
 * pela grade e também trocam, como nos sons.
 */
export function BackgroundPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const selected = backgrounds.find((b) => b.id === value);
  const first = backgrounds.slice(0, COLLAPSED);
  const top =
    expanded || !selected || first.includes(selected)
      ? first
      : [...first.slice(0, COLLAPSED - 1), selected];
  const rest = backgrounds.filter((b) => !first.includes(b));
  const visible = expanded ? [...first, ...rest] : top;
  const roving = useRovingGroup(
    visible.map((b) => b.id),
    value,
    onChange,
    { columns: COLUMNS },
  );

  const tile = (background: Background) => {
    const selected = background.id === value;
    return (
      // biome-ignore lint/a11y/useSemanticElements: opção visual de um radiogroup (padrão ARIA)
      <button
        key={background.id}
        {...roving(background.id)}
        type="button"
        role="radio"
        aria-checked={selected}
        aria-label={background.name}
        title={background.name}
        onClick={() => onChange(background.id)}
        className="group relative aspect-[8/5] w-full rounded-xl"
      >
        <img
          src={background.thumb}
          alt=""
          loading="lazy"
          decoding="async"
          className={cn(
            "size-full rounded-xl object-cover shadow-[inset_0_0_0_1px_var(--hairline)] transition-[transform,filter] duration-300 ease-out group-hover:brightness-105",
            selected ? "scale-[0.9]" : "group-hover:scale-[1.03]",
          )}
        />
        {selected && (
          <motion.span
            layoutId="background-ring"
            transition={glide}
            className="pointer-events-none absolute inset-0 rounded-[0.85rem] shadow-[inset_0_0_0_2px_var(--accent)]"
          />
        )}
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <SectionTitle>Background</SectionTitle>
        {backgrounds.length > COLLAPSED && (
          <button
            type="button"
            aria-expanded={expanded}
            onClick={() => setExpanded((e) => !e)}
            className="-mr-1 inline-flex items-center gap-1 rounded-md px-1 text-[0.8125rem] font-medium text-ink-2 transition-colors duration-150 hover:text-ink"
          >
            {expanded ? "Show less" : `Show all ${backgrounds.length}`}
            <ChevronDown
              aria-hidden="true"
              className={cn("size-3.5 transition-transform duration-300", expanded && "rotate-180")}
            />
          </button>
        )}
      </div>
      <div role="radiogroup" aria-label="Background" className="flex flex-col">
        <div className="grid grid-cols-3 gap-2">{top.map(tile)}</div>
        <AnimatePresence initial={false}>
          {expanded && (
            <Reveal>
              <div className="grid grid-cols-3 gap-2 pt-2">{rest.map(tile)}</div>
            </Reveal>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
