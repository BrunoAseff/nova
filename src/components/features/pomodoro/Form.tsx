import { useFormContext } from "react-hook-form";
import { useContext } from "react";
import { CyclesContext } from "@/contexts/cycleContext";
import { PomodoroInput } from "@/components/nova/PomodoroInput";

export function NewCycleForm() {
  const { activeCycle } = useContext(CyclesContext);
  const { register } = useFormContext();

  return (
    <div className="flex flex-wrap items-center gap-2 text-foreground">
      <div className="flex items-center gap-1 whitespace-nowrap">
        <label htmlFor="task">I will focus on</label>
        <PomodoroInput
          id="task"
          type="text"
          list="task-suggestions"
          placeholder="Task name"
          disabled={!!activeCycle}
          {...register("task")}
        />
      </div>

      <datalist id="task-suggestions">
        <option value="reading a book" />
        <option value="cleaning the house" />
        <option value="working" />
      </datalist>

      <div className="flex items-center gap-2">
        <label htmlFor="minutesAmount">for</label>
        <PomodoroInput
          type="number"
          id="minutesAmount"
          placeholder="25"
          defaultValue={25}
          disabled={!!activeCycle}
          {...register("minutesAmount", { valueAsNumber: true })}
        />
        <span>minutes.</span>
      </div>
    </div>
  );
}
