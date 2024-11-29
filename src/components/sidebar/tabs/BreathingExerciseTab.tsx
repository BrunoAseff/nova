import { TabHeader } from "@/components/tabHeader";

export default function BreathingExerciseTab() {
  return (
    <main className="h-screen">
      <TabHeader
        title="Breathing Exercise"
        subtitle="Configure and select guided breathing techniques.
"
        src="/illustrations/breathing-exercise.svg"
      />
      <div className="mt-28 flex h-full flex-col gap-10"></div>
    </main>
  );
}
