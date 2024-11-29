import { TabHeader } from "@/components/tabHeader";

export default function ReminderTab() {
  return (
    <main className="h-screen">
      <TabHeader
        title="Reminder"
        subtitle="Set up and manage your personal reminders and notifications."
        src="/illustrations/reminder.svg"
      />
      <div className="mt-28 flex h-full flex-col gap-10"></div>
    </main>
  );
}
