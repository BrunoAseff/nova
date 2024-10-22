import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { NewCycleForm } from "./Form";
import { Countdown } from "./Countdown";
import { useContext } from "react";
import { CyclesContext } from "@/contexts/cycleContext";
import { Stop } from "@/components/icons/Stop";
import { Play } from "@/components/icons/Play";
import IconBtn from "@/components/nova/buttons/IconBtn";
import { Pause } from "@/components/icons/pause";
import SecondaryBtn from "@/components/nova/buttons/SecondaryBtn";

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, "Please enter the task"),
  minutesAmount: zod
    .number()
    .min(1, "The cycle must be at least 5 minutes long.")
    .max(99, "The cycle must be at most 99 minutes long."),
});

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

export default function FocusTimer() {
  const {
    activeCycle,
    createNewCycle,
    interruptCurrentCycle,
    isPaused,
    togglePause,
    falsePause,
    focusingOnMessage,
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

  return (
    <form
      className="text-md flex flex-col items-center gap-10 rounded-3xl bg-background p-6 text-center font-open font-extralight text-foreground"
      onSubmit={onSubmit(handleCreateNewCycle)}
    >
      <FormProvider {...newCycleForm}>
        <NewCycleForm />
      </FormProvider>
      <div className="font-inter flex min-h-14 w-full items-center justify-center text-xl">
        {activeCycle && (
          <>
            {" "}
            <p className="w-fit rounded-lg bg-background px-2 py-3 text-muted-foreground">
              Focusing on
            </p>
            <strong className="text-primary"> {focusingOnMessage}</strong>
          </>
        )}
      </div>
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
          <SecondaryBtn
            onClick={falsePause}
            disabled={isSubmitDisabled}
            type="submit"
          >
            <Play />
            Start
          </SecondaryBtn>
        )}
      </div>
    </form>
  );
}
