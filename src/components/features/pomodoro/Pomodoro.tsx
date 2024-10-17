import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { NewCycleForm } from "./Form";
import { Countdown } from "./Countdown";
import { useContext } from "react";
import { CyclesContext } from "@/contexts/cycleContext";
import { Stop } from "@/components/icons/Stop";
import PrimaryBtn from "@/components/nova/buttons/PrimaryBtn";
import { Play } from "@/components/icons/Play";
import type { PomodoroProps } from "@/types";
import IconBtn from "@/components/nova/buttons/IconBtn";
import { Pause } from "@/components/icons/pause";

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, "Please enter the task"),
  minutesAmount: zod
    .number()
    .min(1, "The cycle must be at least 5 minutes long.")
    .max(60, "The cycle must be at most 60 minutes long."),
});

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

export function Pomodoro(props: PomodoroProps) {
  const { isHidden = false } = props;

  const {
    activeCycle,
    createNewCycle,
    interruptCurrentCycle,
    isPaused,
    togglePause,
    falsePause,
  } = useContext(CyclesContext);

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: "",
      minutesAmount: 0,
    },
  });

  const { handleSubmit: onSubmit, watch, reset } = newCycleForm;

  function handleCreateNewCycle(data: NewCycleFormData) {
    createNewCycle(data);
    reset();
  }

  const task = watch("task");
  const isSubmitDisabled = !task;

  if (isHidden) return null;

  return (
    <div className="border-1 fixed left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 transform items-center justify-center text-foreground shadow-foreground drop-shadow-xl">
      <form
        className="text-md flex flex-col items-center gap-10 rounded-3xl bg-background/40 p-6 text-center font-open font-extralight text-foreground"
        onSubmit={onSubmit(handleCreateNewCycle)}
      >
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>
        <Countdown />
        <div className="flex gap-4">
          {activeCycle ? (
            <>
              {isPaused ? (
                <IconBtn onClick={togglePause}>
                  <Play />
                </IconBtn>
              ) : (
                <IconBtn onClick={togglePause}>
                  <Pause />
                </IconBtn>
              )}
              <IconBtn onClick={interruptCurrentCycle} variant="destructive">
                <Stop />
              </IconBtn>
            </>
          ) : (
            <PrimaryBtn
              onClick={falsePause}
              disabled={isSubmitDisabled}
              type="submit"
            >
              <Play />
              Start
            </PrimaryBtn>
          )}
        </div>
      </form>
    </div>
  );
}
