import { useFormContext } from "react-hook-form";
import { useContext, useState, useEffect } from "react";
import { CyclesContext } from "@/contexts/cycleContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function NewCycleForm() {
  const { activeCycle } = useContext(CyclesContext);
  const { register, setValue } = useFormContext();
  // Input display state
  const [minutesAmountDisplay, setMinutesAmountDisplay] = useState("25");

  useEffect(() => {
    // Set the initial value of `minutesAmount` in the form state
    setValue("minutesAmount", parseInt(minutesAmountDisplay));
  }, [minutesAmountDisplay, setValue]);

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
    <div className="mb-2 mt-3 flex flex-wrap items-center gap-6 font-montserrat font-medium text-muted-foreground">
      <div className="flex items-center gap-3 whitespace-nowrap">
        <Label className="text-base" htmlFor="task">
          Task:
        </Label>
        <Input
          className="w-44 text-foreground"
          id="task"
          type="text"
          list="task-suggestions"
          placeholder="Task name"
          maxLength={40}
          disabled={!!activeCycle}
          {...register("task")}
        />
      </div>

      <datalist id="task-suggestions">
        <option value="reading a book" />
        <option value="cleaning the house" />
        <option value="working" />
      </datalist>

      <div className="flex items-center gap-3">
        <Label className="text-base" htmlFor="minutesAmount">
          Minutes:
        </Label>
        <Input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          id="minutesAmount"
          placeholder="25"
          value={minutesAmountDisplay}
          onChange={(e) => handleMinutesAmountChange(e.target.value)}
          onBlur={handleMinutesAmountBlur}
          disabled={!!activeCycle}
          className="w-16 text-foreground"
        />
      </div>
    </div>
  );
}
