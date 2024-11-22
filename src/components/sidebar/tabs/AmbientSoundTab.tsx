import Image from "next/image";

export default function AmbientSoundTab() {
  return (
    <main className="h-screen">
      <div className="absolute top-3 flex w-fit items-center text-secondary">
        <div className="grid h-full grid-cols-2 items-center justify-start">
          <div className="flex flex-col gap-2">
            <h1 className="font-delius text-3xl text-secondary-foreground/80">
              <span className="text-secondary">Ambient Sound</span> settings
            </h1>
            <p className="text-sm text-muted-foreground">
              Customize and select from a variety of soothing background sounds
              to enhance your focus and relaxation environment.
            </p>
          </div>

          <Image
            src="/illustrations/ambient-sound.svg"
            alt="Ambient Sound"
            width={290}
            height={220}
          />
        </div>
      </div>

      <div className="mt-28 flex h-full flex-col gap-10"></div>
    </main>
  );
}
