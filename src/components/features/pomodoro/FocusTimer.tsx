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
import { Air } from "@/components/icons/Air";
import InfoCard from "./InfoCard";

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
    currentTab,
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
      className="text-md flex min-h-[400px] flex-col items-center gap-10 rounded-3xl bg-background p-6 text-center font-open font-extralight text-foreground"
      onSubmit={onSubmit(handleCreateNewCycle)}
    >
      <FormProvider {...newCycleForm}>
        <NewCycleForm />
      </FormProvider>
      <div className="font-inter text-md flex min-h-14 w-full items-center justify-center">
        {activeCycle && currentTab === "Focus" && (
          <div className="flex w-fit items-center gap-2 rounded-3xl border-[1px] border-muted-foreground bg-muted p-2">
            {" "}
            <p className="w-fit rounded-lg text-muted-foreground">
              Focusing on
            </p>
            <strong className="text-foreground"> {focusingOnMessage}</strong>
          </div>
        )}

        {activeCycle &&
          (currentTab === "Long Break" || currentTab === "Short Break") && (
            <div className="flex w-fit items-center gap-3 rounded-3xl p-2 text-2xl">
              <h1 className="bg-gradient-to-br from-primary from-10% via-secondary via-50% to-primary-foreground to-90% bg-clip-text font-montserrat font-semibold text-transparent">
                Take a breath!
              </h1>

              <Air color="hsl(209, 100%, 91%)" />
            </div>
          )}
      </div>
      <Countdown />
      <div className="relative flex w-full items-center justify-center">
        {activeCycle ? (
          <>
            {/* Center container for Play/Pause and Stop buttons */}
            <div className="absolute left-1/2 flex -translate-x-1/2 gap-4">
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
            </div>

            {/* Right-aligned InfoCard */}
            <div className="ml-auto">
              <InfoCard />
            </div>
          </>
        ) : (
          <div className="m-auto flex">
            <SecondaryBtn
              onClick={falsePause}
              disabled={isSubmitDisabled}
              type="submit"
            >
              <Play />
              Start
            </SecondaryBtn>
          </div>
        )}
      </div>
    </form>
  );
}
