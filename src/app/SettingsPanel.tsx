import * as Dialog from "@radix-ui/react-dialog";
import { Check, Moon, Plus, Sun, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { ElasticSlider } from "@/components/arc/elastic-slider/elastic-slider";
import { Button } from "@/components/ui/Button";
import { ConfirmButton } from "@/components/ui/ConfirmButton";
import { List, Row, SectionTitle } from "@/components/ui/List";
import { Tabs } from "@/components/ui/Tabs";
import { Toggle } from "@/components/ui/Toggle";
import { breathingTechniques } from "@/content/breathing";
import { SPACE_ICON } from "@/content/icons";
import { spaceIcons } from "@/content/space-icons";
import { calm, duration, ease, reveal } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useAttentionStore } from "@/stores/attention";
import { usePreferencesStore } from "@/stores/preferences";
import { MAX_SPACE_NAME_LENGTH, MAX_SPACES, useActiveSpace, useSpacesStore } from "@/stores/spaces";

type Tab = "space" | "spaces" | "look";

/** Linha que só existe quando a de cima está ligada: entra e sai abrindo espaço, sem pular. */
function Nested({ show, children }: { show: boolean; children: ReactNode }) {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div {...reveal} className="overflow-hidden">
          <div className="flex flex-col pb-3">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SpaceTab({ focusName }: { focusName: boolean }) {
  const space = useActiveSpace();
  const { updateWidget, renameSpace, setSpaceIcon } = useSpacesStore.getState();
  const [name, setName] = useState(space.name);
  const nameRef = useRef<HTMLInputElement>(null);
  const w = space.widgets;

  useEffect(() => setName(space.name), [space.name]);
  useEffect(() => {
    if (focusName) nameRef.current?.select();
  }, [focusName]);

  const commitName = () => {
    if (!name.trim()) setName(space.name);
    else renameSpace(space.id, name);
  };

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-2">
        <SectionTitle>Name</SectionTitle>
        <input
          ref={nameRef}
          value={name}
          maxLength={MAX_SPACE_NAME_LENGTH}
          onChange={(event) => setName(event.target.value)}
          onBlur={commitName}
          onKeyDown={(event) => event.key === "Enter" && event.currentTarget.blur()}
          aria-label="Space name"
          className="-mx-3 h-11 rounded-xl bg-transparent px-3 text-xl font-medium text-ink transition-colors duration-200 outline-none hover:bg-[var(--fill-hover)] focus-visible:bg-[var(--fill-hover)] focus-visible:shadow-none"
        />
        <div className="flex flex-wrap gap-1" role="radiogroup" aria-label="Space icon">
          {spaceIcons.map((icon) => {
            const Icon = SPACE_ICON[icon];
            const selected = icon === space.icon;
            return (
              // biome-ignore lint/a11y/useSemanticElements: opção visual de um radiogroup (padrão ARIA)
              <button
                key={icon}
                type="button"
                role="radio"
                aria-checked={selected}
                aria-label={icon}
                onClick={() => setSpaceIcon(space.id, icon)}
                className={cn(
                  "grid size-10 place-items-center rounded-xl transition-[background-color,color,box-shadow] duration-200",
                  selected
                    ? "bg-accent-soft text-accent"
                    : "text-ink-2 hover:bg-[var(--fill-hover)] hover:text-ink",
                )}
              >
                <Icon className="size-[1.15rem]" aria-hidden="true" />
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <SectionTitle>Shown in this space</SectionTitle>
        <List>
          <div>
            <Row label="Clock">
              <Toggle
                label="Show clock"
                checked={w.clock.visible}
                onChange={(visible) => updateWidget(space.id, "clock", { visible })}
              />
            </Row>
            <Nested show={w.clock.visible}>
              <Row label="24-hour time">
                <Toggle
                  label="24-hour time"
                  checked={w.clock.format === "24h"}
                  onChange={(on) => updateWidget(space.id, "clock", { format: on ? "24h" : "12h" })}
                />
              </Row>
            </Nested>
          </div>

          <div>
            <Row label="Pomodoro">
              <Toggle
                label="Show pomodoro"
                checked={w.pomodoro.visible}
                onChange={(visible) => updateWidget(space.id, "pomodoro", { visible })}
              />
            </Row>
            <Nested show={w.pomodoro.visible}>
              <div className="pt-1 pb-2">
                <ElasticSlider
                  label="Focus length"
                  min={5}
                  max={90}
                  step={5}
                  value={w.pomodoro.focusMin}
                  onValueCommit={(focusMin) => updateWidget(space.id, "pomodoro", { focusMin })}
                  format={(v) => `${Math.round(v)} min`}
                />
              </div>
              <Row label="Start next phase automatically">
                <Toggle
                  label="Start next phase automatically"
                  checked={w.pomodoro.autoStart}
                  onChange={(autoStart) => updateWidget(space.id, "pomodoro", { autoStart })}
                />
              </Row>
            </Nested>
          </div>

          <div>
            <Row label="Breathing">
              <Toggle
                label="Show breathing exercise"
                checked={w.breathing.visible}
                onChange={(visible) => updateWidget(space.id, "breathing", { visible })}
              />
            </Row>
            <Nested show={w.breathing.visible}>
              <Tabs
                label="Breathing technique"
                size="sm"
                full
                value={w.breathing.technique}
                onChange={(technique) => updateWidget(space.id, "breathing", { technique })}
                options={breathingTechniques.map((t) => ({
                  value: t.id,
                  label: t.id === "alternate-nostril" ? "Nostril" : t.id === "box" ? "Box" : t.name,
                }))}
              />
            </Nested>
          </div>

          <Row label="Quote">
            <Toggle
              label="Show quote"
              checked={w.quote.visible}
              onChange={(visible) => updateWidget(space.id, "quote", { visible })}
            />
          </Row>
        </List>
      </div>
    </div>
  );
}

function SpacesTab({ onCreated }: { onCreated: () => void }) {
  const spaces = useSpacesStore((s) => s.spaces);
  const activeSpaceId = useSpacesStore((s) => s.activeSpaceId);
  const { setActiveSpace, deleteSpace, createSpace, resetSpaces } = useSpacesStore.getState();

  return (
    <div className="flex flex-col gap-7">
      <div>
        <SectionTitle>Your spaces</SectionTitle>
        <List>
          <AnimatePresence initial={false}>
            {spaces.map((space) => {
              const Icon = SPACE_ICON[space.icon];
              const active = space.id === activeSpaceId;
              return (
                <motion.div key={space.id} {...reveal} className="overflow-hidden">
                  <div className="group flex h-12 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setActiveSpace(space.id)}
                      aria-current={active}
                      className="-ml-2 flex h-10 flex-1 items-center gap-3 rounded-xl px-2 text-left text-[0.9375rem] text-ink transition-colors duration-200 hover:bg-[var(--fill-hover)]"
                    >
                      <Icon
                        className={cn("size-[1.1rem]", active ? "text-accent" : "text-ink-3")}
                        aria-hidden="true"
                      />
                      <span className="flex-1 truncate">{space.name}</span>
                      {active && (
                        <Check className="size-4 text-accent" aria-label="Current space" />
                      )}
                    </button>
                    {spaces.length > 1 && (
                      <ConfirmButton
                        variant="ghost"
                        size="sm"
                        icon
                        aria-label={`Delete ${space.name}`}
                        confirmLabel="Delete"
                        className="opacity-0 transition-opacity duration-200 group-hover:opacity-100 focus-visible:opacity-100 data-[asking=true]:opacity-100 [@media(hover:none)]:opacity-100"
                        onConfirm={() => deleteSpace(space.id)}
                      >
                        <Trash2 />
                      </ConfirmButton>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </List>
        <div className="mt-3 flex items-center justify-between">
          <Button
            variant="secondary"
            disabled={spaces.length >= MAX_SPACES}
            onClick={() => {
              const id = createSpace("New space");
              if (id) {
                setActiveSpace(id);
                onCreated();
              }
            }}
          >
            <Plus />
            New space
          </Button>
          <span className="text-[0.8125rem] text-ink-3">
            {spaces.length} of {MAX_SPACES}
          </span>
        </div>
      </div>

      <div className="border-t border-[var(--hairline)] pt-5">
        <ConfirmButton
          variant="ghost"
          className="-ml-4"
          confirmLabel="Restore all spaces to default?"
          onConfirm={resetSpaces}
        >
          Restore default spaces
        </ConfirmButton>
      </div>
    </div>
  );
}

function LookTab() {
  const theme = usePreferencesStore((s) => s.theme);
  const reduceTransparency = usePreferencesStore((s) => s.reduceTransparency);
  const { setTheme, setReduceTransparency } = usePreferencesStore.getState();
  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-2">
        <SectionTitle>Appearance</SectionTitle>
        <Tabs
          label="Appearance"
          full
          value={theme}
          onChange={setTheme}
          options={[
            { value: "light", label: "Light", icon: <Sun aria-hidden="true" /> },
            { value: "dark", label: "Dark", icon: <Moon aria-hidden="true" /> },
          ]}
        />
      </div>
      <List>
        <Row label="Reduce transparency" hint="Solid surfaces instead of glass">
          <Toggle
            label="Reduce transparency"
            checked={reduceTransparency}
            onChange={setReduceTransparency}
          />
        </Row>
      </List>
    </div>
  );
}

/** L4 · Painel. Um por vez; a cena recua atrás dele. */
export function SettingsPanel() {
  const open = useAttentionStore((s) => s.panelOpen);
  const setPanelOpen = useAttentionStore((s) => s.setPanelOpen);
  const [tab, setTab] = useState<Tab>("space");
  const [focusName, setFocusName] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setPanelOpen}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-30 bg-[oklch(12%_0.02_280/0.22)]"
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
              onCloseAutoFocus={() => setFocusName(false)}
            >
              <motion.div
                data-keep-awake
                tabIndex={-1}
                className="glass glass-strong fixed top-3 right-3 bottom-3 z-40 flex w-[min(25rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-[1.75rem] outline-none"
                initial={{ opacity: 0, x: 32 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{
                  opacity: 0,
                  x: 32,
                  transition: { duration: duration.base, ease: ease.out },
                }}
                transition={calm}
              >
                <div className="flex items-center justify-between px-6 pt-5 pb-4">
                  <Dialog.Title className="text-lg font-medium text-ink">Settings</Dialog.Title>
                  <Dialog.Close asChild>
                    <Button variant="ghost" icon size="sm" aria-label="Close settings">
                      <X />
                    </Button>
                  </Dialog.Close>
                </div>
                <div className="px-6 pb-2">
                  <Tabs
                    label="Settings section"
                    full
                    value={tab}
                    onChange={setTab}
                    options={[
                      { value: "space", label: "This space" },
                      { value: "spaces", label: "Spaces" },
                      { value: "look", label: "Look" },
                    ]}
                  />
                </div>
                <div className="relative min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-6 pt-5 pb-8">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={tab}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: duration.quick + 0.04, ease: ease.out }}
                    >
                      {tab === "space" && <SpaceTab focusName={focusName} />}
                      {tab === "spaces" && (
                        <SpacesTab
                          onCreated={() => {
                            setTab("space");
                            setFocusName(true);
                          }}
                        />
                      )}
                      {tab === "look" && <LookTab />}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
