import { useFormContext } from "react-hook-form";
import { useContext } from "react";
import { CyclesContext } from "@/contexts/cycleContext";
import { PomodoroInput } from "@/components/nova/PomodoroInput";

export function NewCycleForm() {
  const { activeCycle } = useContext(CyclesContext);
  const { register, setValue } = useFormContext();

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
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          id="minutesAmount"
          placeholder="25"
          defaultValue={25}
          disabled={!!activeCycle}
          {...register("minutesAmount", {
            onChange: (e) => {
              // Remove non-digits
              const cleanValue = e.target.value.replace(/\D/g, "");

              // Limit to 2 digits
              const limitedValue = cleanValue.slice(0, 2);

              // Convert to number, default to 1 if empty or 0
              const numberValue = parseInt(limitedValue) || 1;

              // Update form value
              setValue("minutesAmount", numberValue, { shouldValidate: true });
            },
            setValueAs: (value) => parseInt(value) || 1,
          })}
          className="w-16"
        />
        <span>minutes.</span>
      </div>
    </div>
  );
}
