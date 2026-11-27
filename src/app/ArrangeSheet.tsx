import { GripVertical } from "lucide-react";
import { Reorder, useDragControls } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Sheet";
import { Tabs } from "@/components/ui/Tabs";
import { PLACED_WIDGET_LABEL, type PlacedWidget, type WidgetSize } from "@/content/widgets";
import { useAttentionStore } from "@/stores/attention";
import { useActiveSpace, useSpacesStore } from "@/stores/spaces";
import { compactOrder, compactSize } from "./layout/compact";

const SIZE_OPTIONS = [
  { value: "s", label: "S" },
  { value: "m", label: "M" },
  { value: "l", label: "L" },
] as const;

/**
 * Arrumar no celular: a coluna vira uma lista. Arrastar pela alça muda a ordem (o
 * primeiro é o principal, no topo) e cada linha escolhe o tamanho. É o layout do celular,
 * guardado à parte: a grade do computador não muda.
 */
export function ArrangeSheet() {
  const arranging = useAttentionStore((s) => s.arranging);
  const setArranging = useAttentionStore((s) => s.setArranging);
  const space = useActiveSpace();
  const { setCompactOrder, setCompactSize, resetLayout } = useSpacesStore.getState();
  const order = compactOrder(space);

  return (
    <Sheet open={arranging} onOpenChange={setArranging} title={`Arrange ${space.name}`}>
      <div className="flex flex-col px-4 pb-6">
        <p className="px-2 pb-3 text-[0.8125rem] text-ink-2">
          Drag to reorder. The first one sits on top.
        </p>
        {order.length === 0 ? (
          <p className="px-2 py-6 text-center text-[0.9375rem] text-ink-3">
            Nothing is shown in this space yet.
          </p>
        ) : (
          <Reorder.Group
            axis="y"
            values={order}
            onReorder={(next: PlacedWidget[]) => setCompactOrder(space.id, next)}
            className="flex flex-col divide-y divide-[var(--hairline)]"
          >
            {order.map((id) => (
              <Item
                key={id}
                id={id}
                size={compactSize(space, id)}
                onSize={(size) => setCompactSize(space.id, id, size)}
              />
            ))}
          </Reorder.Group>
        )}
        <div className="mt-4 flex items-center justify-between gap-2 border-t border-[var(--hairline)] pt-4">
          <Button variant="ghost" onClick={() => resetLayout(space.id)}>
            Reset
          </Button>
          <Button variant="primary" onClick={() => setArranging(false)}>
            Done
          </Button>
        </div>
      </div>
    </Sheet>
  );
}

function Item({
  id,
  size,
  onSize,
}: {
  id: PlacedWidget;
  size: WidgetSize;
  onSize: (size: WidgetSize) => void;
}) {
  const drag = useDragControls();
  const label = PLACED_WIDGET_LABEL[id];
  return (
    <Reorder.Item
      value={id}
      dragListener={false}
      dragControls={drag}
      className="relative flex h-14 items-center gap-2 bg-transparent"
      whileDrag={{ scale: 1.02 }}
    >
      <button
        type="button"
        aria-label={`Move ${label}`}
        className="grid size-10 shrink-0 cursor-grab touch-none place-items-center rounded-xl text-ink-3 active:cursor-grabbing"
        onPointerDown={(event) => drag.start(event)}
      >
        <GripVertical className="size-[1.1rem]" aria-hidden="true" />
      </button>
      <span className="flex-1 truncate text-[0.9375rem] text-ink">{label}</span>
      <Tabs
        label={`${label} size`}
        size="sm"
        value={size}
        onChange={onSize}
        options={SIZE_OPTIONS}
      />
    </Reorder.Item>
  );
}
