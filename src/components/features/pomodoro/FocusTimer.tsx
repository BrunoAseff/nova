import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { NewCycleForm } from "./Form";
import { Countdown } from "./Countdown";
import { useRef } from "react";
import { motion } from "framer-motion";
import { Stop } from "@/components/icons/Stop";
import { Play } from "@/components/icons/Play";
import IconBtn from "@/components/nova/buttons/IconBtn";
import { Pause } from "@/components/icons/pause";
import InfoCard from "./InfoCard";
import { Restart } from "@/components/icons/Restart";
import { Fire } from "@/components/icons/Fire";
import { CheckedCircle } from "@/components/icons/CheckedCircle";
import { Circle } from "@/components/icons/Circle";
import FocusingOnMessage from "./FocusingOnMessage";
import { LinkBtn } from "@/components/nova/buttons/LinkBtn";
import { useSpacesContext } from "@/contexts/spaceContext";
import { Button } from "@/components/nova/buttons/Button";
import { Air } from "@/components/icons/Air";
import PictureInPictureButton from "./PictureInPictureButton";
import { useCycleStore } from "@/stores/useCycleStore";

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, "Please enter the task"),
  minutesAmount: zod
    .number()
    .min(1, "The cycle must be at least 5 minutes long.")
    .max(99, "The cycle must be at most 99 minutes long."),
});

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

export default function FocusTimer() {
  const activeCycle = useCycleStore((state) => state.activeCycle);
  const createNewCycle = useCycleStore((state) => state.createNewCycle);
  const interruptCurrentCycle = useCycleStore(
    (state) => state.interruptCurrentCycle,
  );
  const isPaused = useCycleStore((state) => state.isPaused);
  const togglePause = useCycleStore((state) => state.togglePause);
  const falsePause = useCycleStore((state) => state.falsePause);
  const currentTab = useCycleStore((state) => state.currentTab);
  const resetCurrentSession = useCycleStore(
    (state) => state.resetCurrentSession,
  );
  const cycleCounter = useCycleStore((state) => state.cycleCounter);
  const completedCycles = useCycleStore((state) => state.completedCycles);
  const skipCurrentSession = useCycleStore((state) => state.skipCurrentSession);

  const { spaces, selectedTab, stopPomodoroAlarm } = useSpacesContext();
  const containerRef = useRef<HTMLFormElement>(null);

  const currentSpace = spaces.find((space) => space.id === selectedTab);
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

  function togglePauseAndAlarm() {
    togglePause();
    currentSpace ? stopPomodoroAlarm({ currentSpace }) : null;
  }

  return (
    <div className="focus-timer-container flex items-center justify-center">
      <form
        ref={containerRef}
        className="flex min-w-[19rem] flex-col items-center justify-center rounded-3xl bg-background p-6 text-center md:min-w-[30rem] md:p-6"
        onSubmit={onSubmit(handleCreateNewCycle)}
      >
        <motion.div
          className="text-md flex min-h-[260px] flex-col items-center rounded-3xl text-center font-open font-medium text-muted-foreground"
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

          <div className="font-inter text-md hide-in-pip flex w-full items-center justify-center">
            {activeCycle && currentTab === "Focus" && (
              <div className="flex flex-col items-center gap-1">
                <div className="flex w-fit items-center justify-center gap-2 rounded-xl border-[1px] border-background bg-background p-2">
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
                <div className="mt-auto flex w-fit items-center justify-evenly gap-3 rounded-3xl fill-secondary p-2">
                  <p className="text-left font-montserrat text-2xl text-foreground">
                    Take a breath!
                  </p>
                  <Air className="text-secondary" />
                </div>
              )}
          </div>

          <div className="mt-[2rem]">
            <Countdown />
            {activeCycle && (
              <LinkBtn
                onClick={skipSession}
                className="hide-in-pip mb-[2rem] mt-3 cursor-pointer text-sm text-muted-foreground hover:text-secondary"
              >
                Skip session
              </LinkBtn>
            )}
          </div>

          <div className="hide-in-pip relative flex w-full items-center justify-center">
            {activeCycle ? (
              <>
                <div className="absolute left-1/2 mb-4 flex -translate-x-1/2 gap-4 md:mb-0">
                  <IconBtn
                    tooltipContent="Restart pomodoro"
                    onClick={resetCurrentSession}
                  >
                    <Restart />
                  </IconBtn>

                  <IconBtn
                    tooltipContent={
                      isPaused ? "Play pomodoro" : "Pause pomodoro"
                    }
                    onClick={togglePauseAndAlarm}
                  >
                    {isPaused ? <Play /> : <Pause />}
                  </IconBtn>

                  <IconBtn
                    tooltipContent="Stop pomodoro"
                    onClick={interruptCurrentCycle}
                    variant="destructive"
                    className="rounded-full border-[1px] border-background bg-background text-foreground hover:border-destructive hover:bg-red-700/20 hover:text-destructive"
                  >
                    <Stop />
                  </IconBtn>
                </div>

                <div className="relative right-[45%] hidden -translate-x-1/2 md:block">
                  <InfoCard />
                </div>
                <div className="relative left-[60%] hidden -translate-x-1/2 md:block">
                  <PictureInPictureButton containerRef={containerRef} />
                </div>
              </>
            ) : (
              <div className="flex">
                <Button
                  className="mt-[2rem] flex gap-2"
                  variant="default"
                  onClick={falsePause}
                  disabled={isSubmitDisabled}
                  type="submit"
                >
                  <Play />
                  Start
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </form>
    </div>
  );
}
