import Image from "next/image";

export default function BreathingExerciseTab() {
  return (
    <main>
      <div className="absolute top-0 flex w-full items-center justify-center text-secondary">
        <Image
          className="relative right-[37%] top-0 translate-x-1/2 transform"
          src="/illustrations/breathing-exercise.svg"
          alt="breathing-exercise"
          width={290}
          height={250}
        />
      </div>
      <div className="mt-28 flex h-full flex-col gap-10"></div>
    </main>
  );
}
