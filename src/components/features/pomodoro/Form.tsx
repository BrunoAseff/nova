import { useFormContext } from "react-hook-form";
import { useContext, useState } from "react";
import { CyclesContext } from "@/contexts/cycleContext";
import { PomodoroInput } from "@/components/nova/PomodoroInput";

export function NewCycleForm() {
  const { activeCycle } = useContext(CyclesContext);
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();

  // Input display state
  const [minutesAmountDisplay, setMinutesAmountDisplay] = useState("25");

  const handleMinutesAmountChange = (value: string) => {
    // Allow empty string or numbers only
    if (value === "" || /^\d{1,2}$/.test(value)) {
      setMinutesAmountDisplay(value);
    }
  };

  const handleMinutesAmountBlur = () => {
    const numberValue =
      minutesAmountDisplay === "" ? 1 : parseInt(minutesAmountDisplay) || 1;
    setMinutesAmountDisplay(String(numberValue));
    setValue("minutesAmount", numberValue, { shouldValidate: true });
  };

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

      <div className="relative flex items-center gap-2">
        <label htmlFor="minutesAmount">for</label>
        <PomodoroInput
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          id="minutesAmount"
          placeholder="25"
          value={minutesAmountDisplay}
          onChange={(e) => handleMinutesAmountChange(e.target.value)}
          onBlur={handleMinutesAmountBlur}
          disabled={!!activeCycle}
          className="w-16"
        />
        <span>minutes.</span>
        {errors.minutesAmount && (
          <p className="absolute left-0 top-full mt-1 text-destructive">
            {typeof errors.minutesAmount?.message === "string" &&
              errors.minutesAmount.message}
          </p>
        )}
      </div>
    </div>
  );
}
