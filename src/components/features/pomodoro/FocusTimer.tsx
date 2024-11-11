import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { NewCycleForm } from "./Form";
import { Countdown } from "./Countdown";
import { useContext } from "react";
import { motion } from "framer-motion";
import { CyclesContext } from "@/contexts/cycleContext";
import { Stop } from "@/components/icons/Stop";
import { Play } from "@/components/icons/Play";
import IconBtn from "@/components/nova/buttons/IconBtn";
import { Pause } from "@/components/icons/pause";
import { Air } from "@/components/icons/Air";
import InfoCard from "./InfoCard";
import { Restart } from "@/components/icons/Restart";
import { Fire } from "@/components/icons/Fire";
import { CheckedCircle } from "@/components/icons/CheckedCircle";
import { Circle } from "@/components/icons/Circle";
import FocusingOnMessage from "./FocusingOnMessage";
import { FancyBtn } from "@/components/nova/buttons/FancyBtn";
import { useSpacesContext } from "@/contexts/spaceContext";

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
    currentTab,
    resetCurrentSession,
    cycleCounter,
    completedCycles,
    skipCurrentSession,
  } = useContext(CyclesContext);

  const { spaces, selectedTab } = useSpacesContext();

  const currentSpace = spaces.find((space) => space.name === selectedTab);
  const autoStart = currentSpace?.pomodoro.autoStart ?? false;

  function skipSession() {
    skipCurrentSession();

    if (!autoStart) {
      togglePause();
    }
  }
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
    <div className="flex items-center justify-center">
      <form
        className="flex flex-col items-center justify-center rounded-3xl bg-background p-6 text-center md:min-w-[30rem]"
        onSubmit={onSubmit(handleCreateNewCycle)}
      >
        <motion.div
          className="text-md flex min-h-[320px] flex-col items-center rounded-3xl text-center font-open font-extralight text-foreground"
          key={currentTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {!activeCycle && (
            <FormProvider {...newCycleForm}>
              <NewCycleForm />
            </FormProvider>
          )}

          <div className="font-inter text-md flex min-h-14 w-full items-center justify-center">
            {activeCycle && currentTab === "Focus" && (
              <div className="flex flex-col items-center gap-1">
                <div className="flex w-fit items-center gap-2 rounded-xl border-[1px] border-background bg-background p-2">
                  <p className="w-fit rounded-lg text-muted-foreground">
                    Focusing on
                  </p>
                  <FocusingOnMessage />
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    {[...Array(4)].map((_, index) => (
                      <span key={index}>
                        {index < cycleCounter ? (
                          <CheckedCircle className="text-secondary" />
                        ) : (
                          <Circle className="text-accent" />
                        )}
                      </span>
                    ))}
                  </div>
                  {completedCycles > 0 && (
                    <div className="flex items-center gap-1 text-foreground opacity-80 hover:text-secondary hover:opacity-100">
                      <p>{completedCycles} </p>
                      <Fire color="currentColor" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeCycle &&
              (currentTab === "Long Break" || currentTab === "Short Break") && (
                <div className="mt-auto flex w-fit items-center gap-3 rounded-3xl p-2 text-2xl">
                  <h1 className="bg-gradient-to-br from-primary from-10% via-secondary via-50% to-primary-foreground to-90% bg-clip-text font-montserrat font-semibold text-transparent">
                    Take a breath!
                  </h1>
                  <Air color="hsl(209, 100%, 91%)" />
                </div>
              )}
          </div>

          <div className="mb-auto mt-auto">
            <Countdown />
            {activeCycle && (
              <FancyBtn
                variant="linkHover2"
                onClick={skipSession}
                className="mt-1 cursor-pointer text-sm text-muted-foreground hover:text-secondary"
              >
                Skip session
              </FancyBtn>
            )}
          </div>

          <div className="relative flex w-full items-center justify-center">
            {activeCycle ? (
              <>
                <div className="absolute left-1/2 mb-4 flex -translate-x-1/2 gap-4 md:mb-0">
                  <IconBtn onClick={resetCurrentSession}>
                    <Restart />
                  </IconBtn>

                  <IconBtn onClick={togglePause}>
                    {isPaused ? <Play /> : <Pause />}
                  </IconBtn>

                  <IconBtn
                    onClick={interruptCurrentCycle}
                    variant="destructive"
                    className="rounded-full border-[1px] border-background bg-background text-foreground hover:border-destructive hover:bg-red-700/20 hover:text-destructive"
                  >
                    <Stop />
                  </IconBtn>
                </div>

                <div className="relative left-[80%] hidden -translate-x-1/2 md:block">
                  <InfoCard />
                </div>
              </>
            ) : (
              <div className="m-auto flex">
                <FancyBtn
                  variant="default"
                  onClick={falsePause}
                  disabled={isSubmitDisabled}
                  type="submit"
                >
                  <Play />
                  Start
                </FancyBtn>
              </div>
            )}
          </div>
        </motion.div>
      </form>
    </div>
  );
}
