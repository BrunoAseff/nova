import { useFormContext } from "react-hook-form";
import { useContext } from "react";
import { CyclesContext } from "@/contexts/cycleContext";
import { Input } from "@/components/ui/input";

export function NewCycleForm() {
  const { activeCycle } = useContext(CyclesContext);
  const { register } = useFormContext();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1 whitespace-nowrap">
        <label htmlFor="task">I will work on</label>
        <Input
          id="task"
          type="text"
          list="task-suggestions"
          placeholder="Task name"
          disabled={!!activeCycle}
          {...register("task")}
        />
      </div>

      <datalist id="task-suggestions">
        <option value="Task 1" />
        <option value="Task 2" />
        <option value="Task 3" />
      </datalist>

      <div className="flex items-center gap-2">
        <label htmlFor="minutesAmount">for</label>
        <Input
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
