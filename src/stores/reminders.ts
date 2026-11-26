import { z } from "zod/mini";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type ReminderType, reminderTypes } from "@/content/reminders";
import { moveItem, uniqueById } from "@/lib/collections";
import { persistOptions, syncAcrossTabs } from "./lib/persisted";

export const MAX_REMINDERS = 50;
export const MAX_REMINDER_LENGTH = 280;

const reminderSchema = z.object({
  id: z.string(),
  text: z.catch(z.string().check(z.maxLength(MAX_REMINDER_LENGTH)), ""),
  type: z.catch(z.enum(reminderTypes), "motivation"),
});

const schema = z.object({
  reminders: z.catch(z.array(reminderSchema).check(z.maxLength(MAX_REMINDERS)), []),
});

export type Reminder = z.infer<typeof reminderSchema>;
type Persisted = z.infer<typeof schema>;

interface RemindersState extends Persisted {
  /** Devolve o id do lembrete criado, ou `null` se já estiver no limite. */
  addReminder: (text: string, type: ReminderType) => string | null;
  updateReminder: (id: string, patch: Partial<Omit<Reminder, "id">>) => void;
  removeReminder: (id: string) => void;
  moveReminder: (id: string, toIndex: number) => void;
}

const clampText = (text: string) => text.slice(0, MAX_REMINDER_LENGTH);

export const useRemindersStore = create<RemindersState>()(
  persist(
    (set, get) => ({
      reminders: [],

      addReminder: (text, type) => {
        if (get().reminders.length >= MAX_REMINDERS) return null;
        const id = crypto.randomUUID();
        set((s) => ({ reminders: [...s.reminders, { id, text: clampText(text), type }] }));
        return id;
      },

      updateReminder: (id, patch) =>
        set((s) => ({
          reminders: s.reminders.map((r) =>
            r.id === id
              ? { ...r, ...patch, ...(patch.text !== undefined && { text: clampText(patch.text) }) }
              : r,
          ),
        })),

      removeReminder: (id) => set((s) => ({ reminders: s.reminders.filter((r) => r.id !== id) })),

      moveReminder: (id, toIndex) =>
        set((s) => ({ reminders: moveItem(s.reminders, id, toIndex) })),
    }),
    persistOptions({
      name: "reminders",
      version: 1,
      schema,
      partialize: ({ reminders }) => ({ reminders }),
      repair: ({ reminders }) => ({ reminders: uniqueById(reminders) }),
    }),
  ),
);

syncAcrossTabs(useRemindersStore);

// Em dev, editar um store recarrega a página: o HMR criaria uma segunda cópia do store
// e partes do app continuariam ligadas à antiga.
import.meta.hot?.accept(() => window.location.reload());
